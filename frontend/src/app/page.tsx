import { Metadata } from 'next'
import Link from 'next/link'
import { db } from '@/db'
import { posts, categories, postLikes } from '@/db/schema'
import { eq, desc, sql, and } from 'drizzle-orm'
import { PostCard } from '@/components/blog/PostCard'
import { ArrowRight, Sparkles, TrendingUp, Zap, Mail } from 'lucide-react'
import { formatNumber } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Surya CS | Full-Stack Web Developer & AI Content Creator',
  description: 'Portfolio and blog of Surya CS. Discover projects, services, and the latest insights in web development and AI.',
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

  return (
    <>
      {/* ── Hero ─────────────────────────── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container">
          <div className="hero-content" style={{ maxWidth: 700, margin: '0 auto' }}>
            <div className="hero-eyebrow">
              <Sparkles size={14} /> Blog & Insights
            </div>
            <h1 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              Explore <span className="gradient-text">Articles</span>
            </h1>
            <p className="hero-desc" style={{ marginBottom: '2.5rem' }}>
              Discover the latest in full-stack web development, dynamic platforms, and intelligent digital solutions.
            </p>
            
            <form action="/blog" method="GET" style={{ 
              display: 'flex', gap: '0.5rem', background: 'var(--surface)', padding: '0.5rem', 
              borderRadius: '999px', border: '1px solid var(--border-strong)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              position: 'relative'
            }}>
              <input 
                type="text" 
                name="search" 
                placeholder="Search articles, tutorials, and insights..." 
                style={{ 
                  flex: 1, background: 'transparent', border: 'none', padding: '0.5rem 1rem 0.5rem 1.5rem',
                  color: 'var(--text)', outline: 'none', fontSize: '1rem', width: '100%'
                }}
              />
              <button type="submit" className="btn btn-primary" style={{ borderRadius: '999px', padding: '0 1.5rem' }}>
                Search
              </button>
            </form>

            {/* Quick stats */}
            <div className="flex items-center justify-center gap-8 mt-8" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              <div className="flex items-center gap-2">
                <TrendingUp size={16} style={{ color: 'var(--accent)' }} />
                <strong style={{ color: 'var(--text)' }}>{formatNumber(totalPosts)}</strong> articles published
              </div>
              {cats.length > 0 && (
                <div className="flex items-center gap-2">
                  <Sparkles size={16} style={{ color: 'var(--accent)' }} />
                  <strong style={{ color: 'var(--text)' }}>{cats.length}</strong> categories
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Posts (Carousel) ─────────────────── */}
      {featured.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <div className="section-tag"><Sparkles size={12} /> Featured</div>
              <h2 className="section-title font-heading">Editor&apos;s Picks</h2>
              <p className="section-desc">Hand-picked stories we think you&apos;ll love</p>
            </div>
            <div className="posts-carousel" style={{ 
              display: 'flex', overflowX: 'auto', gap: '1.5rem', paddingBottom: '1.5rem',
              scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none'
            }}>
              {featured.map(p => (
                <div key={p.id} style={{ scrollSnapAlign: 'start', flex: '0 0 calc(85vw)', maxWidth: '400px', minWidth: '300px' }}>
                  <PostCard post={p} />
                </div>
              ))}
            </div>
            <style dangerouslySetInnerHTML={{__html: `
              .posts-carousel::-webkit-scrollbar { display: none; }
            `}} />
          </div>
        </section>
      )}

      {/* ── Latest Posts ────────────────────── */}
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div>
              <div className="section-tag"><TrendingUp size={12} /> Latest</div>
              <h2 className="section-title font-heading" style={{ textAlign: 'left', margin: '0.5rem 0 0' }}>Recent Articles</h2>
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

      {/* ── CTA ──────────────────── */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-alt)' }}>
        <div className="container-sm" style={{ textAlign: 'center' }}>
          <div className="card" style={{ padding: '3rem 2rem' }}>
            <Zap size={48} style={{ margin: '0 auto 1.5rem', color: 'var(--accent)', opacity: 0.8 }} />
            <h2 className="section-title font-heading">Let&apos;s Work Together</h2>
            <p className="section-desc" style={{ marginBottom: '2rem' }}>
              Have a project in mind or need a reliable full-stack developer? Feel free to reach out. I&apos;m currently open to new opportunities!
            </p>
            <Link href="/contact" className="btn btn-primary btn-lg" style={{ display: 'inline-flex' }}>
              <Mail size={18} /> Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}


