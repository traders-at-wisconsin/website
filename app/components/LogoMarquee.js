import { fitLogo } from '../../lib/logo-metrics'
import LogoImage from './LogoImage'

const CELL = { refHeight: 34, maxWidth: 178, minHeight: 20, maxHeight: 52 }
const GAP = 64 // px between logos
const SPEED = 46 // px per second — resolution independent

/**
 * The rotating company wall. One row, duplicated once and translated
 * by exactly -50%, so the loop is seamless with no reset jump. Duration
 * is derived from the measured strip width, which keeps the speed
 * constant no matter how many logos the CMS holds.
 */
export default function LogoMarquee({ items, label }) {
  if (!items?.length) return null

  const stripWidth = items.reduce((total, item) => {
    const { width } = fitLogo(item.measurement?.aspect, CELL)
    return total + width + GAP
  }, 0)

  const duration = Math.max(stripWidth / SPEED, 24)

  const row = (ariaHidden) => (
    <ul
      className="flex shrink-0 items-center"
      style={{ gap: `${GAP}px`, paddingRight: `${GAP}px` }}
      aria-hidden={ariaHidden || undefined}
    >
      {items.map((item, i) => (
        <li key={`${item.company}-${i}`} className="flex h-14 shrink-0 items-center justify-center">
          <LogoImage
            source={item.photo}
            measurement={item.measurement}
            name={item.company}
            fit={CELL}
            className="transition duration-300 hover:scale-[1.06]"
          />
        </li>
      ))}
    </ul>
  )

  return (
    <div
      className="group relative overflow-hidden"
      style={{
        // Feather the ends so logos enter and leave rather than clipping.
        maskImage:
          'linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)',
      }}
    >
      <div
        className="marquee-track flex w-max"
        style={{ animation: `marquee ${duration}s linear infinite` }}
        role="list"
        aria-label={label}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
