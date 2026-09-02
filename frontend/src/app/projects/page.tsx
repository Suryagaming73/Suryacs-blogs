import { Metadata } from 'next'
import { ExternalLink, Layers } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Projects | Surya CS Portfolio',
  description: 'Explore the featured projects by Surya CS, including full-stack CRM systems, e-commerce platforms, and AI applications.',
}

import { db } from '@/db'
import { projects } from '@/db/schema'
import { asc } from 'drizzle-orm'

export default async function ProjectsPage() {
  const dbProjects = await db.select().from(projects).orderBy(asc(projects.order), asc(projects.name))

  return (
    <div>
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container-sm" style={{ textAlign: 'center' }}>
          <div className="section-tag"><Layers size={12} /> Portfolio</div>
          <h1 className="section-title font-heading">Featured Projects</h1>
          <p className="section-desc">
            A selection of my best work in web development, from CRM dashboards to high-performance e-commerce platforms.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
            {dbProjects.map(project => (
              <div key={project.name} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', background: 'var(--bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    {project.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{project.name}</h3>
                    <div style={{ color: 'var(--accent)', fontSize: '0.875rem', fontWeight: 600 }}>{project.tech}</div>
                  </div>
                </div>
                <p className="text-muted" style={{ marginBottom: '1.5rem', flexGrow: 1, lineHeight: 1.6 }}>{project.desc}</p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      Live Demo <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
