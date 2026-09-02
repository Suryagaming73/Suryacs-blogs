import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { db } from '@/db'
import { contactMessages } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!(session?.user as any)?.role || (session?.user as any)?.role !== 'admin') {
    redirect('/')
  }

  const [{ count }] = await db.select({ count: sql<number>`count(*)` })
    .from(contactMessages).where(eq(contactMessages.isRead, false))

  return (
    <div className="dashboard-layout">
      <Sidebar unreadMessages={count} />
      <div className="dashboard-main">
        {children}
      </div>
    </div>
  )
}
