import { urlFor } from './sanity'

/**
 * Logo normalisation.
 *
 * Sponsor and placement logos arrive from the CMS at wildly different
 * aspect ratios (7.1:1 for a tight wordmark, 1.26:1 for a square mark)
 * and with wildly different amounts of built-in padding, an OG-image
 * export can be 60% empty canvas. Sizing those by a shared max-height
 * is what makes a logo wall look broken.
 *
 * So we do two things:
 *
 *   1. Trim. Measure the real ink bounding box of each asset once per
 *      revalidation and emit a Sanity `rect()` crop, removing the
 *      asset's own padding.
 *   2. Normalise by optical area, not height. A tempered equal-area
 *      curve (see AREA_EXP) sits between "same height", which lets
 *      wide wordmarks dominate, and strict equal area, which makes
 *      them spindly.
 *
 * Every step degrades gracefully: no sharp, no network, a corrupt
 * asset, the logo still renders, just sized from its file aspect.
 */

// Reference wordmark: a 3:1 logo renders at REF_HEIGHT.
const REF_ASPECT = 3
const AREA_EXP = 0.42

const cache = new Map()

/** Sanity refs encode dimensions: image-<hash>-<W>x<H>-<ext> */
export function parseRef(ref) {
  const match = /-(\d+)x(\d+)-[a-z]+$/.exec(ref || '')
  if (!match) return null
  return { width: Number(match[1]), height: Number(match[2]) }
}

let sharpModule
async function getSharp() {
  if (sharpModule !== undefined) return sharpModule
  try {
    sharpModule = (await import('sharp')).default
  } catch {
    sharpModule = null
  }
  return sharpModule
}

/**
 * Find the bounding box of non-background pixels.
 *
 * A genuinely transparent asset is trimmed on its alpha channel. A flat
 * asset (opaque everywhere) is trimmed on colour distance from the
 * median corner pixel, which handles both white and dark canvases.
 */
function inkBounds(data, w, h) {
  const CH = 4 // ensureAlpha() guarantees RGBA
  const at = (x, y) => (y * w + x) * CH

  // Does this asset actually use its alpha channel?
  let transparent = false
  for (let i = 3; i < data.length; i += CH * 7) {
    if (data[i] < 250) {
      transparent = true
      break
    }
  }

  let bg = [255, 255, 255]
  if (!transparent) {
    const corners = [
      [0, 0],
      [w - 1, 0],
      [0, h - 1],
      [w - 1, h - 1],
    ].map(([x, y]) => {
      const i = at(x, y)
      return [data[i], data[i + 1], data[i + 2]]
    })
    // Median of the four corners, so one dark corner cannot skew it.
    bg = [0, 1, 2].map((c) => {
      const vals = corners.map((p) => p[c]).sort((a, b) => a - b)
      return (vals[1] + vals[2]) / 2
    })
  }

  const TOL = 26
  let minX = w
  let minY = h
  let maxX = -1
  let maxY = -1

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = at(x, y)
      const ink = transparent
        ? data[i + 3] > 24
        : Math.abs(data[i] - bg[0]) > TOL ||
          Math.abs(data[i + 1] - bg[1]) > TOL ||
          Math.abs(data[i + 2] - bg[2]) > TOL
      if (!ink) continue
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }
  }

  if (maxX < 0 || maxY < 0) return null
  return { minX, minY, maxX, maxY }
}

/**
 * @returns {Promise<{aspect:number, rect:?{left:number,top:number,width:number,height:number}}>}
 */
export async function measureLogo(source) {
  const ref = source?.asset?._ref
  const native = parseRef(ref)
  const fallback = {
    aspect: native ? native.width / native.height : REF_ASPECT,
    rect: null,
    sourceWidth: native?.width ?? null,
  }
  if (!ref || !native) return fallback

  if (cache.has(ref)) return cache.get(ref)

  let result = fallback
  try {
    const sharp = await getSharp()
    if (sharp) {
      const probeWidth = 320
      const url = urlFor(source).width(probeWidth).fit('max').url()
      const res = await fetch(url, { next: { revalidate: 86400 } })
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer())
        const img = sharp(buf).ensureAlpha()
        const { data, info } = await img.raw().toBuffer({ resolveWithObject: true })
        const box = inkBounds(data, info.width, info.height)

        if (box) {
          const scale = native.width / info.width
          // A hair of padding so anti-aliased edges are not clipped.
          const pad = 1
          const left = Math.max(0, Math.round((box.minX - pad) * scale))
          const top = Math.max(0, Math.round((box.minY - pad) * scale))
          const width = Math.min(
            native.width - left,
            Math.round((box.maxX - box.minX + 1 + pad * 2) * scale)
          )
          const height = Math.min(
            native.height - top,
            Math.round((box.maxY - box.minY + 1 + pad * 2) * scale)
          )

          // Ignore a trim that found essentially nothing, or everything.
          const area = (width * height) / (native.width * native.height)
          if (width > 8 && height > 4 && area > 0.01 && area < 0.995) {
            result = {
              aspect: width / height,
              rect: { left, top, width, height },
              sourceWidth: width,
            }
          }
        }
      }
    }
  } catch {
    result = fallback
  }

  cache.set(ref, result)
  return result
}

/**
 * Size a measured logo inside a cell so that every logo carries roughly
 * equal visual weight.
 */
export function fitLogo(aspect, { refHeight, maxWidth, minHeight, maxHeight }) {
  const safeAspect = Number.isFinite(aspect) && aspect > 0 ? aspect : REF_ASPECT
  let height = refHeight * Math.pow(REF_ASPECT / safeAspect, AREA_EXP)
  height = Math.min(Math.max(height, minHeight), maxHeight)
  let width = height * safeAspect
  if (width > maxWidth) {
    width = maxWidth
    height = width / safeAspect
  }
  return { width: Math.round(width), height: Math.round(height) }
}

/**
 * Build a Sanity URL for a measured logo, applying the trim rect.
 * Requests 3x for high-density screens but never more than the asset
 * actually holds, upscaling a small source only adds bytes and blur.
 */
export function logoSrc(source, measurement, renderWidth) {
  let builder = urlFor(source)
  if (measurement?.rect) {
    const { left, top, width, height } = measurement.rect
    builder = builder.rect(left, top, width, height)
  }
  const available = measurement?.sourceWidth || Infinity
  const requested = Math.max(
    Math.round(renderWidth),
    Math.min(Math.round(renderWidth * 3), available)
  )
  return builder.width(requested).fit('max').auto('format').url()
}

/** Measure a list of documents concurrently, in small batches. */
export async function measureAll(items, pick) {
  const out = []
  const BATCH = 6
  for (let i = 0; i < items.length; i += BATCH) {
    const slice = items.slice(i, i + BATCH)
    const measured = await Promise.all(
      slice.map(async (item) => {
        const source = pick(item)
        if (!source) return { ...item, measurement: null }
        return { ...item, measurement: await measureLogo(source) }
      })
    )
    out.push(...measured)
  }
  return out
}
