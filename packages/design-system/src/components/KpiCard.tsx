'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { ArrowUp, ArrowDown, Minus, AlertCircle } from 'lucide-react'
import { Card } from '../primitives/card'
import { cn } from '../lib/cn'
import { slideUp } from '../motion'

export type KpiDirection = 'up' | 'down' | 'neutral'
export type KpiState = 'ready' | 'loading' | 'empty' | 'error'

export interface KpiDelta {
  value: number
  direction: KpiDirection
  period?: string
  /** When true, down is good (e.g. churn rate dropping). Flips the color semantics. */
  invertGood?: boolean
}

export interface KpiCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | number
  unit?: string
  delta?: KpiDelta
  sparkline?: number[]
  state?: KpiState
  errorMessage?: string
  /**
   * Optional dashboard accent (CSS color or hex string). When provided the
   * KPI value and sparkline render in this color so the card visually ties
   * back to the dashboard's color token. Defaults to the design system
   * accent token, which is the original behavior.
   */
  accent?: string
}

const Sparkline: React.FC<{ data: number[]; className?: string; stroke?: string }> = ({
  data,
  className,
  stroke,
}) => {
  if (!data || data.length < 2) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100
      const y = 100 - ((v - min) / range) * 100
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={cn('w-full h-8 overflow-visible', className)}
      aria-hidden="true"
    >
      <polyline
        fill="none"
        stroke={stroke ?? 'var(--color-accent)'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        points={points}
      />
    </svg>
  )
}

const deltaColor = (direction: KpiDirection, invertGood = false): string => {
  if (direction === 'neutral') return 'text-text-muted'
  const isPositive = direction === 'up'
  const isGood = invertGood ? !isPositive : isPositive
  return isGood ? 'text-status-completed' : 'text-status-blocked'
}

const DeltaIcon = ({ direction }: { direction: KpiDirection }) => {
  if (direction === 'up') return <ArrowUp className="h-3 w-3" />
  if (direction === 'down') return <ArrowDown className="h-3 w-3" />
  return <Minus className="h-3 w-3" />
}

export const KpiCard = React.forwardRef<HTMLDivElement, KpiCardProps>(
  (
    {
      label,
      value,
      unit,
      delta,
      sparkline,
      state = 'ready',
      errorMessage,
      className,
      accent,
      ...props
    },
    ref,
  ) => {
    // LOADING
    if (state === 'loading') {
      return (
        <Card ref={ref} className={cn('p-5 space-y-3 animate-pulse', className)} {...props}>
          <div className="h-3 w-24 bg-surface-border rounded" />
          <div className="h-8 w-32 bg-surface-border rounded" />
          <div className="h-3 w-16 bg-surface-border rounded" />
        </Card>
      )
    }

    // EMPTY
    if (state === 'empty') {
      return (
        <Card ref={ref} className={cn('p-5', className)} {...props}>
          <div className="font-mono text-[11px] uppercase tracking-wider text-text-muted">{label}</div>
          <div className="mt-3 text-3xl font-display font-semibold text-text-dim">—</div>
          <div className="mt-2 text-xs text-text-muted">No data</div>
        </Card>
      )
    }

    // ERROR
    if (state === 'error') {
      return (
        <Card ref={ref} className={cn('p-5 border-status-blocked/30', className)} {...props}>
          <div className="font-mono text-[11px] uppercase tracking-wider text-text-muted">{label}</div>
          <div className="mt-3 flex items-center gap-2 text-status-blocked">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Failed to load</span>
          </div>
          {errorMessage && <div className="mt-2 text-xs text-text-muted">{errorMessage}</div>}
        </Card>
      )
    }

    // READY
    return (
      <motion.div
        ref={ref}
        variants={slideUp}
        initial="hidden"
        animate="visible"
        className={cn(
          'rounded-xl border border-surface-border bg-surface text-text-primary p-5 shadow-card transition-all hover:shadow-card-hover hover:border-accent/40',
          className,
        )}
        {...(props as React.ComponentProps<typeof motion.div>)}
      >
        <div className="font-mono text-[11px] uppercase tracking-wider text-text-muted">{label}</div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span
            className="text-3xl font-display font-semibold tracking-tight"
            style={{ color: accent ?? 'var(--color-text-primary)' }}
          >
            {value}
          </span>
          {unit && <span className="text-sm text-text-muted font-mono">{unit}</span>}
        </div>
        {delta && (
          <div className={cn('mt-2 inline-flex items-center gap-1 text-xs font-medium', deltaColor(delta.direction, delta.invertGood))}>
            <DeltaIcon direction={delta.direction} />
            <span>{Math.abs(delta.value)}%</span>
            {delta.period && <span className="text-text-muted font-normal">{delta.period}</span>}
          </div>
        )}
        {sparkline && sparkline.length > 1 && (
          <div className="mt-3">
            <Sparkline data={sparkline} stroke={accent} />
          </div>
        )}
      </motion.div>
    )
  },
)
KpiCard.displayName = 'KpiCard'
