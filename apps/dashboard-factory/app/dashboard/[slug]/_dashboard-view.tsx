'use client'

import * as React from 'react'
import { MousePointerClick } from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  type TooltipProps,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts'
import { ChartCard, KpiCard } from '@rishi/design-system/components'
import {
  Tooltip as RadixTooltip,
  TooltipContent as RadixTooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rishi/design-system/primitives'
import { cn } from '@rishi/design-system/lib/cn'
import type {
  DashboardChart,
  DashboardChartData,
  DashboardLayout,
} from '@/lib/dashboard-builder'
import type { ColorClassSet } from '@/lib/datasets'
import { ChartErrorBoundary } from './_chart-error-boundary'

interface DashboardViewProps {
  layout: DashboardLayout
  /** Color classes from the dataset's colorToken — used to theme charts. */
  colors: ColorClassSet
  /**
   * Resolved hex string for the dataset's accent. Used to color KPI values,
   * sparkline strokes, chart bars / lines / dots / data labels, and any
   * other highlighted chart element so every chart pulls from the same
   * dashboard accent (not the design system teal default).
   */
  accentHex: string
  /** Bar/donut click handlers — open the drill-down dialog on the parent. */
  onBarClick?: (dimensionKey: string, dimensionLabel: string, label: string) => void
  onDonutClick?: (dimensionKey: string, dimensionLabel: string, label: string) => void
}

/**
 * The actual dashboard rendering. Server-built layout, client-rendered.
 *
 * As of Week 3 Day 2, charts are powered by Recharts (was inline SVG on
 * Day 1). Day 3 added click-to-drill on bar + donut charts via the
 * onBarClick / onDonutClick props.
 */
export function DashboardView({
  layout,
  colors,
  accentHex,
  onBarClick,
  onDonutClick,
}: DashboardViewProps) {
  return (
    <div className="space-y-6">
      {/* KPI strip, responsive shape depends on count. 5-up on lg, then
          stepping down through 3+2 (sm), then 1-up (mobile). The 3-col sm
          breakpoint matters: with 2-up at sm, 5 KPIs would render 2+2+1,
          leaving the last card orphaned. 3-up at sm gives 3+2 which feels
          balanced even on tablets. 4-KPI dashboards keep the 4-up pattern. */}
      <div className={`grid grid-cols-1 ${layout.kpis.length === 5 ? 'sm:grid-cols-3 lg:grid-cols-5' : 'sm:grid-cols-2 lg:grid-cols-4'} gap-4`}>
        {layout.kpis.map((kpi, i) => (
          <KpiCard
            key={`${kpi.label}-${i}`}
            label={kpi.label}
            value={kpi.value}
            unit={kpi.unit}
            sparkline={kpi.sparkline}
            delta={kpi.delta}
            accent={accentHex}
          />
        ))}
      </div>

      {/* Charts grid. Primary bar gets 7-of-12 on lg, secondary gets 5-of-12.
          Drill chip appears in the actions slot for bar + donut charts so the
          clickable affordance is visible at the chart level (not buried in a
          footer line). Line chart has no drill behavior, so no chip. */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 dashboard-chart-row">
        {layout.charts.map((chart, i) => {
          const drillable =
            (chart.data.type === 'bar' && !!onBarClick) ||
            (chart.data.type === 'donut' && !!onDonutClick)
          return (
            <div key={chart.id} className={chartGridSpan(i, layout.charts.length)}>
              <ChartCard
                title={chart.title}
                subtitle={chart.subtitle}
                actions={drillable ? <DrillChip /> : undefined}
              >
                <ChartErrorBoundary chartKind={chart.data.type}>
                  <ChartRenderer
                    chart={chart}
                    colors={colors}
                    accentHex={accentHex}
                    onBarClick={onBarClick}
                    onDonutClick={onDonutClick}
                  />
                </ChartErrorBoundary>
              </ChartCard>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-text-muted font-mono mt-4">
        Charts powered by Recharts. Hover for tooltips.
      </p>
    </div>
  )
}

// ============================================================
// Drill affordance — small chip in the ChartCard actions slot
// signals that bars or slices are clickable. Visible at chart level
// rather than only in a hover-cursor or page footer hint.
// ============================================================

function DrillChip() {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-accent"
      aria-label="Click bars or slices to drill in"
    >
      <MousePointerClick className="h-3 w-3" aria-hidden="true" />
      Click to drill in
    </span>
  )
}

// ============================================================
// Layout helpers
// ============================================================

function chartGridSpan(index: number, total: number): string {
  if (total === 1) return 'lg:col-span-12'
  if (index === 0) return 'lg:col-span-7'
  if (index === 1) return 'lg:col-span-5'
  return 'lg:col-span-6'
}

// ============================================================
// Shared palette + tooltip
// ============================================================

// Donut chart palette — routes through the design-system chart tokens so
// every slice re-themes between dark and light mode. The first slot is
// the dataset accent (already themed), the remaining slots are the
// chart palette in an order that maximizes contrast between adjacent
// indices (cool, cool, warm, warm, cool-green). Adjacent indices are
// always from different hue families so a typical 2-3 slice donut never
// renders two near-identical fills.
const PALETTE = [
  'var(--color-accent)',
  'var(--chart-violet)',
  'var(--chart-blue)',
  'var(--chart-amber)',
  'var(--chart-rose)',
  'var(--chart-emerald)',
] as const

function formatChartValue(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  if (value % 1 !== 0) return value.toFixed(1)
  return String(Math.round(value))
}

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null
  const item = payload[0]
  if (!item) return null
  const value = typeof item.value === 'number' ? item.value : 0
  return (
    <div className="rounded-md border border-surface-border bg-surface-elevated px-3 py-2 shadow-lg text-xs backdrop-blur-sm">
      {label && (
        <div className="text-text-muted mb-1 font-mono text-[10px] uppercase tracking-wider">
          {String(label)}
        </div>
      )}
      <div className="flex items-center gap-2">
        {item.color && (
          <span
            className="h-2 w-2 rounded-full shrink-0"
            style={{ backgroundColor: item.color }}
          />
        )}
        <span className="text-text-secondary">
          {String(item.name ?? item.dataKey ?? 'value')}
        </span>
        <span className="text-text-primary font-mono font-semibold">
          {formatChartValue(value)}
        </span>
      </div>
    </div>
  )
}

// ============================================================
// Chart renderer dispatcher
// ============================================================

export function ChartRenderer({
  chart,
  colors,
  accentHex,
  onBarClick,
  onDonutClick,
}: {
  chart: DashboardChart
  /** Currently unused by chart bodies (token CSS vars cover theming) but kept
   *  on the contract so callers can stay future-proof. Optional from W4.D7
   *  so reusable contexts (drill-down dialog) don't have to plumb it. */
  colors?: ColorClassSet
  /** Dataset accent hex. Optional so the drill-down dialog can call without
   *  threading it. Falls back to the design-system accent when omitted. */
  accentHex?: string
  onBarClick?: (dimensionKey: string, dimensionLabel: string, label: string) => void
  onDonutClick?: (dimensionKey: string, dimensionLabel: string, label: string) => void
}) {
  const accent = accentHex ?? 'var(--color-accent)'
  switch (chart.data.type) {
    case 'bar':
      return <BarChartView data={chart.data} colors={colors} accent={accent} onBarClick={onBarClick} />
    case 'line':
      return <LineChartView data={chart.data} colors={colors} accent={accent} />
    case 'donut':
      return (
        <DonutChartView data={chart.data} colors={colors} accent={accent} onDonutClick={onDonutClick} />
      )
    case 'heatmap':
      return <HeatmapChartView data={chart.data} accent={accent} />
    case 'scatter':
      return <ScatterChartView data={chart.data} accent={accent} />
    case 'funnel':
      return <FunnelChartView data={chart.data} accent={accent} onSegmentClick={onBarClick} />
    case 'histogram':
      return <HistogramChartView data={chart.data} accent={accent} />
  }
}

// ============================================================
// Recharts implementations
// ============================================================

function BarChartView({
  data,
  colors: _colors,
  accent = 'var(--color-accent)',
  onBarClick,
}: {
  data: Extract<DashboardChartData, { type: 'bar' }>
  colors?: ColorClassSet
  accent?: string
  onBarClick?: (dimensionKey: string, dimensionLabel: string, label: string) => void
}) {
  if (data.bars.length === 0) {
    return <EmptyChart message="No data" />
  }
  const isClickable = !!onBarClick
  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data.bars}
          layout="vertical"
          margin={{ top: 8, right: 16, left: 0, bottom: 4 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-surface-border)"
            horizontal={false}
          />
          <XAxis
            type="number"
            tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
            tickFormatter={formatChartValue}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={120}
            tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: hexToRgba(accent, 0.08) }}
          />
          <Bar
            dataKey="value"
            fill={accent}
            fillOpacity={0.75}
            radius={[0, 4, 4, 0]}
            cursor={isClickable ? 'pointer' : undefined}
            onClick={(payload: { label?: string }) => {
              if (onBarClick && payload?.label) {
                onBarClick(data.dimensionKey, data.dimensionLabel, payload.label)
              }
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Convert a hex color (#RRGGBB) to an rgba() string at the given alpha.
// Used for chart hover cursors and heatmap intensity tints so they share
// the dataset accent without needing to maintain a parallel CSS variable.
// Falls back to a teal accent if the input is not a 6-char hex (e.g.
// caller passed a CSS variable string).
function hexToRgba(hex: string, alpha: number): string {
  if (!hex.startsWith('#') || hex.length !== 7) {
    return `rgb(var(--color-accent-rgb) / ${alpha})`
  }
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function LineChartView({
  data,
  colors: _colors,
  accent = 'var(--color-accent)',
}: {
  data: Extract<DashboardChartData, { type: 'line' }>
  colors?: ColorClassSet
  accent?: string
}) {
  if (data.points.length === 0) {
    return <EmptyChart message="No time-series data" />
  }
  // Unique gradient id per accent so two charts with different accents
  // on the same page do not collide on the linearGradient id.
  const gradId = `line-area-gradient-${accent.replace(/[^a-z0-9]/gi, '')}`
  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data.points}
          margin={{ top: 8, right: 16, left: 0, bottom: 4 }}
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accent} stopOpacity={0.3} />
              <stop offset="100%" stopColor={accent} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-surface-border)"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
            tickFormatter={formatChartValue}
            axisLine={false}
            tickLine={false}
            width={45}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: accent,
              strokeWidth: 1,
              strokeDasharray: '3 3',
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={accent}
            strokeWidth={2}
            fill={`url(#${gradId})`}
            dot={{ fill: accent, r: 3, strokeWidth: 0 }}
            activeDot={{
              r: 5,
              fill: accent,
              strokeWidth: 0,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

function DonutChartView({
  data,
  colors: _colors,
  accent = 'var(--color-accent)',
  onDonutClick,
}: {
  data: Extract<DashboardChartData, { type: 'donut' }>
  colors?: ColorClassSet
  accent?: string
  onDonutClick?: (dimensionKey: string, dimensionLabel: string, label: string) => void
}) {
  if (data.slices.length === 0 || data.total === 0) {
    return <EmptyChart message="No distribution data" />
  }
  const isClickable = !!onDonutClick
  const triggerSlice = (label: string) => {
    // Don't drill into the synthetic "Other" bucket (no source rows match it)
    if (!onDonutClick || label === 'Other') return
    onDonutClick(data.dimensionKey, data.dimensionLabel, label)
  }
  // First slot resolves to the dataset accent so the donut leads with the
  // dashboard's accent. Slots 2-6 stay in the chart palette for hue
  // separation across slices.
  const palette = [accent, ...PALETTE.slice(1)]
  return (
    <div className="w-full h-full flex items-center gap-4">
      {/* Donut + centered total label */}
      <div className="relative w-32 h-32 sm:w-40 sm:h-40 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data.slices}
              dataKey="value"
              nameKey="label"
              innerRadius="62%"
              outerRadius="100%"
              paddingAngle={1}
              strokeWidth={0}
              isAnimationActive
              cursor={isClickable ? 'pointer' : undefined}
              onClick={(payload: { label?: string }) => {
                if (payload?.label) triggerSlice(payload.label)
              }}
            >
              {data.slices.map((_, i) => (
                <Cell
                  key={i}
                  fill={palette[i % palette.length]}
                  fillOpacity={0.85}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center text overlay, pointer-events-none so slice hover still works */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div
            className="font-display text-2xl font-semibold leading-none"
            style={{ color: accent }}
          >
            {data.total}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-text-muted mt-1">
            total
          </div>
        </div>
      </div>

      {/* Legend, also clickable */}
      <ul className="flex-1 flex flex-col gap-1.5 text-sm min-w-0">
        {data.slices.map((slice, i) => {
          const clickableLegend = isClickable && slice.label !== 'Other'
          return (
            <li
              key={slice.label}
              className={`flex items-center gap-2 min-w-0 ${clickableLegend ? 'cursor-pointer hover:text-text-primary' : ''}`}
              onClick={() => clickableLegend && triggerSlice(slice.label)}
            >
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: palette[i % palette.length] }}
              />
              <span className="flex-1 truncate text-text-secondary text-xs sm:text-sm">
                {slice.label}
              </span>
              <span className="font-mono text-xs text-text-muted shrink-0">
                {slice.pct.toFixed(0)}%
              </span>
            </li>
          )
        })}
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

// ============================================================
// Heatmap (CSS grid — Recharts has no heatmap primitive)
// ============================================================

function HeatmapChartView({
  data,
  accent = 'var(--color-accent)',
}: {
  data: Extract<DashboardChartData, { type: 'heatmap' }>
  accent?: string
}) {
  if (data.cells.length === 0 || data.max === 0) {
    return <EmptyChart message="No heatmap data" />
  }
  const cellMap = React.useMemo(() => {
    const m = new Map<string, number>()
    for (const c of data.cells) m.set(`${c.x}|${c.y}`, c.value)
    return m
  }, [data.cells])

  // Widen the y-label column when long labels would otherwise truncate.
  // Heatmap dimension labels are domain-driven (subjects, regions, products,
  // industries) so 110px is too tight for strings like "Computer Science",
  // "Financial Services", "Manufacturing & Logistics". Sample the longest
  // label and derive a min width so the full text renders without truncation
  // while keeping the column from dominating the chart on short labels.
  const longestY = data.yLabels.reduce((acc, label) => Math.max(acc, label.length), 0)
  const yColPx = Math.max(110, Math.min(180, longestY * 8 + 16))
  // Data labels render inside each cell when the cell is large enough to fit
  // legible text. With more than 60 cells the grid gets too dense for in-cell
  // text and the labels fall back to hover-only via the title attribute.
  const cellCount = data.xLabels.length * data.yLabels.length
  const showCellLabels = cellCount <= 60

  return (
    <TooltipProvider delayDuration={120} skipDelayDuration={60}>
      <div className="w-full h-[280px] flex flex-col text-xs">
        {/* Grid: y-label column + one column per x-label. Each value-bearing
            cell is wrapped in a Radix Tooltip so the hover surface renders
            the same styled tooltip the rest of the dashboard uses. Native
            title was a plain black box that did not theme; the Radix
            primitive resolves to bg-surface-elevated + border-surface-border
            in both modes. */}
        <div
          className="flex-1 grid gap-px overflow-hidden rounded-md border border-surface-border"
          style={{
            gridTemplateColumns: `${yColPx}px repeat(${data.xLabels.length}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${data.yLabels.length}, minmax(0, 1fr))`,
          }}
        >
          {data.yLabels.map((y) => (
            <React.Fragment key={y}>
              <div className="flex items-center px-2 bg-surface text-text-secondary whitespace-nowrap">
                {y}
              </div>
              {data.xLabels.map((x) => {
                const v = cellMap.get(`${x}|${y}`) ?? 0
                const intensity = data.max > 0 ? v / data.max : 0
                const cell = (
                  <div
                    className="bg-surface relative flex items-center justify-center w-full h-full"
                    style={{
                      backgroundColor:
                        intensity > 0
                          ? hexToRgba(accent, 0.08 + intensity * 0.8)
                          : 'var(--color-surface)',
                    }}
                  >
                    {showCellLabels && v > 0 && (
                      <span
                        className="font-mono text-[10px] font-semibold pointer-events-none"
                        style={{
                          // High intensity cells get a high contrast text color
                          // that flips with the theme so the value reads against
                          // the saturated accent fill. Low intensity cells use
                          // the default text token so the label reads against
                          // the near-surface background.
                          color:
                            intensity > 0.55
                              ? 'var(--color-base-900)'
                              : 'var(--color-text-primary)',
                        }}
                      >
                        {formatChartValue(v)}
                      </span>
                    )}
                  </div>
                )
                return v > 0 ? (
                  <RadixTooltip key={`${x}|${y}`}>
                    <TooltipTrigger asChild>{cell}</TooltipTrigger>
                    <RadixTooltipContent sideOffset={6}>
                      <div className="text-text-muted font-mono text-[10px] uppercase tracking-wider mb-1">
                        {y} · {x}
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: accent }}
                        />
                        <span className="text-text-secondary">{data.valueLabel}</span>
                        <span className="text-text-primary font-mono font-semibold">
                          {formatChartValue(v)}
                        </span>
                      </div>
                    </RadixTooltipContent>
                  </RadixTooltip>
                ) : (
                  <React.Fragment key={`${x}|${y}`}>{cell}</React.Fragment>
                )
              })}
            </React.Fragment>
          ))}
        </div>

      {/* x-axis labels under the grid (skipped first column for y-label gutter) */}
      <div
        className="grid gap-px mt-2 text-text-muted font-mono text-[10px]"
        style={{
          gridTemplateColumns: `${yColPx}px repeat(${data.xLabels.length}, minmax(0, 1fr))`,
        }}
      >
        <div />
        {data.xLabels.map((x) => (
          <div key={x} className="truncate text-center">
            {x}
          </div>
        ))}
      </div>

      {/* Legend bar */}
      <div className="mt-2 flex items-center gap-2 text-text-muted font-mono text-[10px]">
        <span>0</span>
        <div
          className="flex-1 h-1.5 rounded-full"
          style={{
            background: `linear-gradient(to right, ${hexToRgba(accent, 0.08)}, ${hexToRgba(accent, 0.88)})`,
          }}
        />
        <span>{formatChartValue(data.max)}</span>
        <span className="text-text-secondary truncate">{data.valueLabel}</span>
      </div>
      </div>
    </TooltipProvider>
  )
}

// ============================================================
// Scatter (Recharts ScatterChart)
// ============================================================

function ScatterChartView({
  data,
  accent = 'var(--color-accent)',
}: {
  data: Extract<DashboardChartData, { type: 'scatter' }>
  accent?: string
}) {
  if (data.points.length === 0) {
    return <EmptyChart message="No scatter data" />
  }
  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 16 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-surface-border)"
          />
          <XAxis
            type="number"
            dataKey="x"
            name={data.xLabel}
            tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
            tickFormatter={formatChartValue}
            axisLine={false}
            tickLine={false}
            label={{
              value: data.xLabel,
              position: 'insideBottom',
              offset: -8,
              style: {
                fontSize: 10,
                fill: 'var(--color-text-secondary)',
                fontFamily: 'var(--font-mono)',
              },
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name={data.yLabel}
            tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
            tickFormatter={formatChartValue}
            axisLine={false}
            tickLine={false}
            width={45}
          />
          <ZAxis range={[40, 40]} />
          <Tooltip
            content={<ScatterTooltip xLabel={data.xLabel} yLabel={data.yLabel} />}
            cursor={{ strokeDasharray: '3 3', stroke: accent }}
          />
          <Scatter
            data={data.points}
            fill={accent}
            fillOpacity={0.7}
            stroke={accent}
            strokeWidth={1}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

function ScatterTooltip({
  active,
  payload,
  xLabel,
  yLabel,
}: TooltipProps<number, string> & { xLabel: string; yLabel: string }) {
  if (!active || !payload || payload.length === 0) return null
  const point = payload[0]?.payload as
    | { x: number; y: number; label: string }
    | undefined
  if (!point) return null
  return (
    <div className="rounded-md border border-surface-border bg-surface-elevated px-3 py-2 shadow-lg text-xs backdrop-blur-sm">
      {point.label && (
        <div className="text-text-muted mb-1.5 font-mono text-[10px] uppercase tracking-wider">
          {point.label}
        </div>
      )}
      <div className="space-y-0.5">
        <div className="flex justify-between gap-4">
          <span className="text-text-secondary">{xLabel}</span>
          <span className="text-text-primary font-mono font-semibold">
            {formatChartValue(point.x)}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-text-secondary">{yLabel}</span>
          <span className="text-text-primary font-mono font-semibold">
            {formatChartValue(point.y)}
          </span>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Funnel (CSS — descending tapered bars)
// ============================================================

function FunnelChartView({
  data,
  accent = 'var(--color-accent)',
  onSegmentClick,
}: {
  data: Extract<DashboardChartData, { type: 'funnel' }>
  accent?: string
  onSegmentClick?: (dimensionKey: string, dimensionLabel: string, label: string) => void
}) {
  if (data.stages.length === 0) {
    return <EmptyChart message="No funnel data" />
  }
  // Drill-in only when the funnel was built from a real dim column —
  // measure-aggregated funnels (impressions → clicks) have no rows to filter
  // by stage, so we don't show a click affordance for them.
  const isClickable = !!onSegmentClick && !!data.dimensionKey
  const triggerStage = (label: string) => {
    if (!isClickable || !data.dimensionKey || !data.dimensionLabel) return
    onSegmentClick!(data.dimensionKey, data.dimensionLabel, label)
  }
  // Bar widths still scale by value/max so the funnel reads as a funnel
  // (largest stage = full width, others narrow proportionally). The
  // displayed percentage now sums to 100% across all stages because the
  // builder switched to share-of-total computation.
  const max = data.stages.reduce((m, s) => Math.max(m, s.value), 0)

  return (
    <TooltipProvider delayDuration={120} skipDelayDuration={60}>
      <div className="w-full h-[280px] flex flex-col justify-center gap-1.5 px-2">
        {data.stages.map((stage, i) => {
          const widthPct = max > 0 ? (stage.value / max) * 100 : 0
          return (
            <div
              key={`${stage.label}-${i}`}
              className="flex items-center gap-3 group"
            >
              <div className="w-28 shrink-0 text-xs text-text-secondary truncate text-right">
                {stage.label}
              </div>
              <div className="flex-1 flex justify-center items-center h-7">
                <RadixTooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      disabled={!isClickable}
                      onClick={() => triggerStage(stage.label)}
                      className={cn(
                        'h-full rounded-md transition-all min-w-[2px]',
                        isClickable ? 'cursor-pointer' : 'cursor-default',
                      )}
                      style={{ width: `${widthPct}%`, backgroundColor: accent }}
                      aria-label={`${stage.label}: ${stage.value}`}
                    />
                  </TooltipTrigger>
                  <RadixTooltipContent sideOffset={6}>
                    <div className="text-text-muted font-mono text-[10px] uppercase tracking-wider mb-1">
                      {stage.label}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: accent }}
                      />
                      <span className="text-text-secondary">{data.valueLabel}</span>
                      <span className="text-text-primary font-mono font-semibold">
                        {formatChartValue(stage.value)}
                      </span>
                      <span className="text-text-muted font-mono">
                        ({stage.pct}%)
                      </span>
                    </div>
                  </RadixTooltipContent>
                </RadixTooltip>
              </div>
              <div className="w-14 shrink-0 text-right text-xs font-mono font-semibold text-text-primary">
                {formatChartValue(stage.value)}
              </div>
              <div className="w-12 shrink-0 text-right text-xs font-mono text-text-muted">
                {stage.pct}%
              </div>
            </div>
          )
        })}
      </div>
    </TooltipProvider>
  )
}

// ============================================================
// Histogram (Recharts BarChart — no-gap vertical bars)
// ============================================================

function HistogramChartView({
  data,
  accent = 'var(--color-accent)',
}: {
  data: Extract<DashboardChartData, { type: 'histogram' }>
  accent?: string
}) {
  if (data.bins.length === 0) {
    return <EmptyChart message="No histogram data" />
  }
  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data.bins}
          margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
          barCategoryGap={1}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-surface-border)"
            vertical={false}
          />
          <XAxis
            dataKey="rangeLabel"
            tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
            tickFormatter={formatChartValue}
            axisLine={false}
            tickLine={false}
            width={45}
            allowDecimals={false}
          />
          <Tooltip
            content={<HistogramTooltip measureLabel={data.measureLabel} unit={data.unit} />}
            cursor={{ fill: hexToRgba(accent, 0.08) }}
          />
          <Bar
            dataKey="count"
            fill={accent}
            fillOpacity={0.75}
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function HistogramTooltip({
  active,
  payload,
  measureLabel,
  unit,
}: TooltipProps<number, string> & { measureLabel: string; unit?: string }) {
  if (!active || !payload || payload.length === 0) return null
  const bin = payload[0]?.payload as
    | { rangeLabel: string; rangeMin: number; rangeMax: number; count: number }
    | undefined
  if (!bin) return null
  return (
    <div className="rounded-md border border-surface-border bg-surface-elevated px-3 py-2 shadow-lg text-xs backdrop-blur-sm">
      <div className="text-text-muted mb-1 font-mono text-[10px] uppercase tracking-wider">
        {measureLabel}
        {unit ? ` (${unit})` : ''}
      </div>
      <div className="text-text-secondary">
        {formatChartValue(bin.rangeMin)} – {formatChartValue(bin.rangeMax)}
      </div>
      <div className="mt-1 text-text-primary font-mono font-semibold">
        {bin.count} {bin.count === 1 ? 'record' : 'records'}
      </div>
    </div>
  )
}
