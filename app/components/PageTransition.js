'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function PageTransition() {
  const pathname = usePathname()
  const [showing, setShowing] = useState(false)
  const [fading, setFading] = useState(false)
  const prevPathname = useRef(pathname)
  const showTime = useRef(null)
  const fadeTimer = useRef(null)
  const hideTimer = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      const anchor = e.target.closest('a')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('http') || href.startsWith('mailto') || href.includes('#')) return
      if (href === pathname) return
      clearTimeout(fadeTimer.current)
      clearTimeout(hideTimer.current)
      setFading(false)
      setShowing(true)
      showTime.current = Date.now()
    }
    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [pathname])

  useEffect(() => {
    if (prevPathname.current === pathname) return
    prevPathname.current = pathname

    const elapsed = showTime.current ? Date.now() - showTime.current : 0
    const delay = Math.max(0, 250 - elapsed)

    fadeTimer.current = setTimeout(() => {
      setFading(true)
      hideTimer.current = setTimeout(() => {
        setShowing(false)
        setFading(false)
      }, 400)
    }, delay)

    return () => {
      clearTimeout(fadeTimer.current)
      clearTimeout(hideTimer.current)
    }
  }, [pathname])

  if (!showing) return null

  return (
    <div
      className="fixed inset-0 z-[150] bg-[#9B0000] pointer-events-none"
      style={{
        opacity: fading ? 0 : 1,
        transition: fading ? 'opacity 0.4s ease' : 'none',
      }}
    />
  )
}
