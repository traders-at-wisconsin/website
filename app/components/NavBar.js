'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

const navLinks = [
  ['About',    '/#about'  ],
  ['Join Us',  '/join'    ],
  ['Sponsors', '/sponsors'],
]

export default function NavBar() {
  const pathname = usePathname()

  function handleAboutClick(e) {
    if (pathname === '/') {
      e.preventDefault()
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">

        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Traders at Wisconsin"
            width={32}
            height={32}
            className="rounded-sm"
          />
          <span className="text-zinc-700 font-normal text-xs tracking-widest uppercase hidden sm:block">
            Traders at Wisconsin
          </span>
        </Link>

        <nav className="flex items-center gap-8">
          {navLinks.map(([label, href]) => (
            label === 'About' ? (
              <a
                key={href}
                href="/#about"
                onClick={handleAboutClick}
                className="text-zinc-500 hover:text-zinc-900 text-sm transition-colors duration-200"
              >
                {label}
              </a>
            ) : (
              <Link
                key={href}
                href={href}
                className="text-zinc-500 hover:text-zinc-900 text-sm transition-colors duration-200"
              >
                {label}
              </Link>
            )
          ))}
        </nav>

      </div>
    </header>
  )
}
