/**
 * Wireframe template metadata + mock data.
 *
 * Three layout archetypes for Persona B (BI engineer) discovery sessions:
 *   - Executive: "1 number + 1 chart, oversized for a CEO meeting room"
 *   - Operational: "dense 6-KPI strip + 2×2 grid for an SRE control center"
 *   - Exploratory: "filter rail + flexible grid for a data analyst's notebook"
 *
 * Each template carries hand-crafted static demo data so the mockups look
 * realistic without needing to pick a real dataset. The data shape mirrors
 * what /dashboard/[slug] computes from real rows.
 */

export type TemplateId = 'executive' | 'operational' | 'exploratory'

export interface TemplateSummary {
  id: TemplateId
  title: string
  tagline: string
  audience: string
  density: 'sparse' | 'medium' | 'dense'
  /** Color token for thumbnail accent. Mirrors the dataset palette. */
  colorToken: 'accent' | 'purple' | 'amber'
}

export const TEMPLATES: TemplateSummary[] = [
  {
    id: 'executive',
    title: 'Executive',
    tagline: 'One headline number, one anchor chart. Designed for QBR / board readouts.',
    audience: 'C-suite, board members, leadership team',
    density: 'sparse',
    colorToken: 'accent',
  },
  {
    id: 'operational',
    title: 'Operational',
    tagline: 'Dense 6-KPI strip plus a 2×2 chart grid. Designed for daily ops standups.',
    audience: 'Operations leads, SRE teams, control rooms',
    density: 'dense',
    colorToken: 'amber',
  },
  {
    id: 'exploratory',
    title: 'Exploratory',
    tagline: 'Filter rail plus a flexible chart grid. Designed for ad-hoc investigation.',
    audience: 'Data analysts, RevOps, product managers',
    density: 'medium',
    colorToken: 'purple',
  },
]

export function getTemplate(id: string): TemplateSummary | undefined {
  return TEMPLATES.find((t) => t.id === id)
}

// ============================================================
// Hand-crafted mock data per template
// ============================================================

export interface MockKpi {
  label: string
  value: string
  unit?: string
  delta?: { value: number; direction: 'up' | 'down' | 'neutral'; period: string }
  sparkline?: number[]
}

export interface MockBars {
  bars: Array<{ label: string; value: number }>
  max: number
}

export interface MockLine {
  points: Array<{ label: string; value: number }>
  max: number
}

export interface MockDonut {
  slices: Array<{ label: string; pct: number; color: string }>
  total: string
}

// ----------------- Executive ------------------

export const EXECUTIVE_DATA = {
  headline: {
    label: 'FY26 Bookings',
    value: '$148.2M',
    delta: { value: 18.4, direction: 'up' as const, period: 'vs FY25' },
    sparkline: [82, 88, 95, 101, 108, 118, 125, 132, 140, 148],
  },
  subKpis: [
    { label: 'Net Retention', value: '118%', delta: { value: 4.2, direction: 'up' as const, period: 'YoY' } },
    { label: 'Logo Growth', value: '+312', delta: { value: 11.0, direction: 'up' as const, period: 'YoY' } },
    { label: 'Churn', value: '6.8%', delta: { value: 0.9, direction: 'down' as const, period: 'YoY' } },
  ],
  trend: {
    points: [
      { label: 'Q1 FY24', value: 22.4 },
      { label: 'Q2', value: 24.1 },
      { label: 'Q3', value: 26.5 },
      { label: 'Q4', value: 28.8 },
      { label: 'Q1 FY25', value: 30.1 },
      { label: 'Q2', value: 31.4 },
      { label: 'Q3', value: 32.9 },
      { label: 'Q4', value: 34.7 },
      { label: 'Q1 FY26', value: 36.2 },
      { label: 'Q2', value: 37.5 },
      { label: 'Q3', value: 38.8 },
      { label: 'Q4', value: 40.6 },
    ],
    max: 42,
  } satisfies MockLine,
}

// ----------------- Operational ------------------

export const OPERATIONAL_DATA = {
  kpis: [
    { label: 'Active Clusters', value: '1,247', delta: { value: 2.1, direction: 'up' as const, period: '7d' } },
    { label: 'Healthy %', value: '98.4%', delta: { value: 0.3, direction: 'up' as const, period: '7d' } },
    { label: 'P95 Latency', value: '142', unit: 'ms', delta: { value: 8.0, direction: 'down' as const, period: '7d' } },
    { label: 'Errors / 1k', value: '4.2', delta: { value: 12.5, direction: 'down' as const, period: '7d' } },
    { label: 'On-call Pages', value: '23', delta: { value: 4.0, direction: 'down' as const, period: '7d' } },
    { label: 'Open Incidents', value: '3', delta: { value: 1, direction: 'down' as const, period: 'today' } },
  ] satisfies MockKpi[],

  byProduct: {
    bars: [
      { label: 'Vega', value: 1840 },
      { label: 'Orion', value: 1240 },
      { label: 'Atlas', value: 880 },
      { label: 'Files', value: 420 },
      { label: 'Move', value: 180 },
    ],
    max: 1840,
  } satisfies MockBars,

  latencyTrend: {
    points: [
      { label: 'Mon', value: 138 },
      { label: 'Tue', value: 145 },
      { label: 'Wed', value: 162 },
      { label: 'Thu', value: 158 },
      { label: 'Fri', value: 142 },
      { label: 'Sat', value: 128 },
      { label: 'Sun', value: 132 },
    ],
    max: 175,
  } satisfies MockLine,

  byRegion: {
    slices: [
      { label: 'us-east-1', pct: 38, color: '#14b8a6' },
      { label: 'us-west-2', pct: 22, color: '#a78bfa' },
      { label: 'eu-west-1', pct: 18, color: '#60a5fa' },
      { label: 'ap-south-1', pct: 14, color: '#fbbf24' },
      { label: 'ap-northeast-1', pct: 8, color: '#fb7185' },
    ],
    total: '1,247',
  } satisfies MockDonut,

  errorsBySeverity: {
    bars: [
      { label: 'Critical', value: 4 },
      { label: 'High', value: 18 },
      { label: 'Medium', value: 92 },
      { label: 'Low', value: 245 },
    ],
    max: 245,
  } satisfies MockBars,
}

// ----------------- Exploratory ------------------

export const EXPLORATORY_DATA = {
  segments: ['Enterprise', 'Mid-Market', 'SMB', 'Channel', 'Strategic'],
  dimensions: ['Region', 'Industry', 'Product', 'Cohort'],
  dateRanges: ['Last 7 days', 'Last 30 days', 'Last quarter', 'Last year', 'All time'],

  kpis: [
    { label: 'Customers in view', value: '2,415', sparkline: [1.8, 2.0, 2.1, 2.3, 2.4, 2.4, 2.4] },
    { label: 'Avg LTV', value: '$847K', delta: { value: 6.4, direction: 'up' as const, period: '30d' } },
    { label: 'Net Revenue Retention', value: '115%', delta: { value: 2.1, direction: 'up' as const, period: '30d' } },
    { label: 'Time to value', value: '18', unit: 'days', delta: { value: 12, direction: 'down' as const, period: '30d' } },
  ] satisfies MockKpi[],

  cohortHeatmap: [
    [12, 18, 24, 31, 38],
    [11, 17, 23, 29, 36],
    [13, 19, 26, 32, 39],
    [9, 15, 21, 28, 34],
    [10, 16, 22, 27, 33],
    [11, 17, 22, 28, 35],
  ],

  industryMix: {
    slices: [
      { label: 'Financial Services', pct: 28, color: '#14b8a6' },
      { label: 'Manufacturing', pct: 22, color: '#a78bfa' },
      { label: 'Healthcare', pct: 18, color: '#60a5fa' },
      { label: 'Technology', pct: 16, color: '#fbbf24' },
      { label: 'Retail', pct: 10, color: '#fb7185' },
      { label: 'Other', pct: 6, color: '#94a3b8' },
    ],
    total: '2,415',
  } satisfies MockDonut,

  ltvDistribution: {
    bars: [
      { label: '< $100K', value: 312 },
      { label: '$100K-500K', value: 894 },
      { label: '$500K-1M', value: 645 },
      { label: '$1M-5M', value: 412 },
      { label: '$5M+', value: 152 },
    ],
    max: 894,
  } satisfies MockBars,
}
