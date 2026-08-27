'use client'

import { useEffect, useRef } from 'react'
import campus from '../data/campus.json'

/**
 * Signature hero graphic, in two acts that transform into one another.
 *
 * ACT I , the UW-Madison campus as a network. Node positions are real
 *          OpenStreetMap building centroids, the red thread is the
 *          actual Lake Mendota shoreline, and the labelled buildings
 *          are the ones this club's disciplines live in.
 *
 * ACT II, those nodes collapse to a common origin and walk out again
 *          as independent ±1 random walks, their terminal values
 *          accumulating into the normal distribution they converge to.
 *
 * The increments are Rademacher, not Gaussian: a sum of independent
 * normals is exactly normal at every n, so Gaussian steps would show
 * closure under convolution rather than the central limit theorem.
 *
 * Timing, staggering and the draw-on effect follow manim's grammar,  * `smooth` as the default rate function, `lag_ratio` cascades, and
 * ShowCreation-style partial-path drawing.
 *
 * Nothing here is or resembles market data.
 */

/* ── manim rate functions (manimlib/utils/rate_functions.py) ──────
   `smooth` is bezier([0,0,0,1,1,1]). Perlin smootherstep, with zero
   first AND second derivatives at both ends. That C2 continuity is
   what stops every manim move from visually snapping. (Note this is
   ManimGL's quintic, not ManimCE's sigmoid of the same name.)      */
const clamp01 = (t) => Math.min(Math.max(t, 0), 1)

const smooth = (t) => {
  const u = clamp01(t)
  return u * u * u * (10 - 15 * u + 6 * u * u)
}

const rushInto = (t) => 2 * smooth(t / 2)
const rushFrom = (t) => 2 * smooth(t / 2 + 0.5) - 1
const thereAndBack = (t) => smooth(t < 0.5 ? 2 * t : 2 * (1 - t))

/** Animation.get_sub_alpha, stagger sub-animation i of n at time t. */
function lagged(t, i, n, lagRatio = LAG) {
  const full = (n - 1) * lagRatio + 1
  return clamp01(t * full - i * lagRatio)
}

/** ShowPassingFlash.get_bounds, a highlight of width `tw` travelling a path. */
function flashBounds(alpha, tw = 0.12) {
  const upper = smooth(alpha) * (1 + tw)
  return [Math.max(upper - tw, 0), Math.min(upper, 1)]
}

/**
 * paths.path_along_arc. Transform moves points along a circular arc
 * rather than a straight line. Straightens out below manim's own
 * STRAIGHT_PATH_THRESHOLD of 0.01.
 */
function arcPath(x0, y0, x1, y1, alpha, theta) {
  const dx = x1 - x0, dy = y1 - y0
  if (Math.abs(theta) < 0.01) return [x0 + dx * alpha, y0 + dy * alpha]
  const t = Math.tan(theta / 2)
  const cx = x0 + dx / 2 + -dy / 2 / t
  const cy = y0 + dy / 2 + dx / 2 / t
  const sx = x0 - cx, sy = y0 - cy
  const c = Math.cos(alpha * theta), s = Math.sin(alpha * theta)
  return [cx + c * sx + s * -sy, cy + c * sy + s * sx]
}

/* ── deterministic PRNG, so the static frame is stable ──────────── */
function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rademacher = (rand) => (rand() < 0.5 ? -1 : 1)

/* ── cycle ──────────────────────────────────────────────────────── */
const ACTS = [
  ['campusIn', 2800],
  ['campusHold', 30000],
  ['collapse', 1150],
  ['walk', 3400],
  ['distHold', 5200],
  ['return', 1500],
]
const CYCLE = ACTS.reduce((s, a) => s + a[1], 0)

const WALKERS = 26
const STEPS = 150
const BINS = 40
const SPREAD = 3.0
const WARMUP = 380
const LAG = 0.05          // DEFAULT_LAGGED_START_LAG_RATIO
const PATH_ARC = Math.PI / 2   // TurnInsideOut's arc, for the collapse

const BG = '#0a0a0b'
const INK_LINE = '226,226,236'
const RED = '255,107,117'

export default function HeroField({ className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const wideEnough = window.matchMedia('(min-width: 1024px)')
    if (!wideEnough.matches) return   // hidden below lg; do no work at all
    const monoFont = getComputedStyle(canvas).fontFamily || 'ui-monospace, monospace'

    let W = 0, H = 0, dpr = 1
    let stage = { x: 0, y: 0, w: 0, h: 0 }
    let nodePos = []          // campus position, px
    let origin = { x: 0, y: 0 }
    let sigma = 0, stepSigma = 0
    let histX = 0, histW = 0, spanX = 0
    let walkers = []
    let bins = new Array(BINS).fill(0)
    let trace = null, tctx = null
    let tracedTo = 0
    let raf = 0, running = true, t0 = 0
    let pointer = { x: 0, y: 0, on: false }
    let clicks = 0
    let clickTimer = 0
    const seedRand = mulberry32(20260826)

    function layout() {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = Math.max(rect.width, 1)
      H = Math.max(rect.height, 1)
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // From lg up the graphic sits behind the headline, so the stage
      // starts clear of the text column. Below that it has its own band.
      const wide = W >= 1024
      stage = {
        x: wide ? W * 0.34 : W * 0.04,
        y: H * (wide ? 0.07 : 0.06),
        w: (wide ? W * 0.64 : W * 0.92),
        h: H * (wide ? 0.84 : 0.88),
      }

      // Fit campus into the stage. Baked coords are normalised by the
      // longer axis, so x spans [0,1] and y spans [0,1/aspect], both
      // must therefore share ONE scale factor or the map is squashed.
      const scale = Math.min(stage.w, stage.h * campus.aspect)
      const cw = scale
      const ch = scale / campus.aspect
      const ox = stage.x + (stage.w - cw) / 2
      const oy = stage.y + (stage.h - ch) / 2
      nodePos = campus.nodes.map(([nx, ny, wgt]) => ({
        x: ox + nx * scale,
        y: oy + ny * scale,
        w: wgt,
      }))
      const toPx = ([sx, sy]) => [ox + sx * scale, oy + sy * scale]
      shorePx = campus.shore.map((seg) => seg.map(toPx))
      wayPx = campus.ways.map((w) => {
        const pts = []
        for (let i = 1; i < w.length; i += 2) pts.push([ox + w[i] * scale, oy + w[i + 1] * scale])
        return { tier: w[0], pts }
      })

      guard = wide
        ? { cx: W * 0.26, cy: H * 0.5, rx: W * 0.30, ry: H * 0.26 }
        : null

      origin = { x: stage.x + stage.w * 0.03, y: stage.y + stage.h * 0.5 }
      histW = Math.min(stage.w * 0.2, 165)
      histX = stage.x + stage.w - histW - 8
      spanX = Math.max(histX - origin.x - 14, 60)
      sigma = Math.min(stage.h * 0.2, 118)
      stepSigma = sigma / Math.sqrt(STEPS)

      trace = document.createElement('canvas')
      trace.width = canvas.width
      trace.height = canvas.height
      tctx = trace.getContext('2d')
      tctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      tracedTo = 0

      buildWalkers()
      pickPulses()
      seedBins()
    }

    let shorePx = []
    let wayPx = []
    let guard = null   // elliptical legibility punch-out behind the headline

    /**
     * Alpha multiplier that erases the graphic behind the headline
     * instead of veiling it. A gradient overlay dims the type's ground
     * as well; this removes only what would collide with it.
     */
    function legible(x, y) {
      if (!guard) return 1
      const dx = (x - guard.cx) / guard.rx
      const dy = (y - guard.cy) / guard.ry
      const d = Math.sqrt(dx * dx + dy * dy)
      return clamp01((d - 1) / 0.55)
    }

    function buildWalkers() {
      walkers = Array.from({ length: WALKERS }, (_, i) => {
        const rand = mulberry32(9176 + i * 7919)
        const pts = [{ x: origin.x, y: origin.y }]
        let y = origin.y
        for (let s = 1; s <= STEPS; s++) {
          y += rademacher(rand) * stepSigma
          pts.push({ x: origin.x + (spanX * s) / STEPS, y })
        }
        return {
          pts,
          z: (y - origin.y) / sigma,
          accent: i % 8 === 3,
          // Which campus node collapses into this walker.
          node: Math.floor((i * campus.nodes.length) / WALKERS),
        }
      })
    }

    function seedBins() {
      bins = new Array(BINS).fill(0)
      const rand = mulberry32(4242)
      for (let i = 0; i < WARMUP; i++) {
        let s = 0
        for (let k = 0; k < STEPS; k++) s += rademacher(rand)
        addSample(s / Math.sqrt(STEPS))
      }
    }

    function addSample(z) {
      const idx = Math.floor(((z / SPREAD + 1) / 2) * BINS)
      if (idx >= 0 && idx < BINS) bins[idx] += 1
    }

    /* ── drawing ─────────────────────────────────────────────── */

    function lattice(alpha) {
      if (alpha <= 0.01) return
      const gap = Math.max(46, Math.min(W, H) / 12)
      ctx.strokeStyle = `rgba(255,255,255,${0.038 * alpha})`
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let x = stage.x % gap; x < W; x += gap) {
        ctx.moveTo(Math.round(x) + 0.5, 0)
        ctx.lineTo(Math.round(x) + 0.5, H)
      }
      for (let y = origin.y % gap; y < H; y += gap) {
        ctx.moveTo(0, Math.round(y) + 0.5)
        ctx.lineTo(W, Math.round(y) + 0.5)
      }
      ctx.stroke()
    }

    /** Partial polyline, the ShowCreation primitive. */
    function partialPath(pts, p, style, width) {
      if (p <= 0 || pts.length < 2) return
      const last = (pts.length - 1) * clamp01(p)
      const whole = Math.floor(last)
      ctx.strokeStyle = style
      ctx.lineWidth = width
      ctx.beginPath()
      ctx.moveTo(pts[0][0] ?? pts[0].x, pts[0][1] ?? pts[0].y)
      for (let i = 1; i <= whole; i++) {
        const q = pts[i]
        ctx.lineTo(q[0] ?? q.x, q[1] ?? q.y)
      }
      const frac = last - whole
      if (frac > 0 && whole + 1 < pts.length) {
        const a = pts[whole], b = pts[whole + 1]
        const ax = a[0] ?? a.x, ay = a[1] ?? a.y
        const bx = b[0] ?? b.x, by = b[1] ?? b.y
        ctx.lineTo(ax + (bx - ax) * frac, ay + (by - ay) * frac)
      }
      ctx.stroke()
    }

    function drawCampus(reveal, fade, offset) {
      drawCampusEdges(reveal, fade, offset)
      drawCampusNodes(reveal, fade, offset)
    }

    function drawCampusEdges(reveal, fade, offset) {
      const { dx, dy } = offset
      // The substrate is UW's actual street and footpath network. Kept
      // deliberately faint: the form comes from the accumulation of
      // hundreds of near-invisible marks, not from a few bold ones.
      // Footways outnumber roads 3.5:1 here, the pedestrian network
      // really is the shape of this campus.
      const n = wayPx.length
      for (let w = 0; w < n; w++) {
        const p = lagged(reveal, w, n, LAG)
        if (p <= 0) continue
        const way = wayPx[w]
        const mid = way.pts[Math.floor(way.pts.length / 2)]
        const vis = legible(mid[0] + dx, mid[1] + dy)
        if (vis <= 0.02) continue
        const alpha = (way.tier ? 0.5 : 0.28) * fade * vis
        partialPath(
          way.pts.map(([x, y]) => [x + dx, y + dy]),
          p,
          `rgba(${INK_LINE},${alpha})`,
          way.tier ? 1.15 : 1
        )
      }

      // Shoreline, the one red element in this act.
      for (const seg of shorePx) {
        // Drawn per span so the mask can fade it where it passes the type.
        const pts = seg.map(([x, y]) => [x + dx * 1.5, y + dy * 1.5])
        const upto = clamp01(reveal * 1.25) * (pts.length - 1)
        ctx.lineWidth = 2
        for (let k = 0; k < Math.floor(upto); k++) {
          const vis = legible(pts[k][0], pts[k][1])
          if (vis <= 0.02) continue
          ctx.strokeStyle = `rgba(${RED},${0.95 * fade * vis})`
          ctx.beginPath()
          ctx.moveTo(pts[k][0], pts[k][1])
          ctx.lineTo(pts[k + 1][0], pts[k + 1][1])
          ctx.stroke()
        }
      }

    }

    function drawCampusNodes(reveal, fade, offset) {
      const { dx, dy } = offset
      for (let i = 0; i < nodePos.length; i++) {
        const p = lagged(reveal, i, nodePos.length, LAG)
        if (p <= 0) continue
        const nd = nodePos[i]
        const vis = legible(nd.x + dx, nd.y + dy)
        if (vis <= 0.02) continue
        const r = (1.5 + nd.w * 2.4) * smooth(p)
        if (nd.w > 0.55) {
          ctx.fillStyle = glow(nd.x + dx, nd.y + dy, r * 5, RED, 2, vis)
          ctx.beginPath()
          ctx.arc(nd.x + dx, nd.y + dy, r * 5, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.fillStyle = nd.w > 0.55
          ? `rgba(${RED},${0.9 * fade * p * vis})`
          : `rgba(${INK_LINE},${(0.42 + nd.w * 0.5) * fade * p * vis})`
        ctx.beginPath()
        ctx.arc(nd.x + dx, nd.y + dy, r, 0, Math.PI * 2)
        ctx.fill()
      }

      // Labels for the buildings this club's subjects live in. Below
      // ~720px they collide with each other and with the mesh, so the
      // graphic carries itself on geometry alone.
      if (fade > 0.4 && W >= 720) {
        ctx.font = `500 11px ${monoFont}`
        ctx.textBaseline = 'middle'
        for (const { i, t } of campus.labels) {
          const p = lagged(reveal, i, nodePos.length, LAG)
          if (p < 0.6) continue
          const nd = nodePos[i]
          const a = (p - 0.6) / 0.4
          const vis = legible(nd.x + dx, nd.y + dy)
          if (vis <= 0.3) continue
          ctx.fillStyle = `rgba(${INK_LINE},${0.6 * fade * a * vis})`
          ctx.fillText(t.toUpperCase(), nd.x + dx + 7, nd.y + dy - 6)
        }
      }
    }

    /**
     * Nodes travelling between their campus seat and the common origin,
     * along a circular arc rather than a straight line, manim's
     * path_arc, which is most of why its Transforms read as motion
     * rather than as interpolation.
     */
    function drawCollapse(p, dir) {
      const n = nodePos.length
      for (let i = 0; i < n; i++) {
        const eased = smooth(lagged(p, i, n, LAG))
        const k = dir === 'in' ? eased : 1 - eased
        const nd = nodePos[i]
        const [x, y] = arcPath(nd.x, nd.y, origin.x, origin.y, k, PATH_ARC)
        const r = (1.9 + nd.w * 2.4) * (1 - k * 0.35)
        // Streak along the direction of travel so the collapse reads as
        // motion rather than as a field of dots blinking out.
        if (k > 0.02 && k < 0.99) {
          // Trail sampled along the same arc, so it curves with the travel.
          ctx.strokeStyle = nd.w > 0.55
            ? `rgba(${RED},${0.5 * (1 - k)})`
            : `rgba(${INK_LINE},${0.42 * (1 - k)})`
          ctx.lineWidth = 1.1
          ctx.beginPath()
          ctx.moveTo(x, y)
          for (let t = 1; t <= 5; t++) {
            const [tx, ty] = arcPath(nd.x, nd.y, origin.x, origin.y,
                                     Math.max(k - 0.035 * t, 0), PATH_ARC)
            ctx.lineTo(tx, ty)
          }
          ctx.stroke()
        }
        ctx.fillStyle = nd.w > 0.55
          ? `rgba(${RED},${0.9 - k * 0.2})`
          : `rgba(${INK_LINE},${0.62 - k * 0.15})`
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    /**
     * ShowPassingFlash along a handful of edges: a short highlight of
     * width `tw` sweeping the segment, easing in and out because the
     * bounds are driven through `smooth`.
     */
    const PULSES = 22
    let pulsePicks = []
    function pickPulses() {
      const rand = mulberry32(51217)
      // Longer ways only: a pulse on a three-metre footpath stub is
      // invisible. Each carries its own phase offset.
      const longEnough = wayPx
        .map((w, i) => [i, w.pts.length])
        .filter(([, n]) => n >= 4)
      pulsePicks = Array.from({ length: PULSES }, () => ({
        way: longEnough.length
          ? longEnough[Math.floor(rand() * longEnough.length)][0]
          : 0,
        offset: rand(),
        speed: 0.75 + rand() * 0.5,
      }))
    }

    function drawPulses(phase) {
      if (!wayPx.length || !pulsePicks.length) return
      ctx.lineCap = 'round'
      for (let k = 0; k < PULSES; k++) {
        const pick = pulsePicks[k]
        const way = wayPx[pick.way]
        if (!way || way.pts.length < 3) continue
        const local = (pick.offset + phase * pick.speed) % 1
        const [lo, hi] = flashBounds(local, 0.3)
        if (hi - lo < 0.01) continue
        const mid = way.pts[Math.floor(way.pts.length / 2)]
        const vis = legible(mid[0], mid[1])
        if (vis <= 0.05) continue
        const ends = Math.min(Math.min(local, 1 - local) * 6, 1)
        ctx.strokeStyle = `rgba(${RED},${0.8 * ends * vis})`
        ctx.lineWidth = 1.5
        // Partial polyline between the two bounds.
        const seg = []
        const last = way.pts.length - 1
        for (let t = 0; t <= 12; t++) {
          const f = lo + (hi - lo) * (t / 12)
          const idx = f * last
          const i0 = Math.min(Math.floor(idx), last - 1)
          const fr = idx - i0
          seg.push([
            way.pts[i0][0] + (way.pts[i0 + 1][0] - way.pts[i0][0]) * fr,
            way.pts[i0][1] + (way.pts[i0 + 1][1] - way.pts[i0][1]) * fr,
          ])
        }
        ctx.beginPath()
        ctx.moveTo(seg[0][0], seg[0][1])
        for (let t = 1; t < seg.length; t++) ctx.lineTo(seg[t][0], seg[t][1])
        ctx.stroke()
      }
      ctx.lineCap = 'butt'
    }

    /** true_dot.wgsl: alpha falls off as (1 - r)^glow_factor. */
    function glow(x, y, radius, rgb, factor = 2, mult = 1) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, radius)
      for (let i = 0; i <= 8; i++) {
        const r = i / 8
        g.addColorStop(r, `rgba(${rgb},${Math.pow(1 - r, factor) * 0.5 * mult})`)
      }
      return g
    }

    /** Walk traces are accumulated on an offscreen canvas. */
    function traceTo(p) {
      const target = Math.floor(clamp01(p) * STEPS)
      if (target <= tracedTo) {
        if (target < tracedTo) {
          tctx.clearRect(0, 0, W, H)
          tracedTo = 0
        } else return
      }
      for (const w of walkers) {
        tctx.strokeStyle = w.accent ? `rgba(${RED},0.72)` : `rgba(${INK_LINE},0.26)`
        tctx.lineWidth = w.accent ? 1.4 : 1
        tctx.beginPath()
        tctx.moveTo(w.pts[tracedTo].x, w.pts[tracedTo].y)
        for (let s = tracedTo + 1; s <= target; s++) tctx.lineTo(w.pts[s].x, w.pts[s].y)
        tctx.stroke()
      }
      tracedTo = target
    }

    function drawDistribution(reveal, fade) {
      const top = origin.y - sigma * SPREAD
      const band = (sigma * SPREAD * 2) / BINS
      const peak = Math.max(...bins, 1)

      ctx.strokeStyle = `rgba(255,255,255,${0.14 * fade})`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(Math.round(histX) + 0.5, Math.max(top, 0))
      ctx.lineTo(Math.round(histX) + 0.5, Math.min(top + sigma * SPREAD * 2, H))
      ctx.stroke()

      const n = BINS
      for (let i = 0; i < n; i++) {
        if (!bins[i]) continue
        const p = lagged(reveal, Math.abs(i - n / 2), n / 2, 0.12)
        if (p <= 0) continue
        const y = top + i * band
        if (y + band < 0 || y > H) continue
        const len = (bins[i] / peak) * histW * smooth(p)
        ctx.fillStyle = `rgba(197,5,12,${0.82 * fade})`
        ctx.fillRect(histX, y + band * 0.14, len, Math.max(band * 0.72, 1.2))
        ctx.fillStyle = `rgba(${RED},${0.85 * fade})`
        ctx.fillRect(histX + len - 1.5, y + band * 0.14, 1.5, Math.max(band * 0.72, 1.2))
      }

      const curve = []
      for (let i = 0; i <= 90; i++) {
        const z = -SPREAD + (i / 90) * SPREAD * 2
        curve.push([histX + Math.exp(-0.5 * z * z) * histW, origin.y + z * sigma])
      }
      partialPath(curve, clamp01(reveal * 1.1), `rgba(255,255,255,${0.34 * fade})`, 1.25)
    }

    /* ── frame ───────────────────────────────────────────────── */

    function render(elapsed) {
      const t = elapsed % CYCLE
      let acc = 0
      let act = ACTS[0][0]
      let local = 0
      for (const [name, dur] of ACTS) {
        if (t < acc + dur) { act = name; local = (t - acc) / dur; break }
        acc += dur
      }

      ctx.fillStyle = BG
      ctx.fillRect(0, 0, W, H)

      const par = pointer.on ? 10 : 0
      const offset = { dx: pointer.x * par, dy: pointer.y * par * 0.6 }

      let edgeFade = 0, campusReveal = 0, nodesOwnDraw = true
      let traceFade = 0, distFade = 0, distReveal = 0

      if (act === 'campusIn') {
        edgeFade = 1; campusReveal = rushInto(local)
      } else if (act === 'campusHold') {
        edgeFade = 1; campusReveal = 1
      } else if (act === 'collapse') {
        // Edges recede while the nodes travel, so the network dissolves
        // rather than cutting to black.
        edgeFade = 1 - smooth(clamp01(local * 1.5)); campusReveal = 1; nodesOwnDraw = false
      } else if (act === 'walk') {
        traceFade = 1; distFade = clamp01((local - 0.7) * 3.4); distReveal = distFade
      } else if (act === 'distHold') {
        traceFade = 1; distFade = 1; distReveal = 1
      } else if (act === 'return') {
        traceFade = 1 - smooth(clamp01(local * 2)); distFade = traceFade; distReveal = 1
        edgeFade = smooth(clamp01((local - 0.5) * 2)); campusReveal = 1; nodesOwnDraw = false
      }

      lattice(0.35 + 0.65 * Math.max(edgeFade, distFade))

      if (edgeFade > 0.01) {
        if (nodesOwnDraw) {
          drawCampus(campusReveal, edgeFade, offset)
          if (act === 'campusHold') drawPulses(local)
        } else {
          drawCampusEdges(campusReveal, edgeFade, offset)
        }
      }

      if (act === 'collapse') {
        drawCollapse(local, 'in')
        const heat = smooth(local)
        ctx.fillStyle = glow(origin.x, origin.y, 42 * heat, RED, 2)
        ctx.beginPath()
        ctx.arc(origin.x, origin.y, 42 * heat, 0, Math.PI * 2)
        ctx.fill()
      }
      if (act === 'return' && local > 0.4) drawCollapse((local - 0.4) / 0.6, 'out')

      if (act === 'walk') traceTo(rushFrom(local))
      else if (act === 'campusIn' && local < 0.05) { tctx.clearRect(0, 0, W, H); tracedTo = 0 }

      if (traceFade > 0.01) {
        ctx.save()
        ctx.globalAlpha = traceFade
        ctx.drawImage(trace, 0, 0, W, H)
        ctx.restore()
      }

      if (distFade > 0.01) drawDistribution(distReveal, distFade)
    }

    function staticFrame() {
      ctx.fillStyle = BG
      ctx.fillRect(0, 0, W, H)
      lattice(1)
      drawCampus(1, 1, { dx: 0, dy: 0 })
      traceTo(1)
      ctx.save()
      ctx.globalAlpha = 0.5
      ctx.drawImage(trace, 0, 0, W, H)
      ctx.restore()
      drawDistribution(1, 0.75)
    }

    function frame(now) {
      raf = requestAnimationFrame(frame)
      if (!running) { t0 = now - lastElapsed; return }
      lastElapsed = now - t0
      render(lastElapsed)
    }
    let lastElapsed = 0

    layout()

    let teardown = () => {}
    if (reduced) {
      staticFrame()
    } else {
      t0 = performance.now()
      raf = requestAnimationFrame(frame)

      const io = new IntersectionObserver(([e]) => { running = e.isIntersecting }, { threshold: 0 })
      io.observe(canvas)
      const onVis = () => { running = !document.hidden }
      document.addEventListener('visibilitychange', onVis)

      // Triple-click anywhere on the graphic to skip the campus hold
      // and run the transform now, rather than waiting out the cycle.
      const onClick = (e) => {
        // The canvas sits behind the headline container, so listen on
        // the hero section and ignore clicks on anything interactive.
        if (e.target.closest('a, button')) return
        clearTimeout(clickTimer)
        clicks += 1
        if (clicks >= 3) {
          clicks = 0
          const intoCollapse = ACTS[0][1] + ACTS[1][1]
          const t = lastElapsed % CYCLE
          if (t < intoCollapse) t0 -= intoCollapse - t - 120
        } else {
          clickTimer = setTimeout(() => { clicks = 0 }, 600)
        }
      }
      const hero = canvas.parentElement
      hero?.addEventListener('click', onClick)

      const fine = window.matchMedia('(pointer: fine)').matches
      const onMove = (e) => {
        const r = canvas.getBoundingClientRect()
        pointer.x = ((e.clientX - r.left) / r.width - 0.5) * 2
        pointer.y = ((e.clientY - r.top) / r.height - 0.5) * 2
        pointer.on = true
      }
      const onLeave = () => { pointer.on = false; pointer.x = 0; pointer.y = 0 }
      if (fine) {
        window.addEventListener('mousemove', onMove, { passive: true })
        window.addEventListener('mouseout', onLeave, { passive: true })
      }

      teardown = () => {
        io.disconnect()
        clearTimeout(clickTimer)
        hero?.removeEventListener('click', onClick)
        document.removeEventListener('visibilitychange', onVis)
        if (fine) {
          window.removeEventListener('mousemove', onMove)
          window.removeEventListener('mouseout', onLeave)
        }
      }
    }

    let resizeTimer
    let lastW = W
    function onResize() {
      if (canvas.getBoundingClientRect().width === lastW) return
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        layout()
        lastW = W
        if (reduced) staticFrame()
        else t0 = performance.now()
      }, 200)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      teardown()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`font-mono ${className}`}
      aria-hidden="true"
      role="presentation"
    />
  )
}
