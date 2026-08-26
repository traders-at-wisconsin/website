'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Wordmark from './Wordmark'

const LINKS = [
  ['About', '/#about'],
  ['Sponsors', '/sponsors'],
]

export default function NavBar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close the panel whenever the route changes.
  useEffect(() => setOpen(false), [pathname])

  // Trap the page behind the open panel and allow Escape to dismiss.
  useEffect(() => {
    if (!open) return
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const linkClass =
    'flex h-full items-center px-1 text-sm text-body-dark hover:text-paper transition-colors duration-200'

  return (
    <header className="on-ink fixed inset-x-0 top-0 z-[100] h-[4.5rem] bg-ink/95 backdrop-blur-md border-b border-hair-dark">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link
          href="/"
          className="flex h-full items-center py-4 text-paper hover:text-brand-400 transition-colors duration-200"
          aria-label="Traders at Wisconsin — home"
        >
          <Wordmark compact />
        </Link>

        {/* ── Desktop ─────────────────────────────────────── */}
        <nav className="hidden h-full items-center gap-8 md:flex" aria-label="Primary">
          {LINKS.map(([label, href]) => (
            <Link key={href} href={href} className={linkClass}>
              {label}
            </Link>
          ))}
          <Link
            href="/join"
            className="group relative inline-flex items-center gap-2 border border-brand-500 px-5 py-2.5
                       font-mono text-2xs font-medium uppercase tracking-[0.18em] text-paper
                       transition-colors duration-200 hover:bg-brand-500"
          >
            Join Us
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
              &rarr;
            </span>
          </Link>
        </nav>

        {/* ── Mobile trigger ──────────────────────────────── */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="-mr-2 flex h-11 w-11 items-center justify-center text-paper md:hidden"
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <span aria-hidden="true" className="relative block h-3.5 w-5">
            <span
              className="absolute left-0 block h-px w-full bg-current transition-transform duration-300"
              style={{ top: open ? '50%' : 0, transform: open ? 'rotate(45deg)' : 'none' }}
            />
            <span
              className="absolute left-0 bottom-0 block h-px w-full bg-current transition-transform duration-300"
              style={{ bottom: open ? '50%' : 0, transform: open ? 'rotate(-45deg)' : 'none' }}
            />
          </span>
        </button>
      </div>

      {/* ── Mobile panel ──────────────────────────────────── */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="fixed inset-x-0 top-[4.5rem] bottom-0 bg-ink px-6 pt-10 md:hidden"
      >
        <nav className="flex flex-col gap-1" aria-label="Primary">
          {[...LINKS, ['Join Us', '/join']].map(([label, href], i) => (
            <Link
              key={href}
              href={href}
              className="border-b border-hair-dark py-5 text-2xl font-semibold text-paper
                         hover:text-brand-400 transition-colors"
            >
              <span className="mr-4 font-mono text-2xs text-brand-400 align-middle">
                {String(i + 1).padStart(2, '0')}
              </span>
              {label}
            </Link>
          ))}
        </nav>
        <p className="mt-10 max-w-xs text-sm text-mute-dark">
          Quantitative finance, trading and research at the University of Wisconsin–Madison.
        </p>
      </div>
    </header>
  )
}
