'use client'
import { useEffect, useRef, useState } from 'react'

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const article = document.getElementById('post-content')
    if (!article) return

    function update() {
      const rect = article!.getBoundingClientRect()
      const totalHeight = article!.scrollHeight
      const windowHeight = window.innerHeight
      const scrolled = window.scrollY - (article!.offsetTop - windowHeight)
      const pct = Math.min(100, Math.max(0, (scrolled / totalHeight) * 100))
      setProgress(pct)
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div
      className="reading-progress"
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  )
}
