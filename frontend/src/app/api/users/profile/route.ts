import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function PUT(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { username, bio, avatarUrl } = await request.json()

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 })
    }

    // Check if username is already taken by another user
    const existing = await db.select().from(users).where(eq(users.username, username)).get()
    if (existing && existing.id !== session.user.id) {
      return NextResponse.json({ error: 'Username is already taken' }, { status: 400 })
    }

    const updateData: any = { username, bio }
    if (avatarUrl !== undefined) {
      updateData.avatarUrl = avatarUrl
    }

    await db.update(users).set(updateData).where(eq(users.id, session.user.id)).run()

    return NextResponse.json({ success: true, message: 'Profile updated' })
  } catch (error: any) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
