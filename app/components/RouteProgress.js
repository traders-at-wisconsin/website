'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

/**
 * A 2px red loading rule under the header during route changes.
 * Replaces the old full-screen red wipe, which hid the page for
 * ~650 ms on every navigation.
 */
export default function RouteProgress() {
  const pathname = usePathname()
  const [state, setState] = useState('idle') // idle | loading | done
  const previous = useRef(pathname)
  const timers = useRef([])

  function clear() {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  useEffect(() => {
    function onClick(e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
      const anchor = e.target.closest('a')
      if (!anchor || anchor.target === '_blank') return

      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('mailto:')) return

      // Same-origin internal routes only.
      let url
      try {
        url = new URL(href, window.location.href)
      } catch {
        return
      }
      if (url.origin !== window.location.origin) return
      if (url.pathname === pathname) return

      clear()
      setState('loading')
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [pathname])

  useEffect(() => {
    if (previous.current === pathname) return
    previous.current = pathname
    clear()
    setState('done')
    timers.current.push(setTimeout(() => setState('idle'), 320))
    return clear
  }, [pathname])

  useEffect(() => clear, [])

  if (state === 'idle') return null

  return (
    <div
      className="fixed left-0 right-0 z-[120] h-0.5 overflow-hidden pointer-events-none"
      style={{ top: 'var(--header-h)' }}
      aria-hidden="true"
    >
      <div
        className="h-full w-full origin-left bg-brand-500"
        style={{
          transform: state === 'done' ? 'scaleX(1)' : 'scaleX(0.7)',
          opacity: state === 'done' ? 0 : 1,
          transition:
            state === 'done'
              ? 'transform 0.2s ease-out, opacity 0.3s ease 0.1s'
              : 'transform 1.6s cubic-bezier(0.1, 0.7, 0.2, 1)',
        }}
      />
    </div>
  )
}
