'use client'

import * as React from 'react'
import { ChartCard, KpiCard } from '@rishi/design-system/components'
import type {
  DashboardChart,
  DashboardChartData,
  DashboardLayout,
} from '@/lib/dashboard-builder'
import type { ColorClassSet } from '@/lib/datasets'

interface DashboardViewProps {
  layout: DashboardLayout
  /** Color classes from the dataset's colorToken — used to theme charts. */
  colors: ColorClassSet
}

/**
 * The actual dashboard rendering. Server-built layout, client-rendered.
 *
 * Day 15 ships inline SVG chart previews. Day 16 swaps SVG for Recharts
 * (same DashboardChartData shape, just nicer renderer with tooltips +
 * interactivity). Keeping the prop contract stable across both days.
 */
export function DashboardView({ layout, colors }: DashboardViewProps) {
  return (
    <div className="space-y-6">
      {/* KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {layout.kpis.map((kpi, i) => (
          <KpiCard
            key={`${kpi.label}-${i}`}
            label={kpi.label}
            value={kpi.value}
            unit={kpi.unit}
            sparkline={kpi.sparkline}
          />
        ))}
      </div>

      {/* Charts grid — primary bar gets full width on large screens, others share row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {layout.charts.map((chart, i) => (
          <div key={chart.id} className={chartGridSpan(i, layout.charts.length)}>
            <ChartCard title={chart.title} subtitle={chart.subtitle}>
              <ChartRenderer chart={chart} colors={colors} />
            </ChartCard>
          </div>
        ))}
      </div>

      {/* Day 16 note */}
      <p className="text-xs text-text-muted font-mono mt-4">
        Charts above are inline-SVG previews of the actual aggregated data. Day 16 of the build plan
        swaps SVG for Recharts to add tooltips, hover interactions, and click-to-drill behavior. Same
        data shape, richer renderer.
      </p>
    </div>
  )
}

// ============================================================
// Layout helpers
// ============================================================

function chartGridSpan(index: number, total: number): string {
  // First chart gets full width on lg if there's only 1, otherwise 7-of-12
  if (total === 1) return 'lg:col-span-12'
  if (index === 0) return 'lg:col-span-7'
  if (index === 1) return 'lg:col-span-5'
  return 'lg:col-span-6'
}

// ============================================================
// SVG chart renderers
// ============================================================

function ChartRenderer({
  chart,
  colors,
}: {
  chart: DashboardChart
  colors: ColorClassSet
}) {
  switch (chart.data.type) {
    case 'bar':
      return <BarChartSvg data={chart.data} colors={colors} />
    case 'line':
      return <LineChartSvg data={chart.data} colors={colors} />
    case 'donut':
      return <DonutChartSvg data={chart.data} colors={colors} />
  }
}

function BarChartSvg({
  data,
  colors,
}: {
  data: Extract<DashboardChartData, { type: 'bar' }>
  colors: ColorClassSet
}) {
  if (data.bars.length === 0) {
    return <EmptyChart message="No data" />
  }
  return (
    <div className="w-full h-full flex flex-col gap-2 py-2">
      {data.bars.map((bar) => {
        const pct = data.max > 0 ? (bar.value / data.max) * 100 : 0
        return (
          <div key={bar.label} className="flex items-center gap-3 text-sm">
            <div className="w-28 sm:w-32 truncate text-text-secondary text-right shrink-0 text-xs sm:text-sm">
              {bar.label}
            </div>
            <div className="flex-1 h-6 bg-base-700/40 rounded-sm overflow-hidden relative">
              <div
                className={`h-full ${colors.iconColor} bg-current transition-all`}
                style={{ width: `${pct}%`, opacity: 0.7 }}
              />
            </div>
            <div className="w-20 sm:w-24 text-right font-mono text-xs text-text-secondary shrink-0">
              {formatBarValue(bar.value)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function LineChartSvg({
  data,
  colors: _colors,
}: {
  data: Extract<DashboardChartData, { type: 'line' }>
  colors: ColorClassSet
}) {
  if (data.points.length === 0) {
    return <EmptyChart message="No time-series data" />
  }
  const W = 600
  const H = 200
  const PAD_X = 16
  const PAD_Y = 12
  const innerW = W - PAD_X * 2
  const innerH = H - PAD_Y * 2

  const points = data.points
    .map((p, i) => {
      const x = PAD_X + (i / Math.max(1, data.points.length - 1)) * innerW
      const y = PAD_Y + innerH - (data.max > 0 ? (p.value / data.max) * innerH : 0)
      return `${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')

  // Area path (line + drop to baseline)
  const area = `M ${PAD_X},${PAD_Y + innerH} L ${points.split(' ').join(' L ')} L ${PAD_X + innerW},${PAD_Y + innerH} Z`

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full flex-1 min-h-[120px]">
        <defs>
          <linearGradient id="line-area-gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* gridlines */}
        {[0.25, 0.5, 0.75].map((t) => (
          <line
            key={t}
            x1={PAD_X}
            x2={PAD_X + innerW}
            y1={PAD_Y + innerH * t}
            y2={PAD_Y + innerH * t}
            stroke="var(--color-surface-border)"
            strokeWidth="1"
            strokeDasharray="2 4"
          />
        ))}
        {/* Filled area */}
        <path d={area} fill="url(#line-area-gradient)" />
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* Endpoints */}
        {data.points.map((_, i) => {
          const x = PAD_X + (i / Math.max(1, data.points.length - 1)) * innerW
          const y =
            PAD_Y +
            innerH -
            (data.max > 0 ? (data.points[i]!.value / data.max) * innerH : 0)
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill="var(--color-accent)"
              vectorEffect="non-scaling-stroke"
            />
          )
        })}
      </svg>
      {/* x-axis labels */}
      <div className="flex justify-between font-mono text-[10px] text-text-muted px-2">
        {data.points.length <= 8 ? (
          data.points.map((p, i) => <span key={i}>{p.label}</span>)
        ) : (
          <>
            <span>{data.points[0]!.label}</span>
            <span>{data.points[data.points.length - 1]!.label}</span>
          </>
        )}
      </div>
    </div>
  )
}

function DonutChartSvg({
  data,
  colors: _colors,
}: {
  data: Extract<DashboardChartData, { type: 'donut' }>
  colors: ColorClassSet
}) {
  if (data.slices.length === 0 || data.total === 0) {
    return <EmptyChart message="No distribution data" />
  }

  const SIZE = 200
  const CENTER = SIZE / 2
  const RADIUS = 80
  const STROKE = 28

  // Walk the circle laying down arcs
  let startAngle = -Math.PI / 2 // start at top
  const arcs = data.slices.map((slice, i) => {
    const angle = (slice.pct / 100) * Math.PI * 2
    const endAngle = startAngle + angle
    const largeArc = angle > Math.PI ? 1 : 0
    const x1 = CENTER + RADIUS * Math.cos(startAngle)
    const y1 = CENTER + RADIUS * Math.sin(startAngle)
    const x2 = CENTER + RADIUS * Math.cos(endAngle)
    const y2 = CENTER + RADIUS * Math.sin(endAngle)
    const path = `M ${x1.toFixed(2)},${y1.toFixed(2)} A ${RADIUS},${RADIUS} 0 ${largeArc} 1 ${x2.toFixed(2)},${y2.toFixed(2)}`
    const result = { path, slice, idx: i }
    startAngle = endAngle
    return result
  })

  // Use accent + Tailwind palette for slices to keep visual consistency
  const arcStrokes = [
    'var(--color-accent)',
    '#a78bfa', // purple-400
    '#60a5fa', // blue-400
    '#fbbf24', // amber-400
    '#fb7185', // rose-400
    '#34d399', // emerald-400
  ]

  return (
    <div className="w-full h-full flex items-center gap-4">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-32 h-32 sm:w-40 sm:h-40 shrink-0">
        {arcs.map((arc, i) => (
          <path
            key={i}
            d={arc.path}
            fill="none"
            stroke={arcStrokes[i % arcStrokes.length]}
            strokeWidth={STROKE}
            strokeLinecap="butt"
            opacity={0.85}
          />
        ))}
        <text
          x={CENTER}
          y={CENTER - 4}
          textAnchor="middle"
          className="fill-text-primary font-display text-2xl font-semibold"
        >
          {data.total}
        </text>
        <text
          x={CENTER}
          y={CENTER + 18}
          textAnchor="middle"
          className="fill-text-muted font-mono text-[10px] uppercase tracking-wider"
        >
          total
        </text>
      </svg>
      {/* Legend */}
      <ul className="flex-1 flex flex-col gap-1.5 text-sm min-w-0">
        {data.slices.map((slice, i) => (
          <li key={slice.label} className="flex items-center gap-2 min-w-0">
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: arcStrokes[i % arcStrokes.length] }}
            />
            <span className="flex-1 truncate text-text-secondary text-xs sm:text-sm">
              {slice.label}
            </span>
            <span className="font-mono text-xs text-text-muted shrink-0">
              {slice.pct.toFixed(0)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center text-sm text-text-muted">
      {message}
    </div>
  )
}

function formatBarValue(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  if (value % 1 !== 0) return value.toFixed(1)
  return String(Math.round(value))
}
