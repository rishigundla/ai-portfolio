import { CalendarOff, AlertTriangle } from 'lucide-react'
import type { EtaSummary } from '@/lib/kpi-calc'

interface EtaCardProps {
  summary: EtaSummary
}

export function EtaCard({ summary }: EtaCardProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Tile
        icon={CalendarOff}
        label="Missing ETA"
        value={summary.missingEta}
        tone={summary.missingEta > 0 ? 'warn' : 'neutral'}
        hint="Tickets without a committed ETA"
      />
      <Tile
        icon={AlertTriangle}
        label="Overdue"
        value={summary.overdue}
        tone={summary.overdue > 0 ? 'danger' : 'neutral'}
        hint="ETA passed but ticket not done"
      />
    </div>
  )
}

type Tone = 'neutral' | 'warn' | 'danger'

const TONE_TEXT: Record<Tone, string> = {
  neutral: 'text-text-primary',
  warn: 'text-amber-300',
  danger: 'text-rose-300',
}

const TONE_BORDER: Record<Tone, string> = {
  neutral: 'border-surface-border',
  warn: 'border-amber-500/30',
  danger: 'border-rose-500/30',
}

function Tile({
  icon: Icon,
  label,
  value,
  tone,
  hint,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  label: string
  value: number
  tone: Tone
  hint: string
}) {
  return (
    <div className={`rounded-lg border ${TONE_BORDER[tone]} bg-surface px-4 py-3`}>
      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-text-muted">
        <Icon className="h-3 w-3" strokeWidth={1.5} />
        {label}
      </div>
      <div className={`mt-1 font-display text-3xl font-bold tracking-tight ${TONE_TEXT[tone]}`}>
        {value}
      </div>
      <p className="mt-1 text-[11px] text-text-muted leading-snug">{hint}</p>
    </div>
  )
}
