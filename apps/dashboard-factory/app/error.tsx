'use client'

import * as React from 'react'
import Link from 'next/link'
import { AlertTriangle, RotateCcw, Home } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Route-level error boundary. Next.js 15 renders this when any server or
 * client component inside the app/ subtree throws during render.
 *
 * Must be a Client Component because it receives the `reset` callback that
 * triggers a re-render of the failed segment without a full page reload.
 *
 * The `digest` is a stable hash Next.js attaches to errors so we can tell the
 * user "share this code with the team" without leaking the stack trace itself.
 */
export default function ErrorPage({ error, reset }: ErrorProps) {
  React.useEffect(() => {
    console.error('[app/error]', error)
  }, [error])

  return (
    <div className="section-container py-24 sm:py-32">
      <div className="max-w-2xl">
        <div className="font-mono text-xs uppercase tracking-widest text-status-blocked mb-4 inline-flex items-center gap-2">
          <AlertTriangle className="h-3.5 w-3.5" />
          Something went wrong
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-text-primary leading-tight">
          We hit a bump.
        </h1>
        <p className="mt-6 text-lg text-text-secondary max-w-xl">
          Something unexpected happened while loading this page. The rest of the app is fine — try
          re-rendering this section, or head back home if the issue persists.
        </p>

        {error.digest && (
          <p className="mt-4 font-mono text-xs text-text-muted">
            Reference: <span className="text-text-secondary">{error.digest}</span>
          </p>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-md bg-accent text-base-900 hover:bg-accent-light px-5 py-2.5 text-sm font-semibold shadow-glow-sm hover:shadow-glow-md transition-all"
          >
            <RotateCcw className="h-4 w-4" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md border border-surface-border bg-surface hover:bg-surface-hover px-5 py-2.5 text-sm font-medium text-text-secondary transition-colors"
          >
            <Home className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
