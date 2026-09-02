import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { services } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'
import { auth } from '@/auth'

export async function GET() {
  const rows = await db.select().from(services).orderBy(asc(services.order), asc(services.title))
  return NextResponse.json({ services: rows })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, desc, icon, order } = await req.json()
  if (!title || !desc) return NextResponse.json({ error: 'Title and Desc are required' }, { status: 400 })

  const [service] = await db.insert(services).values({
    title, desc, icon: icon || '✨', order: order || 0,
  }).returning()

  return NextResponse.json({ service }, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, title, desc, icon, order } = await req.json()
  const [service] = await db.update(services).set({
    title, desc, icon, order,
  }).where(eq(services.id, id)).returning()

  return NextResponse.json({ service })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  await db.delete(services).where(eq(services.id, id))
  return NextResponse.json({ success: true })
}
