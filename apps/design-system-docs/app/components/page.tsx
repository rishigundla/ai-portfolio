'use client'

import * as React from 'react'
import {
  KpiCard,
  ChartCard,
  AiNarrativeBlock,
  FilterBar,
  DataGrid,
  type DataGridColumn,
} from '@rishi/design-system/components'
import { Button } from '@rishi/design-system/primitives'
import { replayFixture, ReplayAbortedError, type Fixture } from '@rishi/ai-core'
import { Section, SubSection } from '../_components/Section'

const SAMPLE_NARRATIVE = `Revenue is **up 12.4% MoM** to $14.8M, driven primarily by APAC expansion (+$1.2M) and strong renewal in the enterprise segment.

- **APAC** crossed the $3M quarterly threshold for the first time
- **SMB churn** has risen 4% WoW and warrants attention
- **NA enterprise** remains the anchor segment (42% of revenue)

Recommended focus for next week: investigate SMB churn drivers and double down on APAC channel partner enablement.`

// Live integration test: use @rishi/ai-core replayFixture to stream this fixture.
// When this renders correctly on production, it proves the full chain works:
// fixture JSON → replayFixture async generator → React state → AiNarrativeBlock.
const DEMO_FIXTURE: Fixture = {
  id: 'revops-weekly-demo',
  text: SAMPLE_NARRATIVE,
  metadata: {
    generatedAt: '2026-04-24T00:00:00.000Z',
    model: 'claude-sonnet-4-6',
    notes: 'Pre-generated showcase fixture for the design system docs site.',
  },
}

type Row = { name: string; category: string; revenue: number; delta: number }
const SAMPLE_ROWS: Row[] = [
  { name: 'RevOps Sales SSOT', category: 'Sales', revenue: 14_800_000, delta: 12.4 },
  { name: 'Marketing Campaigns', category: 'Marketing', revenue: 2_300_000, delta: 8.1 },
  { name: 'Pulse Atlas Telemetry', category: 'Product', revenue: 0, delta: 0 },
  { name: 'Supply Chain', category: 'Operations', revenue: 5_700_000, delta: -3.2 },
  { name: 'Financial Complaints', category: 'CX', revenue: 0, delta: 0 },
  { name: 'Customer Demographics', category: 'CX', revenue: 0, delta: 0 },
]

export default function ComponentsPage() {
  // Streaming simulation for AiNarrativeBlock — uses @rishi/ai-core replayFixture
  // (async generator) instead of a raw setInterval. Same UX, but exercises the
  // shared streaming primitive used by all 5 future AI apps.
  const [streamedText, setStreamedText] = React.useState('')
  const [streaming, setStreaming] = React.useState(false)
  const abortRef = React.useRef<AbortController | null>(null)

  const startStream = async () => {
    // Cancel any prior in-flight stream cleanly
    abortRef.current?.abort()
    const ac = new AbortController()
    abortRef.current = ac

    setStreamedText('')
    setStreaming(true)

    try {
      for await (const chunk of replayFixture(DEMO_FIXTURE, {
        charsPerSecond: 40,
        signal: ac.signal,
      })) {
        setStreamedText(chunk)
      }
    } catch (err) {
      if (!(err instanceof ReplayAbortedError)) throw err
    } finally {
      if (!ac.signal.aborted) setStreaming(false)
    }
  }

  React.useEffect(() => () => abortRef.current?.abort(), [])

  // FilterBar state
  const [search, setSearch] = React.useState('')
  const [segment, setSegment] = React.useState('all')
  const [dateRange, setDateRange] = React.useState('30d')
  const [segmentMulti, setSegmentMulti] = React.useState<string[]>([])
  const [dateMode, setDateMode] = React.useState<string>('all')
  const [dateStart, setDateStart] = React.useState<string | undefined>(undefined)
  const [dateEnd, setDateEnd] = React.useState<string | undefined>(undefined)

  return (
    <Section
      eyebrow="03 · Components"
      title="AI components"
      description="Five composed components built on top of primitives. These power every app in the portfolio."
    >
      <SubSection label="KpiCard" description="Value + directional delta + inline sparkline + 4 states">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Revenue"
            value="$14.8M"
            delta={{ value: 12.4, direction: 'up', period: 'MoM' }}
            sparkline={[10, 12, 11, 13, 15, 14, 16]}
          />
          <KpiCard
            label="Churn Rate"
            value="2.1"
            unit="%"
            delta={{ value: 0.4, direction: 'down', period: 'vs last week', invertGood: true }}
            sparkline={[3.1, 2.9, 2.7, 2.5, 2.4, 2.2, 2.1]}
          />
          <KpiCard label="Pipeline Coverage" value="3.2x" state="loading" />
          <KpiCard label="Active Alerts" value="—" state="empty" />
        </div>
      </SubSection>

      <SubSection label="ChartCard" description="Library-agnostic container with loading / empty / error states">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChartCard
            title="Revenue by Region"
            subtitle="Last 30 days"
            actions={
              <Button variant="ghost" size="sm">
                Export
              </Button>
            }
          >
            <div className="w-full h-full flex items-end gap-2 px-2">
              {[65, 45, 82, 72, 90, 55, 78].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-accent/80 hover:bg-accent rounded-t transition-colors"
                  style={{ height: `${h}%` }}
                  title={`Bar ${i + 1}: ${h}%`}
                />
              ))}
            </div>
          </ChartCard>
          <ChartCard title="Pipeline Trend" subtitle="Last 30 days" state="loading" />
        </div>
      </SubSection>

      <SubSection label="AiNarrativeBlock" description="Markdown renderer with streaming cursor — powers every Claude output in the portfolio">
        <div className="space-y-4">
          <Button onClick={startStream} disabled={streaming}>
            {streaming ? 'Streaming...' : 'Simulate Claude streaming'}
          </Button>
          <AiNarrativeBlock
            text={streamedText || SAMPLE_NARRATIVE}
            streaming={streaming}
            title="Weekly RevOps Brief"
            variant="accent"
          />
        </div>
      </SubSection>

      <SubSection label="FilterBar" description="Compound component — .Search, .Select, .MultiSelect, .DateRange, .DateRangePicker, .Clear">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-text-muted mb-2 font-mono">Single-select segment + preset date range (the original combo)</p>
            <FilterBar>
              <FilterBar.Search value={search} onValueChange={setSearch} placeholder="Search datasets..." />
              <FilterBar.Select
                label="Segment"
                value={segment}
                onValueChange={setSegment}
                options={[
                  { value: 'all', label: 'All Segments' },
                  { value: 'enterprise', label: 'Enterprise' },
                  { value: 'smb', label: 'SMB' },
                  { value: 'apac', label: 'APAC' },
                ]}
              />
              <FilterBar.DateRange value={dateRange} onValueChange={setDateRange} />
              <FilterBar.Clear
                onClear={() => {
                  setSearch('')
                  setSegment('all')
                  setDateRange('30d')
                }}
              />
            </FilterBar>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-2 font-mono">Multi-select segment (cmdk check-list) + custom date-range picker (popover with start/end inputs and preset chips)</p>
            <FilterBar>
              <FilterBar.MultiSelect
                label="Segments"
                values={segmentMulti}
                onValuesChange={setSegmentMulti}
                options={[
                  { value: 'enterprise', label: 'Enterprise' },
                  { value: 'mid-market', label: 'Mid-Market' },
                  { value: 'smb', label: 'SMB' },
                  { value: 'startup', label: 'Startup' },
                ]}
                allLabel="All segments"
              />
              <FilterBar.DateRangePicker
                mode={dateMode}
                start={dateStart}
                end={dateEnd}
                onPresetChange={(preset) => {
                  setDateMode(preset)
                  setDateStart(undefined)
                  setDateEnd(undefined)
                }}
                onCustomChange={(start, end) => {
                  setDateMode('custom')
                  setDateStart(start)
                  setDateEnd(end)
                }}
                onClear={() => {
                  setDateMode('all')
                  setDateStart(undefined)
                  setDateEnd(undefined)
                }}
              />
            </FilterBar>
          </div>
        </div>
      </SubSection>

      <SubSection label="DataGrid" description="Sortable columns, pagination, typed columns with render functions">
        <DataGrid<Row>
          data={SAMPLE_ROWS}
          pageSize={5}
          columns={GRID_COLUMNS}
          rowId={(r) => r.name}
        />
      </SubSection>
    </Section>
  )
}

const GRID_COLUMNS: DataGridColumn<Row>[] = [
  { key: 'name', label: 'Dataset', sortable: true },
  { key: 'category', label: 'Category', sortable: true, width: 'w-32' },
  {
    key: 'revenue',
    label: 'Revenue',
    sortable: true,
    align: 'right',
    width: 'w-40',
    render: (r) => (r.revenue === 0 ? <span className="text-text-muted">—</span> : `$${r.revenue.toLocaleString()}`),
  },
  {
    key: 'delta',
    label: 'MoM Delta',
    sortable: true,
    align: 'right',
    width: 'w-32',
    render: (r) =>
      r.delta === 0 ? (
        <span className="text-text-muted">—</span>
      ) : (
        <span className={r.delta > 0 ? 'text-status-completed' : 'text-status-blocked'}>
          {r.delta > 0 ? '+' : ''}
          {r.delta}%
        </span>
      ),
  },
]
