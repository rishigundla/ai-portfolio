/**
 * Per-dataset chart-pick recommendations for wireframe-mode rendering.
 *
 * Each entry mirrors the "Recommended Charts" section of the corresponding
 * W5.D2 profiling fixture (in `fixtures/dashboard-factory/wireframe-profiling/`)
 * so what a user reads in the streaming narrative matches what the wireframe
 * engine actually materializes.
 *
 * Structure mirrors `lib/per-domain-layout.ts` but lives in its own module
 * for the wireframe stack. Both modules emit the same `ChartPick` shape that
 * `dashboard-builder.resolveChartPick()` knows how to dispatch.
 *
 * Each dataset is allocated:
 *   - 5 KPI measure picks (matching the profiling text's "Recommended KPIs")
 *   - 4 chart picks (matching the profiling text's "Recommended Charts")
 *
 * Charts deliberately span the full 7-chart toolkit (bar/line/donut/heatmap/
 * scatter/funnel/histogram) across the 6 datasets so the engine has varied
 * specs to materialize.
 */

import type { ChartPick } from './per-domain-layout'

export interface WireframeRecommendation {
  /** Specific measures (by name) and order to populate the KPI strip. */
  kpiMeasureNames: string[]
  /** 4 chart picks dispatched by `resolveChartPick`. */
  chartPicks: ChartPick[]
}

const RECOMMENDATIONS: Record<string, WireframeRecommendation> = {
  // Manufacturing — Line D Night-shift scrap concentration + OEE leadership
  'manufacturing-throughput': {
    kpiMeasureNames: ['units_produced', 'oee_pct', 'defect_rate_pct', 'cycle_time_min', 'units_passed'],
    chartPicks: [
      { kind: 'bar', measureName: 'units_produced', dimName: 'production_line', title: 'Units Produced by Line' },
      { kind: 'histogram', measureName: 'defect_rate_pct', title: 'Defect rate distribution' },
      { kind: 'funnel', dimName: 'defect_status', title: 'Pass to Rework to Scrap' },
      { kind: 'heatmap', dimName: 'production_line', measureName: 'oee_pct', title: 'OEE: Line x Plant' },
    ],
  },

  // Real Estate — hot/stale market split + Multi-Family at Over $1M
  'real-estate-pipeline': {
    kpiMeasureNames: ['list_price_usd', 'sold_price_usd', 'days_on_market', 'sqft', 'commission_pct'],
    chartPicks: [
      {
        kind: 'scatter',
        measureXName: 'list_price_usd',
        measureYName: 'days_on_market',
        title: 'List price vs Days on market',
      },
      { kind: 'funnel', dimName: 'listing_status', title: 'Listing pipeline' },
      { kind: 'bar', measureName: 'days_on_market', dimName: 'market', title: 'Avg DOM by Market' },
      { kind: 'donut', dimName: 'property_type', title: 'Property type mix' },
    ],
  },

  // Healthcare — Walk-in wait drag + Mental Health satisfaction lead
  'healthcare-operations': {
    kpiMeasureNames: ['wait_time_min', 'visit_duration_min', 'satisfaction_score', 'charges_usd'],
    chartPicks: [
      { kind: 'bar', dimName: 'department', title: 'Visits by Department' },
      {
        kind: 'scatter',
        measureXName: 'wait_time_min',
        measureYName: 'satisfaction_score',
        title: 'Wait time vs Satisfaction',
      },
      { kind: 'funnel', dimName: 'visit_type', title: 'Visit acuity ladder' },
      { kind: 'heatmap', dimName: 'clinic', measureName: 'wait_time_min', title: 'Avg wait: Clinic x time' },
    ],
  },

  // Education — Online completion gap + Advanced small-cohort persistence
  'education-enrollment': {
    kpiMeasureNames: ['students_enrolled', 'students_completed', 'completion_pct', 'avg_grade', 'satisfaction_score'],
    chartPicks: [
      { kind: 'bar', measureName: 'students_enrolled', dimName: 'course_subject', title: 'Enrollment by Subject' },
      { kind: 'heatmap', dimName: 'course_subject', measureName: 'completion_pct', title: 'Completion: Subject x term' },
      { kind: 'funnel', dimName: 'enrollment_status', title: 'Enrollment lifecycle' },
      { kind: 'line', measureName: 'completion_pct', title: 'Completion trend' },
    ],
  },

  // SaaS — Enterprise MRR dominance + Free/Starter churn cluster
  'saas-subscriptions': {
    kpiMeasureNames: ['mrr_usd', 'arr_usd', 'expansion_mrr_usd', 'nps', 'seat_count'],
    chartPicks: [
      { kind: 'bar', measureName: 'mrr_usd', dimName: 'plan_tier', title: 'MRR by Plan Tier' },
      { kind: 'funnel', dimName: 'account_status', title: 'Account lifecycle' },
      {
        kind: 'scatter',
        measureXName: 'mrr_usd',
        measureYName: 'nps',
        title: 'MRR vs NPS (per account)',
      },
      { kind: 'heatmap', dimName: 'industry', measureName: 'mrr_usd', title: 'MRR: Industry x year' },
    ],
  },

  // Logistics — bimodal distance + Refrigerated capacity premium
  'logistics-fleet': {
    kpiMeasureNames: ['distance_miles', 'fuel_gallons', 'capacity_pct', 'fuel_efficiency_mpg', 'transit_hours'],
    chartPicks: [
      { kind: 'histogram', measureName: 'distance_miles', title: 'Distance distribution (bimodal)' },
      { kind: 'funnel', dimName: 'shipment_status', title: 'Fulfillment lifecycle' },
      {
        kind: 'scatter',
        measureXName: 'distance_miles',
        measureYName: 'fuel_gallons',
        title: 'Distance vs Fuel (MPG slope)',
      },
      { kind: 'heatmap', dimName: 'route_type', measureName: 'capacity_pct', title: 'Avg capacity: Route x Vehicle' },
    ],
  },
}

export function getWireframeRecommendation(slug: string): WireframeRecommendation | undefined {
  return RECOMMENDATIONS[slug]
}
