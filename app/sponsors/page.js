import Image from 'next/image'
import { client, urlFor } from '../../lib/sanity'

export const revalidate = 60

async function getSponsors() {
  return client.fetch(
    `*[_type == "sponsor"] | order(_createdAt asc) { name, logo, website, tier, description }`
  )
}

function LogoCard({ sponsor }) {
  const card = (
    <div className="group bg-white border border-zinc-100 hover:border-zinc-300 transition-colors duration-200 p-14 flex items-center justify-center aspect-video">
      {sponsor.logo ? (
        <Image
          src={urlFor(sponsor.logo).width(400).url()}
          alt={sponsor.name}
          width={240}
          height={100}
          className="object-contain max-h-20 w-auto"
        />
      ) : (
        <span className="text-sm font-medium text-zinc-400">{sponsor.name}</span>
      )}
    </div>
  )

  if (sponsor.website) {
    return (
      <a href={sponsor.website} target="_blank" rel="noopener noreferrer" aria-label={sponsor.name}>
        {card}
      </a>
    )
  }

  return card
}

const tierStyles = {
  Platinum: {
    label: 'text-2xl font-bold text-zinc-400',
    bar: 'bg-zinc-200',
    badge: 'bg-zinc-100 text-zinc-500 border border-zinc-200',
  },
  Gold: {
    label: 'text-2xl font-bold text-zinc-800',
    bar: 'bg-zinc-200',
    badge: 'bg-zinc-100 text-zinc-600 border border-zinc-200',
  },
}

function TierSection({ title, sponsors, columns }) {
  if (!sponsors.length) return null

  const style = tierStyles[title] || tierStyles.Gold

  return (
    <div className="mb-20">
      <div className="flex items-center gap-5 mb-8">
        <span className={style.label}>{title}</span>
        <div className={`flex-1 h-px ${style.bar}`} />
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${style.badge}`}>
          {sponsors.length} {sponsors.length === 1 ? 'Sponsor' : 'Sponsors'}
        </span>
      </div>
      <div className={`grid gap-4 ${columns}`}>
        {sponsors.map((sponsor) => (
          <LogoCard key={sponsor.name} sponsor={sponsor} />
        ))}
      </div>
    </div>
  )
}

export default async function Sponsors() {
  const sponsors = await getSponsors()

  const platinum = sponsors.filter((s) => s.tier === 'Platinum')
  const gold = sponsors.filter((s) => s.tier === 'Gold')
  const hasSponsors = sponsors.length > 0

  return (
    <>
      {/* ── Header ───────────────────────────────────────────── */}
      <section className="bg-white py-12 px-6 border-b border-zinc-100">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-lg font-semibold text-zinc-800">
            Sponsors
          </h1>
          <p className="text-sm text-zinc-400 font-light max-w-lg">
            Our sponsors make it possible for us to run events, bring recruiters to campus, and provide opportunities for our members.
          </p>
        </div>
      </section>

      {/* ── Sponsor Grid ─────────────────────────────────────── */}
      <section className="bg-zinc-50 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          {hasSponsors ? (
            <>
              <TierSection
                title="Platinum"
                sponsors={platinum}
                columns="grid-cols-1 md:grid-cols-2"
              />
              <TierSection
                title="Gold"
                sponsors={gold}
                columns="grid-cols-2 md:grid-cols-3"
              />
            </>
          ) : (
            <p className="text-sm text-zinc-400 font-light">
              Sponsor information coming soon.
            </p>
          )}
        </div>
      </section>

      {/* ── Partner With Us ──────────────────────────────────── */}
      <section className="bg-white py-24 px-6 border-t border-zinc-100">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2 className="text-lg font-semibold text-zinc-800 mb-4">
              Partner With Us
            </h2>
            <p className="text-sm text-zinc-500 font-light leading-relaxed max-w-lg">
              Interested in supporting Traders at Wisconsin? We'd love to hear from you.
              Reach out to learn more about sponsorship opportunities.
            </p>
          </div>
          <a
            href="mailto:tradersatwisconsin@gmail.com"
            className="flex-shrink-0 inline-block px-8 py-3.5 bg-[#9B0000] text-white text-xs font-normal tracking-widest uppercase hover:bg-[#7d0000] transition-colors duration-200"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </>
  )
}
