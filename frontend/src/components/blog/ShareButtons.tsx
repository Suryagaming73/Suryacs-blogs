'use client'
import { useState } from 'react'
import { Share2, MessageCircle, Link2, Check } from 'lucide-react'

interface ShareButtonsProps {
  title: string
  slug: string
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const url = typeof window !== 'undefined' ? `${window.location.origin}/blog/${slug}` : `/blog/${slug}`
  const tweetText = encodeURIComponent(`${title} — check this out!`)
  const tweetUrl = encodeURIComponent(url)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  return (
    <div className="share-buttons">
      <span className="text-sm text-muted flex items-center gap-1"><Share2 size={14} /> Share:</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className="btn btn-ghost btn-sm btn-icon" title="Share on Twitter" id="share-twitter-btn">
          <MessageCircle size={16} />
        </button>
      </a>
      <button className="share-btn" onClick={copyLink} id="share-copy-btn">
        {copied ? <><Check size={14} /> Copied!</> : <><Link2 size={14} /> Copy Link</>}
      </button>
    </div>
  )
}
