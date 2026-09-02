'use client'
import { useState, useEffect } from 'react'
import { Trash2, Plus } from 'lucide-react'

interface Comment {
  id: string; content: string; createdAt: string;
  authorName: string | null; postTitle?: string; postSlug?: string;
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard/comments')
      .then(r => r.json())
      .then(d => { setComments(d.comments || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function del(id: string) {
    if (!confirm('Delete this comment?')) return
    const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' })
    if (res.ok) setComments(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Comments</h1>
        <p className="dashboard-subtitle">{comments.length} total comments</p>
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: 300, borderRadius: 'var(--radius)' }} />
      ) : (
        <div className="card-solid">
          <div className="data-table-wrap">
            <table className="data-table">
              <thead><tr><th>Comment</th><th>Author</th><th>Post</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {comments.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No comments yet</td></tr>
                ) : comments.map(c => (
                  <tr key={c.id}>
                    <td style={{ maxWidth: 300 }}>
                      <div className="truncate text-sm">{c.content}</div>
                    </td>
                    <td className="text-muted text-sm">{c.authorName || '—'}</td>
                    <td className="text-muted text-sm">{c.postSlug ? <a href={`/blog/${c.postSlug}`} className="text-accent" target="_blank">{c.postTitle || c.postSlug}</a> : '—'}</td>
                    <td className="text-faint text-sm">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-danger btn-sm btn-icon" onClick={() => del(c.id)} id={`delete-comment-${c.id}`}><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
