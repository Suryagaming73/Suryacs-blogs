'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const search = formData.get('search') as string
    if (search) {
      router.push(`/blog?search=${encodeURIComponent(search)}`)
    } else {
      router.push(`/blog`)
    }
  }

  useEffect(() => {
    if (!posts || posts.length <= 1) return

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        let newScrollLeft = scrollLeft + clientWidth
        if (newScrollLeft >= scrollWidth - 10) {
          newScrollLeft = 0
        }
        scrollRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' })
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [posts])

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const newIndex = Math.round(scrollLeft / clientWidth)
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex)
      }
    }
  }

  const scrollTo = (index: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: index * scrollRef.current.clientWidth, behavior: 'smooth' })
    }
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: 'clamp(500px, 80vh, 900px)', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="hero-carousel-scroll" 
        style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', height: '100%' }}
      >
        {posts.map((post, index) => (
          <div key={post.id} style={{ scrollSnapAlign: 'start', flex: '0 0 100%', width: '100%', height: '100%', position: 'relative' }}>
             {post.featuredImageUrl ? (
               <img src={post.featuredImageUrl} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
             ) : (
               <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--accent) 0%, #341f97 100%)' }} />
             )}
             
             {/* Dark gradient to ensure text readability without a solid card background */}
             <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.1) 100%)' }} />
             
             <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <div style={{ width: '100%', maxWidth: '1200px', padding: '0 1.5rem', display: 'flex' }}>
                 {/* Transparent Text Container */}
                 <div style={{ 
                   background: 'transparent', 
                   padding: 'clamp(1.5rem, 4vw, 3rem) 0', 
                   maxWidth: '650px',
                   width: '100%',
                   display: 'flex', 
                   flexDirection: 'column', 
                   gap: '1rem',
                   transform: 'translateY(0)', // for hardware acceleration
                 }}>
                    {post.categoryName && (
                      <div style={{ display: 'flex' }}>
                        <span className="badge" style={{ background: post.categoryColor || 'var(--accent)', color: 'white', border: 'none', padding: '0.4rem 0.8rem', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.5px' }}>
                          {post.categoryName.toUpperCase()}
                        </span>
                      </div>
                    )}
                    
                    <h1 style={{ color: 'white', fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 800, margin: 0, lineHeight: 1.15, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                      {post.title}
                    </h1>
                    
                    {post.excerpt && (
                      <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6 }}>
                        {post.excerpt}
                      </p>
                    )}
                    
                    <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                      <Link href={`/blog/${post.slug}`} className="btn btn-primary" style={{ padding: '0.8rem 1.75rem', fontSize: '0.95rem', borderRadius: '99px', fontWeight: 600, boxShadow: '0 8px 20px rgba(var(--accent-rgb), 0.3)' }}>
                        Read Article <ArrowRight size={18} />
                      </Link>
                      {post.readingTime && (
                        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500 }}>
                          <Clock size={15} /> {post.readingTime} min read
                        </span>
                      )}
                    </div>
                 </div>
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
            onClick={() => scrollTo(index)}
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
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 10 }}>
        <div style={{ width: '100%', maxWidth: '1200px', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '100%', maxWidth: '350px' }}>
            <form onSubmit={handleSearch} style={{ 
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
        </div>
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
