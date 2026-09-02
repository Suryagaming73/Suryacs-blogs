'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Code, Mail, Linkedin, Github, Twitter, Facebook, Youtube } from 'lucide-react'

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
  const [settings, setSettings] = useState<any>({})

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
