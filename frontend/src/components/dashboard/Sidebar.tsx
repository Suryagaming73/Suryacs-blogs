'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, FileText, PlusCircle, Tag, FolderOpen,
  MessageSquare, Users, BarChart2, Mail, Inbox, Settings, LogOut
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

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">BlogCraft</div>

      {sections.map(section => (
        <div key={section.title} className="sidebar-section">
          <div className="sidebar-section-title">{section.title}</div>
          {section.items.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item ${isActive(item.href) ? 'active' : ''}`}
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
  )
}
