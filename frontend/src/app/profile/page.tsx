import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { ProfileForm } from '@/components/dashboard/ProfileForm'
import { Mail, Shield, ShieldCheck } from 'lucide-react'

export const metadata = {
  title: 'Profile Settings | Surya CS Portfolio',
}

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  // Fetch the latest profile data from the database
  const dbUser = await db.select().from(users).where(eq(users.id, session.user.id)).get()

  if (!dbUser) {
    redirect('/auth/login')
  }

  const initialData = {
    username: dbUser.username,
    bio: dbUser.bio || '',
    avatarUrl: dbUser.avatarUrl || null,
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 140px)', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: 500, padding: '3rem 2rem', textAlign: 'center' }}>
        
        <h1 className="font-heading" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Profile Settings</h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          <Mail size={14} /> <span>{dbUser.email}</span>
        </div>

        <div style={{ padding: '1rem', background: 'var(--bg-alt)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span style={{ fontWeight: 600 }}>Account Role</span>
          <span className="badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.75rem', borderRadius: '1rem', background: dbUser.role === 'admin' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(108, 92, 231, 0.1)', color: dbUser.role === 'admin' ? '#10b981' : 'var(--accent)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
            {dbUser.role === 'admin' ? <ShieldCheck size={14} /> : <Shield size={14} />}
            {dbUser.role}
          </span>
        </div>

        <ProfileForm initialData={initialData} />
      </div>
    </div>
  )
}
