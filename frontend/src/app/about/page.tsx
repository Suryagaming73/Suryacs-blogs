import { Metadata } from 'next'
import { BookOpen, Target, Users, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about BlogCraft — your premium source for the latest news and insights.',
}

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container-sm" style={{ textAlign: 'center' }}>
          <div className="section-tag"><Sparkles size={12} /> About Us</div>
          <h1 className="section-title font-heading">We&apos;re BlogCraft</h1>
          <p className="section-desc">
            A premium blog and news platform built with passion. We believe great content should be accessible, beautifully presented, and always insightful.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title font-heading">What Drives Us</h2>
          </div>
          <div className="grid grid-cols-3" style={{ gap: '1.5rem' }}>
            {[
              { icon: BookOpen, title: 'Quality Content', color: '#6c5ce7', desc: 'Every article is carefully curated and crafted to provide real value to our readers.' },
              { icon: Target, title: 'Focused Topics', color: '#a855f7', desc: 'We stay focused on what matters — delivering the most relevant news and updates.' },
              { icon: Users, title: 'Community First', color: '#10b981', desc: 'Our readers are at the heart of everything we do. Your engagement makes us better.' },
            ].map(({ icon: Icon, title, color, desc }) => (
              <div key={title} className="card" style={{ padding: '2rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <Icon size={24} color={color} />
                </div>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.625rem' }}>{title}</h3>
                <p className="text-muted" style={{ lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container-sm" style={{ textAlign: 'center' }}>
          <h2 className="section-title font-heading">Our Mission</h2>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '2rem' }}>
            To democratize access to quality journalism and insightful content. We believe everyone deserves to stay informed with news that is clear, accurate, and engaging — presented in a beautiful, distraction-free reading experience.
          </p>
          <a href="/contact" className="btn btn-primary btn-lg">Get in Touch</a>
        </div>
      </section>
    </div>
  )
}
