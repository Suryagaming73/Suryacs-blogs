import { NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()
  if ((session?.user as any)?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const rows = await db.select({
    id: users.id, email: users.email, username: users.username,
    role: users.role, avatarUrl: users.avatarUrl, createdAt: users.createdAt,
  }).from(users).orderBy(desc(users.createdAt))
  return NextResponse.json({ users: rows })
}
