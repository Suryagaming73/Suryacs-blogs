import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { User as UserIcon, Mail, Shield, ShieldCheck } from 'lucide-react'

export const metadata = {
  title: 'Profile Settings | Surya CS Portfolio',
}

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/auth/login')
  }

  const user = session.user as any

  return (
    <div style={{ minHeight: 'calc(100vh - 140px)', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: 500, padding: '3rem 2rem', textAlign: 'center' }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          {user.image ? (
            <img src={user.image} alt="Profile Avatar" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent)' }} referrerPolicy="no-referrer" />
          ) : (
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--border)' }}>
              <UserIcon size={32} color="var(--text-muted)" />
            </div>
          )}
        </div>

        <h1 className="font-heading" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{user.name}</h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          <Mail size={14} /> <span>{user.email}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
          <div style={{ padding: '1rem', background: 'var(--bg-alt)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600 }}>Account Role</span>
            <span className="badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.75rem', borderRadius: '1rem', background: user.role === 'admin' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(108, 92, 231, 0.1)', color: user.role === 'admin' ? '#10b981' : 'var(--accent)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
              {user.role === 'admin' ? <ShieldCheck size={14} /> : <Shield size={14} />}
              {user.role}
            </span>
          </div>

          <div style={{ padding: '1rem', background: 'var(--bg-alt)', borderRadius: 'var(--radius-sm)' }}>
            <p className="text-sm text-muted mb-0">
              Your profile is currently managed through your authentication provider. To change your profile picture or email address, please update your settings with Google or your respective provider.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
