'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * A sponsor tile that opens into a tilting card.
 *
 * The logo markup is rendered on the server and passed through as
 * `tile` and `full`, so the sizing and trimming work in lib/logo-metrics
 * still applies and this component only owns interaction.
 *
 * Tilt and sheen track the pointer and stop dead under
 * prefers-reduced-motion, where the card is simply a static panel.
 */

const MAX_TILT = 11

export default function SponsorCard({ sponsor, index, total, tile, full }) {
  const [open, setOpen] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0, px: 50, py: 50, active: false })
  const cardRef = useRef(null)
  const closeRef = useRef(null)
  const openerRef = useRef(null)
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const close = useCallback(() => {
    setOpen(false)
    setTilt({ x: 0, y: 0, px: 50, py: 50, active: false })
    openerRef.current?.focus()
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
      const focusable = cardRef.current?.parentElement?.querySelectorAll(
        'a[href], button:not([disabled])'
      )
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
      x: (50 - py) / 50 * MAX_TILT,
      y: (px - 50) / 50 * MAX_TILT,
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
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-label={label}
          className="group relative flex min-h-52 cursor-pointer flex-col bg-white text-left
                     transition-transform duration-300 ease-out-quint hover:-translate-y-1"
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
          onMouseMove={track}
          onMouseLeave={() => setTilt((t) => ({ ...t, x: 0, y: 0, active: false }))}
          style={{ perspective: '1200px' }}
        >
          <div className="absolute inset-0 bg-ink/96" aria-hidden="true" />

          <div
            ref={cardRef}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[22rem] bg-paper p-2"
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transformStyle: 'preserve-3d',
              transition: tilt.active ? 'none' : 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
              boxShadow: '0 40px 80px -20px rgba(0,0,0,0.7)',
              animation: 'cardIn 0.45s cubic-bezier(0.22,1,0.36,1) both',
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

            <div className="flex min-h-64 items-center justify-center bg-white px-8">
              {full}
            </div>

            <div className="border-t border-hair px-5 py-5">
              <h3 className="text-2xl font-semibold text-ink">{sponsor.name}</h3>
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
