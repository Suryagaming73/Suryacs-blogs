import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { postLikes, posts } from '@/db/schema'
import { and, eq, sql } from 'drizzle-orm'
import { auth } from '@/auth'

type Params = { params: Promise<{ slug: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Login required' }, { status: 401 })

  const { slug } = await params
  const post = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, slug)).get()
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  const userId = (session.user as any).id

  const existing = await db.select({ id: postLikes.id })
    .from(postLikes)
    .where(and(eq(postLikes.postId, post.id), eq(postLikes.userId, userId)))
    .get()

  if (existing) {
    await db.delete(postLikes).where(eq(postLikes.id, existing.id))
  } else {
    await db.insert(postLikes).values({ postId: post.id, userId })
  }

  const [{ count }] = await db.select({ count: sql<number>`count(*)` })
    .from(postLikes).where(eq(postLikes.postId, post.id))

  return NextResponse.json({ liked: !existing, count })
}
