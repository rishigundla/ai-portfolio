import type { Metadata, Viewport } from 'next'
import {
  ParticleBackground,
  ThemeProvider,
  ThemeScript,
} from '@rishi/design-system/theme'
import { Nav } from './_components/Nav'
import './globals.css'

// Resolved at build time. Same fallback chain as the other portfolio apps.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://ai-portfolio-sprint-intelligence.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Sprint Intelligence · AI Portfolio',
    template: '%s · Sprint Intelligence',
  },
  description:
    'Pick a synthetic sprint, watch the dashboard fill with team and individual KPIs, get a streaming AI authored meeting brief with workload rebalancing recommendations.',
  keywords: [
    'sprint intelligence',
    'AI',
    'Claude',
    'Jira',
    'sprint review',
    'meeting brief',
    'engineering analytics',
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
    siteName: 'Sprint Intelligence',
    title: 'Sprint Intelligence · AI Portfolio',
    description:
      'AI Sprint Intelligence Dashboard. Pick a synthetic sprint, get team and individual KPIs plus a streaming AI meeting brief.',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sprint Intelligence · AI Portfolio',
    description: 'Sprint review prep in minutes, not hours. Powered by Claude and a unified design system.',
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
  colorScheme: 'dark light',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-screen bg-base-900 text-text-primary">
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-base-900 focus:font-semibold focus:shadow-lg"
          >
            Skip to main content
          </a>
          <ParticleBackground />
          <div className="relative" style={{ zIndex: 1 }}>
            <Nav />
            <main id="main-content">{children}</main>
            <footer className="section-container py-16 border-t border-surface-border mt-24">
              <p className="font-mono text-xs text-text-muted">
                Project 03 of 5 · part of the{' '}
                <a
                  href="https://github.com/rishigundla/ai-portfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-light underline underline-offset-4 decoration-accent/40 hover:decoration-accent"
                >
                  ai-portfolio
                </a>{' '}
                monorepo · built by{' '}
                <a
                  href="https://portfolio-site-rishigundlas-projects.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-light underline underline-offset-4 decoration-accent/40 hover:decoration-accent"
                >
                  Rishikesh Gundla
                </a>
              </p>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
