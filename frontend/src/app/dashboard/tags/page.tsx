'use client'
import { useState, useEffect } from 'react'
import { Plus, Trash2, Save } from 'lucide-react'

interface Tag { id: string; name: string; slug: string }

export default function AdminTagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/tags').then(r => r.json()).then(d => { setTags(d.tags || []); setLoading(false) })
  }, [])

  async function save() {
    if (!name.trim()) return
    setSaving(true)
    const res = await fetch('/api/tags', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) })
    if (res.ok) {
      const { tag } = await res.json()
      setTags(prev => [...prev, tag])
      setName('')
    }
    setSaving(false)
  }

  async function del(id: string, tagName: string) {
    if (!confirm(`Delete tag "#${tagName}"?`)) return
    const res = await fetch('/api/tags', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    if (res.ok) setTags(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Tags</h1>
        <p className="dashboard-subtitle">{tags.length} tags</p>
      </div>

      {/* Add Tag */}
      <div className="card-solid" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <input className="input" style={{ flex: 1 }} placeholder="New tag name..." value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && save()} id="new-tag-name" />
        <button className="btn btn-primary" onClick={save} disabled={!name || saving} id="add-tag-btn">
          {saving ? <span className="spinner" /> : <><Plus size={15} /> Add Tag</>}
        </button>
      </div>

      {/* Tag Grid */}
      {loading ? (
        <div className="skeleton" style={{ height: 200, borderRadius: 'var(--radius)' }} />
      ) : (
        <div className="tag-cloud">
          {tags.map(t => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '0.3rem 0.65rem 0.3rem 0.875rem' }}>
              <span className="text-sm font-medium">#{t.name}</span>
              <button className="btn-icon" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)', padding: 2, borderRadius: 4 }} onClick={() => del(t.id, t.name)} id={`delete-tag-${t.id}`}>
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          {tags.length === 0 && <p className="text-muted">No tags yet. Add one above!</p>}
        </div>
      )}
    </div>
  )
}
