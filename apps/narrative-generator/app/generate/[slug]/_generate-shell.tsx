'use client'

import * as React from 'react'
import { Wand2 } from 'lucide-react'
import type { Fixture } from '@rishi/ai-core'
import { StreamingPanel } from './_streaming-panel'

interface GenerateShellProps {
  fixture: Fixture
  dashboardSlug: string
  dashboardTitle: string
  header: React.ReactNode
  dashboardPreview: React.ReactNode
  backLink: React.ReactNode
}

export function GenerateShell({
  fixture,
  dashboardSlug,
  dashboardTitle,
  header,
  dashboardPreview,
  backLink,
}: GenerateShellProps) {
  const [started, setStarted] = React.useState(false)
  const panelRef = React.useRef<HTMLDivElement>(null)

  const handleStart = React.useCallback(() => {
    setStarted(true)
    queueMicrotask(() => {
      panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

  return (
    <section className="section-container pt-12 pb-24">
      {backLink}
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        {header}
        {!started && (
          <button
            onClick={handleStart}
            className="inline-flex items-center gap-2 rounded-md bg-accent text-base-900 hover:bg-accent-light px-5 py-2.5 text-sm font-semibold shadow-glow-sm hover:shadow-glow-md transition-all self-start lg:self-end"
          >
            <Wand2 className="h-4 w-4" />
            Generate Narrative
          </button>
        )}
      </div>
      {dashboardPreview}
      {started && (
        <div ref={panelRef} className="mt-10 scroll-mt-8">
          <StreamingPanel
            fixture={fixture}
            dashboardSlug={dashboardSlug}
            dashboardTitle={dashboardTitle}
          />
        </div>
      )}
    </section>
  )
}
