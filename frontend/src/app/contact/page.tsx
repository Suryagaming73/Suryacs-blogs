'use client'
import { Metadata } from 'next'
import { useState } from 'react'
import { Send, Mail, MapPin, Clock } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (res.ok) {
        setResult({ type: 'success', msg: data.message })
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setResult({ type: 'error', msg: data.error || 'Something went wrong' })
      }
    } catch { setResult({ type: 'error', msg: 'Network error. Please try again.' }) }
    finally { setLoading(false) }
  }

  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <div className="section-tag"><Mail size={12} /> Contact</div>
          <h1 className="section-title font-heading">Get in Touch</h1>
          <p className="section-desc">Have a question, feedback, or just want to say hi? We&apos;d love to hear from you.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem', alignItems: 'start', maxWidth: 900, margin: '0 auto' }}>
          {/* Form */}
          <div className="card" style={{ padding: '2rem' }}>
            {result && (
              <div className={`alert ${result.type === 'success' ? 'alert-success' : 'alert-error'} mb-6`}>
                {result.msg}
              </div>
            )}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-wrap">
                  <label className="input-label" htmlFor="contact-name">Name *</label>
                  <input id="contact-name" className="input" placeholder="Your name" value={form.name} onChange={e => set('name', e.target.value)} required />
                </div>
                <div className="input-wrap">
                  <label className="input-label" htmlFor="contact-email">Email *</label>
                  <input id="contact-email" type="email" className="input" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} required />
                </div>
              </div>
              <div className="input-wrap">
                <label className="input-label" htmlFor="contact-subject">Subject *</label>
                <input id="contact-subject" className="input" placeholder="What is this about?" value={form.subject} onChange={e => set('subject', e.target.value)} required />
              </div>
              <div className="input-wrap">
                <label className="input-label" htmlFor="contact-message">Message *</label>
                <textarea id="contact-message" className="input" rows={6} placeholder="Your message..." value={form.message} onChange={e => set('message', e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading} id="contact-submit-btn">
                {loading ? <span className="spinner" /> : <><Send size={16} /> Send Message</>}
              </button>
            </form>
          </div>

          {/* Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              { icon: Mail, title: 'Email', value: 'cssurya2006@gmail.com', color: '#6c5ce7' },
              { icon: Clock, title: 'Response Time', value: 'Within 24–48 hours', color: '#a855f7' },
              { icon: MapPin, title: 'Based in', value: '137, Bakthavatchalam Street, Rathinapuri, Coimbatore - 641027', color: '#10b981' },
            ].map(({ icon: Icon, title, value, color }) => (
              <div key={title} className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} color={color} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{title}</div>
                  <div className="text-muted text-sm">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
