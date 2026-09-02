import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { posts, categories, tags, postTags, users, comments, postLikes } from '@/db/schema'
import { eq, and, sql } from 'drizzle-orm'
import { auth } from '@/auth'
import { calculateReadingTime, stripHtml } from '@/lib/utils'

type Params = { params: Promise<{ slug: string }> }

// GET /api/posts/[slug] — single post with likes + comment count
export async function GET(req: NextRequest, { params }: Params) {
  const { slug } = await params

  const post = await db.select({
    id: posts.id, title: posts.title, slug: posts.slug,
    content: posts.content, excerpt: posts.excerpt,
    featuredImageUrl: posts.featuredImageUrl, status: posts.status,
    isFeatured: posts.isFeatured, viewsCount: posts.viewsCount,
    readingTime: posts.readingTime, metaTitle: posts.metaTitle,
    metaDescription: posts.metaDescription, externalLink: posts.externalLink,
    publishedAt: posts.publishedAt, createdAt: posts.createdAt, updatedAt: posts.updatedAt,
    categoryId: posts.categoryId, authorId: posts.authorId,
    categoryName: categories.name, categorySlug: categories.slug, categoryColor: categories.color,
    authorName: users.username, authorAvatar: users.avatarUrl, authorBio: users.bio,
  })
  .from(posts)
  .leftJoin(categories, eq(posts.categoryId, categories.id))
  .leftJoin(users, eq(posts.authorId, users.id))
  .where(eq(posts.slug, slug))
  .get()

  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  const session = await auth()
  if (post.status !== 'published' && (session?.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  // Get tags
  const postTagRows = await db.select({ name: tags.name, slug: tags.slug })
    .from(postTags).leftJoin(tags, eq(postTags.tagId, tags.id))
    .where(eq(postTags.postId, post.id))

  // Like count + user liked status
  const [{ likeCount }] = await db.select({ likeCount: sql<number>`count(*)` })
    .from(postLikes).where(eq(postLikes.postId, post.id))

  let userLiked = false
  if (session?.user) {
    const userId = (session.user as any).id
    const liked = await db.select({ id: postLikes.id })
      .from(postLikes).where(and(eq(postLikes.postId, post.id), eq(postLikes.userId, userId))).get()
    userLiked = !!liked
  }

  // Comment count
  const [{ commentCount }] = await db.select({ commentCount: sql<number>`count(*)` })
    .from(comments).where(eq(comments.postId, post.id))

  // Increment views
  await db.update(posts).set({ viewsCount: (post.viewsCount || 0) + 1 }).where(eq(posts.id, post.id))

  return NextResponse.json({ ...post, tags: postTagRows, likeCount, userLiked, commentCount })
}

// PUT /api/posts/[slug] — update post (admin only)
export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { slug } = await params
  const post = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, slug)).get()
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  const body = await req.json()
  const { title, content, excerpt, featuredImageUrl, categoryId, tagIds,
    status, isFeatured, metaTitle, metaDescription, externalLink } = body

  const readingTime = calculateReadingTime(content || '')
  const autoExcerpt = excerpt || stripHtml(content || '', 200)
  const publishedAt = status === 'published' ? (body.publishedAt || new Date().toISOString()) : null

  await db.update(posts).set({
    title, content, excerpt: autoExcerpt,
    featuredImageUrl: featuredImageUrl || null,
    categoryId: categoryId || null,
    status, isFeatured: isFeatured || false,
    readingTime, metaTitle: metaTitle || '',
    metaDescription: metaDescription || '',
    externalLink: externalLink || null,
    publishedAt,
    updatedAt: new Date().toISOString(),
  }).where(eq(posts.id, post.id))

  if (tagIds !== undefined) {
    await db.delete(postTags).where(eq(postTags.postId, post.id))
    if (tagIds.length) {
      await db.insert(postTags).values(tagIds.map((tagId: string) => ({ postId: post.id, tagId })))
    }
  }

  const updated = await db.select().from(posts).where(eq(posts.id, post.id)).get()
  return NextResponse.json({ post: updated })
}

// DELETE /api/posts/[slug] — delete post (admin only)
export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { slug } = await params
  await db.delete(posts).where(eq(posts.slug, slug))
  return NextResponse.json({ success: true })
}
