/**
 * Exploratory layout — analyst's notebook view.
 * "Filter rail + flexible grid for ad-hoc investigation."
 *
 * Composition:
 *   - Sticky left filter rail with: dimensions, segments, date range
 *   - Flexible 12-col content area with KPIs + cohort heatmap + 2 charts
 */

import { ArrowUp, ArrowDown, Filter, Search, ChevronDown, Plus } from 'lucide-react'
import { ChartCard } from '@rishi/design-system/components'
import { Card } from '@rishi/design-system/primitives'
import { EXPLORATORY_DATA } from '@/lib/wireframe-templates'
import { MockBarChart, MockDonutChart, MockCohortHeatmap } from './MockCharts'

const ACCENT = '#a78bfa'

export function ExploratoryLayout() {
  const {
    segments,
    dimensions,
    dateRanges,
    kpis,
    cohortHeatmap,
    industryMix,
    ltvDistribution,
  } = EXPLORATORY_DATA

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Filter rail */}
      <aside className="lg:col-span-3 space-y-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-purple-400" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-text-secondary">
              Filters
            </span>
          </div>

          {/* Search */}
          <div className="mb-4">
            <label className="font-mono text-[10px] uppercase tracking-wider text-text-muted block mb-1.5">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
              <div className="h-8 pl-8 pr-2 bg-base-700 border border-surface-border rounded-md flex items-center text-xs text-text-muted">
                customer or industry...
              </div>
            </div>
          </div>

          {/* Segments */}
          <div className="mb-4">
            <label className="font-mono text-[10px] uppercase tracking-wider text-text-muted block mb-1.5">
              Segments
            </label>
            <div className="space-y-1">
              {segments.map((seg, i) => (
                <label
                  key={seg}
                  className="flex items-center gap-2 text-xs text-text-secondary cursor-default"
                >
                  <span
                    className={`h-3.5 w-3.5 rounded-sm border ${
                      i < 3
                        ? 'bg-purple-400/80 border-purple-400'
                        : 'border-surface-border bg-base-700'
                    } flex items-center justify-center`}
                  >
                    {i < 3 && (
                      <svg
                        className="h-2.5 w-2.5 text-base-900"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M2 6l3 3 5-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span>{seg}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Group by */}
          <div className="mb-4">
            <label className="font-mono text-[10px] uppercase tracking-wider text-text-muted block mb-1.5">
              Group by
            </label>
            <div className="h-8 px-3 bg-base-700 border border-surface-border rounded-md flex items-center justify-between text-xs">
              <span className="text-text-primary">{dimensions[1]}</span>
              <ChevronDown className="h-3.5 w-3.5 text-text-muted" />
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {dimensions.map((d, i) => (
                <span
                  key={d}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    i === 1
                      ? 'bg-purple-400/15 text-purple-400 border border-purple-400/30'
                      : 'bg-base-700 text-text-muted border border-surface-border'
                  }`}
                >
                  {d}
                </span>
              ))}
            </div>
          </div>

          {/* Date range */}
          <div className="mb-4">
            <label className="font-mono text-[10px] uppercase tracking-wider text-text-muted block mb-1.5">
              Date range
            </label>
            <div className="h-8 px-3 bg-base-700 border border-surface-border rounded-md flex items-center justify-between text-xs">
              <span className="text-text-primary">{dateRanges[2]}</span>
              <ChevronDown className="h-3.5 w-3.5 text-text-muted" />
            </div>
          </div>

          {/* Saved views (suggestion) */}
          <div className="pt-3 border-t border-surface-border">
            <button
              type="button"
              className="w-full inline-flex items-center justify-center gap-1.5 text-xs text-text-muted hover:text-accent transition-colors"
            >
              <Plus className="h-3 w-3" />
              Save current view
            </button>
          </div>
        </Card>
      </aside>

      {/* Main content */}
      <main className="lg:col-span-9 space-y-5">
        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {kpis.map((kpi) => (
            <Card key={kpi.label} className="p-4">
              <div className="font-mono text-[10px] uppercase tracking-wider text-text-muted truncate">
                {kpi.label}
              </div>
              <div className="mt-1.5 flex items-baseline gap-1">
                <span className="font-display text-2xl lg:text-3xl font-semibold text-text-primary tabular-nums tracking-tight">
                  {kpi.value}
                </span>
                {kpi.unit && (
                  <span className="text-[11px] text-text-muted font-mono">
                    {kpi.unit}
                  </span>
                )}
              </div>
              {kpi.delta ? (
                <div
                  className={`mt-1.5 inline-flex items-center gap-1 text-[10px] font-medium ${
                    isTimeToValue(kpi.label)
                      ? kpi.delta.direction === 'down'
                        ? 'text-status-completed'
                        : 'text-status-blocked'
                      : kpi.delta.direction === 'up'
                        ? 'text-status-completed'
                        : 'text-status-blocked'
                  }`}
                >
                  {kpi.delta.direction === 'up' ? (
                    <ArrowUp className="h-2.5 w-2.5" />
                  ) : (
                    <ArrowDown className="h-2.5 w-2.5" />
                  )}
                  <span>{kpi.delta.value}%</span>
                  <span className="text-text-muted font-normal ml-0.5">
                    {kpi.delta.period}
                  </span>
                </div>
              ) : kpi.sparkline ? (
                <MiniSpark values={kpi.sparkline} />
              ) : null}
            </Card>
          ))}
        </div>

        {/* Cohort heatmap — full-width feature chart */}
        <ChartCard
          title="Retention cohort matrix"
          subtitle="% retained · monthly cohorts"
        >
          <MockCohortHeatmap
            matrix={cohortHeatmap}
            rowLabels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
            colLabels={['M+1', 'M+3', 'M+6', 'M+9', 'M+12']}
            accent={ACCENT}
          />
        </ChartCard>

        {/* 2-up bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="Customer mix by industry" subtitle="In current view">
            <MockDonutChart data={industryMix} />
          </ChartCard>
          <ChartCard
            title="LTV distribution"
            subtitle="Customer count by lifetime value bucket"
          >
            <MockBarChart data={ltvDistribution} accent={ACCENT} />
          </ChartCard>
        </div>
      </main>
    </div>
  )
}

function MiniSpark({ values }: { values: number[] }) {
  if (values.length < 2) return null
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 100
      const y = 30 - ((v - min) / range) * 26
      return `${x},${y}`
    })
    .join(' ')
  return (
    <svg
      viewBox="0 0 100 32"
      preserveAspectRatio="none"
      className="mt-2 w-full h-6"
      aria-hidden="true"
    >
      <polyline
        fill="none"
        stroke={ACCENT}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        points={points}
      />
    </svg>
  )
}

/** Time-to-value: down is good (faster onboarding). */
function isTimeToValue(label: string): boolean {
  return label.toLowerCase().includes('time to value')
}
