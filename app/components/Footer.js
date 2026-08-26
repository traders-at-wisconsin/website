import Link from 'next/link'
import Mark from './Mark'

const LINKEDIN = 'https://www.linkedin.com/company/traders-at-wisconsin/'
const INSTAGRAM = 'https://instagram.com/tradersatwisconsin'
const EMAIL = 'tradersatwisconsin@gmail.com'

const EXPLORE = [
  ['About', '/#about'],
  ['What We Do', '/#work'],
  ['Recruiting', '/join'],
  ['Sponsors', '/sponsors'],
]

const CONNECT = [
  ['LinkedIn', LINKEDIN],
  ['Instagram', INSTAGRAM],
  ['Email', `mailto:${EMAIL}`],
]

function ColumnHeading({ children }) {
  return <h2 className="eyebrow mb-6 text-mute-dark">{children}</h2>
}

export default function Footer() {
  return (
    <footer className="on-ink bg-ink text-body-dark">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-14 border-b border-hair-dark py-16 sm:grid-cols-2 lg:grid-cols-4 lg:py-20">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Mark className="mb-7 h-8 w-auto text-brand-500" title="Traders at Wisconsin" />
            <p className="max-w-sm text-lg leading-relaxed text-body-dark">
              A student-led quantitative finance club at the University of
              Wisconsin&ndash;Madison.
            </p>
            <p className="eyebrow mt-8 text-mute-dark">
              43.0766&deg; N&nbsp;&nbsp;89.4125&deg; W
            </p>
          </div>

          <nav aria-labelledby="footer-explore">
            <ColumnHeading><span id="footer-explore">Explore</span></ColumnHeading>
            <ul className="flex flex-col gap-4">
              {EXPLORE.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-base hover:text-paper transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-connect">
            <ColumnHeading><span id="footer-connect">Connect</span></ColumnHeading>
            <ul className="flex flex-col gap-4">
              {CONNECT.map(([label, href]) => {
                const external = href.startsWith('http')
                return (
                  <li key={href}>
                    <a
                      href={href}
                      {...(external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      className="group inline-flex items-center gap-2 text-base hover:text-paper transition-colors duration-200"
                    >
                      {label}
                      {external && (
                        <span
                          aria-hidden="true"
                          className="text-2xs text-mute-dark transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        >
                          &#8599;
                        </span>
                      )}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-3 py-8 font-mono text-2xs uppercase tracking-[0.16em] text-mute-dark sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Traders at Wisconsin</p>
          <p>University of Wisconsin&ndash;Madison</p>
        </div>
      </div>
    </footer>
  )
}
