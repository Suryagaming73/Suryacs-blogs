'use client'
import { useState, useEffect } from 'react'
import { Mail, Check, Trash2 } from 'lucide-react'

interface Message {
  id: string; name: string; email: string; subject: string; message: string; isRead: boolean; createdAt: string
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Message | null>(null)

  useEffect(() => {
    fetch('/api/dashboard/messages').then(r => r.json()).then(d => { setMessages(d.messages || []); setLoading(false) })
  }, [])

  async function markRead(id: string) {
    await fetch(`/api/dashboard/messages/${id}/read`, { method: 'POST' })
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m))
  }

  async function del(id: string) {
    if (!confirm('Delete this message?')) return
    await fetch(`/api/dashboard/messages/${id}`, { method: 'DELETE' })
    setMessages(prev => prev.filter(m => m.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  function open(msg: Message) {
    setSelected(msg)
    if (!msg.isRead) markRead(msg.id)
  }

  return (
    <div>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Contact Messages</h1>
        <p className="dashboard-subtitle">{messages.filter(m => !m.isRead).length} unread</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* List */}
        <div className="card-solid" style={{ maxHeight: 600, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}><span className="spinner spinner-accent" style={{ margin: '0 auto' }} /></div>
          ) : messages.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">📭</div><h3>No messages yet</h3></div>
          ) : messages.map(msg => (
            <button
              key={msg.id}
              onClick={() => open(msg)}
              style={{ width: '100%', textAlign: 'left', padding: '1rem', borderBottom: '1px solid var(--border)', background: selected?.id === msg.id ? 'var(--surface-hover)' : 'none', border: 'none', cursor: 'pointer' }}
              id={`msg-${msg.id}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">{msg.name}</span>
                {!msg.isRead && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', display: 'block' }} />}
              </div>
              <div className="text-sm text-muted truncate">{msg.subject}</div>
              <div className="text-xs text-faint mt-1">{new Date(msg.createdAt).toLocaleDateString()}</div>
            </button>
          ))}
        </div>

        {/* Detail */}
        {selected ? (
          <div className="card-solid" style={{ padding: '1.5rem' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>{selected.subject}</h2>
              <div className="flex gap-2">
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="btn btn-secondary btn-sm">
                  <Mail size={14} /> Reply
                </a>
                <button className="btn btn-danger btn-sm" onClick={() => del(selected.id)}><Trash2 size={14} /> Delete</button>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4 text-sm text-muted">
              <span><strong>{selected.name}</strong> &lt;{selected.email}&gt;</span>
              <span>·</span>
              <span>{new Date(selected.createdAt).toLocaleString()}</span>
            </div>
            <div className="divider" />
            <p style={{ lineHeight: 1.75, whiteSpace: 'pre-wrap', marginTop: '1rem' }}>{selected.message}</p>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon"><Mail size={48} /></div>
            <h3>Select a message</h3>
            <p>Click a message on the left to read it</p>
          </div>
        )}
      </div>
    </div>
  )
}
