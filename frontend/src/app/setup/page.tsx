'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, User, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function SetupPage() {
  const router = useRouter()
  const [needsSetup, setNeedsSetup] = useState<boolean | null>(null)
  const [form, setForm] = useState({ email: '', username: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetch('/api/setup').then(r => r.json()).then(d => setNeedsSetup(d.needsSetup))
  }, [])

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setLoading(true)
    const res = await fetch('/api/setup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      setSuccess(true)
      setTimeout(() => router.push('/auth/login'), 2000)
    } else {
      setError(data.error || 'Setup failed')
    }
  }

  if (needsSetup === null) return (
    <div className="auth-page"><div className="spinner spinner-accent spinner-lg" /></div>
  )

  if (!needsSetup) return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <Shield size={48} style={{ color: 'var(--accent)', margin: '0 auto 1rem' }} />
        <h1 className="auth-title">Setup Complete</h1>
        <p className="text-muted mb-6">An admin account already exists. Please sign in.</p>
        <a href="/auth/login" className="btn btn-primary">Go to Login</a>
      </div>
    </div>
  )

  if (success) return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <Shield size={48} style={{ color: 'var(--success)', margin: '0 auto 1rem' }} />
        <h1 className="auth-title">Admin Created!</h1>
        <p className="text-muted">Redirecting to login...</p>
      </div>
    </div>
  )

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <Shield size={40} style={{ color: 'var(--accent)', marginBottom: '1rem' }} />
        <div className="auth-logo">BlogCraft Setup</div>
        <h1 className="auth-title">Create Admin Account</h1>
        <p className="auth-subtitle">This one-time setup creates the first administrator.</p>

        {error && <div className="alert alert-error mb-4">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="input-wrap">
            <label className="input-label" htmlFor="setup-email">Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
              <input id="setup-email" type="email" className="input" style={{ paddingLeft: '2.5rem' }} value={form.email} onChange={e => set('email', e.target.value)} required autoFocus />
            </div>
          </div>
          <div className="input-wrap">
            <label className="input-label" htmlFor="setup-username">Username</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
              <input id="setup-username" type="text" className="input" style={{ paddingLeft: '2.5rem' }} value={form.username} onChange={e => set('username', e.target.value)} required />
            </div>
          </div>
          <div className="input-wrap">
            <label className="input-label" htmlFor="setup-password">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
              <input id="setup-password" type={showPw ? 'text' : 'password'} className="input" style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }} value={form.password} onChange={e => set('password', e.target.value)} required minLength={6} />
              <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)' }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} id="setup-submit-btn">
            {loading ? <span className="spinner" /> : <><Shield size={16} /> Create Admin Account</>}
          </button>
        </form>
      </div>
    </div>
  )
}
