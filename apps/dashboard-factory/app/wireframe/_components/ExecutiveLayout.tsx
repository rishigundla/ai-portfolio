/**
 * Executive layout — sparse, oversized.
 * "1 number + 1 chart, sized for a CEO meeting room."
 *
 * Composition:
 *   - Headline KPI (oversized — 6xl-9xl scale)
 *   - 3 sub-KPI tiles in a row
 *   - 1 anchor trend chart full-width
 */

import { ArrowUp, ArrowDown, TrendingUp } from 'lucide-react'
import { ChartCard } from '@rishi/design-system/components'
import { Card } from '@rishi/design-system/primitives'
import { EXECUTIVE_DATA } from '@/lib/wireframe-templates'
import { MockLineChart } from './MockCharts'

const ACCENT = '#14b8a6'

export function ExecutiveLayout() {
  const { headline, subKpis, trend } = EXECUTIVE_DATA

  return (
    <div className="space-y-8 lg:space-y-10">
      {/* Headline KPI — oversized for boardroom presentation */}
      <Card className="p-8 lg:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 -mt-16 -mr-16 rounded-full bg-accent/5 blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="font-mono text-xs uppercase tracking-widest text-accent mb-3 inline-flex items-center gap-2">
            <TrendingUp className="h-3 w-3" />
            {headline.label}
          </div>
          <div className="font-display text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight bg-gradient-to-r from-accent-light to-accent bg-clip-text text-transparent leading-none">
            {headline.value}
          </div>
          <div className="mt-5 flex items-center gap-3 text-sm font-medium">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md ${
                headline.delta.direction === 'up'
                  ? 'bg-status-completed/10 text-status-completed'
                  : 'bg-status-blocked/10 text-status-blocked'
              }`}
            >
              {headline.delta.direction === 'up' ? (
                <ArrowUp className="h-3.5 w-3.5" />
              ) : (
                <ArrowDown className="h-3.5 w-3.5" />
              )}
              {headline.delta.value}%
            </span>
            <span className="text-text-muted font-mono text-xs uppercase tracking-wider">
              {headline.delta.period}
            </span>
          </div>
          {/* Sparkline strip under headline */}
          <div className="mt-8 max-w-2xl">
            <Sparkline values={headline.sparkline} />
          </div>
        </div>
      </Card>

      {/* 3 sub-KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {subKpis.map((kpi) => (
          <Card key={kpi.label} className="p-6">
            <div className="font-mono text-[11px] uppercase tracking-wider text-text-muted">
              {kpi.label}
            </div>
            <div className="mt-2 font-display text-3xl lg:text-4xl font-semibold text-text-primary tracking-tight">
              {kpi.value}
            </div>
            {kpi.delta && (
              <div
                className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${
                  kpi.delta.direction === 'up'
                    ? 'text-status-completed'
                    : 'text-status-blocked'
                }`}
              >
                {kpi.delta.direction === 'up' ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                <span>{kpi.delta.value}%</span>
                <span className="text-text-muted font-normal ml-1">
                  {kpi.delta.period}
                </span>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Anchor trend chart */}
      <ChartCard
        title="Quarterly Bookings — 3-Year View"
        subtitle="In $M · Quarter-end realized"
      >
        <MockLineChart data={trend} accent={ACCENT} height={260} />
      </ChartCard>
    </div>
  )
}

function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 100
      const y = 40 - ((v - min) / range) * 36
      return `${x},${y}`
    })
    .join(' ')
  return (
    <div className="flex items-end gap-2">
      <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted shrink-0 pb-1">
        10-quarter trend
      </span>
      <svg
        viewBox="0 0 100 42"
        preserveAspectRatio="none"
        className="flex-1 h-10"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="exec-spark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ACCENT} stopOpacity={0.4} />
            <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
          </linearGradient>
        </defs>
        <polygon
          points={`0,40 ${points} 100,40`}
          fill="url(#exec-spark)"
        />
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
    </div>
  )
}
