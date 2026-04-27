import Link from 'next/link'
import { ArrowRight, Compass, Wand2, Sparkles } from 'lucide-react'

export const metadata = {
  title: 'Page not found',
  description:
    'The page you were looking for has moved, was renamed, or never existed. Pick one of the working entry points below.',
  robots: {
    index: false,
    follow: true,
  },
}

/**
 * 404 page. Next.js 15 App Router renders this for any unmatched route in the
 * app/ subtree. The branded card pattern + lucide compass keeps the user
 * inside the conversion funnel rather than hitting a dead-end.
 */
export default function NotFound() {
  return (
    <div className="section-container py-24 sm:py-32">
      <div className="max-w-2xl">
        <div className="font-mono text-xs uppercase tracking-widest text-accent mb-4 inline-flex items-center gap-2">
          <Compass className="h-3.5 w-3.5" />
          404 · Page not found
        </div>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary leading-tight">
          We&apos;ve looked everywhere.
          <br />
          <span className="bg-gradient-to-r from-accent-light to-accent bg-clip-text text-transparent">
            This page isn&apos;t one of them.
          </span>
        </h1>
        <p className="mt-6 text-lg text-text-secondary max-w-xl">
          The page you were looking for has moved, was renamed, or never existed. Pick a working
          entry point below — the rest of Dashboard Factory is still here.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
        <Link
          href="/"
          className="group rounded-xl border border-surface-border bg-surface p-5 transition-all hover:border-accent/40 hover:shadow-card-hover hover:-translate-y-0.5"
        >
          <Sparkles className="h-5 w-5 text-accent mb-3" />
          <div className="font-display font-semibold text-text-primary mb-1">Home</div>
          <p className="text-xs text-text-muted leading-relaxed mb-3">
            Project overview and the two persona modes.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-accent group-hover:gap-2 transition-all">
            Go to home <ArrowRight className="h-3 w-3" />
          </span>
        </Link>

        <Link
          href="/datasets"
          className="group rounded-xl border border-surface-border bg-surface p-5 transition-all hover:border-accent/40 hover:shadow-card-hover hover:-translate-y-0.5"
        >
          <Compass className="h-5 w-5 text-purple-300 mb-3" />
          <div className="font-display font-semibold text-text-primary mb-1">Pick a dataset</div>
          <p className="text-xs text-text-muted leading-relaxed mb-3">
            Six curated samples, ready to profile and dashboard.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-accent group-hover:gap-2 transition-all">
            Browse 6 datasets <ArrowRight className="h-3 w-3" />
          </span>
        </Link>

        <Link
          href="/wireframe"
          className="group rounded-xl border border-surface-border bg-surface p-5 transition-all hover:border-accent/40 hover:shadow-card-hover hover:-translate-y-0.5"
        >
          <Wand2 className="h-5 w-5 text-amber-300 mb-3" />
          <div className="font-display font-semibold text-text-primary mb-1">Wireframe mode</div>
          <p className="text-xs text-text-muted leading-relaxed mb-3">
            Three layout archetypes for BI discovery sessions.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-accent group-hover:gap-2 transition-all">
            Open templates <ArrowRight className="h-3 w-3" />
          </span>
        </Link>
      </div>
    </div>
  )
}
