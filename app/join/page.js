import FAQList from '../components/FAQList'

const steps = [
  {
    title: 'Org Fair',
    description:
      'Stop by our table at the university org fair. Meet current members, pick up information, and find out if Traders at Wisconsin is right for you.',
  },
  {
    title: 'Information Session',
    description:
      'Every semester kicks off with an info session. Come learn what we\'re about, ask questions, and hear directly from current members.',
  },
  {
    title: 'Applications Open',
    description:
      'Applications open shortly after. Fill out a short form and tell us a bit about yourself and your interest in quant.',
  },
  {
    title: 'Take-Home Deliverable',
    description:
      'Applicants invited to move forward will receive a take-home deliverable, a hands-on project that gives you a real taste of the work we do.',
  },
  {
    title: 'Interviews',
    description:
      'A select group of candidates are invited to interview with club leadership.',
  },
  {
    title: 'Decisions',
    description:
      'Decisions are released and new members are welcomed into the club.',
  },
]

export default function Join() {
  return (
    <>
      {/* ── Interest Form Banner ─────────────────────────────── */}
      <section className="bg-white py-16 px-6 border-b border-zinc-100">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h1 className="text-lg font-semibold text-zinc-800 mb-4">
              Stay in the Loop
            </h1>
            <p className="text-sm text-zinc-500 font-light leading-relaxed max-w-lg">
              Recruiting opens at the start of each semester. Sign up to stay updated on dates,
              deadlines, and everything you need to know when applications open.
            </p>
          </div>
          <a
            href="#"
            className="flex-shrink-0 inline-block px-8 py-3.5 bg-[#9B0000] text-white text-xs font-normal tracking-widest uppercase hover:bg-[#7d0000] transition-colors duration-200"
          >
            Stay Updated
          </a>
        </div>
      </section>

      {/* ── Timeline ─────────────────────────────────────────── */}
      <section className="bg-zinc-50 py-24 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Heading */}
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-semibold text-zinc-900 leading-tight">
              Recruiting Timeline
            </h2>
            <div className="w-12 h-0.5 bg-[#9B0000] mt-8" />
          </div>

          {/* Steps */}
          <div className="relative">
            <div className="absolute left-[15px] top-3 bottom-3 w-px bg-zinc-200" />

            <div className="space-y-14">
              {steps.map((step, i) => (
                <div key={step.title} className="flex gap-8 items-start">
                  <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-[#9B0000] flex items-center justify-center">
                    <span className="text-white text-[10px] font-medium">{i}</span>
                  </div>
                  <div className="pt-1">
                    <h3 className="text-base font-semibold text-zinc-800 mb-2">{step.title}</h3>
                    <p className="text-sm text-zinc-400 font-light leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="bg-white py-24 px-6 border-t border-zinc-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold text-zinc-800 mb-12">
            FAQ
          </h2>
          <FAQList />
        </div>
      </section>
    </>
  )
}
