'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Clock, Search, ChevronLeft, ChevronRight } from 'lucide-react'

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
    <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1rem' }}>
      
      {/* Search Header */}
      <div style={{ width: '100%', maxWidth: '1200px', display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem', zIndex: 10 }}>
        <form onSubmit={handleSearch} style={{ 
          display: 'flex', gap: '0.5rem', background: 'var(--surface)', padding: '0.5rem', 
          borderRadius: '99px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
          width: '100%', maxWidth: '350px'
        }}>
          <input 
            type="text" 
            name="search" 
            placeholder="Search articles..." 
            style={{ 
              flex: 1, background: 'transparent', border: 'none', padding: '0.5rem 1rem',
              color: 'var(--text)', outline: 'none', fontSize: '0.95rem', width: '100%'
            }}
            className="hero-search-input-card"
          />
          <button type="submit" className="btn btn-primary btn-sm" style={{ borderRadius: '99px', padding: '0 1rem' }}>
            <Search size={14} />
          </button>
        </form>
      </div>

      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="hero-carousel-scroll" 
        style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', width: '100%', maxWidth: '1200px', gap: '2rem', paddingBottom: '1rem' }}
      >
        {posts.map((post, index) => (
          <div key={post.id} className="hero-card" style={{ 
            scrollSnapAlign: 'center', flex: '0 0 100%', width: '100%',
            background: 'var(--surface)', borderRadius: '24px', overflow: 'hidden',
            boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)',
            display: 'flex'
          }}>
             {/* Image Section */}
             <div className="hero-card-img-wrap" style={{ 
               flex: '1.2', background: 'var(--surface-2)', 
               display: 'flex', alignItems: 'center', justifyContent: 'center',
               position: 'relative'
             }}>
               {post.featuredImageUrl ? (
                 <img src={post.featuredImageUrl} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }} />
               ) : (
                 <div style={{ width: '100%', height: '100%', background: 'var(--gradient)', borderRadius: '12px' }} />
               )}
             </div>
             
             {/* Content Section */}
             <div className="hero-card-content" style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.25rem' }}>
                {post.categoryName && (
                  <div>
                    <span className="badge" style={{ background: post.categoryColor || 'var(--accent)', color: 'white', border: 'none', padding: '0.4rem 0.8rem', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.5px' }}>
                      {post.categoryName.toUpperCase()}
                    </span>
                  </div>
                )}
                
                <h1 style={{ color: 'var(--text)', fontSize: 'clamp(1.75rem, 2.5vw, 2.5rem)', fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
                  {post.title}
                </h1>
                
                {post.excerpt && (
                  <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6 }}>
                    {post.excerpt}
                  </p>
                )}
                
                <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                  <Link href={`/blog/${post.slug}`} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '99px', fontWeight: 600 }}>
                    Read Article <ArrowRight size={18} />
                  </Link>
                  {post.readingTime && (
                    <span style={{ color: 'var(--text-faint)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500 }}>
                      <Clock size={15} /> {post.readingTime} min read
                    </span>
                  )}
                </div>
             </div>
          </div>
        ))}
      </div>
      
      {/* Navigation Arrows */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
        <button
          onClick={() => scrollTo(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--border)',
            background: 'var(--surface)', color: currentIndex === 0 ? 'var(--text-faint)' : 'var(--text)',
            cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease',
            boxShadow: 'var(--shadow-sm)'
          }}
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>
        
        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          {currentIndex + 1} / {posts.length}
        </span>
        
        <button
          onClick={() => scrollTo(Math.min(posts.length - 1, currentIndex + 1))}
          disabled={currentIndex === posts.length - 1}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--border)',
            background: 'var(--surface)', color: currentIndex === posts.length - 1 ? 'var(--text-faint)' : 'var(--text)',
            cursor: currentIndex === posts.length - 1 ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease',
            boxShadow: 'var(--shadow-sm)'
          }}
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hero-carousel-scroll::-webkit-scrollbar { display: none; }
        .hero-carousel-scroll { scroll-behavior: smooth; }
        .hero-search-input-card::placeholder { color: var(--text-faint); }
        .hero-card { flex-direction: row; min-height: 480px; }
        .hero-card-img-wrap { padding: 2rem; }
        .hero-card-content { padding: 3.5rem; }
        @media (max-width: 900px) {
          .hero-card { flex-direction: column; }
          .hero-card-img-wrap { padding: 1.5rem 1.5rem 0 1.5rem; min-height: 250px; }
          .hero-card-content { padding: 2rem 1.5rem; }
        }
      `}} />
    </div>
  )
}
