'use client'

export default function ScrollToAbout({ children, className }) {
  function handleClick(e) {
    e.preventDefault()
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <a href="#about" onClick={handleClick} className={className}>
      {children}
    </a>
  )
}
