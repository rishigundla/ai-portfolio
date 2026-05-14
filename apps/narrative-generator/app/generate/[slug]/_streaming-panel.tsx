'use client'

import * as React from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight, RotateCcw } from 'lucide-react'
import {
  replayFixture,
  ReplayAbortedError,
  type Fixture,
} from '@rishi/ai-core'
import { AiNarrativeBlock } from '@rishi/design-system/components'
import { Button } from '@rishi/design-system/primitives'
import { NARRATIVE_SECTIONS } from '@/lib/narratives'

interface StreamingPanelProps {
  fixture: Fixture
  dashboardSlug: string
  /**
   * Streaming cadence in chars/sec. Default 60 — slightly faster than
   * typical Claude streaming for demo pacing. Matches Project 1.
   */
  charsPerSecond?: number
}

type StepStatus = 'pending' | 'active' | 'done'

export function StreamingPanel({
  fixture,
  dashboardSlug,
  charsPerSecond = 60,
}: StreamingPanelProps) {
  const [streamedText, setStreamedText] = React.useState('')
  const [streaming, setStreaming] = React.useState(false)
  const [completed, setCompleted] = React.useState(false)
  const abortRef = React.useRef<AbortController | null>(null)

  // Compute progress-step status from the streamed text. A section is
  // "done" once a later section has started; the last section is "done"
  // only when streaming completes (no later marker to watch).
  const stepStatuses = React.useMemo<StepStatus[]>(() => {
    if (!streamedText && !streaming) {
      return NARRATIVE_SECTIONS.map(() => 'pending')
    }
    return NARRATIVE_SECTIONS.map((section, i) => {
      const seenThisStep = streamedText.includes(section.marker)
      const nextStep = NARRATIVE_SECTIONS[i + 1]
      const seenNextStep = nextStep
        ? streamedText.includes(nextStep.marker)
        : completed
      if (seenThisStep && seenNextStep) return 'done'
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

  // Auto-start the stream once mounted. The streaming animation IS the
  // headline product moment ("watch Claude write the readout") — same
  // philosophy as Project 1, so we replay it every visit. No Zustand
  // navigation guard here; /deck/[slug] doesn't require a prior generate.
  React.useEffect(() => {
    startStream()
    return () => abortRef.current?.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-6">
      {/* Progress steps */}
      <div className="rounded-xl border border-surface-border bg-surface p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-wider text-text-muted min-w-0">
            <Sparkles className="h-4 w-4 text-accent shrink-0" />
            <span className="truncate">
              {streaming
                ? 'Claude is writing the readout...'
                : completed
                  ? 'Narrative complete'
                  : 'Ready to generate'}
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
          {NARRATIVE_SECTIONS.map((section, i) => (
            <ProgressStep
              key={section.id}
              num={i + 1}
              label={section.label}
              status={stepStatuses[i] ?? 'pending'}
            />
          ))}
        </ol>
      </div>

      {/* Streaming narrative */}
      <AiNarrativeBlock
        text={streamedText}
        streaming={streaming}
        title="Executive readout"
        variant="default"
      />

      {/* Continue CTA */}
      {completed && (
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href={`/deck/${dashboardSlug}`}
            className="inline-flex items-center gap-2 rounded-md bg-accent text-base-900 hover:bg-accent-light px-6 py-3 text-sm font-semibold shadow-glow-sm hover:shadow-glow-md transition-all"
          >
            Generate deck
            <ArrowRight className="h-4 w-4" />
          </Link>
          <span className="text-xs text-text-muted">
            Title slide + headline metric + per-bullet detail slides + closing recap.
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
    <li className="flex items-center gap-3">
      <span
        aria-label={`Step ${num} ${status}`}
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-semibold transition-colors ${ring}`}
      >
        {status === 'done' ? '✓' : num}
      </span>
      <span className={`text-xs font-medium ${labelColor}`}>{label}</span>
    </li>
  )
}
