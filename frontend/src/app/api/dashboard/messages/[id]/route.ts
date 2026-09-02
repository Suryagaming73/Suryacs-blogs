import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { contactMessages } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/auth'

type Params = { params: Promise<{ id: string }> }

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await db.delete(contactMessages).where(eq(contactMessages.id, id))
  return NextResponse.json({ success: true })
}
