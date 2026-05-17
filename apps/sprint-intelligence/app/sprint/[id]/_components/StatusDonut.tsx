import type { StatusDistributionEntry } from '@/lib/kpi-calc'

interface StatusDonutProps {
  distribution: StatusDistributionEntry[]
  accentHex: string
}

const STATUS_FILL: Record<string, string> = {
  done: 'var(--chart-emerald)',
  'in-review': 'var(--chart-violet)',
  'in-progress': 'var(--chart-amber)',
  todo: 'var(--chart-slate)',
  blocked: 'var(--chart-rose)',
}

export function StatusDonut({ distribution, accentHex: _accentHex }: StatusDonutProps) {
  const total = distribution.reduce((acc, e) => acc + e.count, 0)
  if (total === 0) return null

  const size = 140
  const cx = size / 2
  const cy = size / 2
  const radius = 56
  const inner = 36

  // SVG <path> arcs with start == end (the 100% single-status case) draw
  // a degenerate zero-area shape, so the ring never appears. Skip the
  // zero-count entries up front and fall back to a full circle when only
  // one status carries everything.
  const nonZero = distribution.filter((e) => e.count > 0)
  const isFullCircle = nonZero.length === 1 && nonZero[0]!.count === total

  let acc = 0
  const arcs = nonZero.map((entry) => {
    const start = (acc / total) * 2 * Math.PI
    acc += entry.count
    const end = (acc / total) * 2 * Math.PI
    const fill = STATUS_FILL[entry.status] ?? 'var(--chart-slate)'
    return { ...entry, start, end, fill }
  })

  return (
    <div className="flex items-center gap-5">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-32 h-32 shrink-0">
        {isFullCircle ? (
          <circle cx={cx} cy={cy} r={radius} fill={arcs[0]!.fill} opacity={0.9} />
        ) : (
          arcs.map((arc) => (
            <path
              key={arc.status}
              d={arcPath(cx, cy, radius, inner, arc.start, arc.end)}
              fill={arc.fill}
              opacity={0.9}
            />
          ))
        )}
        {/* center hole — uses surface token so the donut center matches the
            card background in both light and dark mode */}
        <circle cx={cx} cy={cy} r={inner - 1} fill="var(--color-surface)" />
        <text
          x={cx}
          y={cy - 2}
          textAnchor="middle"
          fontSize="16"
          fontFamily="Space Grotesk"
          fontWeight="700"
          fill="var(--color-text-primary)"
        >
          {total}
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          fontSize="8"
          fontFamily="JetBrains Mono"
          fill="var(--color-text-muted)"
        >
          TICKETS
        </text>
      </svg>
      <ul className="flex-1 space-y-1.5 min-w-0">
        {distribution.map((entry) => {
          const pct = Math.round((entry.count / total) * 100)
          const fill = STATUS_FILL[entry.status] ?? 'var(--chart-slate)'
          return (
            <li
              key={entry.status}
              className="flex items-center gap-2 text-[11px] font-mono"
            >
              <span
                className="h-2 w-2 rounded-sm shrink-0"
                style={{ backgroundColor: fill, opacity: 0.9 }}
              />
              <span className="text-text-secondary truncate flex-1">
                {entry.label}
              </span>
              <span className="text-text-primary font-semibold">
                {entry.count}
              </span>
              <span className="text-text-muted">{pct}%</span>
            </li>
          )
        })}
      </ul>
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
