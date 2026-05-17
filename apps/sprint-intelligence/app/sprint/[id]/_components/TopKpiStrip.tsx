import { Ticket, CheckCircle2, Eye, Activity, Circle, Clock } from 'lucide-react'
import type { TopKpis } from '@/lib/kpi-calc'

interface TopKpiStripProps {
  kpis: TopKpis
  filtered: boolean
}

export function TopKpiStrip({ kpis, filtered }: TopKpiStripProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
      <Tile
        label="Total tickets"
        value={kpis.totalTickets}
        accent="text-text-primary"
        icon={Ticket}
        title="Total tickets in the current filter scope"
      />
      <Tile
        label="Completion"
        value={`${kpis.completionPct.toFixed(0)}%`}
        accent="text-accent"
        icon={CheckCircle2}
        progress={kpis.completionPct}
        title={`Completion = Done / Total = ${kpis.done} / ${kpis.totalTickets}`}
      />
      <Tile
        label="Done"
        value={kpis.done}
        accent="text-chart-emerald"
        icon={CheckCircle2}
        title={`${kpis.done} tickets in the Done status`}
      />
      <Tile
        label="In review"
        value={kpis.inReview}
        accent="text-chart-violet"
        icon={Eye}
        title={`${kpis.inReview} tickets sitting in code review`}
      />
      <Tile
        label="In progress"
        value={kpis.inProgress}
        accent="text-chart-amber"
        icon={Activity}
        title={`${kpis.inProgress} tickets actively in progress`}
      />
      <Tile
        label={filtered ? 'Open' : 'Open / To do'}
        value={kpis.open}
        accent="text-chart-slate"
        icon={Circle}
        title={`${kpis.open} tickets in To do or Blocked status`}
      />
      <Tile
        label="Avg cycle time"
        value={kpis.avgCycleDays === null ? '—' : `${kpis.avgCycleDays.toFixed(1)}d`}
        accent="text-accent-light"
        icon={Clock}
        title="Rolling team cycle time at the latest sprint day. Sprint level signal, not filter aware."
      />
    </div>
  )
}

function Tile({
  label,
  value,
  accent,
  icon: Icon,
  progress,
  title,
}: {
  label: string
  value: number | string
  accent: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  progress?: number
  title?: string
}) {
  return (
    <div
      className="rounded-lg border border-surface-border bg-surface px-3 py-3"
      title={title}
    >
      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-text-muted">
        <Icon className="h-3 w-3" strokeWidth={1.5} />
        {label}
      </div>
      <div className={`mt-1 font-display text-2xl font-bold tracking-tight ${accent}`}>
        {value}
      </div>
      {progress !== undefined && (
        <div className="mt-2 h-1 w-full rounded-full bg-base-700 overflow-hidden">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>
      )}
    </div>
  )
}
