'use client'

import * as React from 'react'
import { Sparkles, RotateCcw } from 'lucide-react'
import {
  replayFixture,
  ReplayAbortedError,
  type Fixture,
} from '@rishi/ai-core'
import { AiNarrativeBlock } from '@rishi/design-system/components'
import { Button } from '@rishi/design-system/primitives'
import { BRIEF_SECTIONS } from '@/lib/briefs'

interface StreamingBriefPanelProps {
  brief: Fixture
  /**
   * Streaming cadence in chars per second. Default 60 matches the
   * narrative generator panel cadence. Same primitive, same feel.
   */
  charsPerSecond?: number
}

type StepStatus = 'pending' | 'active' | 'done'

export function StreamingBriefPanel({
  brief,
  charsPerSecond = 60,
}: StreamingBriefPanelProps) {
  const [streamedText, setStreamedText] = React.useState('')
  const [streaming, setStreaming] = React.useState(false)
  const [completed, setCompleted] = React.useState(false)
  const abortRef = React.useRef<AbortController | null>(null)

  // Compute step status from streamed text plus completion flag. A
  // section is "done" once a later section has started rendering. The
  // last section is "done" only when streaming completes.
  const stepStatuses = React.useMemo<StepStatus[]>(() => {
    if (!streamedText && !streaming) {
      return BRIEF_SECTIONS.map(() => 'pending')
    }
    return BRIEF_SECTIONS.map((section, i) => {
      const seenThisStep = streamedText.includes(section.marker)
      const nextStep = BRIEF_SECTIONS[i + 1]
      const seenNextStep = nextStep
        ? streamedText.includes(nextStep.marker)
        : completed
      if (seenThisStep && seenNextStep) return 'done'
      if (seenThisStep) return 'active'
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
      for await (const chunk of replayFixture(brief, {
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
  }, [brief, charsPerSecond])

  const cancelStream = React.useCallback(() => {
    abortRef.current?.abort()
    setStreaming(false)
  }, [])

  // Auto start on mount. The streaming is the headline product moment
  // so it plays on every visit, mirroring the narrative generator
  // philosophy.
  React.useEffect(() => {
    startStream()
    return () => abortRef.current?.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-surface-border bg-base-800/40 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-text-muted min-w-0">
            <Sparkles className="h-4 w-4 text-accent shrink-0" />
            <span className="truncate">
              {streaming
                ? 'Claude is writing the brief...'
                : completed
                  ? 'Brief complete'
                  : 'Preparing brief'}
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
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {BRIEF_SECTIONS.map((section, i) => (
            <ProgressStep
              key={section.id}
              num={i + 1}
              label={section.label}
              status={stepStatuses[i] ?? 'pending'}
            />
          ))}
        </ol>
      </div>

      <AiNarrativeBlock
        text={streamedText}
        streaming={streaming}
        title="Sprint review brief"
        variant="default"
      />
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
    <li className="flex items-center gap-2.5">
      <span
        aria-label={`Step ${num} ${status}`}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-mono text-[10px] font-semibold transition-colors ${ring}`}
      >
        {status === 'done' ? '✓' : num}
      </span>
      <span className={`text-[11px] font-medium ${labelColor}`}>{label}</span>
    </li>
  )
}
