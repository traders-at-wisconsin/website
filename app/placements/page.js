import Image from 'next/image'
import { client, urlFor } from '../../lib/sanity'

export const revalidate = 60

async function getPlacements() {
  return client.fetch(
    `*[_type == "placement"] | order(_createdAt asc) { company, category, photo }`
  )
}

function PlacementCard({ placement }) {
  return (
    <div className="bg-white border border-zinc-100 p-10 flex items-center justify-center aspect-video">
      {placement.photo ? (
        <Image
          src={urlFor(placement.photo).width(400).url()}
          alt={placement.company}
          width={200}
          height={80}
          className="object-contain max-h-16 w-auto"
        />
      ) : (
        <span className="text-sm font-medium text-zinc-400">{placement.company}</span>
      )}
    </div>
  )
}

function CategorySection({ title, placements }) {
  if (!placements.length) return null

  const cols = Math.min(placements.length, 3)

  return (
    <div className="mb-20">
      <div className="flex items-center gap-5 mb-8">
        <span className="text-2xl font-bold text-zinc-800">{title}</span>
        <div className="flex-1 h-px bg-zinc-200" />
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200">
          {placements.length} {placements.length === 1 ? 'Placement' : 'Placements'}
        </span>
      </div>
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          maxWidth: placements.length === 1 ? '340px' : undefined,
        }}
      >
        {placements.map((p) => (
          <PlacementCard key={`${p.company}-${Math.random()}`} placement={p} />
        ))}
      </div>
    </div>
  )
}

export default async function Placements() {
  const placements = await getPlacements()

  const quant = placements.filter((p) => p.category === 'Quant')
  const tech = placements.filter((p) => p.category === 'Tech')
  const hasAny = placements.length > 0

  return (
    <>
      {/* ── Header ───────────────────────────────────────────── */}
      <section className="bg-white py-12 px-6 border-b border-zinc-100">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-lg font-semibold text-zinc-800">
            Placements
          </h1>
          <p className="text-sm text-zinc-400 font-light max-w-lg">
            Members of Traders at Wisconsin have gone on to internships and full-time roles at some of the most competitive firms in quant finance and tech.
          </p>
        </div>
      </section>

      {/* ── Placements Grid ──────────────────────────────────── */}
      <section className="bg-zinc-50 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          {hasAny ? (
            <>
              <CategorySection title="Quant" placements={quant} />
              <CategorySection title="Tech" placements={tech} />
            </>
          ) : (
            <p className="text-sm text-zinc-400 font-light">
              Placement information coming soon.
            </p>
          )}
        </div>
      </section>
    </>
  )
}
