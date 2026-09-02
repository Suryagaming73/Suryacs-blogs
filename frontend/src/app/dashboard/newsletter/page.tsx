'use client'
import { useState, useEffect } from 'react'
import { Mail, Trash2 } from 'lucide-react'

interface Sub { id: string; email: string; isActive: boolean; createdAt: string }

export default function AdminNewsletterPage() {
  const [subs, setSubs] = useState<Sub[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard/newsletter').then(r => r.json()).then(d => { setSubs(d.subscribers || []); setLoading(false) })
  }, [])

  async function del(id: string) {
    if (!confirm('Remove subscriber?')) return
    await fetch(`/api/dashboard/newsletter/${id}`, { method: 'DELETE' })
    setSubs(prev => prev.filter(s => s.id !== id))
  }

  const active = subs.filter(s => s.isActive)

  return (
    <div>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Newsletter</h1>
        <p className="dashboard-subtitle">{active.length} active subscriber{active.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="card-solid">
        <div className="data-table-wrap">
          <table className="data-table">
            <thead><tr><th>Email</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center' }}><span className="spinner spinner-accent" style={{ margin: '0 auto' }} /></td></tr>
              ) : subs.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No subscribers yet</td></tr>
              ) : subs.map(s => (
                <tr key={s.id}>
                  <td className="flex items-center gap-2"><Mail size={14} style={{ color: 'var(--text-faint)' }} /> {s.email}</td>
                  <td><span className={`badge ${s.isActive ? 'badge-success' : 'badge-muted'}`}>{s.isActive ? 'Active' : 'Unsubscribed'}</span></td>
                  <td className="text-faint text-sm">{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-danger btn-sm btn-icon" onClick={() => del(s.id)} id={`delete-sub-${s.id}`}><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
