'use client'

import * as React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import type {
  DashboardFixture,
  KpiSpec,
  ChartSpec,
  ChartDataPoint,
} from '@/lib/full-dashboards'
import { getColorClasses, type ColorClassSet } from '@/lib/dashboards'
import { formatKpiValue, HEX_BY_TOKEN } from '@/lib/format-kpi'

// Hover tooltip mirroring the Recharts CustomTooltip used in Project 1's
// completion trend chart (see apps/dashboard-factory/.../_dashboard-view.tsx).
// Same surface, border, padding, text hierarchy, and shadow so the two
// projects share a single tooltip language.
interface ChartTooltipPoint {
  x: number
  y: number
  label: string
  value: number
  seriesName?: string
  swatchColor?: string
}

function ChartTooltip({ point }: { point: ChartTooltipPoint | null }) {
  if (!point) return null
  return (
    <div
      // 24px offset above the cursor with horizontal center keeps the
      // tooltip from sitting on top of the data point and triggering
      // pointer-leave loops on small marks.
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full"
      style={{ left: point.x, top: point.y - 8 }}
    >
      <div className="rounded-md border border-surface-border bg-surface-elevated px-3 py-2 shadow-lg text-xs backdrop-blur-sm">
        <div className="text-text-muted mb-1 font-mono text-[10px] uppercase tracking-wider whitespace-nowrap">
          {point.label}
        </div>
        <div className="flex items-center gap-2 whitespace-nowrap">
          {point.swatchColor && (
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: point.swatchColor }}
            />
          )}
          {point.seriesName && (
            <span className="text-text-secondary">{point.seriesName}</span>
          )}
          <span className="text-text-primary font-mono font-semibold">
            {formatBarValue(point.value)}
          </span>
        </div>
      </div>
    </div>
  )
}

interface DashboardPreviewProps {
  dashboard: DashboardFixture
}

export function DashboardPreview({ dashboard }: DashboardPreviewProps) {
  const colors = getColorClasses(dashboard.metadata.colorToken)
  const accentHex = HEX_BY_TOKEN[dashboard.metadata.colorToken]

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {dashboard.kpis.map((kpi) => (
          <KpiTile key={kpi.id} kpi={kpi} colors={colors} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {dashboard.charts.map((chart) => (
          <ChartCard key={chart.id} chart={chart} accentHex={accentHex} />
        ))}
      </div>

      <RowsTable rows={dashboard.rows} />
    </div>
  )
}

function KpiTile({ kpi, colors }: { kpi: KpiSpec; colors: ColorClassSet }) {
  const hasDelta =
    typeof kpi.deltaPct === 'number' && kpi.deltaDirection !== undefined
  const Arrow = kpi.deltaDirection === 'up' ? TrendingUp : TrendingDown

  return (
    <div className="rounded-lg border border-surface-border bg-surface p-4 flex flex-col gap-2">
      <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted truncate">
        {kpi.label}
      </p>
      <p
        className={`font-display text-2xl sm:text-3xl font-semibold tracking-tight ${colors.iconColor} truncate`}
      >
        {formatKpiValue(kpi)}
      </p>
      {hasDelta && (
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-text-secondary">
          <Arrow className="h-3 w-3" />
          <span className="font-semibold text-text-primary">
            {kpi.deltaPct?.toFixed(1)}%
          </span>
          {kpi.deltaWindow && (
            <span className="text-text-muted truncate">{kpi.deltaWindow}</span>
          )}
        </div>
      )}
      {kpi.subtext && !hasDelta && (
        <p className="text-[11px] text-text-secondary leading-snug line-clamp-2">
          {kpi.subtext}
        </p>
      )}
    </div>
  )
}

function ChartCard({
  chart,
  accentHex,
}: {
  chart: ChartSpec
  accentHex: string
}) {
  return (
    <div className="rounded-lg border border-surface-border bg-surface p-4 flex flex-col gap-3">
      <div>
        <h3 className="font-display text-sm font-semibold text-text-primary">
          {chart.title}
        </h3>
        {chart.subtitle && (
          <p className="text-[11px] text-text-muted mt-0.5 line-clamp-2">
            {chart.subtitle}
          </p>
        )}
      </div>
      <div className="flex-1 min-h-[180px]">
        {chart.type === 'line' && (
          <LineChartSvg data={chart.data} accentHex={accentHex} />
        )}
        {chart.type === 'bar' && (
          <BarChartSvg data={chart.data} accentHex={accentHex} />
        )}
        {chart.type === 'donut' && (
          <DonutChartSvg data={chart.data} accentHex={accentHex} />
        )}
      </div>
    </div>
  )
}

function LineChartSvg({
  data,
  accentHex,
}: {
  data: ChartDataPoint[]
  accentHex: string
}) {
  const [hover, setHover] = React.useState<ChartTooltipPoint | null>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  if (data.length === 0) return null
  const values = data.map((d) => d.value)
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const width = 280
  const height = 160
  const padX = 12
  // Reserve more top padding when data labels render above each point so the
  // top-most label is not clipped by the SVG viewBox edge.
  const showLabels = data.length <= 8
  const padTop = showLabels ? 18 : 14
  const padBottom = 14
  const innerW = width - padX * 2
  const innerH = height - padTop - padBottom

  const points = data.map((d, i) => {
    const x = padX + (i / Math.max(1, data.length - 1)) * innerW
    const y = padTop + innerH - ((d.value - min) / range) * innerH
    return { x, y, label: d.label, value: d.value }
  })

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${path} L ${points[points.length - 1]?.x} ${padTop + innerH} L ${points[0]?.x} ${padTop + innerH} Z`

  // Convert an SVG-space point (within the 280x160 viewBox) into the
  // tooltip's pixel-space coordinates relative to the container, so the
  // ChartTooltip can sit at the hovered data point in the DOM regardless
  // of the SVG's responsive scaling.
  const handleEnter = (p: (typeof points)[number]) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setHover({
      x: (p.x / width) * rect.width,
      y: (p.y / height) * rect.height,
      label: p.label,
      value: p.value,
      swatchColor: accentHex,
    })
  }

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
        preserveAspectRatio="none"
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={`line-grad-${accentHex.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accentHex} stopOpacity="0.32" />
            <stop offset="100%" stopColor={accentHex} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#line-grad-${accentHex.slice(1)})`} />
        <path d={path} fill="none" stroke={accentHex} strokeWidth="2" />
        {points.map((p) => (
          // Each data point is the styled-tooltip hit target plus an
          // optional always-on label when the chart has eight or fewer
          // points. The native <title> is intentionally NOT used so the
          // tooltip stays styled (matching Project 1's CustomTooltip).
          <g
            key={`${p.label}-${p.x}`}
            onMouseEnter={() => handleEnter(p)}
            style={{ cursor: 'pointer' }}
          >
            {/* invisible larger hit area so hover is reliable on small dots */}
            <circle cx={p.x} cy={p.y} r="8" fill="transparent" />
            <circle cx={p.x} cy={p.y} r="2.6" fill={accentHex} />
            {showLabels && (
              <text
                x={p.x}
                y={p.y - 6}
                textAnchor="middle"
                className="font-mono"
                fontSize="9"
                fill={accentHex}
              >
                {formatBarValue(p.value)}
              </text>
            )}
          </g>
        ))}
      </svg>
      <ChartTooltip point={hover} />
    </div>
  )
}

function BarChartSvg({
  data,
  accentHex,
}: {
  data: ChartDataPoint[]
  accentHex: string
}) {
  const [hover, setHover] = React.useState<ChartTooltipPoint | null>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  if (data.length === 0) return null
  const max = Math.max(...data.map((d) => d.value))

  const handleEnter = (
    d: ChartDataPoint,
    target: HTMLElement,
  ) => {
    const rect = containerRef.current?.getBoundingClientRect()
    const dot = target.getBoundingClientRect()
    if (!rect) return
    setHover({
      x: dot.left + dot.width / 2 - rect.left,
      y: dot.top - rect.top,
      label: d.label,
      value: d.value,
      swatchColor: accentHex,
    })
  }

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col gap-1.5"
      onMouseLeave={() => setHover(null)}
    >
      {data.map((d) => {
        const pct = (d.value / max) * 100
        return (
          <div
            key={d.label}
            className="flex items-center gap-2"
            onMouseEnter={(e) => handleEnter(d, e.currentTarget)}
          >
            <span className="text-[10px] text-text-muted w-20 truncate font-mono">
              {d.label}
            </span>
            <div className="flex-1 h-3 rounded-sm bg-base-700 overflow-hidden">
              <div
                className="h-full rounded-sm"
                style={{ width: `${pct}%`, backgroundColor: accentHex, opacity: 0.85 }}
              />
            </div>
            <span
              className="text-[10px] font-mono w-14 text-right truncate"
              style={{ color: accentHex }}
            >
              {formatBarValue(d.value)}
            </span>
          </div>
        )
      })}
      <ChartTooltip point={hover} />
    </div>
  )
}

// Donut segment palette — design-system chart tokens that re-theme between
// dark and light mode. Index rotation maximizes hue contrast between
// adjacent slices (cool-green, cool-purple, warm-yellow, cool-blue,
// warm-pink, neutral-slate) so a 2-5 slice donut never renders two
// near-identical fills. The dataset accentHex stays in use elsewhere
// in the dashboard (bar chart, KPI accents); only the donut segments
// switch to the shared chart palette so the slices are visually
// separable at a glance.
const DONUT_PALETTE = [
  'var(--chart-emerald)',
  'var(--chart-violet)',
  'var(--chart-amber)',
  'var(--chart-blue)',
  'var(--chart-rose)',
  'var(--chart-slate)',
] as const

function DonutChartSvg({
  data,
  accentHex: _accentHex,
}: {
  data: ChartDataPoint[]
  accentHex: string
}) {
  if (data.length === 0) return null
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1
  const size = 140
  const cx = size / 2
  const cy = size / 2
  const radius = 56
  const inner = 32

  let acc = 0
  const arcs = data.map((d, i) => {
    const start = (acc / total) * 2 * Math.PI
    acc += d.value
    const end = (acc / total) * 2 * Math.PI
    const fill = DONUT_PALETTE[i % DONUT_PALETTE.length]
    return { start, end, fill, label: d.label, value: d.value }
  })

  const [hover, setHover] = React.useState<ChartTooltipPoint | null>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleEnter = (
    arc: (typeof arcs)[number],
    target: SVGPathElement | HTMLLIElement,
  ) => {
    const rect = containerRef.current?.getBoundingClientRect()
    const t = target.getBoundingClientRect()
    if (!rect) return
    setHover({
      x: t.left + t.width / 2 - rect.left,
      y: t.top - rect.top,
      label: arc.label,
      value: arc.value,
      swatchColor: arc.fill,
    })
  }

  return (
    <div
      ref={containerRef}
      className="relative flex items-center gap-4"
      onMouseLeave={() => setHover(null)}
    >
      <svg viewBox={`0 0 ${size} ${size}`} className="w-32 h-32 shrink-0">
        {arcs.map((arc, i) => (
          <path
            key={`${arc.label}-${i}`}
            d={arcPath(cx, cy, radius, inner, arc.start, arc.end)}
            fill={arc.fill}
            opacity={0.9}
            onMouseEnter={(e) => handleEnter(arc, e.currentTarget)}
            style={{ cursor: 'pointer' }}
          />
        ))}
        {/* Center fill uses the surface token so the donut hole matches the
            chart card background in both dark and light mode. Previously
            this was hardcoded to #0d111c which stayed dark in light mode. */}
        <circle cx={cx} cy={cy} r={inner - 1} fill="var(--color-surface)" />
      </svg>
      <ul className="flex-1 space-y-1 min-w-0">
        {arcs.map((arc, i) => (
          <li
            key={`${arc.label}-${i}`}
            className="flex items-center gap-2 text-[11px]"
            onMouseEnter={(e) => handleEnter(arc, e.currentTarget)}
          >
            <span
              className="h-2 w-2 rounded-sm shrink-0"
              style={{ backgroundColor: arc.fill, opacity: 0.9 }}
            />
            <span className="text-text-secondary truncate flex-1">{arc.label}</span>
            <span className="text-text-muted font-mono">
              {Math.round((arc.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
      <ChartTooltip point={hover} />
    </div>
  )
}

function arcPath(
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  startAngle: number,
  endAngle: number,
): string {
  const startOuter = polar(cx, cy, outer, startAngle)
  const endOuter = polar(cx, cy, outer, endAngle)
  const startInner = polar(cx, cy, inner, endAngle)
  const endInner = polar(cx, cy, inner, startAngle)
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0
  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${outer} ${outer} 0 ${largeArc} 1 ${endOuter.x} ${endOuter.y}`,
    `L ${startInner.x} ${startInner.y}`,
    `A ${inner} ${inner} 0 ${largeArc} 0 ${endInner.x} ${endInner.y}`,
    'Z',
  ].join(' ')
}

function polar(cx: number, cy: number, r: number, angleRad: number) {
  return {
    x: cx + r * Math.cos(angleRad - Math.PI / 2),
    y: cy + r * Math.sin(angleRad - Math.PI / 2),
  }
}

function formatBarValue(v: number): string {
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
  if (Math.abs(v) >= 1_000) return `${(v / 1_000).toFixed(0)}K`
  return v.toLocaleString()
}

function RowsTable({ rows }: { rows: Record<string, unknown>[] }) {
  if (rows.length === 0) return null
  // Show every column the fixture defines (capped at 8 to keep the table
  // from overflowing on narrow viewports). Surface up to eight preview rows
  // so the table reads as a real data sample rather than a teaser strip.
  const columns = Object.keys(rows[0] ?? {}).slice(0, 8)
  const preview = rows.slice(0, 8)
  // Decide alignment per column based on the value type of the first
  // non-null cell. Numeric columns right-align so digits stack and read as
  // tabular figures; everything else stays left-aligned.
  const alignByCol = new Map<string, 'left' | 'right'>()
  for (const col of columns) {
    const sample = preview.find((row) => row[col] !== null && row[col] !== undefined)
    const v = sample?.[col]
    alignByCol.set(col, typeof v === 'number' ? 'right' : 'left')
  }

  return (
    <div className="rounded-lg border border-surface-border bg-surface overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
        <div>
          <h3 className="font-display text-base font-semibold text-text-primary">
            Detail Table
          </h3>
          <p className="text-[11px] text-text-muted mt-0.5">
            Source rows backing the KPIs and charts above.
          </p>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted shrink-0">
          {preview.length} of {rows.length} rows
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[12px] border-collapse">
          <thead className="bg-base-700/50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  scope="col"
                  className={`px-4 py-3 font-mono text-[10px] font-semibold text-text-secondary uppercase tracking-wider whitespace-nowrap border-b border-surface-border ${
                    alignByCol.get(col) === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {col.replace(/_/g, ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {preview.map((row, i) => (
              <tr key={i} className="transition-colors hover:bg-base-800/40">
                {columns.map((col) => {
                  const formatted = formatCellValue(row[col])
                  return (
                    <td
                      key={col}
                      title={formatted}
                      className={`px-4 py-2.5 text-text-primary whitespace-nowrap max-w-[220px] truncate ${
                        alignByCol.get(col) === 'right'
                          ? 'text-right font-mono tabular-nums'
                          : 'text-left'
                      }`}
                    >
                      {formatted}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'number') {
    if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`
    if (Math.abs(value) >= 10_000) return value.toLocaleString()
    if (Number.isInteger(value)) return value.toLocaleString()
    return value.toFixed(2)
  }
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return String(value)
}
