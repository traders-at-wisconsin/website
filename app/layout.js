import { Geist } from 'next/font/google'
import Image from 'next/image'
import NavBar from './components/NavBar'
import FooterLinks from './components/FooterLinks'
import PageTransition from './components/PageTransition'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata = {
  title: 'Traders at Wisconsin',
  description: "Wisconsin's Premier Quant Finance Club at UW-Madison",
}


function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={geist.className}>
      <body className="bg-white text-black">

        <PageTransition />
        <NavBar />

        <div className="pt-16">
          {children}
        </div>

        {/* ── Footer ─────────────────────────────────────────── */}
        <footer className="bg-zinc-50 border-t border-zinc-200 pt-16 pb-8 px-6">
          <div className="max-w-7xl mx-auto">

            <div className="grid md:grid-cols-3 gap-12 mb-14">

              {/* Brand */}
              <div>
                <p className="text-xs font-normal tracking-widest uppercase text-zinc-700 mb-4">
                  Traders at Wisconsin
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed font-light max-w-xs">
                  Wisconsin's Premier Quant Finance Club.<br />
                  University of Wisconsin–Madison.
                </p>
              </div>

              {/* Explore */}
              <div>
                <p className="text-[10px] tracking-widest uppercase text-zinc-400 mb-5">Explore</p>
                <FooterLinks />
              </div>

              {/* Connect */}
              <div>
                <p className="text-[10px] tracking-widest uppercase text-zinc-400 mb-5">Connect</p>
                <div className="flex items-center gap-5">
                  <a
                    href="https://instagram.com/tradersatwisconsin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-zinc-800 transition-colors duration-200"
                    aria-label="Instagram"
                  >
                    <InstagramIcon />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/cardinal-trading-group/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-zinc-800 transition-colors duration-200"
                    aria-label="LinkedIn"
                  >
                    <LinkedInIcon />
                  </a>
                </div>
              </div>

            </div>

            <div className="border-t border-zinc-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
              <p className="text-xs text-zinc-300">&copy; 2026 Traders at Wisconsin</p>
              <p className="text-xs text-zinc-300">University of Wisconsin–Madison</p>
            </div>

          </div>
        </footer>

      </body>
    </html>
  )
}
