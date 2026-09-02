/** Numbered mono section marker with a red rule, used site-wide. */
export default function SectionLabel({ index, children, tone = 'light' }) {
  const dark = tone === 'dark'
  return (
    <div className="flex items-center gap-4">
      <span
        className={`h-px w-8 shrink-0 ${dark ? 'bg-brand-500' : 'bg-brand-600'}`}
        aria-hidden="true"
      />
      <span className={`eyebrow ${dark ? 'text-mute-dark' : 'text-mute'}`}>
        <span className={dark ? 'text-brand-400' : 'text-brand-600'}>{index}</span>
        <span aria-hidden="true" className="mx-2 opacity-40">/</span>
        {children}
      </span>
    </div>
  )
}
