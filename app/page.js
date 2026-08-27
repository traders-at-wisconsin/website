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
      'Sessions on quant theory, statistics, programming, and market structure. Built around hands-on work rather than lectures, so members apply what they learn as they learn it.',
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

/* Mirrors the Category options on the placement schema. */
const PLACEMENT_GROUPS = [
  { key: 'Quant', label: 'Quant' },
  { key: 'Tech', label: 'Tech' },
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
        {/* The graphic runs on large screens only. On a phone it would
            cost battery for something a thumb scrolls straight past. */}
        <HeroField className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" />

        {/* Keeps the headline legible over the graphic. The canvas also
            punches an ellipse out of itself behind the type, so this is
            only a light wash rather than a veil. */}
        <div
          className="absolute inset-0 -z-0 hidden lg:block"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(94deg, #0a0a0b 0%, rgba(10,10,11,0.86) 22%, rgba(10,10,11,0.3) 40%, rgba(10,10,11,0) 58%)',
          }}
        />

        <div className="relative z-10 mx-auto mt-auto w-full max-w-7xl px-6 pt-16 pb-20 sm:pt-20 lg:px-10 lg:pt-24 lg:pb-28">
          <p className="eyebrow rise text-brand-400" style={{ '--d': '80ms' }}>
            University of Wisconsin-Madison
          </p>

          <h1
            className="rise mt-7 text-hero font-semibold tracking-[-0.035em] sm:max-w-[15ch]"
            style={{ '--d': '180ms' }}
          >
            Quantitative finance at Wisconsin<span className="text-brand-500">.</span>
          </h1>

          <p
            className="rise mt-8 max-w-2xl text-lg text-body-dark sm:text-xl"
            style={{ '--d': '300ms' }}
          >
            Traders at Wisconsin is a student-led quant finance club studying
            probability, statistics, programming, and market structure, and
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
              className="inline-flex items-center justify-center gap-2.5 border border-edge-dark px-8 py-4
                         font-mono text-xs font-medium uppercase tracking-[0.16em] text-paper
                         transition-colors duration-200 hover:border-paper/40 hover:bg-white/5"
            >
              What we do
            </a>
          </div>
        </div>
      </section>

      {/* ═══ Placements ════════════════════════════════════════
          Split on the CMS category field rather than shown as one
          list. A quant firm and a consumer tech firm are different
          claims and should not sit shoulder to shoulder.         */}
      {placements.length > 0 && (
        <section className="border-b border-hair bg-white py-14" aria-labelledby="placements-heading">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <h2 id="placements-heading" className="eyebrow text-mute">
              Where our members have gone
            </h2>
          </div>

          <div className="mt-10 flex flex-col gap-12">
            {PLACEMENT_GROUPS.map(({ key, label }, i) => {
              const items = placements.filter((p) => p.category === key)
              if (!items.length) return null
              return (
                <div key={key}>
                  <div className="mx-auto mb-5 max-w-7xl px-6 lg:px-10">
                    <h3 className="eyebrow text-brand-600">{label}</h3>
                  </div>
                  <LogoMarquee
                    items={items}
                    reverse={i % 2 === 1}
                    // The quant row is the primary claim, so it sits
                    // slightly larger than the one below it.
                    scale={i === 0 ? 1 : 0.86}
                    label={`${label} firms where members have been placed`}
                  />
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ═══ About ═════════════════════════════════════════════ */}
      <section id="about" className="bg-paper py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionLabel index="01">Mission</SectionLabel>

          <div className="mt-11 grid gap-14 lg:grid-cols-12 lg:gap-16">
            <h2 className="text-title font-semibold text-ink lg:col-span-7">
              Making quant accessible to anyone willing to learn.
            </h2>

            <div className="lg:col-span-5 lg:pt-2">
              <p className="text-lg text-body">
                Our mission is to educate students about the world of quant
                finance, from market structure and financial theory to the
                technical skills top firms look for. We welcome students from all
                backgrounds and majors, and host events that make quant accessible
                to anyone willing to learn.
              </p>
            </div>
          </div>

          <dl className="mt-16 grid gap-px border border-hair bg-hair sm:grid-cols-3">
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
        className="on-ink relative overflow-hidden bg-ink py-24 text-paper lg:py-32"
      >
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <SectionLabel index="02" tone="dark">What we do</SectionLabel>

          <h2 className="mt-11 max-w-[20ch] text-title font-semibold">
            Three areas, running all year.
          </h2>

          <div className="mt-16 grid gap-px bg-hair-dark lg:grid-cols-3">
            {WORK.map((item, i) => (
              <article key={item.title} className="flex flex-col bg-ink p-8 lg:p-10">
                <p className="font-mono text-xs font-medium text-brand-400">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-6 text-2xl font-semibold">{item.title}</h3>
                <p className="mt-4 text-base text-body-dark">{item.body}</p>
                <ul className="mt-8 flex flex-wrap gap-x-3 gap-y-2 pt-0 lg:mt-auto lg:pt-8">
                  {item.topics.map((topic) => (
                    <li
                      key={topic}
                      className="group/chip relative isolate overflow-hidden border border-hair-dark
                                 px-3 py-1.5 font-mono text-2xs uppercase tracking-[0.12em]
                                 text-mute-dark transition-colors duration-300
                                 hover:border-brand-600 hover:text-white"
                    >
                      {/* Wipes in from the left, the same gesture the
                          sponsor tiles use. White on brand-600 is 8:1,
                          so the label stays readable once it fills. */}
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 origin-left scale-x-0 bg-brand-600
                                   transition-transform duration-[350ms] ease-out-quint
                                   group-hover/chip:scale-x-100"
                      />
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

            <div className="mt-11 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
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
                  className="flex h-36 items-center justify-center bg-white px-6"
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
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <SectionLabel index="04" tone="dark">Recruiting</SectionLabel>
              <h2 className="mt-11 max-w-[16ch] text-title font-semibold">
                Applications open every semester.
              </h2>
              <p className="mt-6 max-w-xl text-lg text-body-dark">
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
