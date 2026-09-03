import React from 'react'

export function Logo({ className, style }: { className?: string, style?: React.CSSProperties }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 60" width="100%" height="100%" className={className} style={{...style, display: 'block'}}>
      <defs>
        <linearGradient id="primaryGradLogo" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fb923c" />
        </linearGradient>
        <filter id="glowLogo" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Logo Mark */}
      <g transform="translate(10, 7)">
        {/* Hexagon base */}
        <path d="M22,0 L44,12.5 L44,37.5 L22,50 L0,37.5 L0,12.5 Z" fill="rgba(249, 115, 22, 0.05)" stroke="url(#primaryGradLogo)" strokeWidth="2" />
        
        {/* Stylized 'S' representing Surya and Code */}
        <path d="M28,14 C28,14 16,14 16,22 C16,28 28,28 28,34 C28,40 16,40 16,40" fill="none" stroke="var(--text)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Spark / Magic Star */}
        <path d="M34,6 L36,11 L41,13 L36,15 L34,20 L32,15 L27,13 L32,11 Z" fill="url(#primaryGradLogo)" filter="url(#glowLogo)"/>
      </g>

      {/* Typography */}
      <text x="70" y="36" fontFamily="system-ui, -apple-system, sans-serif" fontSize="24" fontWeight="800" fill="var(--text)" letterSpacing="1">Suryacs-</text>
      <text x="180" y="36" fontFamily="system-ui, -apple-system, sans-serif" fontSize="24" fontWeight="800" fill="url(#primaryGradLogo)" letterSpacing="0.5">Blogs</text>
      
      {/* Subtle tagline */}
      <text x="72" y="50" fontFamily="system-ui, -apple-system, sans-serif" fontSize="8.5" fontWeight="600" fill="var(--text-muted)" letterSpacing="1.5" textTransform="uppercase">Full Stack Web Solutions</text>
    </svg>
  )
}
