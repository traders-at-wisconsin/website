import Link from 'next/link'
import ScrollToAbout from './components/ScrollToAbout'
import IntroAnimation from './components/IntroAnimation'

const activities = [
  {
    title: 'Education',
    description:
      'Sessions on quant theory, statistics, programming, and market structure, with a focus on hands-on experience and applying what you learn.',
  },
  {
    title: 'Recruiting',
    description:
      'Resume and technical workshops, recruiting advice, mock interviews, recruiter panels, and exclusive opportunities, all aimed at helping our members navigate and succeed in the recruiting process.',
  },
  {
    title: 'Experiences',
    description:
      'Real team projects, skill-based competitions, and social events throughout the year, giving members ways to apply what they know beyond the classroom.',
  },
]

export default function Home() {
  return (
    <>
      <IntroAnimation />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="relative h-[calc(100vh-4rem)] flex items-center justify-center"
        style={{
          backgroundImage: "url('/uw-campus.jpg')",
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
          <p
            className="text-xs text-red-300 font-normal tracking-widest uppercase mb-6"
            style={{ animation: 'fadeUp 0.6s ease 0.3s both' }}
          >
            University of Wisconsin — Madison
          </p>
          <h1
            className="text-5xl md:text-6xl font-semibold tracking-tight leading-snug mb-10"
            style={{ animation: 'fadeUp 0.7s ease 0.5s both' }}
          >
            Wisconsin's Premier<br />Quant Finance Club.
          </h1>
          <div style={{ animation: 'fadeUp 0.6s ease 0.7s both' }}>
            <ScrollToAbout className="inline-block px-8 py-3.5 bg-[#9B0000]/90 text-white text-xs font-normal tracking-widest uppercase hover:bg-[#9B0000] transition-colors duration-200">
              Learn More
            </ScrollToAbout>
          </div>
        </div>
      </section>

      {/* ── About ────────────────────────────────────────────── */}
      <section id="about" className="bg-white py-24 px-6">
        <div className="max-w-4xl mx-auto">

          <h2 className="text-2xl font-semibold text-zinc-800 mb-12">
            About Us
          </h2>

          <p className="text-base md:text-lg text-zinc-500 leading-relaxed font-light mb-16">
            Traders at Wisconsin is a student-led quantitative finance club at UW-Madison.
            Our mission is to educate students about the world of quant finance — from market
            structure and financial theory to the technical skills that top firms look for.
            We welcome students from all backgrounds and majors, and host events that make
            quant accessible to anyone willing to learn.
          </p>

          <div className="grid md:grid-cols-3 gap-10 border-t border-zinc-100 pt-12">
            {activities.map((a) => (
              <div key={a.title}>
                <h3 className="text-lg font-semibold text-zinc-800 mb-3">{a.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-light">{a.description}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────── */}
      <section className="bg-[#9B0000] py-20 px-6 text-center">
        <h2 className="text-3xl font-semibold text-white mb-8 tracking-tight">
          Ready to get started?
        </h2>
        <Link
          href="/join"
          className="inline-block px-8 py-3.5 bg-white text-[#9B0000] text-xs font-normal tracking-widest uppercase hover:bg-zinc-50 transition-colors duration-200"
        >
          Join Us
        </Link>
      </section>
    </>
  )
}
