'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Users } from 'lucide-react'
import type { EngineerDeepDive } from '@/lib/kpi-calc'

interface TeamWorkloadCardProps {
  deepDives: EngineerDeepDive[]
  accentHex: string
}

export function TeamWorkloadCard({ deepDives, accentHex }: TeamWorkloadCardProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeEng = searchParams.get('eng')

  const handlePick = (engId: string) => {
    // Update the eng search param without scrolling the page back to the top.
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    params.set('eng', engId)
    router.replace(`?${params.toString()}`, { scroll: false })
    // Scroll to the deep dive section so the picked engineer's panel is in view.
    document
      .getElementById('per-engineer-section')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span className="inline-flex items-center gap-1.5 text-text-muted">
          <Users className="h-3.5 w-3.5" />
          Click an engineer to open their deep dive
        </span>
        <span className="text-text-muted">workload as percent of capacity</span>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
        {deepDives.map((dive) => {
          const isActive = dive.engineer.id === activeEng
          const pct = Math.min(150, dive.workload.index * 100)
          const toneColor =
            dive.workload.tone === 'heavy'
              ? 'var(--chart-rose)'
              : dive.workload.tone === 'light'
                ? 'var(--chart-slate)'
                : accentHex
          return (
            <li key={dive.engineer.id}>
              <button
                type="button"
                onClick={() => handlePick(dive.engineer.id)}
                aria-pressed={isActive}
                className={`w-full flex items-center gap-3 py-1.5 px-2 rounded-md transition-colors text-left ${
                  isActive
                    ? 'bg-accent/10 ring-1 ring-accent/40'
                    : 'hover:bg-base-700/40'
                }`}
              >
                <span className="font-display font-semibold text-[13px] text-text-primary w-28 truncate">
                  {dive.engineer.name.split(' ')[0]}
                </span>
                <span className="text-[10px] font-mono text-text-muted w-8 shrink-0">
                  {shortRole(dive.engineer.role)}
                </span>
                <span className="flex-1 h-1.5 rounded-sm bg-base-700 overflow-hidden">
                  <span
                    className="block h-full rounded-sm transition-all"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: toneColor,
                      opacity: 0.9,
                    }}
                  />
                </span>
                <span
                  className="text-[10px] font-mono w-12 text-right"
                  style={{ color: toneColor }}
                >
                  {(dive.workload.index * 100).toFixed(0)}%
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function shortRole(role: string): string {
  if (role.startsWith('Senior')) return 'Sr'
  if (role.startsWith('Junior')) return 'Jr'
  if (role.startsWith('Engineering Manager')) return 'EM'
  return 'Eng'
}
