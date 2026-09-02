import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

// POST /api/setup — create the first admin account (only if no admin exists)
export async function POST(req: NextRequest) {
  try {
    const existingAdmin = await db.select({ id: users.id })
      .from(users).where(eq(users.role, 'admin')).get()
    
    if (existingAdmin) {
      return NextResponse.json({ error: 'Admin already exists. Setup is disabled.' }, { status: 403 })
    }

    const { email, username, password } = await req.json()
    if (!email || !username || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const admin = await db.insert(users).values({
      email,
      username,
      passwordHash,
      role: 'admin',
      isVerified: true,
    }).returning({ id: users.id, email: users.email, username: users.username, role: users.role })

    return NextResponse.json({ user: admin[0], message: 'Admin account created!' }, { status: 201 })
  } catch (err) {
    console.error('[SETUP]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/setup — check if setup is needed
export async function GET() {
  const existingAdmin = await db.select({ id: users.id })
    .from(users).where(eq(users.role, 'admin')).get()
  return NextResponse.json({ needsSetup: !existingAdmin })
}
