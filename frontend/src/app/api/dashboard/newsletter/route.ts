import { NextResponse } from 'next/server'
import { db } from '@/db'
import { subscribers } from '@/db/schema'
import { desc } from 'drizzle-orm'
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()
  if ((session?.user as any)?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const rows = await db.select().from(subscribers).orderBy(desc(subscribers.createdAt))
  return NextResponse.json({ subscribers: rows })
}
