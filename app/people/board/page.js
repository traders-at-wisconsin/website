import Image from 'next/image'
import Link from 'next/link'
import SectionLabel from '../../components/SectionLabel'

export const metadata = {
  title: 'Executive Board',
  description:
    'The student executive board that runs Traders at Wisconsin: presidents, operations, and the vice presidents leading trading, software, and professional development.',
}

/* Static for now. Everyone has a headshot; the monogram tile below stays
   as the fallback for whoever joins the board without one. Shaped to move to Sanity unchanged if the board
   ever needs to be editable without a deploy: photo becomes an image
   ref, everything else already matches. */
const BOARD = [
  {
    name: 'Rajiv Jonnala',
    role: 'President',
    photo: '/board/rajiv-jonnala.jpg',
    // Square source, so cover crops the sides; his face sits centered.
    focus: '50% 42%',
    linkedin: 'https://www.linkedin.com/in/rajiv-jonnala-0a2343244/',
  },
  {
    name: 'Smyan Vinu',
    role: 'President',
    photo: '/board/smyan-vinu.jpg',
    focus: '50% 30%',
    linkedin: 'https://www.linkedin.com/in/smyanvinu/',
  },
  {
    name: 'Taiya Shiva',
    role: 'Chief Operations Officer',
    photo: '/board/taiya-shiva.jpg',
    // Tight close-up: bias the crop up so the frame keeps her hairline
    // without cutting the chin at the bottom edge.
    focus: '50% 22%',
    linkedin: 'https://www.linkedin.com/in/taiya-shiva/',
  },
  {
    name: 'Angelina Arasavelli',
    role: 'VP of Professional Development',
    // Re-framed to head-and-shoulders before import; the source was wide
    // enough that a 3:4 box only trimmed the sides and left her small and
    // high in the card. Now exactly 3:4, so the crop below is a no-op.
    photo: '/board/angelina-arasavelli.jpg',
    focus: '50% 50%',
    linkedin: 'https://www.linkedin.com/in/aarasavelli/',
  },
  {
    name: 'Sam Geng',
    role: 'VP of Trading and Research',
    // Already exactly 3:4; nothing is cropped.
    photo: '/board/sam-geng.jpg',
    focus: '50% 50%',
    linkedin: 'https://www.linkedin.com/in/sam-geng-60356a21b/',
  },
  {
    name: 'Aaron Dong',
    role: 'VP of Software Development',
    // Cropped in from the right of the source to leave out a second
    // person at the left edge; already 3:4, so nothing crops here.
    photo: '/board/aaron-dong.jpg',
    focus: '50% 50%',
    linkedin: 'https://www.linkedin.com/in/aarondong988/',
  },
]

/** LinkedIn glyph. Sits where the numbering used to, so the red accent
    keeps the rhythm the numbered cards elsewhere on the site set. */
function LinkedInIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  )
}

/** Placeholder tile for a board member with no headshot yet. Reads as a
    deliberate slot rather than a broken image. */
function Monogram({ name }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')

  return (
    <div className="flex h-full w-full items-center justify-center bg-paper-2" aria-hidden="true">
      <span className="font-mono text-5xl font-medium tracking-[0.06em] text-ink/15">
        {initials}
      </span>
    </div>
  )
}

export default function Board() {
  return (
    <>
      {/* ═══ Header ════════════════════════════════════════════ */}
      <section className="on-ink relative overflow-hidden bg-ink pt-[var(--header-h)] text-paper">
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <SectionLabel index="01" tone="dark">Leadership</SectionLabel>

          <div className="mt-11 grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <h1 className="text-display font-semibold">
                The executive board<span className="text-brand-500">.</span>
              </h1>
            </div>
            <div className="lg:col-span-5 lg:pt-4">
              <p className="text-lg text-body-dark sm:text-xl">
                Traders at Wisconsin is run entirely by students. The board sets
                the curriculum, runs recruiting, and keeps the club&rsquo;s
                programming on the calendar each semester.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Board grid ════════════════════════════════════════
          Separate cards with real gaps between them, so each one is its
          own object rather than a cell in a shared table. Six across
          three columns fills both rows exactly; because nothing draws
          hairlines through a shared background any more, a seventh
          member would simply leave page beside it.                  */}
      <section className="bg-paper py-24 lg:py-32" aria-labelledby="board-heading">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionLabel index="02">The team</SectionLabel>
          <h2 id="board-heading" className="mt-11 max-w-[20ch] text-title font-semibold text-ink">
            Meet the exec board.
          </h2>

          <ul className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            {BOARD.map((member) => (
              <li
                key={member.name}
                className="group relative border border-hair bg-white transition-transform
                           duration-300 ease-out-quint hover:-translate-y-1"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-paper-2">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={`${member.name}, ${member.role}`}
                      fill
                      quality={90}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-[600ms] ease-out-quint group-hover:scale-[1.04]"
                      style={{ objectPosition: member.focus }}
                    />
                  ) : (
                    <Monogram name={member.name} />
                  )}
                </div>

                <div className="border-t border-hair p-7">
                  {/* Stretched link: the glyph is the visible affordance, but
                      the pseudo-element covers the card so the whole tile is
                      the target, without nesting interactive elements. */}
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on LinkedIn`}
                    className="inline-flex text-brand-600 transition-colors duration-200
                               hover:text-brand-700 after:absolute after:inset-0 after:content-['']"
                  >
                    <LinkedInIcon className="h-5 w-5" />
                  </a>

                  <h3 className="mt-5 text-2xl font-semibold text-ink transition-colors duration-200 group-hover:text-brand-600">
                    {member.name}
                  </h3>
                  <p className="mt-2 text-base text-mute">{member.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═══ CTA ═══════════════════════════════════════════════ */}
      <section className="bg-paper-2 py-24 lg:py-32">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div>
            <h2 className="max-w-[20ch] text-title font-semibold text-ink">
              Want to work with them?
            </h2>
            <p className="mt-5 max-w-xl text-lg text-mute">
              Recruiting opens at the start of each semester. No prior
              experience in finance or programming is required.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              href="/join"
              className="inline-flex items-center gap-2.5 bg-brand-600 px-8 py-4
                         font-mono text-xs font-medium uppercase tracking-[0.16em] text-white
                         transition-colors duration-200 hover:bg-brand-500"
            >
              Join the club
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
