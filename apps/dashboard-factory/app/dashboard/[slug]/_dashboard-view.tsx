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
          />
        ))}
      </div>

      {/* Charts grid. Primary bar gets 7-of-12 on lg, secondary gets 5-of-12.
          Drill chip appears in the actions slot for bar + donut charts so the
          clickable affordance is visible at the chart level (not buried in a
          footer line). Line chart has no drill behavior, so no chip. */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
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

const PALETTE = [
  'var(--color-accent)',
  '#a78bfa', // purple-400
  '#60a5fa', // blue-400
  '#fbbf24', // amber-400
  '#fb7185', // rose-400
  '#34d399', // emerald-400
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

function ChartRenderer({
  chart,
  colors,
  onBarClick,
  onDonutClick,
}: {
  chart: DashboardChart
  colors: ColorClassSet
  onBarClick?: (dimensionKey: string, dimensionLabel: string, label: string) => void
  onDonutClick?: (dimensionKey: string, dimensionLabel: string, label: string) => void
}) {
  switch (chart.data.type) {
    case 'bar':
      return <BarChartView data={chart.data} colors={colors} onBarClick={onBarClick} />
    case 'line':
      return <LineChartView data={chart.data} colors={colors} />
    case 'donut':
      return (
        <DonutChartView data={chart.data} colors={colors} onDonutClick={onDonutClick} />
      )
    case 'heatmap':
      return <HeatmapChartView data={chart.data} />
    case 'scatter':
      return <ScatterChartView data={chart.data} />
  }
}

// ============================================================
// Recharts implementations
// ============================================================

function BarChartView({
  data,
  colors: _colors,
  onBarClick,
}: {
  data: Extract<DashboardChartData, { type: 'bar' }>
  colors: ColorClassSet
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
            cursor={{ fill: 'rgba(45, 212, 191, 0.08)' }}
          />
          <Bar
            dataKey="value"
            fill="var(--color-accent)"
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

function LineChartView({
  data,
  colors: _colors,
}: {
  data: Extract<DashboardChartData, { type: 'line' }>
  colors: ColorClassSet
}) {
  if (data.points.length === 0) {
    return <EmptyChart message="No time-series data" />
  }
  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data.points}
          margin={{ top: 8, right: 16, left: 0, bottom: 4 }}
        >
          <defs>
            <linearGradient id="line-area-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
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
              stroke: 'var(--color-accent)',
              strokeWidth: 1,
              strokeDasharray: '3 3',
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--color-accent)"
            strokeWidth={2}
            fill="url(#line-area-gradient)"
            dot={{ fill: 'var(--color-accent)', r: 3, strokeWidth: 0 }}
            activeDot={{
              r: 5,
              fill: 'var(--color-accent-light)',
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
  onDonutClick,
}: {
  data: Extract<DashboardChartData, { type: 'donut' }>
  colors: ColorClassSet
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
                  fill={PALETTE[i % PALETTE.length]}
                  fillOpacity={0.85}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center text overlay, pointer-events-none so slice hover still works */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="font-display text-2xl font-semibold text-text-primary leading-none">
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
                style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
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
}: {
  data: Extract<DashboardChartData, { type: 'heatmap' }>
}) {
  if (data.cells.length === 0 || data.max === 0) {
    return <EmptyChart message="No heatmap data" />
  }
  const cellMap = React.useMemo(() => {
    const m = new Map<string, number>()
    for (const c of data.cells) m.set(`${c.x}|${c.y}`, c.value)
    return m
  }, [data.cells])

  return (
    <div className="w-full h-[280px] flex flex-col text-xs">
      {/* Grid: y-label column + one column per x-label */}
      <div
        className="flex-1 grid gap-px overflow-hidden rounded-md border border-surface-border"
        style={{
          gridTemplateColumns: `minmax(80px, 110px) repeat(${data.xLabels.length}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${data.yLabels.length}, minmax(0, 1fr))`,
        }}
      >
        {data.yLabels.map((y) => (
          <React.Fragment key={y}>
            <div className="flex items-center px-2 bg-surface text-text-secondary truncate">
              {y}
            </div>
            {data.xLabels.map((x) => {
              const v = cellMap.get(`${x}|${y}`) ?? 0
              const intensity = data.max > 0 ? v / data.max : 0
              return (
                <div
                  key={`${x}|${y}`}
                  title={`${y} · ${x}: ${formatChartValue(v)} ${data.valueLabel}`}
                  className="bg-surface relative"
                  style={{
                    backgroundColor:
                      intensity > 0
                        ? `rgba(45, 212, 191, ${0.08 + intensity * 0.8})`
                        : 'var(--color-surface)',
                  }}
                />
              )
            })}
          </React.Fragment>
        ))}
      </div>

      {/* x-axis labels under the grid (skipped first column for y-label gutter) */}
      <div
        className="grid gap-px mt-2 text-text-muted font-mono text-[10px]"
        style={{
          gridTemplateColumns: `minmax(80px, 110px) repeat(${data.xLabels.length}, minmax(0, 1fr))`,
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
            background:
              'linear-gradient(to right, rgba(45, 212, 191, 0.08), rgba(45, 212, 191, 0.88))',
          }}
        />
        <span>{formatChartValue(data.max)}</span>
        <span className="text-text-secondary truncate">{data.valueLabel}</span>
      </div>
    </div>
  )
}

// ============================================================
// Scatter (Recharts ScatterChart)
// ============================================================

function ScatterChartView({
  data,
}: {
  data: Extract<DashboardChartData, { type: 'scatter' }>
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
            cursor={{ strokeDasharray: '3 3', stroke: 'var(--color-accent)' }}
          />
          <Scatter
            data={data.points}
            fill="var(--color-accent)"
            fillOpacity={0.7}
            stroke="var(--color-accent-light)"
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
