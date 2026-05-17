'use client'

/**
 * Class based error boundary for the interactive panels on /sprint/[id].
 *
 * React still requires a class component for `getDerivedStateFromError`
 * and `componentDidCatch`. Hooks based wrappers exist in the ecosystem,
 * but for one boundary the class is cheaper than pulling in another
 * dependency. The boundary renders only on the client (its parent
 * panels are 'use client' too) so the small class component overhead
 * is irrelevant.
 */

import React, { Component, type ReactNode } from 'react'
import { AlertOctagon, RotateCcw } from 'lucide-react'

interface SprintErrorBoundaryProps {
  children: ReactNode
  /** Label that appears in the eyebrow of the fallback card. */
  label?: string
  /** Optional custom fallback. If absent the default panel renders. */
  fallback?: ReactNode
}

interface SprintErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class SprintErrorBoundary extends Component<
  SprintErrorBoundaryProps,
  SprintErrorBoundaryState
> {
  state: SprintErrorBoundaryState = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): SprintErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Surface the failure in the console so a developer can pick it up
    // without losing the rest of the page. Production sites would log
    // to Sentry or similar here.
    console.error('[SprintErrorBoundary]', error, info)
  }

  reset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (!this.state.hasError) return this.props.children
    if (this.props.fallback) return this.props.fallback

    return (
      <div className="rounded-lg border border-rose-500/40 bg-rose-500/5 p-5 flex flex-col gap-3">
        <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-rose-300">
          <AlertOctagon className="h-3.5 w-3.5" />
          {this.props.label ?? 'Render error'}
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">
          This section could not render. The sprint data is still available
          elsewhere on the page. Try the button below to remount this panel
          or refresh the page.
        </p>
        {this.state.error?.message && (
          <pre className="text-[11px] font-mono text-rose-200/80 bg-base-800/60 border border-surface-border rounded p-2 overflow-x-auto">
            {this.state.error.message}
          </pre>
        )}
        <button
          type="button"
          onClick={this.reset}
          className="self-start inline-flex items-center gap-1.5 rounded-md border border-surface-border bg-base-800/60 px-3 py-1.5 text-[11px] font-mono text-text-muted hover:text-accent hover:border-accent/40 transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          Try again
        </button>
      </div>
    )
  }
}
