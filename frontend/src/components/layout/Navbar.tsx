'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useTheme } from './ThemeProvider'
import { Sun, Moon, LayoutDashboard, LogOut, User, Menu, X, BookOpen } from 'lucide-react'
import { getInitials } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/services', label: 'Services' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const { data: session } = useSession()
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const user = session?.user as any

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        {/* Logo */}
        <Link href="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          Surya CS
        </Link>

        {/* Desktop Links */}
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} className="navbar-link" onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
          {user?.role === 'admin' && (
            <Link href="/dashboard" className="navbar-link" onClick={() => setMenuOpen(false)}>
              Dashboard
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="navbar-right">
          {/* Theme Toggle */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            id="theme-toggle-btn"
          >
            {theme === 'dark'
              ? <Sun size={18} />
              : <Moon size={18} />
            }
          </button>

          {/* Auth */}
          {session ? (
            <div className="user-menu">
              <button
                className="user-menu-trigger"
                onClick={() => setUserMenuOpen(v => !v)}
                id="user-menu-btn"
              >
                {user?.image ? (
                  <img src={user.image} alt="" width={28} height={28} style={{ borderRadius: '50%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
                ) : (
                  <span className="avatar avatar-sm">{getInitials(user?.name || user?.email || 'U')}</span>
                )}
                <span className="text-sm font-medium hidden-mobile" style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name || user?.email}
                </span>
              </button>
              {userMenuOpen && (
                <div className="user-menu-dropdown">
                  <div style={{ padding: '0.5rem 0.75rem 0.625rem' }}>
                    <div className="text-sm font-semibold truncate">{user?.name || 'User'}</div>
                    <div className="text-xs text-muted truncate">{user?.email}</div>
                  </div>
                  <div className="dropdown-divider" />
                  <Link href="/profile" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <User size={15} /> Profile Settings
                  </Link>
                  {user?.role === 'admin' && (
                    <Link href="/dashboard" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <LayoutDashboard size={15} /> Dashboard
                    </Link>
                  )}
                  <button className="dropdown-item danger" onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: '/' }) }}>
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login" className="btn btn-primary btn-sm" id="login-btn">
              Sign In
            </Link>
          )}

          {/* Mobile hamburger */}
          <button className="hamburger" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu" id="hamburger-btn">
            {menuOpen ? <><span /><span /><span /></> : <><span /><span /><span /></>}
            {menuOpen ? <X size={20} color="var(--text)" /> : <Menu size={20} color="var(--text)" />}
          </button>
        </div>
      </div>
    </nav>
  )
}
