import Link from 'next/link'

export const metadata = { title: 'Page not found' }

export default function NotFound() {
  return (
    <section className="on-ink relative flex min-h-[100svh] items-center overflow-hidden bg-ink pt-[4.5rem] text-paper">
      <div
        className="dot-matrix pointer-events-none absolute inset-0 text-white/[0.05]"
        aria-hidden="true"
      />
      <div className="relative mx-auto w-full max-w-7xl px-6 py-24 lg:px-10">
        <p className="eyebrow text-brand-400">Error 404</p>
        <h1 className="mt-8 max-w-[16ch] text-display font-semibold">
          This page doesn&rsquo;t exist<span className="text-brand-500">.</span>
        </h1>
        <p className="mt-7 max-w-lg text-lg text-body-dark">
          The page you&rsquo;re looking for may have been moved or renamed.
        </p>
        <div className="mt-11 flex flex-wrap gap-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 bg-brand-600 px-8 py-4
                       font-mono text-xs font-medium uppercase tracking-[0.16em] text-white
                       transition-colors duration-200 hover:bg-brand-500"
          >
            Back to home
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
          <Link
            href="/join"
            className="inline-flex items-center gap-2.5 border border-hair-dark px-8 py-4
                       font-mono text-xs font-medium uppercase tracking-[0.16em] text-paper
                       transition-colors duration-200 hover:border-paper/40 hover:bg-white/5"
          >
            Recruiting
          </Link>
        </div>
      </div>
    </section>
  )
}
