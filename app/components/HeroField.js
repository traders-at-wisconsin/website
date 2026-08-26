'use client'

import { useEffect, useRef } from 'react'

/**
 * Signature hero graphic: independent random walks fanning out from a
 * common origin, their terminal values accumulating into the normal
 * distribution they converge to — the central limit theorem, drawn live.
 *
 * The increments are Rademacher (+/-1 with equal probability), NOT
 * Gaussian. That matters: a sum of independent normals is exactly
 * normal at every n, so drawing Gaussian steps would demonstrate that
 * the normal family is closed under convolution, not the CLT. With a
 * two-point step distribution the convergence is real, and the walks
 * pick up the lattice texture of an actual random walk.
 *
 * The histogram is likewise built by running the same process — a
 * silent warm-up of WARMUP walks before the first frame — rather than
 * by sampling the limiting density directly. The curve you see is the
 * one the drawn walks produced.
 *
 * Deliberately abstract. No axis values, no tickers, no prices; nothing
 * here could be mistaken for real market data. Each frame draws a
 * handful of short segments, the loop pauses off-screen and when the
 * tab is hidden, and a single static frame is rendered for visitors who
 * prefer reduced motion.
 */

const WALKS = 22
const STEPS = 170
const BINS = 44
const WARMUP = 420 // silent walks run before the first frame, so the
                   // histogram is a curve on load without being faked
const SPREAD = 3.1 // half-width of the binned range, in standard deviations

const BG = '#0a0a0b'

// Deterministic PRNG, so the reduced-motion frame is stable.
function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** One Rademacher increment: -1 or +1, equally likely. */
function rademacher(rand) {
  return rand() < 0.5 ? -1 : 1
}

/**
 * Walk the same process the canvas draws, without drawing it, and
 * return the terminal value in units of the limiting standard
 * deviation.
 */
function terminalZ(rand) {
  let sum = 0
  for (let i = 0; i < STEPS; i++) sum += rademacher(rand)
  return sum / Math.sqrt(STEPS)
}

export default function HeroField({ className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let W = 0
    let H = 0
    let originX = 0
    let centerY = 0
    let histX = 0
    let histW = 0
    let spanX = 0
    let sigma = 0
    let stepSigma = 0

    let walks = []
    let bins = new Array(BINS).fill(0)
    let step = 0
    let phase = 'draw'
    let hold = 0
    let fade = 0
    let raf = 0
    let running = true
    let seed = 20260826
    let rand = mulberry32(seed)

    function layout() {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = Math.max(rect.width, 1)
      H = Math.max(rect.height, 1)
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      histW = Math.min(W * 0.16, 170)
      histX = W - histW - Math.max(W * 0.035, 20)
      // Once the graphic sits behind the headline rather than in its own
      // band, start the fan clear of the text column — otherwise the
      // origin, which is the most legible moment in the animation, ends
      // up buried under the scrim that protects the type.
      originX = W >= 1024 ? W * 0.34 : W * 0.03
      spanX = Math.max(histX - originX - 18, 60)
      centerY = H * 0.5
      sigma = Math.min(H * 0.17, 118)
      stepSigma = sigma / Math.sqrt(STEPS)
    }

    /** Lattice + axis, covering only the walk region. */
    function paintField() {
      ctx.fillStyle = BG
      ctx.fillRect(0, 0, histX - 6, H)

      const gap = Math.max(40, Math.min(W, H) / 13)
      ctx.lineWidth = 1
      ctx.strokeStyle = 'rgba(255,255,255,0.04)'
      ctx.beginPath()
      for (let x = originX % gap; x < histX - 6; x += gap) {
        ctx.moveTo(Math.round(x) + 0.5, 0)
        ctx.lineTo(Math.round(x) + 0.5, H)
      }
      for (let y = centerY % gap; y < H; y += gap) {
        ctx.moveTo(0, Math.round(y) + 0.5)
        ctx.lineTo(histX - 6, Math.round(y) + 0.5)
      }
      ctx.stroke()

      ctx.strokeStyle = 'rgba(255,255,255,0.11)'
      ctx.beginPath()
      ctx.moveTo(0, Math.round(centerY) + 0.5)
      ctx.lineTo(histX - 6, Math.round(centerY) + 0.5)
      ctx.stroke()
    }

    function seedBins() {
      bins = new Array(BINS).fill(0)
      for (let i = 0; i < WARMUP; i++) addSample(terminalZ(rand))
    }

    function addSample(z) {
      const idx = Math.floor(((z / SPREAD + 1) / 2) * BINS)
      if (idx >= 0 && idx < BINS) bins[idx] += 1
    }

    function newBatch() {
      walks = Array.from({ length: WALKS }, (_, i) => ({
        x: originX,
        y: centerY,
        rand: mulberry32((seed + i * 7919 + step) >>> 0),
        accent: i % 8 === 3,
      }))
      step = 0
      phase = 'draw'
      hold = 0
      fade = 0
      paintField()
    }

    function drawStep() {
      const dx = spanX / STEPS
      for (const w of walks) {
        const nx = w.x + dx
        const ny = w.y + rademacher(w.rand) * stepSigma
        ctx.strokeStyle = w.accent
          ? 'rgba(255,107,117,0.72)'
          : 'rgba(226,226,236,0.30)'
        ctx.lineWidth = w.accent ? 1.4 : 1
        ctx.beginPath()
        ctx.moveTo(w.x, w.y)
        ctx.lineTo(nx, ny)
        ctx.stroke()
        w.x = nx
        w.y = ny
      }
      step += 1

      if (step >= STEPS) {
        for (const w of walks) addSample((w.y - centerY) / sigma)
        drawDistribution()
      }
    }

    /** Terminal-value histogram with the limiting normal density over it. */
    function drawDistribution() {
      const top = centerY - sigma * SPREAD
      const band = (sigma * SPREAD * 2) / BINS
      const peak = Math.max(...bins, 1)

      ctx.fillStyle = BG
      ctx.fillRect(histX - 6, 0, W - histX + 6, H)

      // Baseline the bars grow from.
      ctx.strokeStyle = 'rgba(255,255,255,0.14)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(Math.round(histX) + 0.5, Math.max(top, 0))
      ctx.lineTo(Math.round(histX) + 0.5, Math.min(top + sigma * SPREAD * 2, H))
      ctx.stroke()

      for (let i = 0; i < BINS; i++) {
        if (!bins[i]) continue
        const y = top + i * band
        if (y + band < 0 || y > H) continue
        const len = (bins[i] / peak) * histW
        ctx.fillStyle = 'rgba(197,5,12,0.82)'
        ctx.fillRect(histX, y + band * 0.14, len, Math.max(band * 0.72, 1.2))
        ctx.fillStyle = 'rgba(255,107,117,0.85)'
        ctx.fillRect(histX + len - 1.5, y + band * 0.14, 1.5, Math.max(band * 0.72, 1.2))
      }

      // The distribution the histogram is converging to.
      ctx.strokeStyle = 'rgba(255,255,255,0.34)'
      ctx.lineWidth = 1.25
      ctx.beginPath()
      for (let i = 0; i <= 90; i++) {
        const z = -SPREAD + (i / 90) * SPREAD * 2
        const y = centerY + z * sigma
        const x = histX + Math.exp(-0.5 * z * z) * histW
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }

    function frame() {
      raf = requestAnimationFrame(frame)
      if (!running) return

      if (phase === 'draw') {
        drawStep()
        if (step >= STEPS) phase = 'hold'
      } else if (phase === 'hold') {
        if (++hold > 170) phase = 'fade'
      } else {
        // Fade only the walk field; the distribution keeps accumulating.
        fade += 0.022
        ctx.fillStyle = 'rgba(10,10,11,0.13)'
        ctx.fillRect(0, 0, histX - 6, H)
        if (fade >= 1) newBatch()
      }
    }

    layout()
    seedBins()
    newBatch()
    drawDistribution()

    let teardown = () => {}

    if (reduced) {
      while (step < STEPS) drawStep()
    } else {
      raf = requestAnimationFrame(frame)

      const io = new IntersectionObserver(([e]) => { running = e.isIntersecting }, { threshold: 0 })
      io.observe(canvas)
      const onVisibility = () => { running = !document.hidden }
      document.addEventListener('visibilitychange', onVisibility)

      teardown = () => {
        io.disconnect()
        document.removeEventListener('visibilitychange', onVisibility)
      }
    }

    let resizeTimer
    let lastW = W
    function onResize() {
      // Ignore mobile browser-chrome height changes; only width matters.
      if (Math.abs(window.innerWidth - lastW) < 1 && canvas.getBoundingClientRect().width === lastW) return
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        layout()
        lastW = W
        seedBins()
        newBatch()
        drawDistribution()
        if (reduced) while (step < STEPS) drawStep()
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

  return <canvas ref={canvasRef} className={className} aria-hidden="true" role="presentation" />
}
