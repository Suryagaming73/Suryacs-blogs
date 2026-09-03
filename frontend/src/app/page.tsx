import { Metadata } from 'next'
import Link from 'next/link'
import { db } from '@/db'
import { posts, categories, postLikes } from '@/db/schema'
import { eq, desc, sql, and } from 'drizzle-orm'
import { PostCard } from '@/components/blog/PostCard'
import { ArrowRight, Sparkles, TrendingUp, Zap, Mail, Clock, Search } from 'lucide-react'
import { formatNumber } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Suryacs-Blogs | Full-Stack Web Developer & AI Content Creator',
  description: 'Portfolio and blog of Suryacs-Blogs. Discover projects, services, and the latest insights in web development and AI.',
}

async function getData() {
  const featured = await db.select({
    id: posts.id, title: posts.title, slug: posts.slug, excerpt: posts.excerpt,
    featuredImageUrl: posts.featuredImageUrl, readingTime: posts.readingTime,
    viewsCount: posts.viewsCount, publishedAt: posts.publishedAt, createdAt: posts.createdAt,
    isFeatured: posts.isFeatured, externalLink: posts.externalLink,
    categoryId: posts.categoryId, authorId: posts.authorId,
    categoryName: categories.name, categorySlug: categories.slug, categoryColor: categories.color,
  })
  .from(posts)
  .leftJoin(categories, eq(posts.categoryId, categories.id))
  .where(and(eq(posts.status, 'published'), eq(posts.isFeatured, true)))
  .orderBy(desc(posts.publishedAt))
  .limit(3)

  const latest = await db.select({
    id: posts.id, title: posts.title, slug: posts.slug, excerpt: posts.excerpt,
    featuredImageUrl: posts.featuredImageUrl, readingTime: posts.readingTime,
    viewsCount: posts.viewsCount, publishedAt: posts.publishedAt, createdAt: posts.createdAt,
    isFeatured: posts.isFeatured, externalLink: posts.externalLink,
    categoryId: posts.categoryId, authorId: posts.authorId,
    categoryName: categories.name, categorySlug: categories.slug, categoryColor: categories.color,
  })
  .from(posts)
  .leftJoin(categories, eq(posts.categoryId, categories.id))
  .where(eq(posts.status, 'published'))
  .orderBy(desc(posts.publishedAt))
  .limit(6)

  const allCategories = await db.select().from(categories).limit(8)

  const [stats] = await db.select({ total: sql<number>`count(*)` }).from(posts).where(eq(posts.status, 'published'))

  return { featured, latest, categories: allCategories, totalPosts: stats.total }
}

export default async function HomePage() {
  const { featured, latest, categories: cats, totalPosts } = await getData()
  const heroPosts = featured.length > 0 ? featured : latest.slice(0, 3)

  return (
    <>
      {/* ── Hero Carousel ─────────────────────────── */}
      <section style={{ padding: '2rem 0', background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ position: 'relative', width: '100%', height: 'clamp(400px, 65vh, 600px)', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <div className="hero-carousel-scroll" style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', height: '100%' }}>
              {heroPosts.map(post => (
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
          </div>
        </div>
      </section>
      <style dangerouslySetInnerHTML={{__html: `
        .hero-carousel-scroll::-webkit-scrollbar { display: none; }
        .hero-search-input::placeholder { color: rgba(255,255,255,0.7); }
        @media (max-width: 768px) { .hidden-mobile { display: none !important; } }
      `}} />

      {/* ── Latest Posts ────────────────────── */}
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div>
              <div className="section-tag"><TrendingUp size={12} /> Latest</div>
              <h2 className="section-title font-heading" style={{ textAlign: 'left', margin: '0.5rem 0 0' }}>Latest News & Articles</h2>
            </div>
            <Link href="/blog" className="btn btn-ghost">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="posts-grid">
            {latest.map(p => <PostCard key={p.id} post={p} />)}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────── */}
      {cats.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <div className="section-tag">Browse</div>
              <h2 className="section-title font-heading">Explore by Topic</h2>
            </div>
            <div className="grid grid-cols-4" style={{ gap: '1rem' }}>
              {cats.map(cat => (
                <Link key={cat.id} href={`/blog/category/${cat.slug}`}
                  className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', textDecoration: 'none' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: `${cat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                    {cat.icon || '📂'}
                  </div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: 'var(--text)' }}>{cat.name}</div>
                  {cat.description && <div className="text-sm text-muted" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.description}</div>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Newsletter CTA ──────────────────── */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-alt)' }}>
        <div className="container-sm" style={{ textAlign: 'center' }}>
          <div className="card" style={{ padding: '3rem 2rem' }}>
            <Mail size={48} style={{ margin: '0 auto 1.5rem', color: 'var(--accent)', opacity: 0.8 }} />
            <h2 className="section-title font-heading">Subscribe to Our Newsletter</h2>
            <p className="section-desc" style={{ marginBottom: '2rem' }}>
              Get the latest articles, tutorials, and tech news delivered straight to your inbox. No spam, just high-quality content.
            </p>
            <form action="/api/newsletter" method="POST" style={{ display: 'flex', gap: '0.5rem', maxWidth: '400px', margin: '0 auto' }}>
              <input type="email" name="email" placeholder="Enter your email address" required style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)' }} />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}


