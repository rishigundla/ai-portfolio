'use client'

import * as React from 'react'
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
  Tooltip,
  type TooltipProps,
  XAxis,
  YAxis,
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

      {/* Charts grid — primary bar gets 7-of-12 on lg, secondary gets 5-of-12 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {layout.charts.map((chart, i) => (
          <div key={chart.id} className={chartGridSpan(i, layout.charts.length)}>
            <ChartCard title={chart.title} subtitle={chart.subtitle}>
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
        ))}
      </div>

      <p className="text-xs text-text-muted font-mono mt-4">
        Charts powered by Recharts · hover for tooltips · click bars or slices to drill into matching rows
      </p>
    </div>
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
    <div className="w-full h-full min-h-[240px]">
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
    <div className="w-full h-full min-h-[240px]">
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
        {/* Center text overlay — pointer-events-none so slice hover still works */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="font-display text-2xl font-semibold text-text-primary leading-none">
            {data.total}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-text-muted mt-1">
            total
          </div>
        </div>
      </div>

      {/* Legend — also clickable */}
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
