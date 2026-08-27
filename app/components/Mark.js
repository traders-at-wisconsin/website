/**
 * The WT monogram, traced from the original logo artwork into four
 * straight-edged paths. Inherits `currentColor`, so it works on any
 * surface, no more 1.2 MB red-tile PNG scaled down to 32 px.
 */
export default function Mark({ className = '', title }) {
  return (
    <svg
      viewBox="0 0 618 374"
      fill="currentColor"
      className={className}
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : 'true'}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      <path d="M0 0 51 1 196 374 144 373Z M152 0 201 0 203 2 346 374 294 373Z M264 0 433 0 433 3 415 46 281 46Z M453 0 618 0 618 4 601 46 481 47 384 290 359 227Z" />
    </svg>
  )
}
