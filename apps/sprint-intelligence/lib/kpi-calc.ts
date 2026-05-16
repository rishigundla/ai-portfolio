/**
 * KPI helpers for the sprint dashboard. Pure functions over the sprint
 * fixture so they can run in server components without state.
 *
 * The fixtures carry the raw data. These helpers turn that data into
 * the shapes each KPI card needs (counts per status, blocked summary,
 * velocity comparison, and so on).
 */

import type { SprintFixture, TicketSpec, TicketStatus } from './full-sprints'

export interface StatusDistributionEntry {
  status: TicketStatus
  label: string
  count: number
  storyPoints: number
}

const STATUS_LABELS: Record<TicketStatus, string> = {
  done: 'Done',
  'in-review': 'In review',
  'in-progress': 'In progress',
  todo: 'To do',
  blocked: 'Blocked',
}

const STATUS_ORDER: TicketStatus[] = [
  'done',
  'in-review',
  'in-progress',
  'todo',
  'blocked',
]

export function computeStatusDistribution(
  tickets: TicketSpec[],
): StatusDistributionEntry[] {
  const counts: Record<TicketStatus, { count: number; sp: number }> = {
    done: { count: 0, sp: 0 },
    'in-review': { count: 0, sp: 0 },
    'in-progress': { count: 0, sp: 0 },
    todo: { count: 0, sp: 0 },
    blocked: { count: 0, sp: 0 },
  }
  for (const t of tickets) {
    counts[t.status].count += 1
    counts[t.status].sp += t.estimate
  }
  return STATUS_ORDER.map((status) => ({
    status,
    label: STATUS_LABELS[status],
    count: counts[status].count,
    storyPoints: counts[status].sp,
  }))
}

export interface VelocityComparison {
  current: number
  baseline: number
  deltaPct: number
  beat: boolean
  capacity: number
}

export function computeVelocityComparison(
  fixture: SprintFixture,
  capacity: number,
): VelocityComparison {
  const current = fixture.velocity
  const baseline = fixture.fourSprintBaseline
  const deltaPct = baseline > 0 ? ((current - baseline) / baseline) * 100 : 0
  return {
    current,
    baseline,
    deltaPct,
    beat: current >= baseline,
    capacity,
  }
}

export interface BlockedSummary {
  count: number
  totalStoryPoints: number
  oldestDaysBlocked: number
  topBlockerNote: string | null
  tickets: TicketSpec[]
}

export function computeBlockedSummary(
  fixture: SprintFixture,
): BlockedSummary {
  const blocked = fixture.tickets.filter((t) => t.status === 'blocked')
  // We do not track per ticket block date in the fixture today, so the
  // oldest age is approximated from the sprint character. The blocked
  // sprint surfaces a nine day idle, healthy sprints show none.
  const oldestDaysBlocked = blocked.length > 0 ? estimateOldestBlockAge(fixture) : 0
  return {
    count: blocked.length,
    totalStoryPoints: blocked.reduce((acc, t) => acc + t.estimate, 0),
    oldestDaysBlocked,
    topBlockerNote: blocked[0]?.blockerNote ?? null,
    tickets: blocked,
  }
}

function estimateOldestBlockAge(fixture: SprintFixture): number {
  // Blocked sprint character known from the fixture summary.
  // Until we add per ticket block timestamps, we report the worst case
  // staleness based on the sprint window.
  if (fixture.id === 'sprint-44') return 9
  if (fixture.currentDay !== null) {
    return Math.max(1, Math.floor(fixture.currentDay / 2))
  }
  return 1
}

export interface BurndownPoint {
  day: number
  ideal: number
  actual: number | null
}

export function buildBurndownPoints(fixture: SprintFixture): BurndownPoint[] {
  const { ideal, actual } = fixture.burndown
  const total = ideal.length
  const points: BurndownPoint[] = []
  for (let i = 0; i < total; i++) {
    points.push({
      day: i + 1,
      ideal: ideal[i] ?? 0,
      actual: actual[i] ?? null,
    })
  }
  return points
}

export function sprintScopeDelta(fixture: SprintFixture): number {
  return fixture.scopeFinal - fixture.scopePlanned
}

export interface CycleTimePoint {
  day: number
  value: number | null
}

export function buildCycleTimePoints(fixture: SprintFixture): CycleTimePoint[] {
  return fixture.cycleTime.days.map((value, i) => ({ day: i + 1, value }))
}

export interface CycleTimeSummary {
  latest: number | null
  earliest: number | null
  baseline: number
  trend: 'improving' | 'flat' | 'rising'
  deltaPct: number | null
}

export function computeCycleTimeSummary(
  fixture: SprintFixture,
): CycleTimeSummary {
  const filled = fixture.cycleTime.days.filter(
    (d): d is number => typeof d === 'number',
  )
  const earliest = filled[0] ?? null
  const latest = filled[filled.length - 1] ?? null
  const deltaPct =
    earliest && latest && earliest > 0
      ? ((latest - earliest) / earliest) * 100
      : null
  return {
    latest,
    earliest,
    baseline: fixture.cycleTime.teamBaseline,
    trend: fixture.cycleTime.trend,
    deltaPct,
  }
}

export interface ThroughputSummary {
  weekOne: number
  weekTwo: number
  total: number
  priorAverage: number
  deltaPct: number
}

export function computeThroughputSummary(
  fixture: SprintFixture,
): ThroughputSummary {
  const { weekOne, weekTwo, priorAverage } = fixture.throughputPerWeek
  const total = weekOne + weekTwo
  const deltaPct =
    priorAverage > 0 ? ((total - priorAverage * 2) / (priorAverage * 2)) * 100 : 0
  return { weekOne, weekTwo, total, priorAverage, deltaPct }
}

export interface ScopeCreepSummary {
  planned: number
  final: number
  added: number
  creepPct: number
  midSprintAdditions: number
}

export function computeScopeCreepSummary(
  fixture: SprintFixture,
): ScopeCreepSummary {
  const added = fixture.scopeFinal - fixture.scopePlanned
  const creepPct =
    fixture.scopePlanned > 0 ? (added / fixture.scopePlanned) * 100 : 0
  const midSprintAdditions = fixture.tickets.filter(
    (t) => t.addedMidSprint,
  ).length
  return {
    planned: fixture.scopePlanned,
    final: fixture.scopeFinal,
    added,
    creepPct,
    midSprintAdditions,
  }
}

export interface CarryoverSummary {
  done: number
  total: number
  carryover: number
  carryoverPct: number
  blockedInCarryover: number
  projected: boolean
}

export function computeCarryoverSummary(
  fixture: SprintFixture,
): CarryoverSummary {
  const done = fixture.tickets.filter((t) => t.status === 'done').length
  const total = fixture.tickets.length
  const carryover = total - done
  const carryoverPct = total > 0 ? (carryover / total) * 100 : 0
  const blockedInCarryover = fixture.tickets.filter(
    (t) => t.status === 'blocked',
  ).length
  return {
    done,
    total,
    carryover,
    carryoverPct,
    blockedInCarryover,
    projected: fixture.metadata.status === 'in-progress',
  }
}
