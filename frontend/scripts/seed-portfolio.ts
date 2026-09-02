import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from '../src/db/schema.ts'

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

const db = drizzle(client, { schema })

const projects = [
  { name: 'DentalExperts', tech: 'Django, Python, SQLite', desc: 'Architected a full-stack CRM to automate dental appointment workflows and digitize patient records. Implemented online scheduling and management of patient records. Served as the primary subject for a published research paper.', link: 'https://suryacs.pythonanywhere.com', icon: '🦷', order: 1 },
  { name: 'CipherApparel', tech: 'React.js, Django, Python, SQLite', desc: 'Engineered a high-performance fashion e-commerce platform with dynamic product management and secure auth. Delivered a seamless, single-page shopping experience with sub-2 second load times.', link: 'https://cipher-apparel.vercel.app', icon: '👕', order: 2 },
  { name: 'Blogcraft', tech: 'React.js, Django, Python', desc: 'Developed a robust content management system with role-based access control and efficient publishing workflows. Enhanced editorial efficiency by providing a structured environment for multi-user content creation.', link: 'https://blogcraft.pythonanywhere.com', icon: '📝', order: 3 },
  { name: 'Restaurant POS & Billing', tech: 'React, Node.js, Express, Turso', desc: 'Built a cloud-ready Point of Sale system facilitating real-time order management, menu administration, and efficient checkout processes. Integrated Cloudinary and Turso for edge database operations.', link: 'https://restaurant-pos-frontend-steel.vercel.app', icon: '🧾', order: 4 },
  { name: 'Spice Kitchen', tech: 'React-Vite, Supabase', desc: 'Developed a lightweight, responsive digital menu application to streamline the dining experience, featuring intuitive category browsing. Optimized through contactless menu browsing and fast edge-network delivery.', link: 'https://spice-kitchen-veg-nonveg.vercel.app', icon: '🌶️', order: 5 },
  { name: 'Jarvis AI Assistant', tech: 'Android, Java', desc: 'AI assistant for Android mobile phones. Successfully implemented voice-recognition and automated tasks for mobile productivity.', link: 'https://jarvis-official.vercel.app', icon: '🤖', order: 6 },
]

const services = [
  { title: 'Business Websites & Landing Pages', icon: '🏢', desc: 'High-performance, responsive websites built with Next.js and React that capture attention and drive conversions. Perfect for agencies, portfolios, and corporate sites.', order: 1 },
  { title: 'E-commerce Stores', icon: '🛍️', desc: 'Custom e-commerce platforms featuring seamless user experiences, fast load times, and secure checkout processes to maximize your online sales.', order: 2 },
  { title: 'SaaS Dashboards & CRM Systems', icon: '📊', desc: 'Complex, data-driven applications tailored to your business logic. Role-based access control, real-time analytics, and automated workflows.', order: 3 },
  { title: 'AI Solutions & Content Creation', icon: '🤖', desc: 'Innovative AI integrations, including AI Face Swap tools, automated content generation, and promo videos to elevate your digital marketing strategy.', order: 4 },
  { title: 'Google Business Profile Optimization', icon: '🚀', desc: 'Enhance your local search presence. I help optimize your GBP to attract more local customers and build a trustworthy online reputation.', order: 5 }
]

async function seed() {
  console.log('Seeding projects...')
  for (const p of projects) {
    await db.insert(schema.projects).values(p).onConflictDoNothing()
  }
  
  console.log('Seeding services...')
  for (const s of services) {
    await db.insert(schema.services).values(s).onConflictDoNothing()
  }
  
  console.log('Done!')
  process.exit(0)
}

seed()
