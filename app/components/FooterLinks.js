'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const footerLinks = [
  ['About',    '/#about'  ],
  ['Join Us',  '/join'    ],
  ['Sponsors', '/sponsors'],
]

export default function FooterLinks() {
  const pathname = usePathname()

  function handleAboutClick(e) {
    if (pathname === '/') {
      e.preventDefault()
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {footerLinks.map(([label, href]) => (
        label === 'About' ? (
          <a
            key={href}
            href="/#about"
            onClick={handleAboutClick}
            className="text-sm text-zinc-500 hover:text-zinc-800 font-light transition-colors duration-200"
          >
            {label}
          </a>
        ) : (
          <Link
            key={href}
            href={href}
            className="text-sm text-zinc-500 hover:text-zinc-800 font-light transition-colors duration-200"
          >
            {label}
          </Link>
        )
      ))}
    </div>
  )
}
