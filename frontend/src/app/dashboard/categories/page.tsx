'use client'
import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit, Save, X } from 'lucide-react'
import { slugify } from '@/lib/utils'

interface Category { id: string; name: string; slug: string; description: string; icon: string; color: string; order: number }

export default function AdminCategoriesPage() {
  const [cats, setCats] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', description: '', icon: '', color: '#6c5ce7', order: 0 })
  const [editing, setEditing] = useState<Category | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => { setCats(d.categories || []); setLoading(false) })
  }, [])

  function set(k: string, v: any) { setForm(f => ({ ...f, [k]: v })) }

  async function save() {
    setSaving(true)
    const payload = editing ? { ...form, id: editing.id } : form
    const method = editing ? 'PUT' : 'POST'
    const res = await fetch('/api/categories', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) {
      const { category } = await res.json()
      if (editing) { setCats(prev => prev.map(c => c.id === editing.id ? category : c)) }
      else { setCats(prev => [...prev, category]) }
      setForm({ name: '', description: '', icon: '', color: '#6c5ce7', order: 0 })
      setEditing(null)
    }
    setSaving(false)
  }

  function startEdit(cat: Category) {
    setEditing(cat)
    setForm({ name: cat.name, description: cat.description, icon: cat.icon, color: cat.color, order: cat.order })
  }

  function cancelEdit() { setEditing(null); setForm({ name: '', description: '', icon: '', color: '#6c5ce7', order: 0 }) }

  async function del(id: string, name: string) {
    if (!confirm(`Delete category "${name}"?`)) return
    const res = await fetch('/api/categories', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    if (res.ok) setCats(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Categories</h1>
        <p className="dashboard-subtitle">Organize your content with categories</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>
        {/* List */}
        <div className="card-solid">
          <div className="data-table-wrap">
            <table className="data-table">
              <thead><tr><th>Icon</th><th>Name</th><th>Slug</th><th>Order</th><th>Actions</th></tr></thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center' }}><span className="spinner spinner-accent" style={{ margin: '0 auto' }} /></td></tr>
                ) : cats.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No categories yet</td></tr>
                ) : cats.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ width: 32, height: 32, borderRadius: 6, background: `${c.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>{c.icon || '📂'}</div>
                    </td>
                    <td>
                      <div className="font-medium">{c.name}</div>
                      {c.description && <div className="text-xs text-faint truncate" style={{ maxWidth: 200 }}>{c.description}</div>}
                    </td>
                    <td className="text-muted text-sm">{c.slug}</td>
                    <td className="text-muted text-sm">{c.order}</td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-ghost btn-sm btn-icon" onClick={() => startEdit(c)} id={`edit-cat-${c.id}`}><Edit size={14} /></button>
                        <button className="btn btn-danger btn-sm btn-icon" onClick={() => del(c.id, c.name)} id={`delete-cat-${c.id}`}><Trash2 size={14} /></button>
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
            {editing ? 'Edit Category' : 'Add Category'}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div className="input-wrap">
              <label className="input-label">Name *</label>
              <input className="input" placeholder="Category name" value={form.name} onChange={e => set('name', e.target.value)} id="cat-name" />
            </div>
            <div className="input-wrap">
              <label className="input-label">Description</label>
              <textarea className="input" rows={2} placeholder="Brief description..." value={form.description} onChange={e => set('description', e.target.value)} id="cat-description" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="input-wrap">
                <label className="input-label">Icon (emoji)</label>
                <input className="input" placeholder="📂" value={form.icon} onChange={e => set('icon', e.target.value)} id="cat-icon" style={{ fontSize: '1.25rem' }} />
              </div>
              <div className="input-wrap">
                <label className="input-label">Color</label>
                <div className="flex gap-2 items-center">
                  <input type="color" value={form.color} onChange={e => set('color', e.target.value)} style={{ width: 40, height: 40, border: 'none', cursor: 'pointer', background: 'none' }} id="cat-color" />
                  <input className="input" value={form.color} onChange={e => set('color', e.target.value)} style={{ fontFamily: 'monospace', fontSize: '0.8rem' }} />
                </div>
              </div>
            </div>
            <div className="input-wrap">
              <label className="input-label">Display Order</label>
              <input className="input" type="number" min={0} value={form.order} onChange={e => set('order', parseInt(e.target.value))} id="cat-order" />
            </div>
            <div className="flex gap-2">
              <button className="btn btn-primary" onClick={save} disabled={!form.name || saving} id="save-cat-btn">
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
