import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/db'
import { settings } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const allSettings = await db.select().from(settings).all()
    const config = allSettings.reduce((acc, curr) => {
      acc[curr.key] = curr.value
      return acc
    }, {} as Record<string, string>)
    return NextResponse.json(config)
  } catch (error) {
    console.error('Fetch settings error:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await request.json()
    // payload is an object { key: value, ... }

    // Drizzle ORM sqlite doesn't have a direct upsert in this specific version, 
    // so we'll do delete then insert, or just check and update/insert.
    for (const [key, value] of Object.entries(payload)) {
      if (typeof value === 'string') {
        const existing = await db.select().from(settings).where(eq(settings.key, key)).get()
        if (existing) {
          await db.update(settings).set({ value }).where(eq(settings.key, key)).run()
        } else {
          await db.insert(settings).values({ key, value }).run()
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Settings saved successfully' })
  } catch (error) {
    console.error('Update settings error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
