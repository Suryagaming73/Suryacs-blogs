// Utility helpers for BlogCraft

/** Slugify any string into a URL-friendly slug */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Generate a unique slug by appending a short timestamp suffix */
export function generateSlug(title: string): string {
  return `${slugify(title)}-${Date.now().toString(36)}`
}

/** Calculate reading time in minutes from HTML content */
export function calculateReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  const wordCount = text.split(' ').filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / 200))
}

/** Strip HTML tags and return plain text excerpt */
export function stripHtml(html: string, maxLength = 200): string {
  const plain = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  return plain.length > maxLength ? plain.slice(0, maxLength) + '…' : plain
}

/** Format a date string for display */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  })
}

/** Format a number with compact notation (1.2K, 3.4M) */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
}

/** Get the initials of a name (for avatar fallback) */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/** Return a consistent color class from a string (for category badges) */
export function stringToColor(str: string): string {
  const colors = ['#6c5ce7', '#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899']
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

/** Join class names, filtering falsy values */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
