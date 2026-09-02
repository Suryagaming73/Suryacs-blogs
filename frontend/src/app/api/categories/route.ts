import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { categories } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'
import { auth } from '@/auth'
import { slugify } from '@/lib/utils'

export async function GET() {
  const rows = await db.select().from(categories).orderBy(asc(categories.order), asc(categories.name))
  return NextResponse.json({ categories: rows })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, description, icon, color, parentId, order } = await req.json()
  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

  const slug = slugify(name)
  const [cat] = await db.insert(categories).values({
    name, slug, description: description || '', icon: icon || '',
    color: color || '#6c5ce7', parentId: parentId || null, order: order || 0,
  }).returning()

  return NextResponse.json({ category: cat }, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, name, description, icon, color, parentId, order } = await req.json()
  const [cat] = await db.update(categories).set({
    name, description, icon, color, parentId, order,
  }).where(eq(categories.id, id)).returning()

  return NextResponse.json({ category: cat })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  await db.delete(categories).where(eq(categories.id, id))
  return NextResponse.json({ success: true })
}
