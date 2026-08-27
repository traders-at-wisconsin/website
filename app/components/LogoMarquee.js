import { fitLogo } from '../../lib/logo-metrics'
import LogoImage from './LogoImage'

const BASE_CELL = { refHeight: 34, maxWidth: 178, minHeight: 20, maxHeight: 52 }
const GAP = 64 // px between logos, at the 16px base font size
const SPEED = 46 // px per second, resolution independent

/**
 * The rotating company wall. One row, duplicated once and translated
 * by exactly -50%, so the loop is seamless with no reset jump. Duration
 * is derived from the measured strip width, which keeps the speed
 * constant no matter how many logos the CMS holds.
 */
export default function LogoMarquee({ items, label, reverse = false, scale = 1 }) {
  if (!items?.length) return null

  // `scale` lets a secondary row sit visually below a primary one.
  const CELL = {
    refHeight: BASE_CELL.refHeight * scale,
    maxWidth: BASE_CELL.maxWidth * scale,
    minHeight: BASE_CELL.minHeight * scale,
    maxHeight: BASE_CELL.maxHeight * scale,
  }

  const stripWidth = items.reduce((total, item) => {
    const { width } = fitLogo(item.measurement?.aspect, CELL)
    return total + width + GAP
  }, 0)

  const duration = Math.max(stripWidth / SPEED, 24)

  const row = (ariaHidden) => (
    <ul
      className="flex shrink-0 items-center"
      style={{ gap: `${GAP / 16}em`, paddingRight: `${GAP / 16}em` }}
      aria-hidden={ariaHidden || undefined}
    >
      {items.map((item, i) => (
        <li key={`${item.company}-${i}`} className="flex h-[3.5em] shrink-0 items-center justify-center">
          <LogoImage
            source={item.photo}
            measurement={item.measurement}
            name={item.company}
            fit={CELL}
            fluid
            eager
            className="transition-transform duration-300 hover:scale-[1.08]"
          />
        </li>
      ))}
    </ul>
  )

  return (
    <div
      className="marquee-strip relative overflow-hidden"
      style={{
        // Feather the ends so logos enter and leave rather than clipping.
        maskImage:
          'linear-gradient(to right, transparent, #000 15%, #000 85%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent, #000 15%, #000 85%, transparent)',
      }}
    >
      <div
        className="marquee-track flex w-max"
        style={{
          animation: `${reverse ? 'marquee-reverse' : 'marquee'} ${duration}s linear infinite`,
          // Scales the entire strip on narrow screens.
          fontSize: 'clamp(0.8rem, 2.6vw, 1rem)',
        }}
        role="list"
        aria-label={label}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
