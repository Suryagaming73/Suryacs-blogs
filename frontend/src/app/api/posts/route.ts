import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { posts, categories, tags, postTags, users } from '@/db/schema'
import { eq, desc, and, like, or, sql } from 'drizzle-orm'
import { auth } from '@/auth'
import { generateSlug, calculateReadingTime, stripHtml } from '@/lib/utils'

// GET /api/posts — list posts with filters
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '12')
  const offset = (page - 1) * limit
  const status = searchParams.get('status') || 'published'
  const categorySlug = searchParams.get('category')
  const tagSlug = searchParams.get('tag')
  const search = searchParams.get('search') || ''
  const featured = searchParams.get('featured')

  const session = await auth()
  const isAdmin = (session?.user as any)?.role === 'admin'

  // Build where conditions
  const conditions = []
  if (!isAdmin) conditions.push(eq(posts.status, 'published'))
  else if (status !== 'all') conditions.push(eq(posts.status, status as any))
  if (search) conditions.push(or(like(posts.title, `%${search}%`), like(posts.excerpt, `%${search}%`)))
  if (featured === 'true') conditions.push(eq(posts.isFeatured, true))
  
  if (categorySlug) {
    conditions.push(eq(categories.slug, categorySlug))
  }
  
  if (tagSlug) {
    const matchingPostIds = db.select({ postId: postTags.postId })
      .from(postTags)
      .innerJoin(tags, eq(postTags.tagId, tags.id))
      .where(eq(tags.slug, tagSlug))
    conditions.push(sql`${posts.id} IN (${matchingPostIds})`)
  }

  const query = db.select({
    id: posts.id,
    title: posts.title,
    slug: posts.slug,
    excerpt: posts.excerpt,
    featuredImageUrl: posts.featuredImageUrl,
    status: posts.status,
    isFeatured: posts.isFeatured,
    viewsCount: posts.viewsCount,
    readingTime: posts.readingTime,
    externalLink: posts.externalLink,
    externalLinkText: posts.externalLinkText,
    publishedAt: posts.publishedAt,
    createdAt: posts.createdAt,
    categoryId: posts.categoryId,
    authorId: posts.authorId,
    categoryName: categories.name,
    categorySlug: categories.slug,
    categoryColor: categories.color,
    authorName: users.username,
    authorAvatar: users.avatarUrl,
  })
  .from(posts)
  .leftJoin(categories, eq(posts.categoryId, categories.id))
  .leftJoin(users, eq(posts.authorId, users.id))
  .where(conditions.length ? and(...conditions) : undefined)
  .orderBy(desc(posts.publishedAt), desc(posts.createdAt))
  .limit(limit)
  .offset(offset)

  const rows = await query

  // Get total count
  const [{ count }] = await db.select({ count: sql<number>`count(*)` })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(conditions.length ? and(...conditions) : undefined)

  return NextResponse.json({ posts: rows, total: count, page, limit })
}

// POST /api/posts — create a new post (admin only)
export async function POST(req: NextRequest) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { title, content, excerpt, featuredImageUrl, categoryId, tagIds, seriesId, seriesOrder,
      status, isFeatured, metaTitle, metaDescription, externalLink, externalLinkText } = body

    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 })

    const slug = generateSlug(title)
    const readingTime = calculateReadingTime(content || '')
    const autoExcerpt = excerpt || stripHtml(content || '', 200)
    const publishedAt = status === 'published' ? new Date().toISOString() : null
    const authorId = (session?.user as any)?.id

    const [post] = await db.insert(posts).values({
      title,
      slug,
      content: content || '',
      excerpt: autoExcerpt,
      featuredImageUrl: featuredImageUrl || null,
      authorId,
      categoryId: categoryId || null,
      seriesId: seriesId || null,
      seriesOrder: seriesOrder || 0,
      status: status || 'draft',
      isFeatured: isFeatured || false,
      readingTime,
      metaTitle: metaTitle || '',
      metaDescription: metaDescription || '',
      externalLink: externalLink || null,
      externalLinkText: externalLinkText || null,
      publishedAt,
    }).returning()

    if (tagIds?.length) {
      await db.insert(postTags).values(
        tagIds.map((tagId: string) => ({ postId: post.id, tagId }))
      )
    }

    return NextResponse.json({ post }, { status: 201 })
  } catch (err) {
    console.error('[POST CREATE]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
