'use client'
import { useState } from 'react'
import { Share2, Link2, Check } from 'lucide-react'

const Twitter = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
)

const Facebook = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
)

const Linkedin = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
)

const Whatsapp = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/><path d="M16.5 16c0-1.5-2-2.5-2-2.5l-1 1c-1.5-1-2.5-2.5-3.5-3.5l1-1s-1-2-2.5-2-2 1.5-2 1.5c0 3.5 5.5 9 9 9 0 0 1.5-.5 1.5-2.5z"/></svg>
)

const Telegram = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
)

const Instagram = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
)

interface ShareButtonsProps {
  title: string
  slug: string
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const url = typeof window !== 'undefined' ? `${window.location.origin}/blog/${slug}` : `/blog/${slug}`
  const tweetText = encodeURIComponent(`${title} — check this out!`)
  const encodedUrl = encodeURIComponent(url)

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
    <div className="share-buttons" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
      <span className="text-sm text-muted flex items-center gap-1" style={{ marginRight: '0.5rem' }}><Share2 size={14} /> Share:</span>
      
      <a
        href={`https://twitter.com/intent/tweet?text=${tweetText}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-ghost btn-sm btn-icon"
        title="Share on Twitter"
        id="share-twitter-btn"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Twitter size={16} />
      </a>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-ghost btn-sm btn-icon"
        title="Share on Facebook"
        id="share-facebook-btn"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Facebook size={16} />
      </a>

      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-ghost btn-sm btn-icon"
        title="Share on LinkedIn"
        id="share-linkedin-btn"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Linkedin size={16} />
      </a>

      <a
        href={`https://wa.me/?text=${tweetText}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-ghost btn-sm btn-icon"
        title="Share on WhatsApp"
        id="share-whatsapp-btn"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Whatsapp size={16} />
      </a>

      <a
        href={`https://t.me/share/url?url=${encodedUrl}&text=${tweetText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-ghost btn-sm btn-icon"
        title="Share on Telegram"
        id="share-telegram-btn"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Telegram size={16} />
      </a>

      <a
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-ghost btn-sm btn-icon"
        title="Copy link & open Instagram"
        id="share-instagram-btn"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onClick={async (e) => {
          // Instagram doesn't have a direct share link. Copy to clipboard and open IG.
          await copyLink();
        }}
      >
        <Instagram size={16} />
      </a>

      <button className="share-btn" onClick={copyLink} id="share-copy-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
        {copied ? <><Check size={14} /> Copied!</> : <><Link2 size={14} /> Copy Link</>}
      </button>
    </div>
  )
}
