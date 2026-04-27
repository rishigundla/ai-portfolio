import * as React from 'react'
import { AlertCircle, Inbox } from 'lucide-react'
import { Card } from '../primitives/card'
import { cn } from '../lib/cn'

export type ChartState = 'ready' | 'loading' | 'empty' | 'error'

export interface ChartCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  actions?: React.ReactNode
  state?: ChartState
  errorMessage?: string
  emptyMessage?: string
  /** Chart content (e.g. Recharts ResponsiveContainer). Pass your chart library of choice. */
  children?: React.ReactNode
}

export const ChartCard = React.forwardRef<HTMLDivElement, ChartCardProps>(
  ({ title, subtitle, actions, state = 'ready', errorMessage, emptyMessage, children, className, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn('p-5 flex flex-col gap-4 min-h-[240px]', className)}
        {...props}
      >
        {/* Header */}
        {(title || actions) && (
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              {title && (
                <h3 className="font-display text-base font-semibold text-text-primary tracking-tight">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-text-muted">
                  {subtitle}
                </p>
              )}
            </div>
            {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
          </div>
        )}

        {/* Body — when ready, stretch the child so ResponsiveContainer can
            measure non-zero width/height. For loading/empty/error fallbacks,
            center them inside the body. */}
        <div
          className={cn(
            'flex-1 min-h-[160px]',
            state === 'ready' ? 'flex flex-col' : 'flex items-center justify-center',
          )}
        >
          {state === 'loading' && <ChartSkeleton />}
          {state === 'empty' && <EmptyChart message={emptyMessage || 'No data for this view'} />}
          {state === 'error' && <ErrorChart message={errorMessage || 'Chart failed to render'} />}
          {state === 'ready' && (
            <div className="flex-1 min-h-[200px] w-full">
              {children}
            </div>
          )}
        </div>
      </Card>
    )
  },
)
ChartCard.displayName = 'ChartCard'

const ChartSkeleton: React.FC = () => (
  <div className="w-full h-full min-h-[160px] flex items-end gap-2 px-4 animate-pulse">
    {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
      <div
        key={i}
        className="flex-1 bg-surface-border rounded-t"
        style={{ height: `${h}%` }}
      />
    ))}
  </div>
)

const EmptyChart: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center gap-2 text-text-muted">
    <Inbox className="h-8 w-8 opacity-50" />
    <span className="text-sm">{message}</span>
  </div>
)

const ErrorChart: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center gap-2 text-status-blocked">
    <AlertCircle className="h-8 w-8 opacity-75" />
    <span className="text-sm font-medium">{message}</span>
  </div>
)
