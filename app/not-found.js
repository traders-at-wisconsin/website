import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="bg-white min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-[10px] tracking-widest uppercase text-zinc-400 mb-6">
          404
        </p>
        <h1 className="text-4xl font-semibold text-zinc-800 mb-4">
          Page not found
        </h1>
        <p className="text-sm text-zinc-400 font-light mb-10 max-w-sm mx-auto leading-relaxed">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3.5 bg-[#9B0000] text-white text-xs font-normal tracking-widest uppercase hover:bg-[#7d0000] transition-colors duration-200"
        >
          Back to Home
        </Link>
      </div>
    </section>
  )
}
