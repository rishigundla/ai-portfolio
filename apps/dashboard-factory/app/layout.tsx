import type { Metadata } from 'next'
import { Nav } from './_components/Nav'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dashboard Factory · AI Portfolio',
  description:
    'Pick a sample dataset, watch Claude profile it, get a fully designed interactive dashboard. Built for business users needing ad-hoc analysis and BI engineers prototyping high-fidelity wireframes.',
  openGraph: {
    title: 'Dashboard Factory · AI Portfolio',
    description: 'Dashboards in minutes, not days. Powered by Claude + a unified design system.',
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
            Project 01 of 5 · part of the{' '}
            <a
              href="https://github.com/rishigundla/ai-portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-light"
            >
              ai-portfolio
            </a>{' '}
            monorepo · built by{' '}
            <a
              href="https://rishikeshgundla.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-light"
            >
              Rishikesh Gundla
            </a>
          </p>
        </footer>
      </body>
    </html>
  )
}
