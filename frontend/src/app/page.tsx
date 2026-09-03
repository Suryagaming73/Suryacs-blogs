import { Metadata } from 'next'
import Link from 'next/link'
import { db } from '@/db'
import { posts, categories, postLikes } from '@/db/schema'
import { eq, desc, sql, and } from 'drizzle-orm'
import { PostCard } from '@/components/blog/PostCard'
import { HeroCarousel } from '@/components/home/HeroCarousel'
import { NewsletterForm } from '@/components/home/NewsletterForm'
import { ArrowRight, Sparkles, TrendingUp, Zap, Mail, Clock, Search } from 'lucide-react'
import { formatNumber } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Suryacs-Blogs | Full-Stack Web Developer & AI Content Creator',
  description: 'Portfolio and blog of Suryacs-Blogs. Discover projects, services, and the latest insights in web development and AI.',
}

async function getData() {
  const [featured, latest, allCategories, statsResult] = await Promise.all([
    db.select({
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
    .limit(3),
    
    db.select({
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
    .limit(6),

    db.select().from(categories).limit(8),

    db.select({ total: sql<number>`count(*)` }).from(posts).where(eq(posts.status, 'published'))
  ])

  return { featured, latest, categories: allCategories, totalPosts: statsResult[0]?.total || 0 }
}

export default async function HomePage() {
  const { featured, latest, categories: cats, totalPosts } = await getData()
  const heroPosts = featured.length > 0 ? featured : latest.slice(0, 3)

  return (
    <>
      {/* ── Hero Carousel ─────────────────────────── */}
      <section style={{ background: 'var(--bg)', paddingBottom: '2rem' }}>
        <HeroCarousel posts={heroPosts as any} />
      </section>

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
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  )
}


