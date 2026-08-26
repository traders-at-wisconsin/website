export const revalidate = 60

import Link from 'next/link'
import { safeFetch } from '../../lib/sanity'
import { measureAll } from '../../lib/logo-metrics'
import LogoImage from '../components/LogoImage'
import SectionLabel from '../components/SectionLabel'

export const metadata = {
  title: 'Sponsors',
  description:
    'The firms that support Traders at Wisconsin, and what partnership with a student-led quantitative finance club at UW–Madison involves.',
}

const EMAIL = 'tradersatwisconsin@gmail.com'

/* What sponsorship funds, drawn from what the club actually runs. */
const SUPPORT = [
  {
    title: 'Events on campus',
    body: 'Education sessions on quant theory, statistics, programming, and market structure, plus skill-based competitions and team projects across the year.',
  },
  {
    title: 'Recruiters in the room',
    body: 'Recruiter panels and information sessions that put your team in front of students already working on the technical fundamentals you hire for.',
  },
  {
    title: 'Opportunities for members',
    body: 'Resume and technical workshops, mock interviews, and recruiting guidance that help members arrive at your process prepared.',
  },
]

const TIER_ORDER = ['Platinum', 'Gold']

/* Mirrors the Category options on the placement schema. */
const PLACEMENT_GROUPS = [
  { key: 'Quant', label: 'Quant' },
  { key: 'Tech', label: 'Tech' },
]

function SponsorCard({ sponsor, prominent }) {
  const inner = (
    <>
      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <LogoImage
          source={sponsor.logo}
          measurement={sponsor.measurement}
          name={sponsor.name}
          fit={
            prominent
              ? { refHeight: 66, maxWidth: 330, minHeight: 42, maxHeight: 104 }
              : { refHeight: 52, maxWidth: 262, minHeight: 32, maxHeight: 86 }
          }
          className="transition-transform duration-300 group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-hair px-5 py-3.5">
        <span className="eyebrow truncate text-mute">{sponsor.name}</span>
        {sponsor.website && (
          <span
            aria-hidden="true"
            className="shrink-0 text-2xs text-hair-dark/60 transition-all duration-200 group-hover:text-brand-600
                       group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          >
            &#8599;
          </span>
        )}
      </div>
    </>
  )

  const shell = `group flex ${prominent ? 'min-h-56' : 'min-h-48'} flex-col bg-paper
                 transition-colors duration-200 hover:bg-white`

  return (
    <li className="contents">
      {sponsor.website ? (
        <a
          href={sponsor.website}
          target="_blank"
          rel="noopener noreferrer"
          className={shell}
          aria-label={`${sponsor.name} — opens in a new tab`}
        >
          {inner}
        </a>
      ) : (
        <div className={shell}>{inner}</div>
      )}
    </li>
  )
}

export default async function Sponsors() {
  const [rawSponsors, rawPlacements] = await Promise.all([
    safeFetch(`*[_type == "sponsor"] | order(_createdAt asc) { name, logo, website, tier, description }`),
    safeFetch(`*[_type == "placement"] | order(orderRank asc) { company, category, photo }`),
  ])

  const [sponsors, placements] = await Promise.all([
    measureAll(rawSponsors, (s) => s.logo),
    measureAll(rawPlacements, (p) => p.photo),
  ])

  // Only label tiers when more than one is actually populated — a lone
  // "Gold" heading over every sponsor reads as an accident.
  const groups = TIER_ORDER.map((tier) => ({
    tier,
    items: sponsors.filter((s) => s.tier === tier),
  })).filter((g) => g.items.length)
  const untiered = sponsors.filter((s) => !TIER_ORDER.includes(s.tier))
  if (untiered.length) groups.push({ tier: null, items: untiered })
  const labelTiers = groups.filter((g) => g.tier).length > 1

  return (
    <>
      {/* ═══ Header ════════════════════════════════════════════ */}
      <section className="on-ink relative overflow-hidden bg-ink pt-[4.5rem] text-paper">
        <div
          className="dot-matrix pointer-events-none absolute inset-0 text-white/[0.05]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <SectionLabel index="01" tone="dark">Partners</SectionLabel>

          <div className="mt-11 grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <h1 className="text-display font-semibold">
                Industry partnership<span className="text-brand-500">.</span>
              </h1>
            </div>
            <div className="lg:col-span-5 lg:pt-4">
              <p className="text-lg text-body-dark sm:text-xl">
                Our sponsors make it possible for us to run events, bring
                recruiters to campus, and provide opportunities for our members.
              </p>
              <a
                href={`mailto:${EMAIL}`}
                className="group mt-8 inline-flex items-center gap-2.5 border-b-2 border-brand-500 pt-3 pb-3
                           font-mono text-xs font-medium uppercase tracking-[0.16em] text-paper
                           transition-colors duration-200 hover:text-brand-400"
              >
                Partner with us
                <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
                  &rarr;
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Sponsor wall ══════════════════════════════════════ */}
      <section className="bg-paper py-24 lg:py-32" aria-labelledby="wall-heading">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionLabel index="02">Our sponsors</SectionLabel>
          <h2 id="wall-heading" className="mt-11 max-w-[18ch] text-title font-semibold text-ink">
            The firms behind our programming.
          </h2>

          {sponsors.length ? (
            groups.map((group) => (
              <div key={group.tier || 'all'} className="mt-16">
                {labelTiers && group.tier && (
                  <div className="mb-8 flex items-center gap-5">
                    <h3 className="eyebrow text-mute">{group.tier}</h3>
                    <span className="h-px flex-1 bg-hair" aria-hidden="true" />
                  </div>
                )}
                <ul
                  className={`grid gap-px border border-hair bg-hair ${
                    group.tier === 'Platinum'
                      ? 'sm:grid-cols-2'
                      : 'sm:grid-cols-2 lg:grid-cols-3'
                  }`}
                >
                  {group.items.map((sponsor) => (
                    <SponsorCard
                      key={sponsor.name}
                      sponsor={sponsor}
                      prominent={group.tier === 'Platinum'}
                    />
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p className="mt-12 text-lg text-mute">Sponsor information coming soon.</p>
          )}
        </div>
      </section>

      {/* ═══ What sponsorship supports ═════════════════════════ */}
      <section className="on-ink relative overflow-hidden bg-ink py-24 text-paper lg:py-32">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <SectionLabel index="03" tone="dark">What it supports</SectionLabel>
          <h2 className="mt-11 max-w-[20ch] text-title font-semibold">
            Where sponsorship goes.
          </h2>

          <div className="mt-16 grid gap-px bg-hair-dark lg:grid-cols-3">
            {SUPPORT.map((item, i) => (
              <article key={item.title} className="bg-ink p-8 lg:p-10">
                <p className="font-mono text-xs font-medium text-brand-400">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-6 text-2xl font-semibold">{item.title}</h3>
                <p className="mt-4 text-base text-body-dark">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Outcomes ══════════════════════════════════════════
          A static, grouped grid rather than a second marquee: a
          recruiter reading this should be able to see the whole list
          at once instead of waiting out a scroll loop.            */}
      {placements.length > 0 && (
        <section className="bg-paper py-24 lg:py-32" aria-labelledby="sponsor-placements">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <SectionLabel index="04">Outcomes</SectionLabel>
            <h2 id="sponsor-placements" className="mt-11 max-w-[22ch] text-title font-semibold text-ink">
              Where our members have gone.
            </h2>

            {PLACEMENT_GROUPS.map(({ key, label }) => {
              const items = placements.filter((p) => p.category === key)
              if (!items.length) return null
              return (
                <div key={key} className="mt-14">
                  <div className="mb-6 flex items-center gap-5">
                    <h3 className="eyebrow text-brand-600">{label}</h3>
                    <span className="h-px flex-1 bg-hair" aria-hidden="true" />
                    <span className="eyebrow tabular text-mute">{items.length}</span>
                  </div>
                  <ul className="grid grid-cols-2 gap-px border border-hair bg-hair sm:grid-cols-3 lg:grid-cols-4">
                    {items.map((item) => (
                      <li
                        key={item.company}
                        className="flex h-32 items-center justify-center bg-paper px-6"
                      >
                        <LogoImage
                          source={item.photo}
                          measurement={item.measurement}
                          name={item.company}
                          fit={{ refHeight: 34, maxWidth: 148, minHeight: 22, maxHeight: 54 }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ═══ CTA ═══════════════════════════════════════════════ */}
      <section className="bg-paper-2 py-24 lg:py-28">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div>
            <h2 className="max-w-[20ch] text-title font-semibold text-ink">
              Interested in supporting the club?
            </h2>
            <p className="mt-5 max-w-xl text-lg text-mute">
              We&rsquo;d love to hear from you. Reach out to learn more about
              sponsorship opportunities.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-4">
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-2.5 bg-brand-600 px-8 py-4
                         font-mono text-xs font-medium uppercase tracking-[0.16em] text-white
                         transition-colors duration-200 hover:bg-brand-500"
            >
              Get in touch
            </a>
            <Link
              href="/join"
              className="inline-flex items-center gap-2.5 border border-ink/20 px-8 py-4
                         font-mono text-xs font-medium uppercase tracking-[0.16em] text-ink
                         transition-colors duration-200 hover:border-ink/50 hover:bg-white"
            >
              Join the club
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
