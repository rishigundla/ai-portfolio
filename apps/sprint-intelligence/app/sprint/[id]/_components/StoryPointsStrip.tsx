import type { StoryPointsKpis } from '@/lib/kpi-calc'

interface StoryPointsStripProps {
  kpis: StoryPointsKpis
}

export function StoryPointsStrip({ kpis }: StoryPointsStripProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <Tile
        label="SP completed"
        value={kpis.spCompleted}
        accent="text-emerald-300"
        title={`Story points completed (sum of estimates for Done tickets)`}
      />
      <Tile
        label="SP in progress"
        value={kpis.spInProgress}
        accent="text-amber-300"
        title="Story points actively in progress"
      />
      <Tile
        label="SP in review"
        value={kpis.spInReview}
        accent="text-violet-300"
        title="Story points sitting in code review"
      />
      <Tile
        label="SP open"
        value={kpis.spOpen}
        accent="text-slate-300"
        title="Story points in To do or Blocked status"
      />
      <Tile
        label="Total SP"
        value={kpis.spTotal}
        accent="text-accent"
        title={`Total story points = ${kpis.spCompleted} + ${kpis.spInProgress} + ${kpis.spInReview} + ${kpis.spOpen}`}
      />
      <Tile
        label="Missing SP"
        value={kpis.missingSp}
        accent={kpis.missingSp > 0 ? 'text-rose-300' : 'text-text-muted'}
        title="Tickets without a story point estimate. Indicates planning gaps."
      />
    </div>
  )
}

function Tile({
  label,
  value,
  accent,
  title,
}: {
  label: string
  value: number | string
  accent: string
  title?: string
}) {
  return (
    <div
      className="rounded-lg border border-surface-border bg-surface px-3 py-3"
      title={title}
    >
      <div className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
        {label}
      </div>
      <div className={`mt-1 font-display text-2xl font-bold tracking-tight ${accent}`}>
        {value}
      </div>
    </div>
  )
}
