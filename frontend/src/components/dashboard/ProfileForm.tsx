'use client'
import { useState } from 'react'
import { Save, User as UserIcon, Upload, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface ProfileFormProps {
  initialData: {
    username: string
    bio: string
    avatarUrl: string | null
  }
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [form, setForm] = useState(initialData)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const router = useRouter()
  const { update } = useSession()

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
        // Force NextAuth session update to pick up new changes if possible, or router.refresh()
        await update() 
        router.refresh()
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile.' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error occurred.' })
    } finally {
      setSaving(false)
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }
  }

  return (
    <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left', marginTop: '1.5rem' }} onSubmit={handleSave}>
      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <div style={{ position: 'relative' }}>
          {form.avatarUrl ? (
            <img src={form.avatarUrl} alt="Avatar" style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent)' }} />
          ) : (
            <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--border)' }}>
              <UserIcon size={36} color="var(--text-muted)" />
            </div>
          )}
          <label style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--accent)', color: '#fff', borderRadius: '50%', padding: '6px', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
            <Upload size={14} />
            <input type="file" style={{ display: 'none' }} accept="image/*" onChange={e => {
              const file = e.target.files?.[0]
              if (file) {
                const reader = new FileReader()
                reader.onload = ev => setForm(f => ({ ...f, avatarUrl: ev.target?.result as string }))
                reader.readAsDataURL(file)
              }
            }} />
          </label>
        </div>
      </div>

      <div className="input-wrap">
        <label className="input-label" htmlFor="username">Username</label>
        <input className="input" id="username" name="username" value={form.username} onChange={handleChange} required />
      </div>

      <div className="input-wrap">
        <label className="input-label" htmlFor="bio">Bio</label>
        <textarea className="input" id="bio" name="bio" rows={4} value={form.bio} onChange={handleChange} placeholder="Tell us about yourself..." />
      </div>

      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? <span className="spinner" /> : <Save size={16} />}
        {saving ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  )
}
