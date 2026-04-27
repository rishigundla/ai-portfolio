'use client'

import * as React from 'react'
import { AlertTriangle } from 'lucide-react'

interface ChartErrorBoundaryProps {
  /** Title to show in the fallback panel — usually the chart title */
  title?: string
  /** What kind of chart failed, for the fallback message */
  chartKind?: string
  children: React.ReactNode
}

interface ChartErrorBoundaryState {
  error: Error | null
}

/**
 * Error boundary that quarantines a single chart's render failure.
 *
 * Why class-based: React error boundaries are still class-only as of 19.
 * The functional `useErrorBoundary` API hasn't shipped to stable.
 *
 * Why scoped per chart instead of one boundary at the page level:
 * if one chart's data is malformed (e.g., NaN values, empty bars array,
 * Recharts internal layout error), we want only that tile to show the
 * fallback. The other 3 charts on the dashboard should still render.
 */
export class ChartErrorBoundary extends React.Component<
  ChartErrorBoundaryProps,
  ChartErrorBoundaryState
> {
  state: ChartErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ChartErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ChartErrorBoundary]', this.props.chartKind ?? 'chart', error, info)
  }

  reset = () => this.setState({ error: null })

  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col items-center justify-center gap-2 text-center px-4 py-8">
          <AlertTriangle className="h-8 w-8 text-status-blocked opacity-75" />
          <span className="text-sm font-medium text-status-blocked">
            {this.props.chartKind
              ? `Couldn't render ${this.props.chartKind}`
              : 'This chart failed to render'}
          </span>
          <span className="text-xs text-text-muted max-w-xs">
            The other charts on this dashboard are still live. Try clearing filters
            or selecting a different segment.
          </span>
          <button
            type="button"
            onClick={this.reset}
            className="mt-2 text-xs font-mono text-accent hover:text-accent-light underline underline-offset-2"
          >
            Retry render
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
