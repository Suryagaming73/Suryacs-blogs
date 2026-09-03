'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, FileText, PlusCircle, Tag, FolderOpen,
  MessageSquare, Users, BarChart2, Mail, Inbox, Settings, LogOut,
  Layers, Briefcase
} from 'lucide-react'

const sections = [
  {
    title: 'Overview',
    items: [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/dashboard/analytics', icon: BarChart2, label: 'Analytics' },
    ],
  },
  {
    title: 'Content',
    items: [
      { href: '/dashboard/posts', icon: FileText, label: 'All Posts' },
      { href: '/dashboard/posts/new', icon: PlusCircle, label: 'New Post' },
      { href: '/dashboard/categories', icon: FolderOpen, label: 'Categories' },
      { href: '/dashboard/tags', icon: Tag, label: 'Tags' },
    ],
  },
  {
    title: 'Portfolio',
    items: [
      { href: '/dashboard/projects', icon: Layers, label: 'Projects' },
      { href: '/dashboard/services', icon: Briefcase, label: 'Services' },
    ],
  },
  {
    title: 'Community',
    items: [
      { href: '/dashboard/comments', icon: MessageSquare, label: 'Comments' },
      { href: '/dashboard/users', icon: Users, label: 'Users' },
    ],
  },
  {
    title: 'Inbox',
    items: [
      { href: '/dashboard/newsletter', icon: Mail, label: 'Newsletter' },
      { href: '/dashboard/messages', icon: Inbox, label: 'Messages' },
    ],
  },
  {
    title: 'Account',
    items: [
      { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
    ],
  },
]

interface SidebarProps {
  unreadMessages?: number
}

export function Sidebar({ unreadMessages = 0 }: SidebarProps) {
  const pathname = usePathname()

  const [isOpen, setIsOpen] = useState(false)

  function isActive(href: string) {
    if (pathname === href) return true
    if (href === '/dashboard') return false
    
    // Special case for 'All Posts' to not be active on 'New Post' page
    if (href === '/dashboard/posts' && pathname === '/dashboard/posts/new') return false
    
    return pathname.startsWith(href + '/')
  }

  // Close sidebar on route change on mobile
  useEffect(() => {
    setTimeout(() => setIsOpen(false), 0)
  }, [pathname])

  return (
    <>
      {/* Mobile Header Toggle */}
      <div className="mobile-sidebar-header" style={{ alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--border)', background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 900 }}>
        <button className="btn btn-ghost" onClick={() => setIsOpen(true)} style={{ padding: '0.5rem' }}>
          <LayoutDashboard size={20} />
        </button>
        <span style={{ fontWeight: 600, marginLeft: '0.5rem' }}>Dashboard</span>
      </div>

      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
      )}

      <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo flex items-center justify-between">
          <img src="/logo.svg" alt="Suryacs-Blogs" style={{ height: '32px', width: 'auto' }} />
          <button className="hidden-desktop" onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <span style={{ fontSize: '1.25rem' }}>&times;</span>
          </button>
        </div>

        {sections.map(section => (
          <div key={section.title} className="sidebar-section">
            <div className="sidebar-section-title">{section.title}</div>
            {section.items.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-item ${isActive(item.href) ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <item.icon size={16} />
                {item.label}
                {item.label === 'Messages' && unreadMessages > 0 && (
                  <span className="sidebar-badge">{unreadMessages}</span>
                )}
              </Link>
            ))}
          </div>
        ))}

        <div style={{ marginTop: 'auto', padding: '0 0.75rem 1rem' }}>
          <button
            className="sidebar-item"
            style={{ width: '100%', color: 'var(--danger)' }}
            onClick={() => signOut({ callbackUrl: '/' })}
            id="sidebar-signout-btn"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
