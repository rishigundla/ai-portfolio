/**
 * Operational layout — dense control-room view.
 * "6-KPI strip + 2x2 chart grid for an SRE control center."
 *
 * Composition:
 *   - 6-up KPI strip (compact tiles)
 *   - 2x2 chart grid: bars / line / donut / bars
 *   - Status footer with last-updated stamp
 */

import { ArrowUp, ArrowDown, Activity, Clock } from 'lucide-react'
import { ChartCard } from '@rishi/design-system/components'
import { Card } from '@rishi/design-system/primitives'
import { OPERATIONAL_DATA } from '@/lib/wireframe-templates'
import { MockBarChart, MockLineChart, MockDonutChart } from './MockCharts'

const ACCENT = '#fbbf24'

export function OperationalLayout() {
  const { kpis, byProduct, latencyTrend, byRegion, errorsBySeverity } = OPERATIONAL_DATA

  return (
    <div className="space-y-6">
      {/* Live indicator strip */}
      <div className="flex items-center justify-between flex-wrap gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-status-completed">
          <span className="h-2 w-2 rounded-full bg-status-completed animate-pulse" />
          <span className="uppercase tracking-widest">Live · auto-refresh 30s</span>
        </div>
        <div className="flex items-center gap-2 text-text-muted">
          <Clock className="h-3 w-3" />
          <span>Updated 12 seconds ago</span>
        </div>
      </div>

      {/* 6-KPI dense strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="p-4">
            <div className="font-mono text-[10px] uppercase tracking-wider text-text-muted truncate">
              {kpi.label}
            </div>
            <div className="mt-1.5 flex items-baseline gap-1">
              <span className="font-display text-2xl font-semibold text-text-primary tabular-nums tracking-tight">
                {kpi.value}
              </span>
              {kpi.unit && (
                <span className="text-[10px] text-text-muted font-mono">
                  {kpi.unit}
                </span>
              )}
            </div>
            {kpi.delta && (
              <div
                className={`mt-1.5 inline-flex items-center gap-1 text-[10px] font-medium ${
                  // For ops: down is good for latency/errors/pages/incidents
                  isInverseGood(kpi.label)
                    ? kpi.delta.direction === 'down'
                      ? 'text-status-completed'
                      : 'text-status-blocked'
                    : kpi.delta.direction === 'up'
                      ? 'text-status-completed'
                      : 'text-status-blocked'
                }`}
              >
                {kpi.delta.direction === 'up' ? (
                  <ArrowUp className="h-2.5 w-2.5" />
                ) : (
                  <ArrowDown className="h-2.5 w-2.5" />
                )}
                <span>{kpi.delta.value}%</span>
                <span className="text-text-muted font-normal ml-0.5">
                  {kpi.delta.period}
                </span>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* 2x2 chart grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard
          title="Active clusters by product"
          subtitle="Top 5 · current"
        >
          <MockBarChart data={byProduct} accent={ACCENT} />
        </ChartCard>

        <ChartCard
          title="P95 latency · 7-day trend"
          subtitle="In milliseconds · all regions"
        >
          <MockLineChart data={latencyTrend} accent={ACCENT} height={200} />
        </ChartCard>

        <ChartCard
          title="Cluster distribution by region"
          subtitle="Active workloads"
        >
          <MockDonutChart data={byRegion} />
        </ChartCard>

        <ChartCard
          title="Error volume by severity"
          subtitle="Last 24 hours"
        >
          <MockBarChart data={errorsBySeverity} accent="#fb7185" />
        </ChartCard>
      </div>

      {/* Status footer */}
      <Card className="p-4">
        <div className="flex items-center gap-3 flex-wrap text-xs">
          <Activity className="h-4 w-4 text-status-completed shrink-0" />
          <span className="font-mono text-text-secondary">
            All systems operational
          </span>
          <span className="text-text-muted">·</span>
          <span className="text-text-muted">
            3 services in degraded state, 0 incidents critical
          </span>
        </div>
      </Card>
    </div>
  )
}

/**
 * For ops KPIs where lower numbers are better (latency, errors, pages, incidents),
 * flip the green/red semantics on the delta.
 */
function isInverseGood(label: string): boolean {
  const inverse = ['Latency', 'Errors', 'Pages', 'Incidents', 'Churn']
  return inverse.some((k) => label.includes(k))
}
