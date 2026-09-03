'use client'

import { useState } from 'react'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  async function subscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      setMsg(data.message || data.error || 'Subscribed!')
      setEmail('')
    } catch {
      setMsg('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
      <form onSubmit={subscribe} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <input 
          type="email" 
          name="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address" 
          required 
          style={{ flex: '1 1 200px', padding: '0.75rem 1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)' }} 
        />
        <button type="submit" className="btn btn-primary" style={{ flex: '1 1 120px' }} disabled={loading}>
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      {msg && <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--accent)' }}>{msg}</p>}
    </div>
  )
}
