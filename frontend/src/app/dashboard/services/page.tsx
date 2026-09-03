'use client'
import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit, Save, X } from 'lucide-react'

interface Service { id: string; title: string; desc: string; icon: string; order: number }

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title: '', desc: '', icon: '✨', order: 0 })
  const [editing, setEditing] = useState<Service | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/services').then(r => r.json()).then(d => { setServices(d.services || []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  function set(k: string, v: any) { setForm(f => ({ ...f, [k]: v })) }

  async function save() {
    setSaving(true)
    const payload = editing ? { ...form, id: editing.id } : form
    const method = editing ? 'PUT' : 'POST'
    const res = await fetch('/api/services', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) {
      const { service } = await res.json()
      if (editing) { setServices(prev => prev.map(s => s.id === editing.id ? service : s)) }
      else { setServices(prev => [...prev, service]) }
      cancelEdit()
    }
    setSaving(false)
  }

  function startEdit(s: Service) {
    setEditing(s)
    setForm({ title: s.title, desc: s.desc, icon: s.icon, order: s.order })
  }

  function cancelEdit() { setEditing(null); setForm({ title: '', desc: '', icon: '✨', order: 0 }) }

  async function del(id: string, title: string) {
    if (!confirm(`Delete service "${title}"?`)) return
    const res = await fetch('/api/services', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    if (res.ok) setServices(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Services</h1>
        <p className="dashboard-subtitle">Manage your professional services</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>
        {/* List */}
        <div className="card-solid">
          <div className="data-table-wrap">
            <table className="data-table">
              <thead><tr><th>Service</th><th>Order</th><th>Actions</th></tr></thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={3} style={{ padding: '2rem', textAlign: 'center' }}><span className="spinner spinner-accent" style={{ margin: '0 auto' }} /></td></tr>
                ) : services.length === 0 ? (
                  <tr><td colSpan={3} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No services yet</td></tr>
                ) : services.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div className="flex gap-2 items-center">
                        <span style={{ fontSize: '1.25rem' }}>{s.icon}</span>
                        <div>
                          <div className="font-medium">{s.title}</div>
                          <div className="text-xs text-muted truncate" style={{ maxWidth: 200 }}>{s.desc}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-muted text-sm">{s.order}</td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-ghost btn-sm btn-icon" onClick={() => startEdit(s)} title="Edit"><Edit size={14} /></button>
                        <button className="btn btn-danger btn-sm btn-icon" onClick={() => del(s.id, s.title)} title="Delete"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Form */}
        <div className="card-solid" style={{ padding: '1.5rem', position: 'sticky', top: '1rem' }}>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, marginBottom: '1rem' }}>
            {editing ? 'Edit Service' : 'Add Service'}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div className="input-wrap">
              <label className="input-label">Service Title *</label>
              <input className="input" placeholder="e.g. Full-Stack Web Development" value={form.title} onChange={e => set('title', e.target.value)} />
            </div>
            <div className="input-wrap">
              <label className="input-label">Description *</label>
              <textarea className="input" rows={4} placeholder="Describe the service..." value={form.desc} onChange={e => set('desc', e.target.value)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="input-wrap">
                <label className="input-label">Icon (emoji)</label>
                <input className="input" placeholder="✨" value={form.icon} onChange={e => set('icon', e.target.value)} style={{ fontSize: '1.25rem' }} />
              </div>
              <div className="input-wrap">
                <label className="input-label">Display Order</label>
                <input className="input" type="number" min={0} value={form.order} onChange={e => set('order', parseInt(e.target.value))} />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="btn btn-primary" onClick={save} disabled={!form.title || !form.desc || saving}>
                {saving ? <span className="spinner" /> : <><Save size={14} /> {editing ? 'Update' : 'Add'}</>}
              </button>
              {editing && (
                <button className="btn btn-ghost" onClick={cancelEdit}><X size={14} /> Cancel</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
