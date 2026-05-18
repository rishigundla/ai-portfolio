import type { Metadata, Viewport } from 'next'
import {
  ParticleBackground,
  ThemeProvider,
  ThemeScript,
} from '@rishi/design-system/theme'
import { Nav } from './_components/Nav'
import './globals.css'

// Resolved at build time. NEXT_PUBLIC_SITE_URL takes precedence so a custom
// domain works without code changes. VERCEL_URL is auto-injected on preview +
// production builds. Falls back to the planned production hostname following
// the same `ai-portfolio-{slug}.vercel.app` convention as Project 1.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://ai-portfolio-narrative-generator.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Narrative Generator · AI Portfolio',
    template: '%s · Narrative Generator',
  },
  description:
    'Pick a sample dashboard, watch Claude write the executive narrative, then download a polished deck as a PPTX file. Built for analysts who spend hours writing leadership readouts.',
  keywords: [
    'narrative generator',
    'AI',
    'Claude',
    'PPTX',
    'executive readout',
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
    siteName: 'Narrative Generator',
    title: 'Narrative Generator · AI Portfolio',
    description:
      'Dashboard to Deck Narrative Generator. Pick a sample dashboard, get a polished AI authored executive readout in PPTX form.',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Narrative Generator · AI Portfolio',
    description: 'Dashboard to deck narratives in minutes, not hours. Powered by Claude and a unified design system.',
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
                Project 02 of 5 · part of the{' '}
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
