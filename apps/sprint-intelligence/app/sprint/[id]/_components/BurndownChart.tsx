'use client'

import { useState } from 'react'
import type { BurndownPoint } from '@/lib/kpi-calc'

interface BurndownChartProps {
  points: BurndownPoint[]
  accentHex: string
  currentDay: number | null
}

export function BurndownChart({ points, accentHex, currentDay }: BurndownChartProps) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  if (points.length === 0) return null

  const width = 320
  const height = 180
  const padX = 28
  const padY = 18
  const innerW = width - padX * 2
  const innerH = height - padY * 2

  const max = Math.max(
    ...points.map((p) => Math.max(p.ideal, p.actual ?? 0)),
  )
  const lastDay = points.length

  const toX = (day: number) => padX + ((day - 1) / Math.max(1, lastDay - 1)) * innerW
  const toY = (value: number) =>
    padY + innerH - (value / Math.max(1, max)) * innerH

  const idealPath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.day)} ${toY(p.ideal)}`)
    .join(' ')

  const actualPoints = points.filter((p) => p.actual !== null) as Array<
    BurndownPoint & { actual: number }
  >
  const actualPath = actualPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.day)} ${toY(p.actual)}`)
    .join(' ')

  const hovered = hoverIdx !== null ? actualPoints[hoverIdx] ?? null : null
  const hoveredLeftPct = hovered ? (toX(hovered.day) / width) * 100 : 0
  const hoveredTopPct = hovered ? (toY(hovered.actual) / height) * 100 : 0

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 text-[10px] font-mono text-text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-px w-4 border-t border-dashed" style={{ borderColor: accentHex, opacity: 0.55 }} />
          Ideal
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4" style={{ backgroundColor: accentHex }} />
          Actual
        </span>
      </div>
      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
          <line x1={padX} y1={padY + innerH} x2={padX + innerW} y2={padY + innerH} stroke="var(--color-surface-border)" strokeWidth="1" />
          <line x1={padX} y1={padY} x2={padX} y2={padY + innerH} stroke="var(--color-surface-border)" strokeWidth="1" />
          <path d={idealPath} fill="none" stroke={accentHex} strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="4 3" />
          {actualPath && (
            <path d={actualPath} fill="none" stroke={accentHex} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          )}
          {actualPoints.map((p, i) => (
            <circle
              key={`pt-${p.day}`}
              cx={toX(p.day)}
              cy={toY(p.actual)}
              r={hoverIdx === i ? 3.4 : 2.2}
              fill={accentHex}
            />
          ))}
          {currentDay !== null && (
            <line
              x1={toX(currentDay)}
              y1={padY}
              x2={toX(currentDay)}
              y2={padY + innerH}
              stroke="var(--chart-slate)"
              strokeWidth="1"
              strokeDasharray="2 3"
              opacity="0.5"
            />
          )}
          {actualPoints.map((p, i) => (
            <circle
              key={`hit-${p.day}`}
              cx={toX(p.day)}
              cy={toY(p.actual)}
              r={8}
              fill="transparent"
              className="cursor-default"
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
            />
          ))}
          <text x={padX} y={height - 4} fontSize="9" fill="var(--color-text-muted)" fontFamily="JetBrains Mono">
            Day 1
          </text>
          <text x={padX + innerW - 32} y={height - 4} fontSize="9" fill="var(--color-text-muted)" fontFamily="JetBrains Mono">
            Day {lastDay}
          </text>
          <text x={padX - 22} y={padY + 4} fontSize="9" fill="var(--color-text-muted)" fontFamily="JetBrains Mono">
            {max} SP
          </text>
          <text x={padX - 14} y={padY + innerH + 4} fontSize="9" fill="var(--color-text-muted)" fontFamily="JetBrains Mono">
            0
          </text>
        </svg>
        {hovered && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+8px)] rounded-md border border-surface-border bg-surface-elevated px-3 py-1.5 text-xs text-text-primary shadow-lg"
            style={{ left: `${hoveredLeftPct}%`, top: `${hoveredTopPct}%` }}
          >
            <div className="text-text-muted font-mono text-[10px] uppercase tracking-wider mb-1">
              Day {hovered.day}
            </div>
            <div className="flex items-center gap-2 mb-0.5">
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: accentHex, opacity: 0.55 }}
              />
              <span className="text-text-secondary">Ideal</span>
              <span className="text-text-primary font-mono font-semibold">
                {hovered.ideal} SP
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: accentHex }}
              />
              <span className="text-text-secondary">Actual</span>
              <span className="text-text-primary font-mono font-semibold">
                {hovered.actual} SP
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
