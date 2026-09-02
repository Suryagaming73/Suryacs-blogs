import { Metadata } from 'next'
import { ExternalLink, Layers } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Projects | Surya CS Portfolio',
  description: 'Explore the featured projects by Surya CS, including full-stack CRM systems, e-commerce platforms, and AI applications.',
}

const projects = [
  { 
    name: 'DentalExperts', 
    tech: 'Django, Python, SQLite', 
    desc: 'Architected a full-stack CRM to automate dental appointment workflows and digitize patient records. Implemented online scheduling and management of patient records. Served as the primary subject for a published research paper.', 
    link: 'https://suryacs.pythonanywhere.com',
    icon: '🦷'
  },
  { 
    name: 'CipherApparel', 
    tech: 'React.js, Django, Python, SQLite', 
    desc: 'Engineered a high-performance fashion e-commerce platform with dynamic product management and secure auth. Delivered a seamless, single-page shopping experience with sub-2 second load times.', 
    link: 'https://cipher-apparel.vercel.app',
    icon: '👕'
  },
  { 
    name: 'Blogcraft', 
    tech: 'React.js, Django, Python', 
    desc: 'Developed a robust content management system with role-based access control and efficient publishing workflows. Enhanced editorial efficiency by providing a structured environment for multi-user content creation.', 
    link: 'https://blogcraft.pythonanywhere.com',
    icon: '📝'
  },
  { 
    name: 'Restaurant POS & Billing', 
    tech: 'React, Node.js, Express, Turso', 
    desc: 'Built a cloud-ready Point of Sale system facilitating real-time order management, menu administration, and efficient checkout processes. Integrated Cloudinary and Turso for edge database operations.', 
    link: 'https://restaurant-pos-frontend-steel.vercel.app',
    icon: '🧾'
  },
  { 
    name: 'Spice Kitchen', 
    tech: 'React-Vite, Supabase', 
    desc: 'Developed a lightweight, responsive digital menu application to streamline the dining experience, featuring intuitive category browsing. Optimized through contactless menu browsing and fast edge-network delivery.', 
    link: 'https://spice-kitchen-veg-nonveg.vercel.app',
    icon: '🌶️'
  },
  { 
    name: 'Jarvis AI Assistant', 
    tech: 'Android, Java', 
    desc: 'AI assistant for Android mobile phones. Successfully implemented voice-recognition and automated tasks for mobile productivity.', 
    link: 'https://jarvis-official.vercel.app',
    icon: '🤖'
  },
]

export default function ProjectsPage() {
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
            {projects.map(project => (
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
                  <a href={project.link} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    Live Demo <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
