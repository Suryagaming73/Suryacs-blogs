import { Metadata } from 'next'
import Image from 'next/image'
import { Code, Server, Database, GraduationCap, Briefcase, Award, ExternalLink, Github, Linkedin, Mail, MapPin, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Surya CS',
  description: 'Full-Stack Web Developer & AI Content Creator based in Coimbatore.',
}

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container-sm" style={{ textAlign: 'center' }}>
          <div className="section-tag"><Code size={12} /> Developer Portfolio</div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Image src="/portfolio-img-1.png" alt="Surya CS" width={120} height={120} style={{ borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent)' }} priority />
          </div>
          <h1 className="section-title font-heading">Surya CS</h1>
          <p className="section-desc" style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>
            Full-Stack Web Developer & AI Content Creator
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <a href="mailto:cssurya2006@gmail.com" className="badge badge-accent" style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center', padding: '0.5rem 1rem' }}><Mail size={14} /> cssurya2006@gmail.com</a>
            <span className="badge badge-muted" style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center', padding: '0.5rem 1rem' }}><MapPin size={14} /> Coimbatore, India</span>
            <a href="https://linkedin.com/in/suryacs22" target="_blank" rel="noreferrer" className="badge badge-accent" style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center', padding: '0.5rem 1rem' }}><Linkedin size={14} /> LinkedIn</a>
            <a href="https://github.com/Surya20062" target="_blank" rel="noreferrer" className="badge badge-muted" style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center', padding: '0.5rem 1rem' }}><Github size={14} /> GitHub</a>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="section">
        <div className="container-sm" style={{ display: 'flex', gap: '3rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px' }}>
            <h2 className="section-title font-heading" style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Professional Summary</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
              Result-oriented Full-Stack Developer with a passion for architecting digital solutions that drive business improvement and operational efficiency. Expert in delivering high-impact services including Business Websites, E-commerce stores, Portfolio sites, SaaS Dashboards, CRM & Management Systems, Landing Pages, Booking Websites, and Blogs. Additionally proficient in Google Business Profile optimization, Custom Web Apps, Promo Videos & Graphics, and AI Face Swap solutions. Dedicated to leveraging modern web technologies to solve complex business challenges and enhance user engagement through intuitive, high-availability platforms.
            </p>
          </div>
          <div style={{ flex: '1 1 250px', display: 'flex', justifyContent: 'center' }}>
            <Image src="/portfolio-img-2.png" alt="Creative AI Content" width={300} height={300} style={{ borderRadius: 'var(--radius-lg)', objectFit: 'cover', maxWidth: '100%', height: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title font-heading">Technical Skills</h2>
          </div>
          <div className="grid grid-cols-3" style={{ gap: '1.5rem' }}>
            {[
              { icon: Code, title: 'Languages', color: '#6c5ce7', desc: 'HTML, CSS, JavaScript, SQL' },
              { icon: Server, title: 'Frameworks & Libs', color: '#a855f7', desc: 'React.js, Next.js, Node.js, Express.js, Django, Bootstrap, Tailwind CSS' },
              { icon: Database, title: 'Databases & Tools', color: '#10b981', desc: 'MySQL, SQLite, Supabase, Turso, GitHub, Vercel, Cloudinary' },
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

      {/* Projects */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title font-heading">Featured Projects</h2>
          </div>
          <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
            {[
              { name: 'DentalExperts', tech: 'Django, Python, SQLite', desc: 'Architected a full-stack CRM to automate dental appointment workflows and digitize patient records.', link: 'https://suryacs.pythonanywhere.com' },
              { name: 'CipherApparel', tech: 'React.js, Django, Python, SQLite', desc: 'Engineered a high-performance fashion e-commerce platform with dynamic product management and secure auth.', link: 'https://cipher-apparel.vercel.app' },
              { name: 'Blogcraft', tech: 'React.js, Django, Python', desc: 'Developed a robust content management system with role-based access control and efficient publishing workflows.', link: 'https://blogcraft.pythonanywhere.com' },
              { name: 'Restaurant POS', tech: 'React, Node.js, Express, Turso', desc: 'Built a cloud-ready Point of Sale system facilitating real-time order management and efficient checkout processes.', link: 'https://restaurant-pos-frontend-steel.vercel.app' },
              { name: 'Spice Kitchen', tech: 'React-Vite, Supabase', desc: 'Developed a lightweight, responsive digital menu application to streamline the dining experience.', link: 'https://spice-kitchen-veg-nonveg.vercel.app' },
              { name: 'Jarvis AI Assistant', tech: 'Android', desc: 'AI assistant for Android mobile phones. Successfully implemented voice-recognition and automated tasks.', link: 'https://jarvis-official.vercel.app' },
            ].map(project => (
              <div key={project.name} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{project.name}</h3>
                <div style={{ color: 'var(--accent)', fontSize: '0.875rem', marginBottom: '1rem', fontWeight: 600 }}>{project.tech}</div>
                <p className="text-muted" style={{ marginBottom: '1.5rem', flexGrow: 1 }}>{project.desc}</p>
                <a href={project.link} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ display: 'inline-flex', alignSelf: 'flex-start', gap: '0.5rem' }}>
                  View Project <ExternalLink size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education & Certs */}
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container-sm">
          <div className="section-header">
            <h2 className="section-title font-heading">Education & Certifications</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '2rem', display: 'flex', gap: '1.5rem' }}>
              <GraduationCap size={32} color="#6c5ce7" style={{ flexShrink: 0 }} />
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.25rem' }}>Master of Computer Applications (MCA)</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Bharathiar University, Maruthamalai | 2026 – Present</p>
              </div>
            </div>
            
            <div className="card" style={{ padding: '2rem', display: 'flex', gap: '1.5rem' }}>
              <GraduationCap size={32} color="#6c5ce7" style={{ flexShrink: 0 }} />
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.25rem' }}>B.Com (Computer Applications)</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Sri Ramakrishna College of Arts & Science | 2023 – 2026</p>
              </div>
            </div>

            <div className="card" style={{ padding: '2rem', display: 'flex', gap: '1.5rem' }}>
              <Award size={32} color="#a855f7" style={{ flexShrink: 0 }} />
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.25rem' }}>Certifications</h3>
                <ul className="text-muted" style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <li style={{ listStyleType: 'disc' }}>Full-Stack Python Development — Indra Institute of Education (Jul-Dec 2025)</li>
                  <li style={{ listStyleType: 'disc' }}>Data Analytics — IBM & ITC (Nov 2025)</li>
                  <li style={{ listStyleType: 'disc' }}>Publication: &quot;A Study on Web-Based Dental Appointment Booking System&quot; (IJSRED, Vol 9, Issue 1)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
