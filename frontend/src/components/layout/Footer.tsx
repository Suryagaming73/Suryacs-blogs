'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Code, Mail } from 'lucide-react'

const Github = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
)

const Linkedin = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const Twitter = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
)

const Facebook = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const Youtube = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
)

const links = {
  platform: [
    { href: '/', label: 'Home' },
    { href: '/projects', label: 'Projects' },
    { href: '/services', label: 'Services' },
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ],
  account: [
    { href: '/auth/login', label: 'Sign In' },
    { href: '/auth/register', label: 'Register' },
  ],
}

export function Footer() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        if (!data.error) setSettings(data)
      })
      .catch(console.error)
  }, [])

  async function subscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      setMsg(data.message || 'Subscribed!')
      setEmail('')
    } catch {
      setMsg('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div className="footer-brand-name">{settings.siteName || 'Surya CS'}</div>
            <p className="footer-brand-desc">
              {settings.siteDescription || 'Full-Stack Web Developer & AI Content Creator. Crafting high-performance digital experiences and intelligent web solutions.'}
            </p>
            <form className="footer-newsletter" onSubmit={subscribe}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                id="newsletter-email"
              />
              <button type="submit" className="btn btn-primary btn-sm" disabled={loading} id="newsletter-subscribe-btn">
                {loading ? <span className="spinner" /> : <><Mail size={14} /> Subscribe</>}
              </button>
            </form>
            {msg && <p className="text-sm mt-2" style={{ color: 'var(--success)' }}>{msg}</p>}
          </div>

          {/* Platform */}
          <div>
            <h3 className="footer-heading">Platform</h3>
            <ul className="footer-links">
              {links.platform.map(l => (
                <li key={l.href}><Link href={l.href} className="footer-link">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="footer-heading">Account</h3>
            <ul className="footer-links">
              {links.account.map(l => (
                <li key={l.href}><Link href={l.href} className="footer-link">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {settings.siteName || 'Surya CS'}. All rights reserved.</span>
          <div className="flex gap-3">
            {(settings.linkedinUrl || 'https://linkedin.com/in/suryacs22') && (
              <a href={settings.linkedinUrl || 'https://linkedin.com/in/suryacs22'} target="_blank" rel="noreferrer" className="footer-link" aria-label="LinkedIn">
                <Linkedin size={16} />
              </a>
            )}
            {(settings.githubUrl || 'https://github.com/Surya200622') && (
              <a href={settings.githubUrl || 'https://github.com/Surya200622'} target="_blank" rel="noreferrer" className="footer-link" aria-label="GitHub">
                <Github size={16} />
              </a>
            )}
            {settings.twitterUrl && (
              <a href={settings.twitterUrl} target="_blank" rel="noreferrer" className="footer-link" aria-label="Twitter">
                <Twitter size={16} />
              </a>
            )}
            {settings.facebookUrl && (
              <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="footer-link" aria-label="Facebook">
                <Facebook size={16} />
              </a>
            )}
            {settings.youtubeUrl && (
              <a href={settings.youtubeUrl} target="_blank" rel="noreferrer" className="footer-link" aria-label="YouTube">
                <Youtube size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
