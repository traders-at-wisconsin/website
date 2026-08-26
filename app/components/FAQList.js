const faqs = [
  {
    q: 'Do I need prior experience in finance or programming?',
    a: "Not at all. If you're curious about quant finance, that's enough. We welcome students from any background.",
  },
  {
    q: 'How much of a time commitment is membership?',
    a: 'At minimum, one meeting per week, typically between an hour and an hour and a half. Beyond that, it depends on what projects you choose to take on.',
  },
  {
    q: 'When do applications open?',
    a: 'Applications open within the first few weeks of each semester, following the information session.',
  },
  {
    q: 'Where are recruiting dates and deadlines posted?',
    a: 'On our LinkedIn page. That is where we post information sessions, application windows, and deadlines for each cycle.',
  },
  {
    q: "What if I don't get in this cycle?",
    a: "You're welcome to reapply as many times as you'd like. There's no limit, and we encourage it.",
  },
]

/**
 * Native <details> so the accordion is keyboard accessible and works
 * with JavaScript disabled — no client component needed.
 */
export default function FAQList() {
  return (
    <div className="border-t border-hair">
      {faqs.map((faq) => (
        <details key={faq.q} className="group border-b border-hair">
          <summary
            className="flex cursor-pointer list-none items-start justify-between gap-8 py-7
                       text-lg font-medium text-ink transition-colors hover:text-brand-600
                       [&::-webkit-details-marker]:hidden"
          >
            {faq.q}
            <span
              aria-hidden="true"
              className="relative mt-2.5 block h-3 w-3 shrink-0 text-brand-600"
            >
              <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current" />
              <span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-current transition-transform duration-200 group-open:rotate-90 group-open:opacity-0" />
            </span>
          </summary>
          <p className="max-w-2xl pb-8 text-base text-mute">{faq.a}</p>
        </details>
      ))}
    </div>
  )
}
