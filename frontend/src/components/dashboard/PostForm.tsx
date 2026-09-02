'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { Save, Eye, ArrowLeft, Upload, X, Plus } from 'lucide-react'
import Link from 'next/link'

const PostEditor = dynamic(() => import('@/components/dashboard/PostEditor').then(m => ({ default: m.PostEditor })), {
  ssr: false,
  loading: () => <div className="skeleton" style={{ height: 400, borderRadius: 'var(--radius)' }} />,
})

interface Category { id: string; name: string; slug: string }
interface Tag { id: string; name: string; slug: string }

interface PostFormProps {
  initialData?: {
    title?: string; content?: string; excerpt?: string;
    featuredImageUrl?: string | null; categoryId?: string | null;
    status?: string; isFeatured?: boolean; externalLink?: string | null;
    metaTitle?: string; metaDescription?: string;
    tagIds?: string[]; slug?: string;
  }
  mode: 'create' | 'edit'
  slug?: string
}

export function PostForm({ initialData, mode, slug }: PostFormProps) {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [form, setForm] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    featuredImageUrl: initialData?.featuredImageUrl || '',
    categoryId: initialData?.categoryId || '',
    externalLink: initialData?.externalLink || '',
    status: initialData?.status || 'draft',
    isFeatured: initialData?.isFeatured || false,
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || '',
    tagIds: initialData?.tagIds || [] as string[],
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => setCategories(d.categories || []))
    fetch('/api/tags').then(r => r.json()).then(d => setTags(d.tags || []))
  }, [])

  function set(k: string, v: any) { setForm(f => ({ ...f, [k]: v })) }

  function toggleTag(id: string) {
    setForm(f => ({
      ...f,
      tagIds: f.tagIds.includes(id) ? f.tagIds.filter(t => t !== id) : [...f.tagIds, id],
    }))
  }

  async function createTag() {
    if (!newTag.trim()) return
    const res = await fetch('/api/tags', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newTag }) })
    if (res.ok) {
      const { tag } = await res.json()
      setTags(t => [...t, tag])
      setForm(f => ({ ...f, tagIds: [...f.tagIds, tag.id] }))
      setNewTag('')
    }
  }

  async function handleSave(saveStatus?: string) {
    setError(''); setSaving(true)
    const payload = { ...form, status: saveStatus || form.status }
    try {
      const url = mode === 'edit' ? `/api/posts/${slug}` : '/api/posts'
      const method = mode === 'edit' ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Save failed'); return }
      setSuccess('Saved successfully!')
      if (mode === 'create') {
        router.push(`/dashboard/posts/${data.post.slug}/edit`)
      } else {
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch { setError('Network error. Please retry.') }
    finally { setSaving(false) }
  }

  return (
    <div>
      <div className="dashboard-header">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/dashboard/posts" className="btn btn-ghost btn-sm"><ArrowLeft size={15} /></Link>
          <h1 className="dashboard-title">{mode === 'create' ? 'New Post' : 'Edit Post'}</h1>
        </div>
      </div>

      {error && <div className="alert alert-error mb-4">{error}</div>}
      {success && <div className="alert alert-success mb-4">{success}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start' }}>
        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Title */}
          <div className="input-wrap">
            <label className="input-label" htmlFor="post-title">Title *</label>
            <input id="post-title" className="input" style={{ fontSize: '1.1rem', fontWeight: 600 }} placeholder="Enter post title..." value={form.title} onChange={e => set('title', e.target.value)} required />
          </div>

          {/* Rich Editor */}
          <div>
            <div className="input-label mb-2">Content</div>
            <PostEditor value={form.content} onChange={v => set('content', v)} />
          </div>

          {/* Excerpt */}
          <div className="input-wrap">
            <label className="input-label" htmlFor="post-excerpt">Excerpt (auto-generated if empty)</label>
            <textarea id="post-excerpt" className="input" rows={3} placeholder="Brief summary..." value={form.excerpt} onChange={e => set('excerpt', e.target.value)} />
          </div>

          {/* SEO */}
          <div className="card-solid" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, marginBottom: '1rem' }}>SEO</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div className="input-wrap">
                <label className="input-label" htmlFor="meta-title">Meta Title</label>
                <input id="meta-title" className="input" placeholder="SEO title (defaults to post title)" value={form.metaTitle} onChange={e => set('metaTitle', e.target.value)} />
              </div>
              <div className="input-wrap">
                <label className="input-label" htmlFor="meta-desc">Meta Description</label>
                <textarea id="meta-desc" className="input" rows={2} placeholder="SEO description..." value={form.metaDescription} onChange={e => set('metaDescription', e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'sticky', top: '1rem' }}>
          {/* Publish Actions */}
          <div className="card-solid" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, marginBottom: '1rem' }}>Publish</h3>
            <select className="input mb-3" value={form.status} onChange={e => set('status', e.target.value)} id="post-status">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <div className="flex gap-2 flex-col">
              <button className="btn btn-primary" onClick={() => handleSave('published')} disabled={saving} id="publish-post-btn">
                {saving ? <span className="spinner" /> : <><Eye size={15} /> Publish</>}
              </button>
              <button className="btn btn-ghost" onClick={() => handleSave('draft')} disabled={saving} id="save-draft-btn">
                {saving ? <span className="spinner" /> : <><Save size={15} /> Save Draft</>}
              </button>
              {form.status === 'published' && slug && (
                <Link href={`/blog/${slug}`} target="_blank" className="btn btn-secondary btn-sm" style={{ textAlign: 'center' }}>
                  <Eye size={14} /> View Post
                </Link>
              )}
            </div>
          </div>

          {/* Featured Image */}
          <div className="card-solid" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, marginBottom: '1rem' }}>Featured Image</h3>
            {form.featuredImageUrl && (
              <div style={{ position: 'relative', marginBottom: '0.75rem', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <img src={form.featuredImageUrl} alt="" style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                <button onClick={() => set('featuredImageUrl', '')} style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', padding: 4, cursor: 'pointer', color: '#fff' }}>
                  <X size={14} />
                </button>
              </div>
            )}
            <input id="post-image-url" className="input" placeholder="Image URL..." value={form.featuredImageUrl} onChange={e => set('featuredImageUrl', e.target.value)} />
          </div>

          {/* Category */}
          <div className="card-solid" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, marginBottom: '1rem' }}>Category</h3>
            <select className="input" value={form.categoryId} onChange={e => set('categoryId', e.target.value)} id="post-category">
              <option value="">No category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* Tags */}
          <div className="card-solid" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, marginBottom: '0.75rem' }}>Tags</h3>
            <div className="tag-cloud" style={{ marginBottom: '0.75rem' }}>
              {tags.map(t => (
                <button key={t.id} className={`tag-pill ${form.tagIds.includes(t.id) ? 'active' : ''}`} onClick={() => toggleTag(t.id)} type="button">
                  #{t.name}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input className="input" style={{ fontSize: '0.8rem', padding: '0.35rem 0.625rem' }} placeholder="New tag..." value={newTag} onChange={e => setNewTag(e.target.value)} onKeyDown={e => e.key === 'Enter' && createTag()} id="new-tag-input" />
              <button type="button" className="btn btn-secondary btn-sm" onClick={createTag}><Plus size={14} /></button>
            </div>
          </div>

          {/* Options */}
          <div className="card-solid" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, marginBottom: '1rem' }}>Options</h3>
            <label className="flex items-center gap-2 cursor-pointer mb-3">
              <input type="checkbox" checked={form.isFeatured} onChange={e => set('isFeatured', e.target.checked)} id="post-featured" />
              <span className="text-sm font-medium">Mark as Featured</span>
            </label>
            <div className="input-wrap">
              <label className="input-label" htmlFor="post-external-link">External Link (Read More)</label>
              <input id="post-external-link" className="input" placeholder="https://..." value={form.externalLink} onChange={e => set('externalLink', e.target.value)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
