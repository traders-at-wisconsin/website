import Image from 'next/image'
import { client, urlFor } from '../../lib/sanity'

async function getPlacements() {
  return client.fetch(
    `*[_type == "placement"] | order(orderRank asc) { company, photo }`
  )
}

export default async function PlacementBanner() {
  const placements = await getPlacements()

  if (!placements.length) return null

  const times = Math.ceil(12 / placements.length)
  const repeated = Array.from({ length: times }, () => placements).flat()
  const items = [...repeated, ...repeated]

  return (
    <section className="bg-white py-6 relative">
      <div className="overflow-hidden">
        <div
          className="flex gap-20 w-max"
          style={{ animation: `marquee ${repeated.length * 2.5}s linear infinite` }}
        >
          {items.map((p, i) => (
            <div key={i} className="flex items-center justify-center flex-shrink-0">
              {p.photo ? (
                <Image
                  src={urlFor(p.photo).width(280).url()}
                  alt={p.company}
                  width={140}
                  height={48}
                  className="object-contain w-auto max-h-10"
                />
              ) : (
                <span className="text-xs font-medium text-zinc-400 whitespace-nowrap">{p.company}</span>
              )}
            </div>
          ))}
        </div>
      </div>
      <p className="text-center text-[9px] tracking-widest uppercase text-zinc-300 mt-3">
        Our Placements
      </p>
    </section>
  )
}
