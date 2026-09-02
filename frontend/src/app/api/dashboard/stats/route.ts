import { NextResponse } from 'next/server'
import { db } from '@/db'
import { posts, comments, postLikes, users, subscribers, contactMessages } from '@/db/schema'
import { eq, sql, desc } from 'drizzle-orm'
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()
  if ((session?.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [totalPosts] = await db.select({ count: sql<number>`count(*)` }).from(posts)
  const [publishedPosts] = await db.select({ count: sql<number>`count(*)` }).from(posts).where(eq(posts.status, 'published'))
  const [totalViews] = await db.select({ total: sql<number>`sum(views_count)` }).from(posts)
  const [totalComments] = await db.select({ count: sql<number>`count(*)` }).from(comments)
  const [totalLikes] = await db.select({ count: sql<number>`count(*)` }).from(postLikes)
  const [totalUsers] = await db.select({ count: sql<number>`count(*)` }).from(users)
  const [totalSubscribers] = await db.select({ count: sql<number>`count(*)` }).from(subscribers).where(eq(subscribers.isActive, true))
  const [unreadMessages] = await db.select({ count: sql<number>`count(*)` }).from(contactMessages).where(eq(contactMessages.isRead, false))

  // Top posts by views
  const topPosts = await db.select({
    id: posts.id, title: posts.title, slug: posts.slug,
    viewsCount: posts.viewsCount, publishedAt: posts.publishedAt,
  }).from(posts).where(eq(posts.status, 'published')).orderBy(desc(posts.viewsCount)).limit(5)

  // Recent posts
  const recentPosts = await db.select({
    id: posts.id, title: posts.title, slug: posts.slug,
    status: posts.status, createdAt: posts.createdAt,
  }).from(posts).orderBy(desc(posts.createdAt)).limit(5)

  return NextResponse.json({
    totalPosts: totalPosts.count,
    publishedPosts: publishedPosts.count,
    totalViews: totalViews.total || 0,
    totalComments: totalComments.count,
    totalLikes: totalLikes.count,
    totalUsers: totalUsers.count,
    totalSubscribers: totalSubscribers.count,
    unreadMessages: unreadMessages.count,
    topPosts,
    recentPosts,
  })
}
