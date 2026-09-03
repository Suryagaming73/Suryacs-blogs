import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { db } from '@/db'
import { posts, categories, users, tags, postTags, postLikes, comments } from '@/db/schema'
import { eq, and, sql } from 'drizzle-orm'
import { auth } from '@/auth'
import { formatDate } from '@/lib/utils'
import { ReadingProgress } from '@/components/blog/ReadingProgress'
import { LikeButton } from '@/components/blog/LikeButton'
import { ShareButtons } from '@/components/blog/ShareButtons'
import { CommentSection } from '@/components/blog/CommentSection'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { Clock, Eye, Calendar, User, ExternalLink, ArrowLeft, Tag } from 'lucide-react'
import Link from 'next/link'
import { formatNumber } from '@/lib/utils'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await db.select({ title: posts.title, metaTitle: posts.metaTitle, metaDescription: posts.metaDescription, featuredImageUrl: posts.featuredImageUrl, excerpt: posts.excerpt })
    .from(posts).where(eq(posts.slug, slug)).get()
  if (!post) return { title: 'Post Not Found' }
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || '',
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || '',
      images: post.featuredImageUrl ? [post.featuredImageUrl] : [],
    },
  }
}

export default async function PostDetailPage({ params }: Props) {
  const { slug } = await params
  const session = await auth()
  const currentUser = session?.user as any

  const post = await db.select({
    id: posts.id, title: posts.title, slug: posts.slug, content: posts.content,
    excerpt: posts.excerpt, featuredImageUrl: posts.featuredImageUrl,
    status: posts.status, isFeatured: posts.isFeatured,
    viewsCount: posts.viewsCount, readingTime: posts.readingTime,
    metaTitle: posts.metaTitle, metaDescription: posts.metaDescription,
    externalLink: posts.externalLink, externalLinkText: posts.externalLinkText,
    publishedAt: posts.publishedAt, createdAt: posts.createdAt, updatedAt: posts.updatedAt,
    categoryName: categories.name, categorySlug: categories.slug, categoryColor: categories.color,
    authorName: users.username, authorAvatar: users.avatarUrl, authorBio: users.bio,
  })
  .from(posts)
  .leftJoin(categories, eq(posts.categoryId, categories.id))
  .leftJoin(users, eq(posts.authorId, users.id))
  .where(eq(posts.slug, slug))
  .get()

  if (!post) notFound()
  if (post.status !== 'published' && currentUser?.role !== 'admin') notFound()

  // Get tags and likes in parallel
  const [postTagRows, [{ likeCount }], likedRow] = await Promise.all([
    db.select({ name: tags.name, slug: tags.slug })
      .from(postTags).leftJoin(tags, eq(postTags.tagId, tags.id))
      .where(eq(postTags.postId, post.id)),
      
    db.select({ likeCount: sql<number>`count(*)` })
      .from(postLikes).where(eq(postLikes.postId, post.id)),

    currentUser?.id ? db.select({ id: postLikes.id })
      .from(postLikes)
      .where(and(eq(postLikes.postId, post.id), eq(postLikes.userId, currentUser.id)))
      .get() : Promise.resolve(null)
  ])

  let userLiked = !!likedRow

  // Increment views (fire-and-forget)
  db.update(posts).set({ viewsCount: (post.viewsCount || 0) + 1 }).where(eq(posts.id, post.id)).run().catch(() => {})

  return (
    <>
      <ReadingProgress />
      <div className="container" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', justifyContent: 'center', flexWrap: 'wrap' }}>
        <article className="post-detail" style={{ flex: '1 1 0%', minWidth: 'min(100%, 780px)', width: '100%' }}>
          {/* Back */}
          <Link href="/blog" className="btn btn-ghost btn-sm mb-6" style={{ display: 'inline-flex', marginTop: '1.5rem' }}>
            <ArrowLeft size={15} /> Back to Blog
          </Link>

          {/* Category + Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categoryName && (
              <Link href={`/blog/category/${post.categorySlug}`}>
                <span className="badge badge-accent">{post.categoryName}</span>
              </Link>
            )}
            {postTagRows.map(t => (
              <span key={t.slug} className="badge badge-muted"><Tag size={10} /> {t.name}</span>
            ))}
          </div>

          {/* Title */}
          <h1 className="post-detail-title">{post.title}</h1>

          {/* Meta */}
          <div className="post-detail-meta">
            {post.authorName && (
              <span className="post-detail-meta-item">
                <User size={14} /> {post.authorName}
              </span>
            )}
            <span className="post-detail-meta-item">
              <Calendar size={14} /> {formatDate(post.publishedAt || post.createdAt || '')}
            </span>
            <span className="post-detail-meta-item">
              <Clock size={14} /> {post.readingTime} min read
            </span>
            <span className="post-detail-meta-item">
              <Eye size={14} /> {formatNumber(post.viewsCount || 0)} views
            </span>
          </div>

          {/* External Link CTA */}
          {post.externalLink && (
            <a href={post.externalLink} target="_blank" rel="noopener noreferrer" className="external-link-btn mb-6" style={{ display: 'inline-flex', marginBottom: '1.5rem' }}>
              <ExternalLink size={16} /> {post.externalLinkText || 'Read Full Article'}
            </a>
          )}

          {/* Featured Image */}
          {post.featuredImageUrl && (
            <div className="post-detail-image">
              <img src={post.featuredImageUrl} alt={post.title} />
            </div>
          )}

          {/* Content */}
          <div
            id="post-content"
            className="post-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Actions Bar */}
          <div className="post-actions-bar">
            <LikeButton
              slug={slug}
              initialCount={likeCount}
              initialLiked={userLiked}
              isLoggedIn={!!session}
            />
            <ShareButtons title={post.title} slug={slug} />
          </div>

          {/* Author Box */}
          {post.authorName && (
            <div className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start', margin: '2rem 0' }}>
              <div className="avatar avatar-lg">
                {post.authorAvatar
                  ? <img src={post.authorAvatar} alt="" width={64} height={64} style={{ objectFit: 'cover' }} />
                  : post.authorName?.[0]?.toUpperCase()
                }
              </div>
              <div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, marginBottom: '0.25rem' }}>{post.authorName}</div>
                {post.authorBio && <p className="text-sm text-muted">{post.authorBio}</p>}
              </div>
            </div>
          )}

          {/* Comments */}
          <CommentSection slug={slug} />
        </article>

        {/* Sidebar for TOC */}
        <TableOfContents />
      </div>
    </>
  )
}
