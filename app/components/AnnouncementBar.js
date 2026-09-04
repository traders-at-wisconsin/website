'use client'

import { useEffect, useState } from 'react'

/**
 * Site-wide recruiting-deadline banner. Sits above the nav, in the
 * same fixed stack (see --banner-h / --header-h in globals.css).
 *
 * The application link is always present and always the same accessible
 * name ("Apply now"), so it's never lost mid-rotation. Only the
 * descriptive text beside it rotates, and that text is purely visual:
 * screen readers get the full, un-rotating picture from one static
 * sr-only paragraph read in normal document order, not a live region
 * re-announcing itself every few seconds.
 */

const FORM_URL = 'https://forms.gle/LGvknpaCkSKnGUoD8'
const DEADLINE = 'September 17, 11:59 PM CST'
const MESSAGES = ['Applications are now open.', `Apply by ${DEADLINE}.`]
const ROTATE_MS = 4200

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), ROTATE_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="on-ink flex h-[var(--banner-h)] items-center justify-center gap-3 bg-brand-600 px-4 text-white">
      {/* The complete, non-rotating picture, read once by assistive
          tech in normal document order. */}
      <p className="sr-only">{MESSAGES.join(' ')} Apply now, opens in a new tab.</p>

      {/* All messages share one grid cell (grid stacking), so the cell
          auto-sizes to the longest one and a simple opacity crossfade
          never clips or reflows the container mid-rotation. */}
      <span
        aria-hidden="true"
        className="hidden grid-cols-1 grid-rows-1 font-mono text-2xs font-medium tracking-[0.1em] uppercase sm:grid"
      >
        {MESSAGES.map((message, i) => (
          <span
            key={message}
            className="col-start-1 row-start-1 whitespace-nowrap transition-opacity duration-500 ease-out-quint"
            style={{ opacity: i === index ? 1 : 0 }}
          >
            {message}
          </span>
        ))}
      </span>

      {/* Short form for the smallest screens, where the rotating copy
          above is hidden to guarantee one line at any width. */}
      <span
        aria-hidden="true"
        className="font-mono text-2xs font-medium tracking-[0.1em] uppercase sm:hidden"
      >
        Applications open
      </span>

      <a
        href={FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Apply now, opens the application form in a new tab"
        className="group inline-flex shrink-0 items-center gap-1.5 font-mono text-2xs font-semibold
                   tracking-[0.12em] uppercase underline decoration-white/50 underline-offset-2
                   transition-colors duration-200 hover:decoration-white"
      >
        Apply now
        <span
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        >
          &#8599;
        </span>
      </a>
    </div>
  )
}
