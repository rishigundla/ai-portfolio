/**
 * Static SVG chart placeholders for wireframe mode.
 *
 * Why hand-rolled SVG instead of Recharts:
 *   - Wireframes are static — no resize / tooltip / filter recompute
 *   - Pure server components — no 'use client' boundary, no hydration cost
 *   - Renders identically in HTML and PDF
 *   - Visual language mirrors the live dashboard so the preview reads true
 *
 * All charts accept a `accent` prop so each template can carry its own color.
 */

import type {
  MockBars,
  MockDonut,
  MockLine,
} from '@/lib/wireframe-templates'

interface ChartPropsBase {
  accent?: string
  className?: string
}

// ============================================================
// Horizontal bars — used for "by category" comparisons
// ============================================================

export function MockBarChart({
  data,
  accent = '#14b8a6',
  showValues = true,
}: ChartPropsBase & { data: MockBars; showValues?: boolean }) {
  const { bars, max } = data
  return (
    <div className="w-full space-y-2.5">
      {bars.map((bar) => {
        const pct = (bar.value / max) * 100
        return (
          <div key={bar.label} className="flex items-center gap-3">
            <span className="w-20 shrink-0 text-xs font-mono text-text-muted truncate">
              {bar.label}
            </span>
            <div className="flex-1 h-6 bg-base-700 rounded-sm overflow-hidden relative">
              <div
                className="h-full rounded-sm transition-all"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(to right, ${accent}cc, ${accent})`,
                }}
              />
            </div>
            {showValues && (
              <span className="w-14 shrink-0 text-xs font-mono text-text-secondary tabular-nums text-right">
                {bar.value.toLocaleString()}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ============================================================
// Area / line trend — used for time-series anchors
// ============================================================

export function MockLineChart({
  data,
  accent = '#14b8a6',
  height = 200,
}: ChartPropsBase & { data: MockLine; height?: number }) {
  const { points, max } = data
  if (points.length < 2) return null

  const W = 400
  const H = height
  const PADDING_X = 8
  const PADDING_Y = 12
  const innerW = W - PADDING_X * 2
  const innerH = H - PADDING_Y * 2

  const coords = points.map((p, i) => {
    const x = PADDING_X + (i / (points.length - 1)) * innerW
    const y = PADDING_Y + innerH - (p.value / max) * innerH
    return { x, y, label: p.label, value: p.value }
  })

  const pathLine = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x},${c.y}`).join(' ')
  const pathArea = `${pathLine} L${coords[coords.length - 1]!.x},${PADDING_Y + innerH} L${coords[0]!.x},${PADDING_Y + innerH} Z`

  // Show ~5 evenly-spaced labels max
  const labelStride = Math.max(1, Math.ceil(points.length / 5))

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ height }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="mock-line-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity={0.3} />
            <stop offset="100%" stopColor={accent} stopOpacity={0} />
          </linearGradient>
        </defs>
        {/* Faint gridlines */}
        {[0.25, 0.5, 0.75].map((g) => (
          <line
            key={g}
            x1={PADDING_X}
            x2={W - PADDING_X}
            y1={PADDING_Y + innerH * g}
            y2={PADDING_Y + innerH * g}
            stroke="rgb(38, 41, 56)"
            strokeWidth={1}
            strokeDasharray="2,3"
          />
        ))}
        {/* Area fill */}
        <path d={pathArea} fill="url(#mock-line-fill)" />
        {/* Line */}
        <path
          d={pathLine}
          fill="none"
          stroke={accent}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* Endpoint dot */}
        <circle
          cx={coords[coords.length - 1]!.x}
          cy={coords[coords.length - 1]!.y}
          r={3}
          fill={accent}
        />
      </svg>
      <div className="mt-2 flex justify-between text-[10px] font-mono text-text-muted">
        {points.map((p, i) =>
          i % labelStride === 0 || i === points.length - 1 ? (
            <span key={i}>{p.label}</span>
          ) : null,
        )}
      </div>
    </div>
  )
}

// ============================================================
// Donut — used for category mix
// ============================================================

export function MockDonutChart({ data }: { data: MockDonut }) {
  const { slices, total } = data
  const SIZE = 160
  const STROKE = 24
  const RADIUS = (SIZE - STROKE) / 2
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS
  const cx = SIZE / 2
  const cy = SIZE / 2

  let offset = 0
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
      <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} aria-hidden="true">
          <circle
            cx={cx}
            cy={cy}
            r={RADIUS}
            fill="none"
            stroke="rgb(38, 41, 56)"
            strokeWidth={STROKE}
          />
          {slices.map((slice) => {
            const length = (slice.pct / 100) * CIRCUMFERENCE
            const segment = (
              <circle
                key={slice.label}
                cx={cx}
                cy={cy}
                r={RADIUS}
                fill="none"
                stroke={slice.color}
                strokeWidth={STROKE}
                strokeDasharray={`${length} ${CIRCUMFERENCE - length}`}
                strokeDashoffset={-offset}
                transform={`rotate(-90 ${cx} ${cy})`}
              />
            )
            offset += length
            return segment
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-xl font-semibold text-text-primary tabular-nums">
            {total}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
            Total
          </span>
        </div>
      </div>
      <ul className="flex-1 space-y-1.5 min-w-0 w-full">
        {slices.map((s) => (
          <li
            key={s.label}
            className="flex items-center justify-between gap-2 text-xs"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="h-2.5 w-2.5 rounded-sm shrink-0"
                style={{ backgroundColor: s.color }}
              />
              <span className="truncate text-text-secondary">{s.label}</span>
            </div>
            <span className="font-mono text-text-muted tabular-nums shrink-0">
              {s.pct}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ============================================================
// Cohort heatmap — used for retention/cohort matrices
// ============================================================

export function MockCohortHeatmap({
  matrix,
  rowLabels = [],
  colLabels = [],
  accent = '#a78bfa',
}: {
  matrix: number[][]
  rowLabels?: string[]
  colLabels?: string[]
  accent?: string
}) {
  if (matrix.length === 0) return null
  const flat = matrix.flat()
  const max = Math.max(...flat)
  const min = Math.min(...flat)
  const range = max - min || 1

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-xs font-mono border-separate border-spacing-1">
        {colLabels.length > 0 && (
          <thead>
            <tr>
              <th className="w-16" />
              {colLabels.map((label) => (
                <th
                  key={label}
                  className="px-1 py-1 text-text-muted font-normal text-center"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {matrix.map((row, ri) => (
            <tr key={ri}>
              <td className="text-text-muted pr-2 text-right">
                {rowLabels[ri] ?? `R${ri + 1}`}
              </td>
              {row.map((v, ci) => {
                const intensity = (v - min) / range
                return (
                  <td
                    key={ci}
                    className="rounded-sm text-center text-[10px] tabular-nums"
                    style={{
                      backgroundColor: `${accent}${Math.round(intensity * 200 + 30)
                        .toString(16)
                        .padStart(2, '0')}`,
                      color: intensity > 0.5 ? '#0a0e1a' : 'rgb(165, 171, 195)',
                      padding: '0.5rem',
                      minWidth: '2.25rem',
                    }}
                  >
                    {v}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
