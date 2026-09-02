import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { projects } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'
import { auth } from '@/auth'

export async function GET() {
  const rows = await db.select().from(projects).orderBy(asc(projects.order), asc(projects.name))
  return NextResponse.json({ projects: rows })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, tech, desc, link, icon, order } = await req.json()
  if (!name || !tech || !desc) return NextResponse.json({ error: 'Name, Tech, and Desc are required' }, { status: 400 })

  const [project] = await db.insert(projects).values({
    name, tech, desc, link: link || null, icon: icon || '📁', order: order || 0,
  }).returning()

  return NextResponse.json({ project }, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, name, tech, desc, link, icon, order } = await req.json()
  const [project] = await db.update(projects).set({
    name, tech, desc, link, icon, order,
  }).where(eq(projects.id, id)).returning()

  return NextResponse.json({ project })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  await db.delete(projects).where(eq(projects.id, id))
  return NextResponse.json({ success: true })
}
