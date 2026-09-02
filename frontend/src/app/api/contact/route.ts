import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { contactMessages } from '@/db/schema'

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json()
  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }

  await db.insert(contactMessages).values({ name, email, subject, message })
  return NextResponse.json({ message: 'Message sent! We\'ll get back to you soon.' }, { status: 201 })
}
