import { Metadata } from 'next'
import { Monitor, ShoppingBag, PieChart, Sparkles, Target, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Services | Surya CS Portfolio',
  description: 'Professional web development services including business websites, e-commerce stores, SaaS dashboards, and AI solutions.',
}

const services = [
  {
    title: 'Business Websites & Landing Pages',
    icon: <Monitor size={32} color="#6c5ce7" />,
    desc: 'High-performance, responsive websites built with Next.js and React that capture attention and drive conversions. Perfect for agencies, portfolios, and corporate sites.',
  },
  {
    title: 'E-commerce Stores',
    icon: <ShoppingBag size={32} color="#a855f7" />,
    desc: 'Custom e-commerce platforms featuring seamless user experiences, fast load times, and secure checkout processes to maximize your online sales.',
  },
  {
    title: 'SaaS Dashboards & CRM Systems',
    icon: <PieChart size={32} color="#10b981" />,
    desc: 'Complex, data-driven applications tailored to your business logic. Role-based access control, real-time analytics, and automated workflows.',
  },
  {
    title: 'AI Solutions & Content Creation',
    icon: <Sparkles size={32} color="#f59e0b" />,
    desc: 'Innovative AI integrations, including AI Face Swap tools, automated content generation, and promo videos to elevate your digital marketing strategy.',
  },
  {
    title: 'Google Business Profile Optimization',
    icon: <Target size={32} color="#ec4899" />,
    desc: 'Enhance your local search presence. I help optimize your GBP to attract more local customers and build a trustworthy online reputation.',
  }
]

export default function ServicesPage() {
  return (
    <div>
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container-sm" style={{ textAlign: 'center' }}>
          <div className="section-tag"><Sparkles size={12} /> What I Do</div>
          <h1 className="section-title font-heading">Professional Services</h1>
          <p className="section-desc">
            Leveraging modern web technologies to architect digital solutions that drive business improvement and operational efficiency.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
            {services.map((service, i) => (
              <div key={i} className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '1.5rem', display: 'inline-flex', padding: '1rem', background: 'var(--bg-alt)', borderRadius: 'var(--radius-sm)' }}>
                  {service.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>{service.title}</h3>
                <p className="text-muted" style={{ lineHeight: 1.6, flexGrow: 1 }}>{service.desc}</p>
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
