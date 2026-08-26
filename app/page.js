export const revalidate = 60

import Link from 'next/link'
import { safeFetch } from '../lib/sanity'
import { measureAll } from '../lib/logo-metrics'
import HeroField from './components/HeroField'
import LogoMarquee from './components/LogoMarquee'
import LogoImage from './components/LogoImage'
import SectionLabel from './components/SectionLabel'

const WORK = [
  {
    title: 'Education',
    body:
      'Sessions on quant theory, statistics, programming, and market structure — built around hands-on work rather than lectures, so members apply what they learn as they learn it.',
    topics: ['Probability', 'Statistics', 'Programming', 'Market structure'],
  },
  {
    title: 'Recruiting',
    body:
      'Resume and technical workshops, mock interviews, recruiter panels, and recruiting advice from members who have been through the process.',
    topics: ['Technical prep', 'Mock interviews', 'Recruiter panels'],
  },
  {
    title: 'Experiences',
    body:
      'Real team projects, skill-based competitions, and social events across the year, giving members ways to apply what they know beyond the classroom.',
    topics: ['Team projects', 'Competitions', 'Community'],
  },
]

const FACTS = [
  ['Open to every major', 'No finance or programming background required.'],
  ['One meeting a week', 'An hour to an hour and a half, plus whatever you take on.'],
  ['Recruiting each semester', 'Applications open in the first few weeks of the term.'],
]

async function getData() {
  const [placements, sponsors] = await Promise.all([
    safeFetch(`*[_type == "placement"] | order(orderRank asc) { company, category, photo }`),
    safeFetch(`*[_type == "sponsor"] | order(_createdAt asc) { name, logo, website, tier }`),
  ])
  return {
    placements: await measureAll(placements, (p) => p.photo),
    sponsors: await measureAll(sponsors, (s) => s.logo),
  }
}

export default async function Home() {
  const { placements, sponsors } = await getData()

  return (
    <>
      {/* ═══ Hero ══════════════════════════════════════════════ */}
      <section className="on-ink relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink pt-[4.5rem] text-paper">
        {/* Below lg the graphic takes its own band above the headline.
            The overlaid composition needs real horizontal room, so it
            only kicks in once the text column has somewhere to sit. */}
        <HeroField className="relative h-[32svh] w-full shrink-0 lg:absolute lg:inset-0 lg:h-full" />

        {/* Blends the mobile graphic band into the section below it. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-[4.5rem] h-[32svh] lg:hidden"
          aria-hidden="true"
          style={{ background: 'linear-gradient(to bottom, transparent 50%, #0a0a0b 100%)' }}
        />

        {/* Keeps the headline legible over the graphic from sm up. */}
        <div
          className="absolute inset-0 -z-0 hidden lg:block"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(96deg, #0a0a0b 0%, rgba(10,10,11,0.97) 32%, rgba(10,10,11,0.80) 48%, rgba(10,10,11,0.30) 72%, rgba(10,10,11,0.06) 100%)',
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-40 -z-0 hidden lg:block"
          aria-hidden="true"
          style={{ background: 'linear-gradient(to top, #0a0a0b, transparent)' }}
        />

        <div className="relative z-10 mx-auto mt-auto w-full max-w-7xl px-6 pt-12 pb-16 sm:pt-16 lg:px-10 lg:pt-24 lg:pb-24">
          <p className="eyebrow rise text-brand-400" style={{ '--d': '80ms' }}>
            University of Wisconsin&ndash;Madison
          </p>

          <h1
            className="rise mt-7 max-w-[15ch] text-hero font-semibold tracking-[-0.035em]"
            style={{ '--d': '180ms' }}
          >
            Quantitative finance at Wisconsin<span className="text-brand-500">.</span>
          </h1>

          <p
            className="rise mt-8 max-w-2xl text-lg text-body-dark sm:text-xl"
            style={{ '--d': '300ms' }}
          >
            Traders at Wisconsin is a student-led quant finance club studying
            probability, statistics, programming, and market structure &mdash; and
            building the technical foundation quantitative firms hire for.
          </p>

          <div
            className="rise mt-11 flex flex-col gap-4 sm:flex-row sm:items-center"
            style={{ '--d': '400ms' }}
          >
            <Link
              href="/join"
              className="group inline-flex items-center justify-center gap-2.5 bg-brand-600 px-8 py-4
                         font-mono text-xs font-medium uppercase tracking-[0.16em] text-white
                         transition-colors duration-200 hover:bg-brand-500"
            >
              Join Us
              <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
            <a
              href="#work"
              className="inline-flex items-center justify-center gap-2.5 border border-hair-dark px-8 py-4
                         font-mono text-xs font-medium uppercase tracking-[0.16em] text-paper
                         transition-colors duration-200 hover:border-paper/40 hover:bg-white/5"
            >
              What we do
            </a>
          </div>

          {/* Honest caption: this is a simulation, not market data. */}
          <p className="eyebrow mt-16 max-w-md text-mute-dark">
            Fig. 01 &mdash; Independent &plusmn;1 random walks from a common
            origin. Terminal values accumulate into the normal distribution
            they converge to. Simulated; illustrative only.
          </p>
        </div>
      </section>

      {/* ═══ Placements ════════════════════════════════════════ */}
      {placements.length > 0 && (
        <section className="border-b border-hair bg-paper py-14" aria-labelledby="placements-heading">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <h2 id="placements-heading" className="eyebrow mb-9 text-mute">
              Where our members have gone
            </h2>
          </div>
          <LogoMarquee items={placements} label="Companies where members have been placed" />
        </section>
      )}

      {/* ═══ About ═════════════════════════════════════════════ */}
      <section id="about" className="bg-paper py-24 lg:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionLabel index="01">Mission</SectionLabel>

          <div className="mt-12 grid gap-14 lg:grid-cols-12 lg:gap-16">
            <h2 className="text-title font-semibold text-ink lg:col-span-7">
              Making quant accessible to anyone willing to learn.
            </h2>

            <div className="lg:col-span-5 lg:pt-2">
              <p className="text-lg text-body">
                Our mission is to educate students about the world of quant
                finance &mdash; from market structure and financial theory to the
                technical skills top firms look for. We welcome students from all
                backgrounds and majors, and host events that make quant accessible
                to anyone willing to learn.
              </p>
            </div>
          </div>

          <dl className="mt-20 grid gap-px border border-hair bg-hair sm:grid-cols-3">
            {FACTS.map(([term, detail]) => (
              <div key={term} className="bg-paper p-8 lg:p-10">
                <dt className="text-xl font-semibold text-ink">{term}</dt>
                <dd className="mt-3 text-base text-mute">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ═══ What we do ════════════════════════════════════════ */}
      <section
        id="work"
        className="on-ink relative overflow-hidden bg-ink py-24 text-paper lg:py-36"
      >
        <div
          className="dot-matrix pointer-events-none absolute inset-0 text-white/[0.05]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <SectionLabel index="02" tone="dark">What we do</SectionLabel>

          <h2 className="mt-12 max-w-[20ch] text-title font-semibold">
            Three tracks, running all year.
          </h2>

          <div className="mt-20 grid gap-px bg-hair-dark lg:grid-cols-3">
            {WORK.map((item, i) => (
              <article key={item.title} className="bg-ink p-8 lg:p-10">
                <p className="font-mono text-xs font-medium text-brand-400">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-6 text-2xl font-semibold">{item.title}</h3>
                <p className="mt-4 text-base text-body-dark">{item.body}</p>
                <ul className="mt-8 flex flex-wrap gap-x-3 gap-y-2">
                  {item.topics.map((topic) => (
                    <li
                      key={topic}
                      className="border border-hair-dark px-3 py-1.5 font-mono text-2xs uppercase tracking-[0.12em] text-mute-dark"
                    >
                      {topic}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Sponsors ══════════════════════════════════════════ */}
      {sponsors.length > 0 && (
        <section className="bg-paper py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <SectionLabel index="03">Partners</SectionLabel>

            <div className="mt-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <h2 className="max-w-[18ch] text-title font-semibold text-ink">
                Supported by firms who hire quants.
              </h2>
              <Link
                href="/sponsors"
                className="group inline-flex shrink-0 items-center gap-2.5 border-b-2 border-brand-600 pt-3 pb-3
                           font-mono text-xs font-medium uppercase tracking-[0.16em] text-ink
                           transition-colors duration-200 hover:text-brand-600"
              >
                All sponsors
                <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
                  &rarr;
                </span>
              </Link>
            </div>

            <ul className="mt-16 grid grid-cols-2 gap-px border border-hair bg-hair sm:grid-cols-3 lg:grid-cols-6">
              {sponsors.map((sponsor) => (
                <li
                  key={sponsor.name}
                  className="flex h-36 items-center justify-center bg-paper px-6"
                >
                  <LogoImage
                    source={sponsor.logo}
                    measurement={sponsor.measurement}
                    name={sponsor.name}
                    fit={{ refHeight: 38, maxWidth: 150, minHeight: 24, maxHeight: 58 }}
                    className="transition duration-300 hover:scale-[1.06]"
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ═══ Join ══════════════════════════════════════════════ */}
      <section className="on-ink relative overflow-hidden bg-ink text-paper">
        <div className="absolute inset-x-0 top-0 h-px bg-brand-600" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <SectionLabel index="04" tone="dark">Recruiting</SectionLabel>
              <h2 className="mt-10 max-w-[16ch] text-display font-semibold">
                Applications open every semester.
              </h2>
              <p className="mt-7 max-w-xl text-lg text-body-dark">
                No prior experience in finance or programming required. See the
                full recruiting timeline and what each round looks like.
              </p>
            </div>
            <div className="lg:col-span-4 lg:justify-self-end">
              <Link
                href="/join"
                className="group inline-flex items-center gap-3 bg-brand-600 px-9 py-5
                           font-mono text-sm font-medium uppercase tracking-[0.16em] text-white
                           transition-colors duration-200 hover:bg-brand-500"
              >
                Join Us
                <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
                  &rarr;
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
