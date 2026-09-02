import { Metadata } from 'next'
import { Briefcase, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { db } from '@/db'
import { services } from '@/db/schema'
import { asc } from 'drizzle-orm'

export const metadata: Metadata = {
  title: 'Services | Surya CS Portfolio',
  description: 'Professional web development services including business websites, e-commerce stores, SaaS dashboards, and AI solutions.',
}

export default async function ServicesPage() {
  const dbServices = await db.select().from(services).orderBy(asc(services.order), asc(services.title))

  return (
    <div>
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container-sm" style={{ textAlign: 'center' }}>
          <div className="section-tag"><Briefcase size={12} /> Services</div>
          <h1 className="section-title font-heading">Professional Offerings</h1>
          <p className="section-desc">
            End-to-end solutions tailored to your business needs, from stunning landing pages to full-scale SaaS applications.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
            {dbServices.map(service => (
              <div key={service.title} className="card" style={{ padding: '2.5rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '1.5rem', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
                  {service.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', fontFamily: 'Outfit, sans-serif' }}>{service.title}</h3>
                <p className="text-muted" style={{ lineHeight: 1.6, fontSize: '0.95rem' }}>{service.desc}</p>
              </div>
            ))}
            
            {/* CTA Card */}
            <div className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, var(--bg-alt) 0%, rgba(108, 92, 231, 0.1) 100%)', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--accent)' }}>Need something else?</h3>
              <p className="text-muted" style={{ lineHeight: 1.6, flexGrow: 1 }}>
                I offer custom web application development tailored specifically to your unique business requirements.
              </p>
              <Link href="/contact" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                Let&apos;s Discuss <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
