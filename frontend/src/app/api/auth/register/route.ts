import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { slugify } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const { email, username, password } = await req.json()

    if (!email || !username || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    const existingEmail = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).get()
    if (existingEmail) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const existingUsername = await db.select({ id: users.id }).from(users).where(eq(users.username, username)).get()
    if (existingUsername) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const newUser = await db.insert(users).values({
      email,
      username: slugify(username) || username,
      passwordHash,
      role: email.toLowerCase() === 'cssurya2006@gmail.com' ? 'admin' : 'viewer',
    }).returning({ id: users.id, email: users.email, username: users.username, role: users.role })

    return NextResponse.json({ user: newUser[0] }, { status: 201 })
  } catch (err) {
    console.error('[REGISTER]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
