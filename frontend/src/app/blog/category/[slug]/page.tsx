'use client'
import { useState, useEffect, useCallback } from 'react'
import { PostCard } from '@/components/blog/PostCard'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Post {
  id: string; title: string; slug: string; excerpt?: string | null;
  featuredImageUrl?: string | null; readingTime?: number | null;
  viewsCount?: number | null; publishedAt?: string | null; createdAt: string | null;
  isFeatured?: boolean | null; externalLink?: string | null;
  categoryName?: string | null; categorySlug?: string | null; categoryColor?: string | null;
  authorName?: string | null;
}

interface Category { id: string; name: string; slug: string; color: string }
interface Tag { id: string; name: string; slug: string }

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [cats, setCats] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(params.slug)
  const [tag, setTag] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const LIMIT = 12

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => setCats(d.categories || []))
    fetch('/api/tags').then(r => r.json()).then(d => setTags(d.tags || []))
  }, [])

  useEffect(() => {
    if (category && category !== params.slug) {
      router.push(`/blog/category/${category}`)
    } else if (category === '' && params.slug) {
      router.push(`/blog`)
    }
  }, [category, params.slug, router])

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    const urlParams = new URLSearchParams({ page: String(page), limit: String(LIMIT) })
    if (search) urlParams.set('search', search)
    urlParams.set('category', params.slug)
    if (tag) urlParams.set('tag', tag)
    const res = await fetch(`/api/posts?${urlParams}`)
    const data = await res.json()
    setPosts(data.posts || [])
    setTotal(data.total || 0)
    setLoading(false)
  }, [search, tag, page, params.slug])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  const totalPages = Math.ceil(total / LIMIT)
  
  const currentCategory = cats.find(c => c.slug === params.slug)

  return (
    <div className="section">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="section-tag">Category</div>
          <h1 className="section-title font-heading" style={{ textAlign: 'left', margin: '0.5rem 0 0.5rem' }}>
            {currentCategory ? currentCategory.name : 'Category'}
          </h1>
          <p className="text-muted">{total} article{total !== 1 ? 's' : ''} in this category</p>
        </div>

        {/* Search & Filters */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
            <Search size={16} className="search-bar-icon" />
            <input
              className="input"
              placeholder="Search articles..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              id="blog-search"
            />
          </div>

          <select
            className="input"
            style={{ width: 'auto' }}
            value={category}
            onChange={e => { setCategory(e.target.value); setPage(1) }}
            id="category-filter"
          >
            <option value="">All Categories</option>
            {cats.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>

          {search || tag ? (
            <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setTag(''); setPage(1) }}>
              Clear filters
            </button>
          ) : null}
        </div>

        {/* Tag Cloud */}
        {tags.length > 0 && (
          <div className="tag-cloud" style={{ marginBottom: '2rem' }}>
            <button className={`tag-pill ${!tag ? 'active' : ''}`} onClick={() => { setTag(''); setPage(1) }}>All</button>
            {tags.slice(0, 15).map(t => (
              <button key={t.id} className={`tag-pill ${tag === t.slug ? 'active' : ''}`}
                onClick={() => { setTag(tag === t.slug ? '' : t.slug); setPage(1) }}>
                #{t.name}
              </button>
            ))}
          </div>
        )}

        {/* Posts Grid */}
        {loading ? (
          <div className="posts-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 380, borderRadius: 'var(--radius-lg)' }} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>No articles found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map(p => <PostCard key={p.id} post={p} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button className="page-btn" onClick={() => setPage(1)} disabled={page === 1}>«</button>
            <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹</button>
            {[...Array(Math.min(totalPages, 7))].map((_, i) => {
              const p = i + 1
              return (
                <button key={p} className={`page-btn ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
              )
            })}
            <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>›</button>
            <button className="page-btn" onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</button>
          </div>
        )}
      </div>
    </div>
  )
}
