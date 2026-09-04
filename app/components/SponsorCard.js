'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

/**
 * A sponsor tile that opens into a tilting card.
 *
 * The logo markup is rendered on the server and passed through as
 * `tile` and `full`, so the sizing and trimming work in lib/logo-metrics
 * still applies and this component only owns interaction.
 *
 * The open/close motion is a FLIP transform (First, Last, Invert,
 * Play): the card is measured at its resting centered position, then
 * an inverse translate+scale is applied so it starts exactly over the
 * clicked tile, then that inverse is animated away — so the card
 * visibly launches from where you clicked and grows into place, and
 * reverses back into the tile on close. That transform lives on its
 * own wrapper (`flipRef`), imperatively driven, so it never fights the
 * separate React-controlled pointer-tilt transform on the card face.
 *
 * Tilt and sheen track the pointer and stop dead under
 * prefers-reduced-motion, where the card simply appears and disappears
 * with no motion at all.
 */

const MAX_TILT = 13
const ENTER_MS = 640
const EXIT_MS = 380

function flipOffsets(finalRect, originRect) {
  return {
    dx: originRect.left + originRect.width / 2 - (finalRect.left + finalRect.width / 2),
    dy: originRect.top + originRect.height / 2 - (finalRect.top + finalRect.height / 2),
    sx: Math.max(originRect.width / finalRect.width, 0.04),
    sy: Math.max(originRect.height / finalRect.height, 0.04),
  }
}

export default function SponsorCard({ sponsor, index, total, tile, full, className = '' }) {
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [impactKey, setImpactKey] = useState(0)
  const [tilt, setTilt] = useState({ x: 0, y: 0, px: 50, py: 50, active: false })

  const flipRef = useRef(null)
  const cardRef = useRef(null)
  const closeRef = useRef(null)
  const openerRef = useRef(null)
  const originRectRef = useRef(null)
  const closeTimerRef = useRef(null)
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => () => clearTimeout(closeTimerRef.current), [])

  function openCard() {
    originRectRef.current = openerRef.current?.getBoundingClientRect() ?? null
    setOpen(true)
  }

  // Enter: measure the card's resting position, jump it back to the
  // tile's position with no transition, then release it on the next
  // frame with a springy overshoot so it visibly launches into place.
  useLayoutEffect(() => {
    if (!open) return
    const el = flipRef.current
    const origin = originRectRef.current
    if (reduced.current || !el || !origin) {
      setImpactKey((k) => k + 1)
      return
    }
    const from = flipOffsets(el.getBoundingClientRect(), origin)
    el.style.transition = 'none'
    el.style.transform = `translate(${from.dx}px, ${from.dy}px) scale(${from.sx}, ${from.sy})`
    void el.offsetWidth // force reflow so the start position is committed before animating
    const raf = requestAnimationFrame(() => {
      el.style.transition = `transform ${ENTER_MS}ms cubic-bezier(0.34, 1.56, 0.64, 1)`
      el.style.transform = 'translate(0px, 0px) scale(1, 1)'
    })
    const landed = setTimeout(() => setImpactKey((k) => k + 1), ENTER_MS)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(landed)
    }
  }, [open])

  const close = useCallback(() => {
    const el = flipRef.current
    const origin = originRectRef.current
    if (reduced.current || !el || !origin) {
      setOpen(false)
      setTilt({ x: 0, y: 0, px: 50, py: 50, active: false })
      openerRef.current?.focus()
      return
    }
    const to = flipOffsets(el.getBoundingClientRect(), origin)
    setClosing(true)
    el.style.transition = `transform ${EXIT_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`
    el.style.transform = `translate(${to.dx}px, ${to.dy}px) scale(${to.sx}, ${to.sy})`
    clearTimeout(closeTimerRef.current)
    closeTimerRef.current = setTimeout(() => {
      setOpen(false)
      setClosing(false)
      setTilt({ x: 0, y: 0, px: 50, py: 50, active: false })
      openerRef.current?.focus()
    }, EXIT_MS)
  }, [])

  useEffect(() => {
    if (!open) return
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key !== 'Tab') return
      // Small dialog: keep focus inside it.
      const focusable = flipRef.current?.querySelectorAll('a[href], button:not([disabled])')
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, close])

  function track(e) {
    if (reduced.current || !cardRef.current) return
    const r = cardRef.current.getBoundingClientRect()
    const px = ((e.clientX - r.left) / r.width) * 100
    const py = ((e.clientY - r.top) / r.height) * 100
    setTilt({
      x: ((50 - py) / 50) * MAX_TILT,
      y: ((px - 50) / 50) * MAX_TILT,
      px,
      py,
      active: true,
    })
  }

  const label = `${sponsor.name}, sponsor ${index + 1} of ${total}`

  return (
    <>
      {/* ── Tile ────────────────────────────────────────────── */}
      <li className="contents">
        <button
          ref={openerRef}
          type="button"
          onClick={openCard}
          aria-haspopup="dialog"
          aria-label={label}
          className={`group relative flex min-h-52 cursor-pointer flex-col bg-white text-left
                     transition-transform duration-300 ease-out-quint hover:-translate-y-1 ${className}`}
        >
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-brand-600
                       transition-transform duration-[400ms] ease-out-quint group-hover:scale-x-100"
          />
          <span className="flex flex-1 items-center justify-center px-6 py-10">
            <span className="block transition-transform duration-[400ms] ease-out-quint group-hover:scale-[1.06]">
              {tile}
            </span>
          </span>
          <span className="flex items-center justify-between gap-3 border-t border-hair px-5 py-3.5">
            <span className="eyebrow truncate text-mute">{sponsor.name}</span>
            <span className="eyebrow shrink-0 text-hair opacity-0 transition-opacity duration-200 group-hover:text-brand-600 group-hover:opacity-100">
              View
            </span>
          </span>
        </button>
      </li>

      {/* ── Card ────────────────────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-5"
          role="dialog"
          aria-modal="true"
          aria-label={sponsor.name}
          onClick={close}
          style={{ perspective: '1400px' }}
        >
          <div
            className="absolute inset-0 bg-ink"
            aria-hidden="true"
            style={{
              opacity: closing ? 0 : 0.96,
              transition: `opacity ${closing ? EXIT_MS : 240}ms ease-out`,
            }}
          />

          {/* FLIP wrapper: launch/return transform only. Never carries
              the tilt transform, so the two never fight over one
              element's `transform` property. */}
          <div
            ref={flipRef}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[22rem] sm:max-w-[25rem] lg:max-w-[28rem]"
            style={{ willChange: 'transform' }}
          >
            {/* One-shot arrival pulse, keyed to remount (and so restart
                its animation) exactly when the launch lands. */}
            <span
              key={impactKey}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ animation: reduced.current ? 'none' : 'cardPulse 750ms ease-out both' }}
            />

            {/* Tilt face: React-controlled rotateX/rotateY, tracks the
                pointer, independent of the FLIP wrapper's transform. */}
            <div
              ref={cardRef}
              onMouseMove={track}
              onMouseLeave={() => setTilt((t) => ({ ...t, x: 0, y: 0, active: false }))}
              className="relative bg-paper p-2"
              style={{
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transformStyle: 'preserve-3d',
                transition: tilt.active ? 'none' : 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
                boxShadow: '0 48px 96px -24px rgba(0,0,0,0.75)',
              }}
            >
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-brand-600" />

              <div className="border border-hair">
                <div className="flex items-center justify-between border-b border-hair px-5 pt-5 pb-4">
                  <span className="eyebrow tabular text-mute">
                    {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                  </span>
                  {sponsor.tier && <span className="eyebrow text-brand-600">{sponsor.tier}</span>}
                </div>

                <div className="flex min-h-64 items-center justify-center bg-white px-8 sm:min-h-72 lg:min-h-80">
                  {full}
                </div>

                <div className="border-t border-hair px-5 py-5 sm:px-6 sm:py-6">
                  <h3 className="text-2xl font-semibold text-ink sm:text-3xl">{sponsor.name}</h3>
                  {sponsor.description ? (
                    <p className="mt-3 text-base text-mute">{sponsor.description}</p>
                  ) : (
                    sponsor.website && (
                      <p className="eyebrow mt-3 text-mute">
                        {sponsor.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                      </p>
                    )
                  )}
                  {sponsor.website && (
                    <a
                      href={sponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mt-6 inline-flex items-center gap-2.5 border-b-2 border-brand-600 pt-2 pb-2
                                 font-mono text-xs font-medium uppercase tracking-[0.16em] text-ink
                                 transition-colors duration-200 hover:text-brand-600"
                    >
                      Visit site
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      >
                        &#8599;
                      </span>
                    </a>
                  )}
                </div>
              </div>

              {/* Specular sheen, following the pointer across the face. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 mix-blend-soft-light transition-opacity duration-300"
                style={{
                  opacity: tilt.active ? 1 : 0,
                  background: `radial-gradient(52% 40% at ${tilt.px}% ${tilt.py}%, rgba(255,255,255,1), rgba(255,107,117,0.55) 45%, transparent 74%)`,
                }}
              />
              {/* A single chromatic band, angled with the tilt. Restrained
                  on purpose: red and white, not iridescent. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 mix-blend-overlay transition-opacity duration-300"
                style={{
                  opacity: tilt.active ? 0.75 : 0,
                  background: `linear-gradient(${102 + tilt.y * 4}deg, transparent 30%, rgba(197,5,12,0.55) 44%, rgba(255,255,255,0.9) 51%, rgba(197,5,12,0.55) 58%, transparent 72%)`,
                }}
              />
            </div>

            <button
              ref={closeRef}
              type="button"
              onClick={close}
              className="absolute -top-12 right-0 py-2 font-mono text-2xs uppercase tracking-[0.18em]
                         text-mute-dark transition-colors duration-200 hover:text-paper"
            >
              Close &#10005;
            </button>
          </div>
        </div>
      )}
    </>
  )
}
