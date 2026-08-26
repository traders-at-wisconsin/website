import Image from 'next/image'
import { fitLogo, logoSrc } from '../../lib/logo-metrics'

/**
 * One normalised logo. `measurement` comes from measureLogo() and
 * carries the trimmed aspect ratio plus the crop rect to apply.
 */
export default function LogoImage({ source, measurement, name, fit, className = '' }) {
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
      style={{ width, height }}
    />
  )
}
