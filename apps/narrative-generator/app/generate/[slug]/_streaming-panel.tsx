'use client'

import * as React from 'react'
import { Sparkles, RotateCcw, Download } from 'lucide-react'
import {
  replayFixture,
  ReplayAbortedError,
  type Fixture,
} from '@rishi/ai-core'
import { AiNarrativeBlock } from '@rishi/design-system/components'
import { Button } from '@rishi/design-system/primitives'
import {
  HEADING_HEADLINE,
  HEADING_WHAT_MOVED,
  HEADING_SO_WHAT,
  HEADING_TALKING_POINTS,
  HEADING_RISKS,
} from '@/lib/narratives'

interface StreamingPanelProps {
  fixture: Fixture
  dashboardSlug: string
  dashboardTitle: string
  charsPerSecond?: number
}

type StepStatus = 'pending' | 'active' | 'done'

interface AnalysisStep {
  id: string
  label: string
  marker: string
}

const ANALYSIS_STEPS: AnalysisStep[] = [
  { id: 'reading', label: 'Reading dashboard data', marker: HEADING_HEADLINE },
  { id: 'movement', label: 'Identifying movement drivers', marker: HEADING_WHAT_MOVED },
  { id: 'significance', label: 'Checking metric significance', marker: HEADING_SO_WHAT },
  { id: 'narrative', label: 'Composing executive readout', marker: HEADING_TALKING_POINTS },
  { id: 'risks', label: 'Surfacing risks and caveats', marker: HEADING_RISKS },
]

export function StreamingPanel({
  fixture,
  dashboardSlug,
  dashboardTitle,
  charsPerSecond = 60,
}: StreamingPanelProps) {
  const [streamedText, setStreamedText] = React.useState('')
  const [streaming, setStreaming] = React.useState(false)
  const [completed, setCompleted] = React.useState(false)
  const abortRef = React.useRef<AbortController | null>(null)

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
    } catch (err) {
      if (!(err instanceof ReplayAbortedError)) throw err
    } finally {
      if (!ac.signal.aborted) setStreaming(false)
    }
  }, [fixture, charsPerSecond])

  const cancelStream = React.useCallback(() => {
    abortRef.current?.abort()
    setStreaming(false)
  }, [])

  React.useEffect(() => {
    startStream()
    return () => abortRef.current?.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const stepStatuses = React.useMemo<StepStatus[]>(() => {
    return ANALYSIS_STEPS.map((step, i) => {
      const seenThisStep = streamedText.includes(step.marker)
      const nextStep = ANALYSIS_STEPS[i + 1]
      const seenNextStep = nextStep
        ? streamedText.includes(nextStep.marker)
        : completed
      if (seenThisStep && seenNextStep) return 'done'
      if (seenThisStep) return 'active'
      if (i === 0 && streaming && !seenThisStep) return 'active'
      return 'pending'
    })
  }, [streamedText, streaming, completed])

  const downloadFilename = `${dashboardTitle.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-deck.pptx`

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-surface-border bg-surface p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-wider text-text-muted min-w-0">
            <Sparkles className="h-4 w-4 text-accent shrink-0" />
            <span className="truncate">
              {streaming
                ? 'Claude is analyzing the dashboard...'
                : completed
                  ? 'Analysis complete'
                  : 'Preparing analysis'}
            </span>
          </div>
          {streaming && (
            <Button variant="ghost" size="sm" onClick={cancelStream}>
              Cancel
            </Button>
          )}
          {completed && (
            <Button variant="ghost" size="sm" onClick={startStream}>
              <RotateCcw className="h-3.5 w-3.5" />
              Replay
            </Button>
          )}
        </div>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {ANALYSIS_STEPS.map((step, i) => (
            <ProgressStep
              key={step.id}
              num={i + 1}
              label={step.label}
              status={stepStatuses[i] ?? 'pending'}
            />
          ))}
        </ol>
      </div>

      <AiNarrativeBlock
        text={streamedText}
        streaming={streaming}
        title="Executive readout"
        variant="default"
      />

      {completed && (
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href={`/api/deck/${dashboardSlug}`}
            download={downloadFilename}
            className="inline-flex items-center gap-2 rounded-md bg-accent text-base-900 hover:bg-accent-light px-6 py-3 text-sm font-semibold shadow-glow-sm hover:shadow-glow-md transition-all"
          >
            <Download className="h-4 w-4" />
            Download PPTX
          </a>
          <span className="text-xs text-text-muted">
            7 slide deck themed to this dashboard, exported as a single PPTX file.
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
        {status === 'done' ? '✓' : num}
      </span>
      <span
        className={`text-xs font-medium leading-tight pt-1 transition-colors ${labelColor}`}
      >
        {label}
      </span>
    </li>
  )
}
