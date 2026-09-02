'use client'
import { useState } from 'react'
import Link from 'next/link'
import { MessageCircle, Code, Rss, Mail } from 'lucide-react'

const links = {
  platform: [
    { href: '/', label: 'Home' },
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
            <div className="footer-brand-name">BlogCraft</div>
            <p className="footer-brand-desc">
              Your go-to source for the latest news, insights, and updates. Stay informed with quality content, curated just for you.
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
          <span>© {new Date().getFullYear()} BlogCraft. All rights reserved.</span>
          <div className="flex gap-3">
            <a href="#" className="footer-link" aria-label="RSS Feed"><Rss size={16} /></a>
            <a href="#" className="footer-link" aria-label="Twitter"><MessageCircle size={16} /></a>
            <a href="#" className="footer-link" aria-label="GitHub"><Code size={16} /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
