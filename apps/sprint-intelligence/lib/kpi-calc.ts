/**
 * KPI helpers for the sprint dashboard. Pure functions over the sprint
 * fixture so they can run in server components without state.
 *
 * The fixtures carry the raw data. These helpers turn that data into
 * the shapes each KPI card needs (counts per status, blocked summary,
 * velocity comparison, and so on).
 */

import type {
  SprintFixture,
  TicketPriority,
  TicketSpec,
  TicketStatus,
  TicketType,
} from './full-sprints'
import type { TeamMember } from './sprints'

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
  if (fixture.id === 'mar-2026') return 9
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

// ============================================================
// Per engineer deep dive (W9.D5)
// ============================================================

const PRIORITY_WEIGHTS: Record<TicketPriority, number> = {
  P0: 2.0,
  P1: 1.5,
  P2: 1.0,
  P3: 0.5,
}

export interface PriorityMixEntry {
  priority: TicketPriority
  count: number
  storyPoints: number
}

const PRIORITY_ORDER: TicketPriority[] = ['P0', 'P1', 'P2', 'P3']

export function computePriorityMix(tickets: TicketSpec[]): PriorityMixEntry[] {
  return PRIORITY_ORDER.map((priority) => {
    const matching = tickets.filter((t) => t.priority === priority)
    return {
      priority,
      count: matching.length,
      storyPoints: matching.reduce((acc, t) => acc + t.estimate, 0),
    }
  }).filter((entry) => entry.count > 0)
}

export type WorkloadTone = 'light' | 'ideal' | 'heavy'

export interface WorkloadScore {
  raw: number
  index: number
  capacity: number
  tone: WorkloadTone
  label: string
}

export function computeWorkloadScore(
  tickets: TicketSpec[],
  capacity: number,
): WorkloadScore {
  const raw = tickets.reduce(
    (acc, t) => acc + t.estimate * PRIORITY_WEIGHTS[t.priority],
    0,
  )
  const index = capacity > 0 ? raw / capacity : 0
  let tone: WorkloadTone = 'ideal'
  let label = 'On capacity'
  if (index < 0.8) {
    tone = 'light'
    label = 'Has headroom'
  } else if (index > 1.1) {
    tone = 'heavy'
    label = 'Overloaded'
  }
  return { raw, index, capacity, tone, label }
}

export interface CompletionRate {
  done: number
  total: number
  percent: number
}

export function computeCompletionRate(tickets: TicketSpec[]): CompletionRate {
  const total = tickets.length
  const done = tickets.filter((t) => t.status === 'done').length
  const percent = total > 0 ? (done / total) * 100 : 0
  return { done, total, percent }
}

export type ReviewBottleneckTone = 'clean' | 'queue' | 'bottleneck'

export interface ReviewLoad {
  inReviewCount: number
  inProgressCount: number
  blockedCount: number
  tone: ReviewBottleneckTone
  label: string
}

export function computeReviewLoad(tickets: TicketSpec[]): ReviewLoad {
  const inReviewCount = tickets.filter((t) => t.status === 'in-review').length
  const inProgressCount = tickets.filter((t) => t.status === 'in-progress').length
  const blockedCount = tickets.filter((t) => t.status === 'blocked').length

  let tone: ReviewBottleneckTone = 'clean'
  let label = 'Queue clear'
  if (inReviewCount >= 2) {
    tone = 'bottleneck'
    label = 'Bottleneck'
  } else if (inReviewCount === 1) {
    tone = 'queue'
    label = 'In review'
  }
  if (blockedCount > 0 && tone === 'clean') {
    tone = 'queue'
    label = 'Blocked work'
  }
  return { inReviewCount, inProgressCount, blockedCount, tone, label }
}

export interface PersonalCycleTime {
  personal: number | null
  team: number
  deltaPct: number | null
  beatsTeam: boolean
}

export function computePersonalCycleTime(
  fixture: SprintFixture,
  engineerId: string,
): PersonalCycleTime {
  const personal = fixture.perEngineer[engineerId]?.personalCycleTime ?? null
  const team = fixture.cycleTime.teamBaseline
  if (personal === null) {
    return { personal: null, team, deltaPct: null, beatsTeam: false }
  }
  const deltaPct = team > 0 ? ((personal - team) / team) * 100 : 0
  return {
    personal,
    team,
    deltaPct,
    beatsTeam: personal <= team,
  }
}

export interface EngineerDeepDive {
  engineer: TeamMember
  tickets: TicketSpec[]
  workload: WorkloadScore
  completion: CompletionRate
  cycle: PersonalCycleTime
  review: ReviewLoad
  priorityMix: PriorityMixEntry[]
  statusMix: StatusDistributionEntry[]
}

export function buildEngineerDeepDive(
  fixture: SprintFixture,
  engineer: TeamMember,
): EngineerDeepDive {
  const tickets = fixture.tickets.filter((t) => t.assignee === engineer.id)
  return {
    engineer,
    tickets,
    workload: computeWorkloadScore(tickets, engineer.capacity),
    completion: computeCompletionRate(tickets),
    cycle: computePersonalCycleTime(fixture, engineer.id),
    review: computeReviewLoad(tickets),
    priorityMix: computePriorityMix(tickets),
    statusMix: computeStatusDistribution(tickets),
  }
}

// ============================================================
// Filter primitives (W10.D7)
// ============================================================

export interface TicketFilters {
  assignee?: string
  type?: string
  status?: string
}

export function applyTicketFilters(
  tickets: TicketSpec[],
  filters: TicketFilters,
): TicketSpec[] {
  const { assignee, type, status } = filters
  return tickets.filter((t) => {
    if (assignee && assignee !== 'all' && t.assignee !== assignee) return false
    if (type && type !== 'all' && t.type !== type) return false
    if (status && status !== 'all' && t.status !== status) return false
    return true
  })
}

export function hasActiveFilter(filters: TicketFilters): boolean {
  return (
    (filters.assignee !== undefined && filters.assignee !== 'all') ||
    (filters.type !== undefined && filters.type !== 'all') ||
    (filters.status !== undefined && filters.status !== 'all')
  )
}

// ============================================================
// Top KPI strip (W10.D7)
// Seven tiles mirroring the DE Tracker top row.
// ============================================================

export interface TopKpis {
  totalTickets: number
  completionPct: number
  done: number
  inReview: number
  inProgress: number
  open: number
  avgCycleDays: number | null
}

export function computeTopKpis(
  tickets: TicketSpec[],
  fixture: SprintFixture,
): TopKpis {
  const total = tickets.length
  const done = tickets.filter((t) => t.status === 'done').length
  const inReview = tickets.filter((t) => t.status === 'in-review').length
  const inProgress = tickets.filter((t) => t.status === 'in-progress').length
  // Open / To do bucket on the DE Tracker top strip groups todo plus blocked.
  const open = tickets.filter(
    (t) => t.status === 'todo' || t.status === 'blocked',
  ).length
  const completionPct = total > 0 ? (done / total) * 100 : 0

  // Avg cycle days: the last filled cycle time value from the fixture
  // (sprint level signal). Filter aware enough for the strip without
  // adding per ticket timestamps yet (W10.D8 lifts this to per ticket).
  const filledCycle = fixture.cycleTime.days.filter(
    (d): d is number => typeof d === 'number',
  )
  const avgCycleDays =
    filledCycle.length > 0 ? filledCycle[filledCycle.length - 1] ?? null : null

  return {
    totalTickets: total,
    completionPct,
    done,
    inReview,
    inProgress,
    open,
    avgCycleDays,
  }
}

// ============================================================
// Story points strip (W10.D7)
// Six tiles mirroring the DE Tracker story points row.
// ============================================================

export interface StoryPointsKpis {
  spCompleted: number
  spInProgress: number
  spInReview: number
  spOpen: number
  spTotal: number
  missingSp: number
}

export function computeStoryPointsKpis(tickets: TicketSpec[]): StoryPointsKpis {
  let spCompleted = 0
  let spInProgress = 0
  let spInReview = 0
  let spOpen = 0
  let missingSp = 0
  for (const t of tickets) {
    if (t.estimate === 0) missingSp += 1
    switch (t.status) {
      case 'done':
        spCompleted += t.estimate
        break
      case 'in-progress':
        spInProgress += t.estimate
        break
      case 'in-review':
        spInReview += t.estimate
        break
      case 'todo':
      case 'blocked':
        spOpen += t.estimate
        break
    }
  }
  const spTotal = spCompleted + spInProgress + spInReview + spOpen
  return { spCompleted, spInProgress, spInReview, spOpen, spTotal, missingSp }
}

// ============================================================
// Static option lists for the filter UI
// ============================================================

export const TICKET_TYPE_OPTIONS: { value: TicketType; label: string }[] = [
  { value: 'bug', label: 'Bug' },
  { value: 'development', label: 'Development' },
  { value: 'enhancement', label: 'Enhancement' },
  { value: 'deployment', label: 'Deployment' },
]

export const TICKET_STATUS_OPTIONS: { value: TicketStatus; label: string }[] = [
  { value: 'done', label: 'Done' },
  { value: 'in-review', label: 'In review' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'todo', label: 'To do' },
  { value: 'blocked', label: 'Blocked' },
]

// ============================================================
// Per ticket signals (W10.D8)
// ============================================================

const TODAY = '2026-05-17'

function daysBetween(fromIso: string, toIso: string): number {
  const a = new Date(fromIso).getTime()
  const b = new Date(toIso).getTime()
  return Math.max(0, (b - a) / (1000 * 60 * 60 * 24))
}

export interface AvgDaysInStatusEntry {
  status: TicketStatus
  label: string
  averageDays: number
  count: number
}

export function computeAvgDaysInStatus(
  tickets: TicketSpec[],
): AvgDaysInStatusEntry[] {
  // Reads each ticket's per-status duration (daysInStatus) directly.
  // This is the time the ticket has spent in its CURRENT status, not
  // the total age. Synthesized at fixture generation time with realistic
  // per-status distributions.
  const buckets: Record<TicketStatus, { total: number; count: number }> = {
    done: { total: 0, count: 0 },
    'in-review': { total: 0, count: 0 },
    'in-progress': { total: 0, count: 0 },
    todo: { total: 0, count: 0 },
    blocked: { total: 0, count: 0 },
  }
  for (const t of tickets) {
    buckets[t.status].total += t.daysInStatus
    buckets[t.status].count += 1
  }
  return STATUS_ORDER.map((status) => ({
    status,
    label: STATUS_LABELS[status],
    averageDays:
      buckets[status].count > 0
        ? buckets[status].total / buckets[status].count
        : 0,
    count: buckets[status].count,
  })).filter((entry) => entry.count > 0)
}

export interface PriorityBreakdownEntry {
  priority: TicketPriority
  done: number
  remaining: number
  total: number
}

export function computePriorityBreakdown(
  tickets: TicketSpec[],
): PriorityBreakdownEntry[] {
  return PRIORITY_ORDER.map((priority) => {
    const subset = tickets.filter((t) => t.priority === priority)
    const done = subset.filter((t) => t.status === 'done').length
    return {
      priority,
      done,
      remaining: subset.length - done,
      total: subset.length,
    }
  }).filter((entry) => entry.total > 0)
}

export interface EtaSummary {
  missingEta: number
  overdue: number
  total: number
}

export function computeEtaSummary(tickets: TicketSpec[]): EtaSummary {
  let missingEta = 0
  let overdue = 0
  const now = new Date(TODAY).getTime()
  for (const t of tickets) {
    if (t.eta === null) {
      missingEta += 1
      continue
    }
    if (t.status === 'done') continue
    if (new Date(t.eta).getTime() < now) overdue += 1
  }
  return { missingEta, overdue, total: tickets.length }
}

export type CycleTone = 'fast' | 'on-track' | 'slow'

export interface PerTicketCycleEntry {
  ticketId: string
  title: string
  assignee: string
  days: number
  tone: CycleTone
}

export function computePerTicketCycleTime(
  tickets: TicketSpec[],
  teamBaseline: number,
): PerTicketCycleEntry[] {
  const done = tickets.filter((t) => t.status === 'done')
  const entries = done.map((t) => {
    const days = daysBetween(t.createdAt, TODAY)
    let tone: CycleTone = 'on-track'
    if (days < teamBaseline * 1.5) tone = 'fast'
    else if (days > teamBaseline * 5) tone = 'slow'
    return {
      ticketId: t.id,
      title: t.title,
      assignee: t.assignee,
      days,
      tone,
    }
  })
  return entries.sort((a, b) => b.days - a.days)
}

export type AgingTone = 'fresh' | 'aging' | 'stale'

export interface AgingTicketEntry {
  ticketId: string
  title: string
  status: TicketStatus
  assignee: string
  ageDays: number
  tone: AgingTone
}

export function computeAgingTickets(tickets: TicketSpec[]): AgingTicketEntry[] {
  const open = tickets.filter((t) => t.status !== 'done')
  const entries = open.map((t) => {
    const ageDays = daysBetween(t.createdAt, TODAY)
    let tone: AgingTone = 'fresh'
    if (ageDays > 60) tone = 'stale'
    else if (ageDays > 20) tone = 'aging'
    return {
      ticketId: t.id,
      title: t.title,
      status: t.status,
      assignee: t.assignee,
      ageDays,
      tone,
    }
  })
  return entries.sort((a, b) => b.ageDays - a.ageDays)
}

export interface WorkloadByAssigneeEntry {
  engineer: TeamMember
  done: number
  total: number
  ratio: number
}

export function computeWorkloadByAssignee(
  tickets: TicketSpec[],
  team: TeamMember[],
): WorkloadByAssigneeEntry[] {
  return team.map((member) => {
    const own = tickets.filter((t) => t.assignee === member.id)
    const done = own.filter((t) => t.status === 'done').length
    const total = own.length
    return {
      engineer: member,
      done,
      total,
      ratio: total > 0 ? done / total : 0,
    }
  })
}
