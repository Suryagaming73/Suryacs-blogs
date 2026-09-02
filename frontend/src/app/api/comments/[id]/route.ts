import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { comments, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/auth'

type Params = { params: Promise<{ id: string }> }

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const comment = await db.select({ id: comments.id, authorId: comments.authorId })
    .from(comments).where(eq(comments.id, id)).get()
  if (!comment) return NextResponse.json({ error: 'Comment not found' }, { status: 404 })

  const userId = (session.user as any).id
  const role = (session.user as any).role
  if (comment.authorId !== userId && role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await db.delete(comments).where(eq(comments.id, id))
  return NextResponse.json({ success: true })
}
