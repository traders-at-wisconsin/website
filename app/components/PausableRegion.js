'use client'

import { useState } from 'react'

/**
 * Wraps auto-scrolling content with a pause control.
 *
 * Hover-pause alone only serves a mouse. WCAG 2.2.2 asks for a
 * mechanism to pause motion that starts on its own and runs for more
 * than five seconds, so touch and keyboard users need a real button.
 *
 * `heading` and `children` are rendered on the server and passed
 * through — this component only owns the paused state.
 */
export default function PausableRegion({ heading, children, label = 'logo strip' }) {
  const [paused, setPaused] = useState(false)

  return (
    <div data-paused={paused ? 'true' : undefined}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 lg:px-10">
        {heading}
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="eyebrow shrink-0 py-2 text-mute transition-colors duration-200 hover:text-brand-600"
        >
          <span className="sr-only">
            {paused ? `Resume the ${label}` : `Pause the ${label}`}
          </span>
          <span aria-hidden="true">{paused ? 'Play' : 'Pause'}</span>
        </button>
      </div>
      {children}
    </div>
  )
}
