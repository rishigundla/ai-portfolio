import type { Metadata } from 'next'
import { Nav } from './_components/Nav'
import './globals.css'

export const metadata: Metadata = {
  title: 'Design System · AI Portfolio',
  description:
    'Live showcase of @rishi/design-system — tokens, primitives, and AI-specific components used across the five AI portfolio projects.',
  openGraph: {
    title: 'Design System · AI Portfolio',
    description: 'Tokens, primitives, and AI components. Live docs.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-base-900 text-text-primary">
        <Nav />
        <main>{children}</main>
        <footer className="section-container py-16 border-t border-surface-border mt-24">
          <p className="font-mono text-xs text-text-muted">
            @rishi/design-system · part of the{' '}
            <a
              href="https://github.com/rishigundla/ai-portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-light"
            >
              ai-portfolio
            </a>{' '}
            monorepo · built by Rishikesh Gundla
          </p>
        </footer>
      </body>
    </html>
  )
}
