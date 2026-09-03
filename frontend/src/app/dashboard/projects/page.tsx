'use client'
import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit, Save, X, ExternalLink } from 'lucide-react'

interface Project { id: string; name: string; tech: string; desc: string; link: string; icon: string; order: number }

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', tech: '', desc: '', link: '', icon: '📁', order: 0 })
  const [editing, setEditing] = useState<Project | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/projects').then(r => r.json()).then(d => { setProjects(d.projects || []); setLoading(false) })
  }, [])

  function set(k: string, v: any) { setForm(f => ({ ...f, [k]: v })) }

  async function save() {
    setSaving(true)
    const payload = editing ? { ...form, id: editing.id } : form
    const method = editing ? 'PUT' : 'POST'
    const res = await fetch('/api/projects', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) {
      const { project } = await res.json()
      if (editing) { setProjects(prev => prev.map(p => p.id === editing.id ? project : p)) }
      else { setProjects(prev => [...prev, project]) }
      cancelEdit()
    }
    setSaving(false)
  }

  function startEdit(p: Project) {
    setEditing(p)
    setForm({ name: p.name, tech: p.tech, desc: p.desc, link: p.link || '', icon: p.icon, order: p.order })
  }

  function cancelEdit() { setEditing(null); setForm({ name: '', tech: '', desc: '', link: '', icon: '📁', order: 0 }) }

  async function del(id: string, name: string) {
    if (!confirm(`Delete project "${name}"?`)) return
    const res = await fetch('/api/projects', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    if (res.ok) setProjects(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Projects</h1>
        <p className="dashboard-subtitle">Manage your portfolio projects</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>
        {/* List */}
        <div className="card-solid">
          <div className="data-table-wrap">
            <table className="data-table">
              <thead><tr><th>Project</th><th>Tech</th><th>Order</th><th>Actions</th></tr></thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center' }}><span className="spinner spinner-accent" style={{ margin: '0 auto' }} /></td></tr>
                ) : projects.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No projects yet</td></tr>
                ) : projects.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="flex gap-2 items-center">
                        <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {(p.icon?.startsWith('data:image') || p.icon?.startsWith('http')) ? (
                            <img src={p.icon} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                          ) : (
                            <span style={{ fontSize: '1.25rem' }}>{p.icon}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{p.name}</div>
                          {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="text-xs text-accent flex items-center gap-1">Link <ExternalLink size={10} /></a>}
                        </div>
                      </div>
                    </td>
                    <td className="text-sm text-muted" style={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.tech}</td>
                    <td className="py-3 px-4 text-muted text-sm">{p.order}</td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-ghost btn-sm btn-icon" onClick={() => startEdit(p)} title="Edit"><Edit size={14} /></button>
                        <button className="btn btn-danger btn-sm btn-icon" onClick={() => del(p.id, p.name)} title="Delete"><Trash2 size={14} /></button>
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
            {editing ? 'Edit Project' : 'Add Project'}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div className="input-wrap">
              <label className="input-label">Project Name *</label>
              <input className="input" placeholder="e.g. DentalExperts" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div className="input-wrap">
              <label className="input-label">Tech Stack *</label>
              <input className="input" placeholder="e.g. React, Node.js" value={form.tech} onChange={e => set('tech', e.target.value)} />
            </div>
            <div className="input-wrap">
              <label className="input-label">Description *</label>
              <textarea className="input" rows={3} placeholder="Describe the project..." value={form.desc} onChange={e => set('desc', e.target.value)} />
            </div>
            <div className="input-wrap">
              <label className="input-label">Live Link URL</label>
              <input className="input" placeholder="https://..." value={form.link} onChange={e => set('link', e.target.value)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="input-wrap">
                <label className="input-label">Thumbnail Image</label>
                {(form.icon?.startsWith('data:image') || form.icon?.startsWith('http')) ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src={form.icon} alt="thumbnail" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => set('icon', '')}>Remove</button>
                  </div>
                ) : (
                  <input type="file" className="input" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = (ev) => {
                        set('icon', ev.target?.result as string)
                      }
                      reader.readAsDataURL(file)
                    }
                  }} />
                )}
              </div>
              <div className="input-wrap">
                <label className="input-label">Display Order</label>
                <input className="input" type="number" min={0} value={form.order} onChange={e => set('order', parseInt(e.target.value))} />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="btn btn-primary" onClick={save} disabled={!form.name || !form.tech || !form.desc || saving}>
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
