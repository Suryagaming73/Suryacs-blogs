'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Clock, Search } from 'lucide-react'

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  featuredImageUrl?: string | null
  readingTime?: number | null
  categoryName?: string | null
  categoryColor?: string | null
}

interface HeroCarouselProps {
  posts: Post[]
}

export function HeroCarousel({ posts }: HeroCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!posts || posts.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posts.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [posts])

  useEffect(() => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current
      scrollRef.current.scrollTo({
        left: currentIndex * clientWidth,
        behavior: 'smooth'
      })
    }
  }, [currentIndex])

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const newIndex = Math.round(scrollLeft / clientWidth)
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex)
      }
    }
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: 'clamp(400px, 65vh, 600px)', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="hero-carousel-scroll" 
        style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', height: '100%' }}
      >
        {posts.map((post, index) => (
          <div key={post.id} style={{ scrollSnapAlign: 'start', flex: '0 0 100%', width: '100%', height: '100%', position: 'relative' }}>
             {post.featuredImageUrl ? (
               <img src={post.featuredImageUrl} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             ) : (
               <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--accent) 0%, #341f97 100%)' }} />
             )}
             <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.1) 100%)' }} />
             <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: 'clamp(1.5rem, 5vw, 4rem)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {post.categoryName && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span className="badge" style={{ background: post.categoryColor || 'var(--accent)', color: 'white', border: 'none', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                      {post.categoryName}
                    </span>
                  </div>
                )}
                <h1 style={{ color: 'white', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 800, margin: 0, lineHeight: 1.1, textShadow: '0 2px 10px rgba(0,0,0,0.3)', maxWidth: '800px' }}>
                  {post.title}
                </h1>
                {post.excerpt && (
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 'clamp(1rem, 2vw, 1.25rem)', maxWidth: '700px', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.excerpt}
                  </p>
                )}
                <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Link href={`/blog/${post.slug}`} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', borderRadius: '99px' }}>
                    Read Article <ArrowRight size={18} />
                  </Link>
                  {post.readingTime && (
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={14} /> {post.readingTime} min read
                    </span>
                  )}
                </div>
             </div>
          </div>
        ))}
      </div>
      
      {/* Navigation Dots */}
      <div style={{ position: 'absolute', bottom: '1.5rem', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '0.5rem', zIndex: 10 }}>
        {posts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              border: 'none',
              background: index === currentIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
              cursor: 'pointer',
              transition: 'background 0.3s ease'
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Search Overlay */}
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10, width: 'min(100%, 350px)' }} className="hidden-mobile">
        <form action="/blog" method="GET" style={{ 
          display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '0.5rem', 
          borderRadius: '99px', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
        }}>
          <input 
            type="text" 
            name="search" 
            placeholder="Search articles..." 
            style={{ 
              flex: 1, background: 'transparent', border: 'none', padding: '0.5rem 1rem',
              color: 'white', outline: 'none', fontSize: '0.95rem', width: '100%'
            }}
            className="hero-search-input"
          />
          <button type="submit" className="btn btn-primary btn-sm" style={{ borderRadius: '99px', padding: '0 1rem', background: 'white', color: 'black' }}>
            <Search size={14} />
          </button>
        </form>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hero-carousel-scroll::-webkit-scrollbar { display: none; }
        .hero-carousel-scroll { scroll-behavior: smooth; }
        .hero-search-input::placeholder { color: rgba(255,255,255,0.7); }
        @media (max-width: 768px) { .hidden-mobile { display: none !important; } }
      `}} />
    </div>
  )
}
