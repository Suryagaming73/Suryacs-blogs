import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { comments, posts, users } from '@/db/schema'
import { eq, asc, sql } from 'drizzle-orm'
import { auth } from '@/auth'

type Params = { params: Promise<{ slug: string }> }

// GET /api/posts/[slug]/comments
export async function GET(req: NextRequest, { params }: Params) {
  const { slug } = await params
  const post = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, slug)).get()
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  const rows = await db.select({
    id: comments.id,
    content: comments.content,
    parentId: comments.parentId,
    createdAt: comments.createdAt,
    authorId: comments.authorId,
    authorName: users.username,
    authorAvatar: users.avatarUrl,
  })
  .from(comments)
  .leftJoin(users, eq(comments.authorId, users.id))
  .where(eq(comments.postId, post.id))
  .orderBy(asc(comments.createdAt))

  // Build threaded structure
  const topLevel = rows.filter(c => !c.parentId)
  const replies = rows.filter(c => c.parentId)
  const threaded = topLevel.map(c => ({
    ...c,
    replies: replies.filter(r => r.parentId === c.id),
  }))

  return NextResponse.json({ comments: threaded })
}

// POST /api/posts/[slug]/comments
export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Login required' }, { status: 401 })

  const { slug } = await params
  const post = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, slug)).get()
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  const { content, parentId } = await req.json()
  if (!content?.trim()) return NextResponse.json({ error: 'Comment cannot be empty' }, { status: 400 })

  const userId = (session.user as any).id
  const [comment] = await db.insert(comments).values({
    postId: post.id,
    authorId: userId,
    parentId: parentId || null,
    content: content.trim(),
  }).returning()

  const author = await db.select({ username: users.username, avatarUrl: users.avatarUrl })
    .from(users).where(eq(users.id, userId)).get()

  return NextResponse.json({ comment: { ...comment, authorName: author?.username, authorAvatar: author?.avatarUrl } }, { status: 201 })
}
