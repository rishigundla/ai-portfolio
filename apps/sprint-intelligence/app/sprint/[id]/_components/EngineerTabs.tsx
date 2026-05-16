'use client'

import * as React from 'react'
import { AlertOctagon, CheckCircle2, Clock, GaugeCircle, ListChecks } from 'lucide-react'
import type {
  EngineerDeepDive,
} from '@/lib/kpi-calc'

interface EngineerTabsProps {
  deepDives: EngineerDeepDive[]
  accentHex: string
}

export function EngineerTabs({ deepDives, accentHex }: EngineerTabsProps) {
  const [activeId, setActiveId] = React.useState<string>(
    deepDives[0]?.engineer.id ?? '',
  )
  const active = deepDives.find((d) => d.engineer.id === activeId) ?? deepDives[0]
  if (!active) {
    return (
      <div className="text-text-muted text-sm">
        No engineer data on this sprint.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div
        role="tablist"
        aria-label="Engineer deep dive tabs"
        className="flex flex-wrap gap-2"
      >
        {deepDives.map((d) => {
          const selected = d.engineer.id === active.engineer.id
          return (
            <button
              key={d.engineer.id}
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveId(d.engineer.id)}
              className={`px-3 py-2 rounded-md text-xs font-mono flex items-center gap-2 transition-colors min-h-[44px] ${
                selected
                  ? 'bg-accent/10 text-accent border border-accent/30 shadow-glow-sm'
                  : 'text-text-muted border border-surface-border hover:text-text-primary hover:border-text-muted/30'
              }`}
            >
              <span className="font-display font-semibold text-[13px] tracking-tight">
                {d.engineer.name.split(' ')[0]}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-text-dim">
                {shortRole(d.engineer.role)}
              </span>
            </button>
          )
        })}
      </div>
      <EngineerPanel deepDive={active} accentHex={accentHex} />
    </div>
  )
}

function EngineerPanel({
  deepDive,
  accentHex,
}: {
  deepDive: EngineerDeepDive
  accentHex: string
}) {
  const { engineer, workload, completion, cycle, review, priorityMix, tickets } =
    deepDive

  return (
    <div className="rounded-lg border border-surface-border bg-surface p-5 lg:p-6 flex flex-col gap-5">
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-semibold tracking-tight">
            {engineer.name}
          </h3>
          <p className="text-[11px] font-mono text-text-muted mt-0.5">
            {engineer.role} · capacity {engineer.capacity} SP
          </p>
        </div>
        <div className="text-[10px] font-mono text-text-muted">
          {tickets.length} ticket{tickets.length === 1 ? '' : 's'} assigned
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <StatTile
          icon={<GaugeCircle className="h-3.5 w-3.5" />}
          label="Workload score"
          tone={
            workload.tone === 'heavy'
              ? '#fb7185'
              : workload.tone === 'light'
                ? '#94a3b8'
                : accentHex
          }
          value={workload.raw.toFixed(1)}
          unit="weighted SP"
          subtitle={`${(workload.index * 100).toFixed(0)}% of capacity · ${workload.label}`}
        />
        <StatTile
          icon={<CheckCircle2 className="h-3.5 w-3.5" />}
          label="Completion rate"
          tone={completion.percent >= 80 ? '#34d399' : completion.percent >= 50 ? '#fbbf24' : '#fb7185'}
          value={`${completion.percent.toFixed(0)}%`}
          unit=""
          subtitle={`${completion.done} of ${completion.total} tickets done`}
        />
        <StatTile
          icon={<Clock className="h-3.5 w-3.5" />}
          label="Cycle time"
          tone={cycle.beatsTeam ? '#34d399' : '#fb7185'}
          value={cycle.personal !== null ? `${cycle.personal.toFixed(1)}d` : '—'}
          unit=""
          subtitle={
            cycle.deltaPct !== null
              ? `Team baseline ${cycle.team.toFixed(1)}d (${cycle.deltaPct >= 0 ? '+' : ''}${cycle.deltaPct.toFixed(0)}%)`
              : `Team baseline ${cycle.team.toFixed(1)}d`
          }
        />
        <StatTile
          icon={
            review.tone === 'bottleneck' ? (
              <AlertOctagon className="h-3.5 w-3.5" />
            ) : (
              <ListChecks className="h-3.5 w-3.5" />
            )
          }
          label="Review queue"
          tone={
            review.tone === 'bottleneck'
              ? '#fb7185'
              : review.tone === 'queue'
                ? '#fbbf24'
                : '#34d399'
          }
          value={`${review.inReviewCount}`}
          unit={review.inReviewCount === 1 ? 'in review' : 'in review'}
          subtitle={`${review.label} · ${review.inProgressCount} in progress${review.blockedCount > 0 ? ` · ${review.blockedCount} blocked` : ''}`}
        />
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
            Priority mix
          </p>
          {priorityMix.length === 0 ? (
            <p className="text-[11px] text-text-muted">No tickets to show.</p>
          ) : (
            <ul className="space-y-1.5">
              {priorityMix.map((entry) => (
                <li
                  key={entry.priority}
                  className="flex items-center gap-2 text-[11px] font-mono"
                >
                  <span className="text-text-primary font-semibold w-7">
                    {entry.priority}
                  </span>
                  <div className="flex-1 h-2 rounded-sm bg-base-700 overflow-hidden">
                    <div
                      className="h-full rounded-sm"
                      style={{
                        width: `${barWidth(entry.count, priorityMix)}%`,
                        backgroundColor: priorityColor(entry.priority, accentHex),
                        opacity: 0.9,
                      }}
                    />
                  </div>
                  <span className="text-text-secondary">
                    {entry.count} ticket{entry.count === 1 ? '' : 's'}
                  </span>
                  <span className="text-text-muted">{entry.storyPoints} SP</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
            Assigned tickets
          </p>
          {tickets.length === 0 ? (
            <p className="text-[11px] text-text-muted">
              Nothing on this sprint.
            </p>
          ) : (
            <ul className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {tickets.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center gap-2 text-[11px] font-mono py-1 border-b border-surface-border last:border-b-0"
                >
                  <span
                    className="inline-flex shrink-0 items-center justify-center h-4 w-4 rounded-sm text-[9px] font-bold"
                    style={{
                      backgroundColor: statusColor(t.status, accentHex),
                      color: '#0a0d16',
                      opacity: 0.95,
                    }}
                    aria-label={t.status}
                  >
                    {statusGlyph(t.status)}
                  </span>
                  <span className="text-text-secondary text-[10px] w-12">
                    {t.priority}
                  </span>
                  <span className="text-text-primary truncate flex-1">
                    {t.title}
                  </span>
                  <span className="text-text-muted">{t.estimate} SP</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}

function StatTile({
  icon,
  label,
  value,
  unit,
  subtitle,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: string
  unit: string
  subtitle: string
  tone: string
}) {
  return (
    <div className="rounded-md border border-surface-border bg-base-800/50 p-3 flex flex-col gap-1">
      <div
        className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-mono"
        style={{ color: tone }}
      >
        {icon}
        <span>{label}</span>
      </div>
      <p className="font-display text-xl font-bold" style={{ color: tone }}>
        {value}
        {unit && (
          <span className="text-[10px] font-mono text-text-muted ml-1.5 font-normal">
            {unit}
          </span>
        )}
      </p>
      <p className="text-[10px] text-text-muted leading-snug">{subtitle}</p>
    </div>
  )
}

function shortRole(role: string): string {
  if (role.startsWith('Senior')) return 'Sr'
  if (role.startsWith('Junior')) return 'Jr'
  if (role.startsWith('Engineering Manager')) return 'EM'
  return 'Eng'
}

function barWidth(count: number, mix: { count: number }[]): number {
  const max = Math.max(1, ...mix.map((m) => m.count))
  return (count / max) * 100
}

function priorityColor(priority: string, accent: string): string {
  if (priority === 'P0') return '#fb7185'
  if (priority === 'P1') return '#fbbf24'
  if (priority === 'P2') return accent
  return '#94a3b8'
}

function statusColor(status: string, accent: string): string {
  if (status === 'done') return '#34d399'
  if (status === 'in-review') return accent
  if (status === 'in-progress') return '#fbbf24'
  if (status === 'blocked') return '#fb7185'
  return '#475569'
}

function statusGlyph(status: string): string {
  if (status === 'done') return '✓'
  if (status === 'in-review') return 'R'
  if (status === 'in-progress') return 'P'
  if (status === 'blocked') return '!'
  return ' '
}
