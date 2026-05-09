/**
 * Data-driven wireframe template engine.
 *
 * Replaces the 3 hardcoded wireframe templates (Executive / Operational /
 * Exploratory at app/wireframe/_components/*) with a single engine that
 * consumes:
 *
 *   1. A wireframe dataset (rows + schema) via getWireframeDataset(slug)
 *   2. A per-dataset recommendation (KPI measures + 4 ChartPicks) via
 *      getWireframeRecommendation(slug)
 *
 * and emits a `DashboardLayout` consumable by the existing `<DashboardView>`
 * (the same component the ad-hoc /dashboard route uses). All chart
 * resolution + KPI building reuses dashboard-builder's machinery.
 *
 * The engine produces a single canonical layout: 5-KPI strip + 4-chart
 * 2x2 grid (formerly the "Balanced" density). Earlier Sparse and Dense
 * modes were removed in favour of one polished default — same data
 * drives every wireframe.
 */

import type { ColumnSchema } from './full-datasets'
import type { FullDataset } from './full-datasets'
import {
  buildKpis,
  resolveChartPick,
  type DashboardChart,
  type DashboardLayout,
  type PickResolverHelpers,
} from './dashboard-builder'
import { splitByPeriod } from './period'
import {
  getWireframeRecommendation,
  type WireframeRecommendation,
} from './wireframe-recommendations'
import { getWireframeDataset } from './wireframe-datasets'

export interface WireframeLayout {
  /** KPIs + charts, identical shape to the ad-hoc DashboardLayout. */
  layout: DashboardLayout
  /** Source dataset, exposed for header chrome (title / tagline). */
  dataset: FullDataset
  /** Recommendation source, exposed for a future "Why these charts?" panel. */
  recommendation: WireframeRecommendation
}

/**
 * Build a wireframe layout for the given dataset slug.
 * Returns null when the slug is unknown OR no recommendation is registered
 * (both are expected — caller should 404 in that case).
 */
export function buildWireframeLayout(slug: string): WireframeLayout | null {
  const dataset = getWireframeDataset(slug)
  const recommendation = getWireframeRecommendation(slug)
  if (!dataset || !recommendation) return null

  const { rows, metadata } = dataset
  const schema = metadata.schema

  // Reuse the resolver helpers shape that dashboard-builder.resolveChartPick
  // expects. Same lookup logic as the ad-hoc generic builder.
  const byName = new Map(schema.map((c) => [c.name, c]))
  const findMeasure = (name?: string): ColumnSchema | undefined => {
    if (!name) return undefined
    const c = byName.get(name)
    return c?.type === 'measure' ? c : undefined
  }
  const findDim = (name?: string): ColumnSchema | undefined => {
    if (!name) return undefined
    const c = byName.get(name)
    return c?.type === 'dimension' ? c : undefined
  }
  const helpers: PickResolverHelpers = {
    findMeasure,
    findDim,
    timeCol: schema.find((c) => c.type === 'time'),
    idColumn: schema.find((c) => c.type === 'id'),
  }

  // Resolve each chart pick via the existing dispatcher. Missing-column
  // picks console.warn and skip (same behavior the ad-hoc layouts already
  // exhibit), so a misconfigured recommendation surfaces in the dev console
  // rather than silently rendering garbage.
  const charts: DashboardChart[] = []
  for (const pick of recommendation.chartPicks) {
    const chart = resolveChartPick(rows, pick, helpers)
    if (chart) {
      charts.push(pick.title ? { ...chart, title: pick.title } : chart)
    } else {
      // eslint-disable-next-line no-console
      console.warn(
        `[wireframe-engine] Skipped chart pick (kind=${pick.kind}) for slug=${slug} — required column(s) missing or wrong type.`,
        pick,
      )
    }
  }

  // KPI selection drawn from the recommendation's kpiMeasureNames. Resolve
  // each by name and pass to the existing buildKpis() so we reuse:
  //   - period-over-period growth % delta computation (W4.D6)
  //   - sparkline bucketing
  //   - derived-KPI fallback (Total X, Top X, distinct counts) when fewer
  //     than 5 measures are listed
  const measures = recommendation.kpiMeasureNames
    .map((n) => byName.get(n))
    .filter((c): c is ColumnSchema => c?.type === 'measure')
  const dimensions = schema.filter((c) => c.type === 'dimension')
  const usefulDimensions = dimensions.filter((d) => {
    const distinct = new Set(rows.map((r) => r[d.name])).size
    return distinct > 1 && distinct < rows.length
  })
  const period = splitByPeriod(rows, helpers.timeCol)

  const kpis = buildKpis(rows, measures, usefulDimensions, helpers.idColumn, period)

  return {
    layout: { kpis, charts },
    dataset,
    recommendation,
  }
}
