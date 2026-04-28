import type { Metadata, Viewport } from 'next'
import { Nav } from './_components/Nav'
import { Toaster } from './_components/Toaster'
import './globals.css'

// Resolved at build time. NEXT_PUBLIC_SITE_URL takes precedence so a custom
// domain works without code changes. VERCEL_URL is auto-injected on preview +
// production builds. Falls back to the planned production hostname (which
// follows the existing portfolio convention `ai-portfolio-{slug}.vercel.app`,
// matching the deployed `ai-portfolio-design-system-docs.vercel.app`).
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://ai-portfolio-dashboard-factory.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Dashboard Factory · AI Portfolio',
    template: '%s · Dashboard Factory',
  },
  description:
    'Pick a sample dataset, watch Claude profile it, get a fully designed interactive dashboard. Built for business users needing ad-hoc analysis and BI engineers prototyping high-fidelity wireframes.',
  keywords: [
    'dashboard',
    'AI',
    'Claude',
    'data visualization',
    'business intelligence',
    'BI engineer',
    'analytics',
    'Next.js',
    'React',
    'design system',
    'portfolio',
  ],
  authors: [{ name: 'Rishikesh Gundla', url: 'https://rishikeshgundla.com' }],
  creator: 'Rishikesh Gundla',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Dashboard Factory',
    title: 'Dashboard Factory · AI Portfolio',
    description:
      'Dashboards in minutes, not days. Pick a sample, watch Claude profile it, get an interactive dashboard with filters, drill-downs, and PDF export.',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dashboard Factory · AI Portfolio',
    description: 'Dashboards in minutes, not days. Powered by Claude + a unified design system.',
    creator: '@rishigundla',
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  category: 'technology',
}

export const viewport: Viewport = {
  themeColor: '#0a0e1a',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-base-900 text-text-primary">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-base-900 focus:font-semibold focus:shadow-lg"
        >
          Skip to main content
        </a>
        <Nav />
        <main id="main-content">{children}</main>
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
        <Toaster />
      </body>
    </html>
  )
}
