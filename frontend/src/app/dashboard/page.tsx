import { Metadata } from 'next'
import Link from 'next/link'
import { db } from '@/db'
import { posts, comments, postLikes, users, subscribers, contactMessages } from '@/db/schema'
import { eq, sql, desc } from 'drizzle-orm'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { ViewsChart } from '@/components/dashboard/ViewsChart'
import { FileText, Eye, Heart, MessageSquare, Users, Mail, Inbox, Edit } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = { title: 'Dashboard' }

async function getStats() {
  const [totalPosts] = await db.select({ count: sql<number>`count(*)` }).from(posts)
  const [publishedPosts] = await db.select({ count: sql<number>`count(*)` }).from(posts).where(eq(posts.status, 'published'))
  const [totalViews] = await db.select({ total: sql<number>`coalesce(sum(views_count),0)` }).from(posts)
  const [totalComments] = await db.select({ count: sql<number>`count(*)` }).from(comments)
  const [totalLikes] = await db.select({ count: sql<number>`count(*)` }).from(postLikes)
  const [totalUsers] = await db.select({ count: sql<number>`count(*)` }).from(users)
  const [totalSubs] = await db.select({ count: sql<number>`count(*)` }).from(subscribers).where(eq(subscribers.isActive, true))
  const [unread] = await db.select({ count: sql<number>`count(*)` }).from(contactMessages).where(eq(contactMessages.isRead, false))

  const recentPosts = await db.select({
    id: posts.id, title: posts.title, slug: posts.slug,
    status: posts.status, viewsCount: posts.viewsCount, createdAt: posts.createdAt,
  }).from(posts).orderBy(desc(posts.createdAt)).limit(5)

  const topPosts = await db.select({
    id: posts.id, title: posts.title, slug: posts.slug, viewsCount: posts.viewsCount,
  }).from(posts).where(eq(posts.status, 'published')).orderBy(desc(posts.viewsCount)).limit(5)

  return {
    totalPosts: totalPosts.count,
    publishedPosts: publishedPosts.count,
    totalViews: totalViews.total,
    totalComments: totalComments.count,
    totalLikes: totalLikes.count,
    totalUsers: totalUsers.count,
    totalSubs: totalSubs.count,
    unread: unread.count,
    recentPosts,
    topPosts,
  }
}

export default async function DashboardPage() {
  const stats = await getStats()

  return (
    <div>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Welcome back! Here&apos;s what&apos;s happening.</p>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <Link href="/dashboard/posts/new" className="btn btn-primary">
          <FileText size={16} /> New Post
        </Link>
        <Link href="/dashboard/posts" className="btn btn-ghost">
          Manage Posts
        </Link>
        <Link href="/dashboard/messages" className="btn btn-ghost">
          <Inbox size={16} /> Messages {stats.unread > 0 && <span className="badge badge-danger">{stats.unread}</span>}
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard label="Total Posts" value={stats.totalPosts} icon={FileText} color="#6c5ce7" />
        <StatsCard label="Published" value={stats.publishedPosts} icon={FileText} color="#22d3ee" />
        <StatsCard label="Total Views" value={stats.totalViews} icon={Eye} color="#a855f7" />
        <StatsCard label="Comments" value={stats.totalComments} icon={MessageSquare} color="#10b981" />
        <StatsCard label="Likes" value={stats.totalLikes} icon={Heart} color="#f43f5e" />
        <StatsCard label="Users" value={stats.totalUsers} icon={Users} color="#f59e0b" />
        <StatsCard label="Subscribers" value={stats.totalSubs} icon={Mail} color="#06b6d4" />
        <StatsCard label="Unread Messages" value={stats.unread} icon={Inbox} color="#fb7185" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Recent Posts */}
        <div className="card-solid" style={{ padding: '1.5rem' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.1rem', fontWeight: 700 }}>Recent Posts</h2>
            <Link href="/dashboard/posts" className="text-sm text-accent">View all</Link>
          </div>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead><tr><th>Title</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {stats.recentPosts.map(p => (
                  <tr key={p.id}>
                    <td style={{ maxWidth: 200 }}>
                      <div className="truncate font-medium" style={{ maxWidth: 180 }}>{p.title}</div>
                    </td>
                    <td>
                      <span className={`badge ${p.status === 'published' ? 'badge-success' : p.status === 'draft' ? 'badge-warning' : 'badge-muted'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="text-faint">{formatDate(p.createdAt || '', { month: 'short', day: 'numeric' })}</td>
                    <td>
                      <Link href={`/dashboard/posts/${p.slug}/edit`} className="btn btn-ghost btn-sm btn-icon" title="Edit">
                        <Edit size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Posts */}
        <div className="card-solid" style={{ padding: '1.5rem' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.1rem', fontWeight: 700 }}>Top Posts by Views</h2>
          </div>
          <ViewsChart data={stats.topPosts.map(p => ({ title: p.title, views: p.viewsCount || 0 }))} />
        </div>
      </div>
    </div>
  )
}
