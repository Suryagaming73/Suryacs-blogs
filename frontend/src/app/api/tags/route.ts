import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { tags } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'
import { auth } from '@/auth'
import { slugify } from '@/lib/utils'

export async function GET() {
  const rows = await db.select().from(tags).orderBy(asc(tags.name))
  return NextResponse.json({ tags: rows })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name } = await req.json()
  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  const slug = slugify(name)

  const [tag] = await db.insert(tags).values({ name, slug }).returning()
  return NextResponse.json({ tag }, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  await db.delete(tags).where(eq(tags.id, id))
  return NextResponse.json({ success: true })
}
