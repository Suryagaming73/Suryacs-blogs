import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/auth'

type Params = { params: Promise<{ id: string }> }

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const target = await db.select({ role: users.role }).from(users).where(eq(users.id, id)).get()
  if (target?.role === 'admin') return NextResponse.json({ error: 'Cannot delete admin user' }, { status: 403 })
  await db.delete(users).where(eq(users.id, id))
  return NextResponse.json({ success: true })
}
