'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { formatDate, getInitials } from '@/lib/utils'
import { Send, Trash2, CornerDownRight, MessageSquare } from 'lucide-react'

interface Comment {
  id: string
  content: string
  parentId: string | null
  createdAt: string
  authorId: string
  authorName: string | null
  authorAvatar: string | null
  replies?: Comment[]
}

export function CommentSection({ slug }: { slug: string }) {
  const { data: session } = useSession()
  const user = session?.user as any
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch(`/api/posts/${slug}/comments`)
      .then(r => r.json())
      .then(d => { setComments(d.comments || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [slug])

  async function submitComment(content: string, parentId?: string) {
    if (!content.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/posts/${slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, parentId }),
      })
      if (res.ok) {
        const { comment } = await res.json()
        if (parentId) {
          setComments(prev => prev.map(c =>
            c.id === parentId
              ? { ...c, replies: [...(c.replies || []), comment] }
              : c
          ))
          setReplyTo(null)
          setReplyText('')
        } else {
          setComments(prev => [{ ...comment, replies: [] }, ...prev])
          setText('')
        }
      }
    } finally {
      setSubmitting(false)
    }
  }

  async function deleteComment(id: string, parentId?: string) {
    const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' })
    if (res.ok) {
      if (parentId) {
        setComments(prev => prev.map(c =>
          c.id === parentId
            ? { ...c, replies: (c.replies || []).filter(r => r.id !== id) }
            : c
        ))
      } else {
        setComments(prev => prev.filter(c => c.id !== id))
      }
    }
  }

  const canDelete = (authorId: string) => user?.role === 'admin' || user?.id === authorId

  function CommentItem({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) {
    return (
      <div className={`comment-item ${isReply ? 'reply' : ''}`}>
        <div className="comment-header">
          <div className="comment-author">
            {comment.authorAvatar ? (
              <img src={comment.authorAvatar} alt="" width={28} height={28} style={{ borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <span className="avatar avatar-sm">{getInitials(comment.authorName || 'U')}</span>
            )}
            <span>{comment.authorName || 'Anonymous'}</span>
          </div>
          <span className="comment-date">{formatDate(comment.createdAt, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
        <p className="comment-content">{comment.content}</p>
        <div className="comment-actions">
          {!isReply && session && (
            <button className="comment-action-btn" onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)} id={`reply-btn-${comment.id}`}>
              <CornerDownRight size={12} /> Reply
            </button>
          )}
          {canDelete(comment.authorId) && (
            <button className="comment-action-btn danger" onClick={() => deleteComment(comment.id, isReply ? comment.parentId! : undefined)} id={`delete-comment-${comment.id}`}>
              <Trash2 size={12} /> Delete
            </button>
          )}
        </div>

        {/* Reply form */}
        {replyTo === comment.id && (
          <div style={{ marginTop: '0.75rem' }}>
            <textarea
              className="input"
              rows={2}
              placeholder="Write a reply..."
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              style={{ marginBottom: '0.5rem' }}
              id={`reply-textarea-${comment.id}`}
            />
            <div className="flex gap-2">
              <button className="btn btn-primary btn-sm" disabled={submitting} onClick={() => submitComment(replyText, comment.id)} id={`submit-reply-${comment.id}`}>
                {submitting ? <span className="spinner" /> : <><Send size={13} /> Reply</>}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => { setReplyTo(null); setReplyText('') }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Nested replies */}
        {(comment.replies || []).map(reply => (
          <CommentItem key={reply.id} comment={{ ...reply, parentId: comment.id } as any} isReply />
        ))}
      </div>
    )
  }

  return (
    <section className="comments-section" id="comments">
      <h2 className="comments-title">
        <MessageSquare size={20} style={{ display: 'inline', marginRight: 8 }} />
        Comments ({comments.length})
      </h2>

      {/* Comment Form */}
      {session ? (
        <div className="comment-form">
          <div className="flex gap-3 mb-3">
            {user?.image ? (
              <img src={user.image} alt="" width={36} height={36} style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            ) : (
              <span className="avatar avatar-md">{getInitials(user?.name || 'U')}</span>
            )}
            <textarea
              className="input"
              rows={3}
              placeholder="Share your thoughts..."
              value={text}
              onChange={e => setText(e.target.value)}
              id="comment-textarea"
            />
          </div>
          <div className="flex justify-end">
            <button
              className="btn btn-primary btn-sm"
              disabled={submitting || !text.trim()}
              onClick={() => submitComment(text)}
              id="submit-comment-btn"
            >
              {submitting ? <span className="spinner" /> : <><Send size={14} /> Post Comment</>}
            </button>
          </div>
        </div>
      ) : (
        <div className="comment-form" style={{ textAlign: 'center', padding: '2rem' }}>
          <MessageSquare size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
          <p className="text-muted mb-4">Sign in to join the conversation</p>
          <Link href="/auth/login" className="btn btn-primary btn-sm" id="sign-in-to-comment-btn">Sign In to Comment</Link>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="empty-state"><span className="spinner spinner-lg spinner-accent mx-auto" style={{ margin: '2rem auto' }} /></div>
      ) : comments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💬</div>
          <h3>No comments yet</h3>
          <p>Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="comment-list">
          {comments.map(c => <CommentItem key={c.id} comment={c} />)}
        </div>
      )}
    </section>
  )
}
