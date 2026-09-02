import Mark from './Mark'

/** Mark + lockup used in the header and footer. */
export default function Wordmark({ compact = false }) {
  return (
    <span className="flex items-center gap-3">
      <Mark className="h-5 w-auto shrink-0" title="Traders at Wisconsin" />
      <span
        className={`font-mono text-2xs tracking-[0.2em] uppercase font-medium leading-none ${
          compact ? 'hidden sm:inline' : ''
        }`}
      >
        Traders<span className="opacity-45"> / </span>Wisconsin
      </span>
    </span>
  )
}
