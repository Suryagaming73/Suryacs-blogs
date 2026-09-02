import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { subscribers } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }

  const existing = await db.select({ id: subscribers.id })
    .from(subscribers).where(eq(subscribers.email, email)).get()
  
  if (existing) {
    return NextResponse.json({ message: 'Already subscribed!' })
  }

  await db.insert(subscribers).values({ email, isActive: true })
  return NextResponse.json({ message: 'Subscribed successfully! 🎉' }, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const { email } = await req.json()
  await db.update(subscribers).set({ isActive: false }).where(eq(subscribers.email, email))
  return NextResponse.json({ message: 'Unsubscribed successfully' })
}
