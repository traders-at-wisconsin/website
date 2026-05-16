'use client'

import { useState } from 'react'

const faqs = [
  {
    q: 'Do I need prior experience in finance or programming?',
    a: 'Not at all. If you\'re curious about quant finance, that\'s enough. We welcome students from any background.',
  },
  {
    q: 'What does the take-home deliverable look like?',
    a: 'It varies by cycle, but expect something hands-on. Past deliverables have involved working with real market data.',
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
    q: 'What if I don\'t get in this cycle?',
    a: 'You\'re welcome to reapply as many times as you\'d like. There\'s no limit, and we encourage it.',
  },
]

export default function FAQList() {
  const [open, setOpen] = useState(null)

  return (
    <div className="divide-y divide-zinc-100">
      {faqs.map((faq, i) => (
        <div key={i} className="py-5">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full text-left flex items-start justify-between gap-6"
          >
            <span className="text-sm font-medium text-zinc-700">{faq.q}</span>
            <span className="text-zinc-300 text-base flex-shrink-0 mt-0.5">
              {open === i ? '−' : '+'}
            </span>
          </button>
          {open === i && (
            <p className="text-sm text-zinc-400 font-light leading-relaxed mt-3 pr-8">
              {faq.a}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
