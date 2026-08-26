import Image from 'next/image'
import { fitLogo, logoSrc } from '../../lib/logo-metrics'

/**
 * One normalised logo. `measurement` comes from measureLogo() and
 * carries the trimmed aspect ratio plus the crop rect to apply.
 */
export default function LogoImage({ source, measurement, name, fit, className = '', fluid = false }) {
  if (!source) {
    return (
      <span className="font-mono text-xs uppercase tracking-[0.14em] text-mute whitespace-nowrap">
        {name}
      </span>
    )
  }

  const { width, height } = fitLogo(measurement?.aspect, fit)

  return (
    <Image
      src={logoSrc(source, measurement, width)}
      alt={name}
      width={width}
      height={height}
      sizes={`${width}px`}
      className={`object-contain ${className}`}
      // `fluid` sizes in em so the whole strip can scale with one
      // font-size on the track, keeping the -50% loop exact.
      style={
        fluid
          ? { width: `${width / 16}em`, height: `${height / 16}em` }
          : { width, height }
      }
    />
  )
}
