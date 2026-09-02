import Link from 'next/link'
import { Clock, Eye, Heart, ExternalLink } from 'lucide-react'
import { formatDate, formatNumber } from '@/lib/utils'

interface PostCardProps {
  post: {
    id: string
    title: string
    slug: string
    excerpt?: string | null
    featuredImageUrl?: string | null
    readingTime?: number | null
    viewsCount?: number | null
    publishedAt?: string | null
    createdAt: string | null
    isFeatured?: boolean | null
    externalLink?: string | null
    categoryName?: string | null
    categorySlug?: string | null
    categoryColor?: string | null
    authorName?: string | null
    likeCount?: number
  }
  variant?: 'default' | 'horizontal'
}

export function PostCard({ post, variant = 'default' }: PostCardProps) {
  if (variant === 'horizontal') {
    return (
      <Link href={`/blog/${post.slug}`} className="card" style={{ display: 'flex', gap: '1rem', padding: '1rem', textDecoration: 'none' }}>
        {post.featuredImageUrl && (
          <div style={{ width: 100, height: 70, borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0 }}>
            <img src={post.featuredImageUrl} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <div style={{ minWidth: 0 }}>
          {post.categoryName && (
            <span className="badge badge-accent" style={{ marginBottom: '0.375rem', fontSize: '0.7rem' }}>
              {post.categoryName}
            </span>
          )}
          <div style={{ fontWeight: 700, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text)' }}>
            {post.title}
          </div>
          <div className="text-xs text-faint" style={{ marginTop: '0.25rem' }}>
            {formatDate(post.publishedAt || post.createdAt || '', { year: 'numeric', month: 'short', day: 'numeric' })}
          </div>
        </div>
      </Link>
    )
  }

  return (
    <article className="post-card">
      <Link href={`/blog/${post.slug}`} style={{ display: 'contents' }}>
        {/* Image */}
        <div className="post-card-image">
          {post.featuredImageUrl ? (
            <img src={post.featuredImageUrl} alt={post.title} loading="lazy" />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '2.5rem', opacity: 0.25 }}>📰</span>
            </div>
          )}
          {post.isFeatured && (
            <div className="featured-ribbon">
              <span className="badge badge-accent">⭐ Featured</span>
            </div>
          )}
          {post.externalLink && (
            <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', zIndex: 2 }}>
              <span className="badge badge-muted"><ExternalLink size={10} /> External</span>
            </div>
          )}
        </div>

        <div className="post-card-body">
          {/* Meta */}
          <div className="post-card-meta">
            {post.categoryName && (
              <span
                className="badge"
                style={{ background: `${post.categoryColor || '#6c5ce7'}18`, color: post.categoryColor || 'var(--accent)', borderColor: `${post.categoryColor || '#6c5ce7'}30` }}
              >
                {post.categoryName}
              </span>
            )}
            {post.readingTime && (
              <span className="text-xs text-faint flex items-center gap-1">
                <Clock size={12} /> {post.readingTime} min read
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="post-card-title">{post.title}</h3>

          {/* Excerpt */}
          {post.excerpt && <p className="post-card-excerpt">{post.excerpt}</p>}

          {/* Footer */}
          <div className="post-card-footer">
            <span>{formatDate(post.publishedAt || post.createdAt || '', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <div className="post-card-stats">
              {(post.viewsCount !== undefined && post.viewsCount !== null) && (
                <span className="post-card-stat text-faint">
                  <Eye size={13} /> {formatNumber(post.viewsCount)}
                </span>
              )}
              {(post.likeCount !== undefined) && (
                <span className="post-card-stat text-faint">
                  <Heart size={13} /> {formatNumber(post.likeCount)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}
