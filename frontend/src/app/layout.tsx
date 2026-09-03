import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Providers } from '@/components/layout/Providers'
import NextTopLoader from 'nextjs-toploader'

export const metadata: Metadata = {
  title: { default: 'Suryacs-Blogs', template: '%s | Suryacs-Blogs' },
  description: 'A premium tech and news publication delivering insights on software, technology, and industry trends.',
  keywords: ['blog', 'news', 'articles', 'updates', 'technology', 'software'],
  authors: [{ name: 'Suryacs-Blogs' }],
  openGraph: {
    type: 'website',
    siteName: 'Suryacs-Blogs',
    title: 'Suryacs-Blogs',
    description: 'A premium tech and news publication delivering insights on software, technology, and industry trends.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent FOUC: apply theme before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('blogcraft-theme');
                  if (!theme) {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.setAttribute('data-theme', theme);
                } catch(e) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <Providers>
          <NextTopLoader color="var(--accent)" showSpinner={false} />
          <Navbar />
          <main className="page-wrap">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
