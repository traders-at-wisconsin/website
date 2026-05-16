'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function IntroAnimation() {
  const [phase, setPhase] = useState('visible')

  useEffect(() => {
    if (sessionStorage.getItem('introPlayed')) {
      setPhase('gone')
      return
    }

    const t1 = setTimeout(() => setPhase('fading'), 1800)
    const t2 = setTimeout(() => {
      setPhase('gone')
      sessionStorage.setItem('introPlayed', 'true')
    }, 2600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (phase === 'gone') return null

  return (
    <div
      className="fixed inset-0 z-[200] bg-[#9B0000] flex items-center justify-center"
      style={{
        opacity: phase === 'fading' ? 0 : 1,
        transform: phase === 'fading' ? 'scale(1.6)' : 'scale(1)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
        pointerEvents: 'none',
      }}
    >
      <Image
        src="/logo.png"
        alt="Traders at Wisconsin"
        width={88}
        height={88}
        className="rounded-sm"
        priority
      />
    </div>
  )
}
