import { NextResponse } from 'next/server'
import { db } from '@/db'
import { comments, users, posts } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()
  if ((session?.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rows = await db.select({
    id: comments.id,
    content: comments.content,
    createdAt: comments.createdAt,
    authorName: users.username,
    postTitle: posts.title,
    postSlug: posts.slug,
  })
  .from(comments)
  .leftJoin(users, eq(comments.authorId, users.id))
  .leftJoin(posts, eq(comments.postId, posts.id))
  .orderBy(desc(comments.createdAt))
  .limit(200)

  return NextResponse.json({ comments: rows })
}
