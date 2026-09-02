import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { contactMessages } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()
  if ((session?.user as any)?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rows = await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt)).limit(100)
  return NextResponse.json({ messages: rows })
}
