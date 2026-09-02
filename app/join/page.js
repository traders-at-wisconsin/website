import Link from 'next/link'
import FAQList from '../components/FAQList'
import SectionLabel from '../components/SectionLabel'

export const metadata = {
  title: 'Recruiting',
  description:
    'How to join Traders at Wisconsin: the recruiting timeline, what each round looks like, and when applications open.',
}

const LINKEDIN = 'https://www.linkedin.com/company/traders-at-wisconsin/'

// Stripped to the bare viewform URL; see the matching note in app/page.js.
// NOTE: currently returns 401 / prompts sign-in for a signed-out
// visitor. Needs "Anyone with the link" access in Google Forms before
// this link works for prospective members.
const INTEREST_FORM =
  'https://docs.google.com/forms/d/131BKCa0_IC_nCEHuBMtElP1nxGZS3Darl7nokxFVJQc/viewform'

const STAGES = [
  {
    title: 'Org Fair',
    body: 'Stop by our table at the university org fair. Meet current members, pick up information, and find out if Traders at Wisconsin is right for you.',
  },
  {
    title: 'Information Session',
    body: "Every semester kicks off with an info session. Come learn what we're about, ask questions, and hear directly from current members.",
  },
  {
    title: 'Applications Open',
    body: 'Applications open shortly after. Fill out a short form and tell us a bit about yourself and your interest in quant.',
  },
  {
    title: 'Interviews',
    body: 'Selected candidates are invited to interview with club leadership.',
  },
  {
    title: 'Decisions',
    body: 'Decisions are released and new members are welcomed into the club.',
  },
]

export default function Join() {
  return (
    <>
      {/* ═══ Header ════════════════════════════════════════════ */}
      <section className="on-ink relative overflow-hidden bg-ink pt-[4.5rem] text-paper">
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <SectionLabel index="01" tone="dark">Recruiting</SectionLabel>

          <div className="mt-11 grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <h1 className="text-display font-semibold">
                Join Traders at Wisconsin<span className="text-brand-500">.</span>
              </h1>
              <p className="mt-8 max-w-xl text-lg text-body-dark sm:text-xl">
                Recruiting opens at the start of each semester. No prior
                experience in finance or programming is required, only that
                you want to learn.
              </p>
            </div>

            {/* Stay Updated → the club's LinkedIn, where cycles are announced. */}
            <div className="lg:col-span-5 lg:pt-4">
              <div className="border border-edge-dark p-8 lg:p-9">
                <h2 className="text-xl font-semibold text-paper">Stay in the loop</h2>
                <p className="mt-4 text-base text-body-dark">
                  Dates, deadlines, and application windows are announced on our
                  LinkedIn page. Follow us there so you know the moment
                  applications open.
                </p>
                <a
                  href={LINKEDIN}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-8 inline-flex items-center gap-2.5 bg-brand-600 px-7 py-4
                             font-mono text-xs font-medium uppercase tracking-[0.16em] text-white
                             transition-colors duration-200 hover:bg-brand-500"
                >
                  Stay Updated
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  >
                    &#8599;
                  </span>
                </a>
                <a
                  href={INTEREST_FORM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-2 inline-flex items-center gap-1.5 py-3 font-mono text-2xs uppercase
                             tracking-[0.16em] text-mute-dark transition-colors duration-200 hover:text-paper"
                >
                  Or fill out our interest form
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  >
                    &#8599;
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Timeline ══════════════════════════════════════════ */}
      <section className="bg-paper py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionLabel index="02">Timeline</SectionLabel>
          <h2 className="mt-11 max-w-[16ch] text-title font-semibold text-ink">
            Five stages, once a semester.
          </h2>

          <ol className="mt-20 grid gap-y-12 lg:grid-cols-5 lg:gap-x-8">
            {STAGES.map((stage, i) => (
              <li key={stage.title} className="relative flex gap-6 lg:block">
                {/* Rail: vertical on small screens, horizontal on large. */}
                <div className="flex shrink-0 flex-col items-center lg:block">
                  <span
                    className="relative z-10 flex h-11 w-11 items-center justify-center border border-brand-600
                               font-mono text-xs font-medium text-brand-600 lg:h-12 lg:w-12 lg:text-sm"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {i < STAGES.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="mt-2 w-px flex-1 bg-hair lg:absolute lg:top-6 lg:left-12 lg:mt-0 lg:h-px lg:w-[calc(100%-3rem)]"
                    />
                  )}
                </div>

                <div className="pb-2 lg:mt-8 lg:pr-4">
                  <h3 className="text-xl font-semibold text-ink">{stage.title}</h3>
                  <p className="mt-3 text-base text-mute lg:text-sm">{stage.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ═══ FAQ ═══════════════════════════════════════════════ */}
      <section className="border-t border-hair bg-paper-2 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionLabel index="03">Questions</SectionLabel>
          <div className="mt-11 grid gap-12 lg:grid-cols-12 lg:gap-16">
            <h2 className="text-title font-semibold text-ink lg:col-span-4 lg:sticky lg:top-32 lg:self-start">
              Frequently asked.
            </h2>
            <div className="lg:col-span-8">
              <FAQList />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Closing ═══════════════════════════════════════════ */}
      <section className="on-ink relative bg-ink text-paper">
        <div className="absolute inset-x-0 top-0 h-px bg-brand-600" aria-hidden="true" />
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-20 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-32">
          <div>
            <h2 className="max-w-[20ch] text-title font-semibold">
              Still have a question about recruiting?
            </h2>
            <p className="mt-4 max-w-lg text-lg text-body-dark">
              Reach out and a member of the team will get back to you.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:tradersatwisconsin@gmail.com"
              className="inline-flex items-center gap-2.5 border border-edge-dark px-7 py-4
                         font-mono text-xs font-medium uppercase tracking-[0.16em] text-paper
                         transition-colors duration-200 hover:border-paper/40 hover:bg-white/5"
            >
              Email us
            </a>
            <Link
              href="/sponsors"
              className="inline-flex items-center gap-2.5 border border-edge-dark px-7 py-4
                         font-mono text-xs font-medium uppercase tracking-[0.16em] text-paper
                         transition-colors duration-200 hover:border-paper/40 hover:bg-white/5"
            >
              Our sponsors
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
