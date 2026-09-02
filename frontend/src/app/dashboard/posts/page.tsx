'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PlusCircle, Edit, Trash2, Eye, EyeOff, Search } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Post {
  id: string; title: string; slug: string; status: string;
  isFeatured: boolean; viewsCount: number; createdAt: string | null; publishedAt: string | null;
  categoryName: string | null;
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const LIMIT = 20

  async function fetchPosts() {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: String(LIMIT), status })
    if (search) params.set('search', search)
    const res = await fetch(`/api/posts?${params}`)
    const data = await res.json()
    setPosts(data.posts || [])
    setTotal(data.total || 0)
    setLoading(false)
  }

  useEffect(() => { fetchPosts() }, [page, status, search])

  async function deletePost(slug: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    const res = await fetch(`/api/posts/${slug}`, { method: 'DELETE' })
    if (res.ok) {
      setPosts(prev => prev.filter(p => p.slug !== slug))
      setTotal(t => t - 1)
    }
  }

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Posts</h1>
        <p className="dashboard-subtitle">{total} total posts</p>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <Link href="/dashboard/posts/new" className="btn btn-primary">
          <PlusCircle size={16} /> New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
          <Search size={15} className="search-bar-icon" />
          <input className="input" style={{ paddingLeft: '2.5rem' }} placeholder="Search posts..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} id="posts-search" />
        </div>
        <select className="input" style={{ width: 'auto' }} value={status} onChange={e => { setStatus(e.target.value); setPage(1) }} id="posts-status-filter">
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: 400, borderRadius: 'var(--radius)' }} />
      ) : (
        <div className="card-solid">
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Views</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No posts found</td></tr>
                ) : posts.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ maxWidth: 280 }}>
                        <div className="font-medium truncate">{p.title}</div>
                        {p.isFeatured && <span className="badge badge-accent" style={{ marginTop: 4, fontSize: '0.65rem' }}>⭐ Featured</span>}
                      </div>
                    </td>
                    <td className="text-muted text-sm">{p.categoryName || '—'}</td>
                    <td>
                      <span className={`badge ${p.status === 'published' ? 'badge-success' : p.status === 'draft' ? 'badge-warning' : 'badge-muted'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="text-muted text-sm">{p.viewsCount || 0}</td>
                    <td className="text-faint text-sm">{formatDate(p.publishedAt || p.createdAt || '', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td>
                      <div className="flex gap-2">
                        <Link href={`/blog/${p.slug}`} target="_blank" className="btn btn-ghost btn-sm btn-icon" title="View"><Eye size={14} /></Link>
                        <Link href={`/dashboard/posts/${p.slug}/edit`} className="btn btn-ghost btn-sm btn-icon" title="Edit" id={`edit-post-${p.id}`}><Edit size={14} /></Link>
                        <button className="btn btn-danger btn-sm btn-icon" title="Delete" onClick={() => deletePost(p.slug, p.title)} id={`delete-post-${p.id}`}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination" style={{ padding: '1rem' }}>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} className={`page-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
