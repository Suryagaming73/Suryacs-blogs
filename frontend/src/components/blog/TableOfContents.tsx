'use client'
import { useEffect, useState } from 'react'

interface TOCItem {
  id: string
  text: string
  level: number
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('#post-content h2, #post-content h3'))
    
    // Add IDs to headings if they don't have them
    const newHeadings = elements.map(elem => {
      if (!elem.id) {
        elem.id = elem.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'heading'
      }
      return {
        id: elem.id,
        text: elem.textContent || '',
        level: Number(elem.tagName.charAt(1))
      }
    })
    
    setHeadings(newHeadings)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '0% 0% -80% 0%' }
    )

    elements.forEach((elem) => observer.observe(elem))

    return () => observer.disconnect()
  }, [])

  if (headings.length === 0) return null

  return (
    <div className="toc-wrapper">
      <h4 className="toc-title">Table of Contents</h4>
      <nav className="toc-nav">
        <ul>
          {headings.map((heading, idx) => (
            <li 
              key={idx} 
              style={{ paddingLeft: heading.level === 3 ? '1rem' : '0' }}
              className={activeId === heading.id ? 'active' : ''}
            >
              <a 
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
