'use client'

import * as React from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight, RotateCcw, Check } from 'lucide-react'
import {
  replayFixture,
  ReplayAbortedError,
  type Fixture,
} from '@rishi/ai-core'
import { AiNarrativeBlock } from '@rishi/design-system/components'
import { Button } from '@rishi/design-system/primitives'
import {
  HEADING_COLUMN_CLASSIFICATION,
  HEADING_DOMAIN_INFERENCE,
  HEADING_KPI_RECOMMENDATIONS,
  HEADING_CHART_RECOMMENDATIONS,
} from '@/lib/profiling'
import { useDashboardStore, useStoreHydrated } from '@/lib/store'

interface StreamingPanelProps {
  fixture: Fixture
  datasetSlug: string
  /** Streaming cadence in chars/sec. Default 60 — slightly faster than typical Claude streaming for demo pacing. */
  charsPerSecond?: number
}

const STEPS = [
  { id: 'columns', label: 'Column classification', marker: HEADING_COLUMN_CLASSIFICATION },
  { id: 'domain', label: 'Domain inference', marker: HEADING_DOMAIN_INFERENCE },
  { id: 'kpis', label: 'KPI recommendations', marker: HEADING_KPI_RECOMMENDATIONS },
  { id: 'charts', label: 'Chart recommendations', marker: HEADING_CHART_RECOMMENDATIONS },
] as const

type StepStatus = 'pending' | 'active' | 'done'

export function StreamingPanel({
  fixture,
  datasetSlug,
  charsPerSecond = 60,
}: StreamingPanelProps) {
  const [streamedText, setStreamedText] = React.useState('')
  const [streaming, setStreaming] = React.useState(false)
  const [completed, setCompleted] = React.useState(false)
  const abortRef = React.useRef<AbortController | null>(null)

  const hydrated = useStoreHydrated()
  const alreadyProfiled = useDashboardStore(
    (s) => s.profilingComplete[datasetSlug] ?? false,
  )
  const markProfilingComplete = useDashboardStore((s) => s.markProfilingComplete)
  const resetProfiling = useDashboardStore((s) => s.resetProfiling)

  // Compute step statuses from the streamed text + streaming flag
  const stepStatuses = React.useMemo<StepStatus[]>(() => {
    if (!streamedText && !streaming) {
      return STEPS.map(() => 'pending')
    }
    return STEPS.map((step, i) => {
      const seenThisStep = streamedText.includes(step.marker)
      const nextStep = STEPS[i + 1]
      const seenNextStep = nextStep ? streamedText.includes(nextStep.marker) : completed
      if (seenThisStep && (seenNextStep || (i === STEPS.length - 1 && completed))) return 'done'
      if (seenThisStep) return 'active'
      // First step is "active" while we haven't yet rendered any heading (initial delay)
      if (i === 0 && streaming && !seenThisStep) return 'active'
      return 'pending'
    })
  }, [streamedText, streaming, completed])

  const startStream = React.useCallback(async () => {
    abortRef.current?.abort()
    const ac = new AbortController()
    abortRef.current = ac

    setStreamedText('')
    setCompleted(false)
    setStreaming(true)

    try {
      for await (const chunk of replayFixture(fixture, {
        charsPerSecond,
        signal: ac.signal,
      })) {
        setStreamedText(chunk)
      }
      setCompleted(true)
      markProfilingComplete(datasetSlug)
    } catch (err) {
      if (!(err instanceof ReplayAbortedError)) throw err
    } finally {
      if (!ac.signal.aborted) setStreaming(false)
    }
  }, [fixture, charsPerSecond, datasetSlug, markProfilingComplete])

  const cancelStream = React.useCallback(() => {
    abortRef.current?.abort()
    setStreaming(false)
  }, [])

  const handleReplay = React.useCallback(() => {
    resetProfiling(datasetSlug)
    startStream()
  }, [datasetSlug, resetProfiling, startStream])

  // Auto-start once Zustand has hydrated.
  // If the user already profiled this slug in a prior session, render the
  // full text immediately and skip the animation.
  React.useEffect(() => {
    if (!hydrated) return
    if (alreadyProfiled) {
      setStreamedText(fixture.text)
      setCompleted(true)
      return
    }
    startStream()
    return () => abortRef.current?.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated])

  return (
    <div className="space-y-6">
      {/* Progress steps */}
      <div className="rounded-xl border border-surface-border bg-surface p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-wider text-text-muted min-w-0">
            <Sparkles className="h-4 w-4 text-accent shrink-0" />
            <span className="truncate">{streaming ? 'Claude is analyzing...' : completed ? 'Profiling complete' : 'Ready to profile'}</span>
          </div>
          {streaming && (
            <Button variant="ghost" size="sm" onClick={cancelStream}>
              Cancel
            </Button>
          )}
          {completed && (
            <Button variant="ghost" size="sm" onClick={handleReplay}>
              <RotateCcw className="h-3.5 w-3.5" />
              Replay
            </Button>
          )}
        </div>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {STEPS.map((step, i) => (
            <ProgressStep
              key={step.id}
              num={i + 1}
              label={step.label}
              status={stepStatuses[i] ?? 'pending'}
            />
          ))}
        </ol>
      </div>

      {/* Streaming narrative */}
      <AiNarrativeBlock
        text={streamedText}
        streaming={streaming}
        title="Profiling output"
        variant="default"
      />

      {/* Continue CTA */}
      {completed && (
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href={`/dashboard/${datasetSlug}`}
            className="inline-flex items-center gap-2 rounded-md bg-accent text-base-900 hover:bg-accent-light px-6 py-3 text-sm font-semibold shadow-glow-sm hover:shadow-glow-md transition-all"
          >
            Generate dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
          <span className="text-xs text-text-muted">
            5-KPI strip + 4 charts + filters + drill-downs + PDF export.
          </span>
        </div>
      )}
    </div>
  )
}

function ProgressStep({
  num,
  label,
  status,
}: {
  num: number
  label: string
  status: StepStatus
}) {
  const ring =
    status === 'done'
      ? 'border-status-completed bg-status-completed/10 text-status-completed'
      : status === 'active'
        ? 'border-accent bg-accent/10 text-accent shadow-glow-sm'
        : 'border-surface-border bg-base-700 text-text-muted'

  const labelColor =
    status === 'done'
      ? 'text-status-completed'
      : status === 'active'
        ? 'text-text-primary'
        : 'text-text-muted'

  return (
    <li className="flex items-start gap-3">
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-semibold transition-all ${ring}`}
        aria-label={`Step ${num} ${status}`}
      >
        {status === 'done' ? <Check className="h-3.5 w-3.5" /> : num}
      </span>
      <span className={`text-sm font-medium leading-tight pt-0.5 transition-colors ${labelColor}`}>
        {label}
      </span>
    </li>
  )
}
