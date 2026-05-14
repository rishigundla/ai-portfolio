/**
 * Full dashboard fixture loader.
 *
 * Statically imports all 6 dashboard JSONs so webpack can tree-shake
 * unused dashboards per route at build time. Each /generate/[slug] and
 * /deck/[slug] page loads only its own dashboard's JSON in its bundle.
 *
 * The gallery at /dashboards uses lib/dashboards.ts (manifest only).
 * This module is heavier and should only be imported by routes that
 * actually need KPI / chart / row data.
 */

import revopsQ3 from '../../../fixtures/narrative-generator/dashboards/revops-q3-readout.json'
import marketingQ3 from '../../../fixtures/narrative-generator/dashboards/marketing-q3-performance.json'
import opsUptime from '../../../fixtures/narrative-generator/dashboards/ops-uptime-quality.json'
import financeQuarter from '../../../fixtures/narrative-generator/dashboards/finance-quarter-close.json'
import hrEngagement from '../../../fixtures/narrative-generator/dashboards/hr-engagement-attrition.json'
import cxCsatNps from '../../../fixtures/narrative-generator/dashboards/cx-csat-nps.json'
import type { ColorToken } from './dashboards'

// ============================================================
// Types
// ============================================================

/**
 * KPI as it appears on a finished dashboard — value already computed,
 * delta already calculated. The narrative generator's job is to explain
 * what these numbers mean, not to compute them.
 */
export interface KpiSpec {
  id: string
  label: string
  /**
   * The headline value. String when format is 'categorical' (top-segment
   * style); number for everything else. Caller renders based on `format`.
   */
  value: number | string
  format: 'currency' | 'percent' | 'count' | 'rating' | 'duration' | 'ratio' | 'score' | 'categorical'
  currency?: string
  unit?: string
  deltaPct?: number
  deltaDirection?: 'up' | 'down'
  deltaWindow?: string
  /** Optional 1-line context shown under the value (e.g., "Beat plan by 3.8%"). */
  subtext?: string
  /** Time-series sample for the small sparkline next to the KPI. */
  sparkline?: number[]
}

/**
 * Chart shape on a finished dashboard. Discriminated on `type` so the
 * renderer can pick the right Recharts component (or custom layout) per
 * kind. Project 1's dashboard-factory engine has a richer 7-kind chart
 * dispatcher; here we start with the 3 most common.
 */
export type ChartType = 'line' | 'bar' | 'donut'

export interface ChartDataPoint {
  label: string
  value: number
}

export interface ChartSpec {
  id: string
  type: ChartType
  title: string
  subtitle?: string
  data: ChartDataPoint[]
}

/**
 * Full dashboard fixture — what /generate/[slug] consumes to drive
 * the narrative streaming, and what /deck/[slug] consumes to render
 * the slide deck preview.
 */
export interface DashboardFixture {
  id: string
  metadata: {
    title: string
    tagline: string
    domain: string
    colorToken: ColorToken
    icon: string
    thumbnail: string
    period: string
    audience: string
  }
  kpis: KpiSpec[]
  charts: ChartSpec[]
  rows: Record<string, unknown>[]
}

// ============================================================
// Static-import map — webpack tree-shakes unused entries per route
// ============================================================

const FIXTURES: Record<string, DashboardFixture> = {
  'revops-q3-readout': revopsQ3 as DashboardFixture,
  'marketing-q3-performance': marketingQ3 as DashboardFixture,
  'ops-uptime-quality': opsUptime as DashboardFixture,
  'finance-quarter-close': financeQuarter as DashboardFixture,
  'hr-engagement-attrition': hrEngagement as DashboardFixture,
  'cx-csat-nps': cxCsatNps as DashboardFixture,
}

/**
 * Returns the full fixture for a slug, or `undefined` if the slug
 * doesn't match any dashboard. Routes should treat undefined as a
 * 404 condition (use Next.js notFound()).
 */
export function getFullDashboard(slug: string): DashboardFixture | undefined {
  return FIXTURES[slug]
}

/**
 * Enumerate all fixture payloads — primarily for generateStaticParams
 * + cross-route iteration in tests. Routes that only need metadata
 * should use lib/dashboards.ts instead (lighter bundle).
 */
export function getAllFullDashboards(): DashboardFixture[] {
  return Object.values(FIXTURES)
}
