'use client'
import { useState } from 'react'
import { Heart } from 'lucide-react'
import { formatNumber } from '@/lib/utils'

interface LikeButtonProps {
  slug: string
  initialCount: number
  initialLiked: boolean
  isLoggedIn: boolean
}

export function LikeButton({ slug, initialCount, initialLiked, isLoggedIn }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    if (!isLoggedIn) {
      window.location.href = '/auth/login'
      return
    }
    if (loading) return
    setLoading(true)

    // Optimistic update
    setLiked(l => !l)
    setCount(c => liked ? c - 1 : c + 1)

    try {
      const res = await fetch(`/api/posts/${slug}/like`, { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        setLiked(data.liked)
        setCount(data.count)
      } else {
        // Revert on error
        setLiked(l => !l)
        setCount(c => liked ? c + 1 : c - 1)
      }
    } catch {
      setLiked(l => !l)
      setCount(c => liked ? c + 1 : c - 1)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      className={`like-btn ${liked ? 'liked' : ''}`}
      onClick={toggle}
      disabled={loading}
      id="like-post-btn"
      aria-label={liked ? 'Unlike post' : 'Like post'}
    >
      <Heart size={17} fill={liked ? 'currentColor' : 'none'} />
      <span>{formatNumber(count)}</span>
      <span>{liked ? 'Liked' : 'Like'}</span>
    </button>
  )
}
