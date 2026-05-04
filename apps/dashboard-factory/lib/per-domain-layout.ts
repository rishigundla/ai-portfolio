/**
 * Per-domain dashboard layout overrides.
 *
 * Each of the 6 portfolio datasets gets a hand-curated chart mix that uses
 * the existing 7-chart toolkit (bar / line / donut / heatmap / scatter /
 * funnel / histogram) but with deliberate axis + dimension picks that match
 * the domain's analytical conventions:
 *
 *   - RevOps: ACV by Segment + ACV trend + ACV vs GRR% scatter +
 *             deal_stage funnel
 *   - Marketing: spend by Channel + Impressions→Clicks→Conversions funnel +
 *                CPA vs ROI scatter + heatmap (Channel × month)
 *   - Pulse: P95 latency trend + P95 latency histogram + heatmap
 *           (Customer × time) + errors by Product
 *   - Supply: fulfillment % by Supplier + lead-time vs unit-cost scatter +
 *             lead-time histogram + heatmap (Region × month)
 *   - Financial: days-to-resolve histogram + top issue types bar +
 *                response_status funnel + line trend
 *   - Customer: LTV vs CSAT scatter + heatmap (Industry × signup-year cohort)
 *               + LTV by Segment bar + signup-count line
 *
 * The builder consults `getDomainOverride(slug)` first; when an override is
 * registered it drives all 4 chart slots. When unknown (e.g. a future
 * dataset added after this file), the builder falls through to the generic
 * schema-driven slot allocator from W4.D6.
 *
 * Each `ChartPick` references columns by NAME, not by index, so a future
 * schema reorder won't silently swap a chart's axis. Picks that reference
 * a missing column are skipped at resolve time with a console.warn.
 */

export type ChartPickKind =
  | 'bar'
  | 'line'
  | 'donut'
  | 'heatmap'
  | 'scatter'
  | 'funnel'
  | 'histogram'

/**
 * A single chart slot in a per-domain layout. The fields actually consumed
 * vary by `kind` — see `resolveChartPick()` in dashboard-builder.ts for the
 * dispatch contract.
 */
export interface ChartPick {
  kind: ChartPickKind
  /** Single measure for line / histogram / heatmap-cell-value / bar-by-measure. */
  measureName?: string
  /** Single dimension for bar / donut / heatmap-yAxis / funnel-from-dim. */
  dimName?: string
  /** X-axis measure for scatter. */
  measureXName?: string
  /** Y-axis measure for scatter. */
  measureYName?: string
  /** Ordered list of measures for measure-aggregated funnel. */
  funnelMeasureNames?: string[]
  /** Optional title override (otherwise the builder generates one). */
  title?: string
}

export interface DomainOverride {
  /**
   * Exactly which measures (by name) and in which order should populate the
   * KPI strip. Builder will append derived KPIs (counts, top values) only if
   * fewer than 5 measures are listed.
   */
  kpiMeasureNames?: string[]
  /** Up to 4 chart picks that drive the chart grid. */
  chartPicks: ChartPick[]
}

const OVERRIDES: Record<string, DomainOverride> = {
  // ============================================================
  // RevOps Sales SSOT — pipeline + retention metrics
  // ============================================================
  'revops-sales': {
    kpiMeasureNames: ['acv_usd', 'grr_pct'],
    chartPicks: [
      { kind: 'bar', measureName: 'acv_usd', dimName: 'segment', title: 'ACV by Segment' },
      { kind: 'line', measureName: 'acv_usd', title: 'ACV trend' },
      {
        kind: 'scatter',
        measureXName: 'acv_usd',
        measureYName: 'grr_pct',
        title: 'ACV vs GRR % (per deal)',
      },
      // deal_stage has explicit `values` ordering (Qualification → Proposal
      // → Negotiation → Closed Won → Closed Lost) so the funnel preserves
      // semantic stage order rather than sorting by count.
      { kind: 'funnel', dimName: 'deal_stage', title: 'Deal pipeline' },
    ],
  },

  // ============================================================
  // Marketing Campaigns — funnel from impressions → clicks → conversions
  // ============================================================
  'marketing-campaigns': {
    // Curated 5: spend, conversions, ROI %, CPA, CTR % — what a marketer
    // actually scans first, in that order. (Schema has 7 measures; without
    // a curated pick the generic builder grabs spend/impressions/clicks/
    // CTR/conversions which leaves out ROI and CPA — the two highest-signal
    // measures for campaign performance.)
    kpiMeasureNames: ['spend_usd', 'conversions', 'roi_pct', 'cpa_usd', 'ctr_pct'],
    chartPicks: [
      { kind: 'bar', measureName: 'spend_usd', dimName: 'channel', title: 'Spend by Channel' },
      // Real marketing funnel — the three measures form a natural funnel
      // because each row's clicks ≤ impressions and conversions ≤ clicks.
      // This is more informative than a count-of-channel funnel.
      {
        kind: 'funnel',
        funnelMeasureNames: ['impressions', 'clicks', 'conversions'],
        title: 'Impressions → Clicks → Conversions',
      },
      {
        kind: 'scatter',
        measureXName: 'cpa_usd',
        measureYName: 'roi_pct',
        title: 'CPA vs ROI % (low CPA + high ROI = best campaigns)',
      },
      // Channel × month heatmap — sums spend per cell, gives the
      // "where + when am I spending" view in one chart.
      { kind: 'heatmap', dimName: 'channel', measureName: 'spend_usd', title: 'Spend: Channel × month' },
    ],
  },

  // ============================================================
  // Pulse Telemetry — latency-focused
  // ============================================================
  'pulse-telemetry': {
    kpiMeasureNames: [
      'usage_count',
      'active_users',
      'p95_latency_ms',
      'error_count',
      'health_score',
    ],
    chartPicks: [
      { kind: 'line', measureName: 'p95_latency_ms', title: 'P95 latency trend' },
      // Latency distribution is the canonical "is the long tail OK" view
      // for telemetry. Histogram bins surface multimodality if the data
      // has it.
      { kind: 'histogram', measureName: 'p95_latency_ms', title: 'P95 latency distribution' },
      // Keep the customer × time heatmap — pulse-telemetry's date span is
      // 33 days so the existing monthly bucketing yields ~2 columns. The
      // heatmap still surfaces "which customers are heaviest" by row
      // intensity even with few time buckets.
      { kind: 'heatmap', dimName: 'customer_id', measureName: 'usage_count', title: 'Usage Count: Customer × time' },
      { kind: 'bar', measureName: 'error_count', dimName: 'product', title: 'Errors by Product' },
    ],
  },

  // ============================================================
  // Supply Chain — fulfillment + lead-time
  // ============================================================
  'supply-chain': {
    kpiMeasureNames: [
      'fulfillment_pct',
      'lead_time_days',
      'total_cost_usd',
      'cost_per_unit',
      'ordered_units',
    ],
    chartPicks: [
      {
        kind: 'bar',
        measureName: 'fulfillment_pct',
        dimName: 'supplier_name',
        title: 'Fulfillment % by Supplier',
      },
      {
        kind: 'scatter',
        measureXName: 'lead_time_days',
        measureYName: 'cost_per_unit',
        title: 'Lead time vs Unit cost',
      },
      { kind: 'histogram', measureName: 'lead_time_days', title: 'Lead time distribution' },
      { kind: 'heatmap', dimName: 'region', measureName: 'total_cost_usd', title: 'Total cost: Region × month' },
    ],
  },

  // ============================================================
  // Financial Complaints — distribution + funnel
  // ============================================================
  'financial-complaints': {
    // Only 1 measure on this dataset — KPI strip will mostly be derived
    // (Total Complaints / Top Issue Type / Issue Types / Products).
    kpiMeasureNames: ['days_to_resolve'],
    chartPicks: [
      // Days-to-resolve is the headline operational metric — distribution
      // shows whether complaints close fast or stretch into a long tail.
      { kind: 'histogram', measureName: 'days_to_resolve', title: 'Days to resolve distribution' },
      { kind: 'bar', dimName: 'issue_type', title: 'Top issue types' },
      // response_status has 5 ordered values — natural funnel of
      // complaints flowing through the response pipeline.
      { kind: 'funnel', dimName: 'response_status', title: 'Response pipeline' },
      // State distribution surfaces geographic concentration of complaints.
      // Bar (top-N) reads cleaner than donut for high-cardinality dims.
      { kind: 'bar', dimName: 'state', title: 'Top states' },
    ],
  },

  // ============================================================
  // Customer Demographics — LTV / satisfaction quadrant + cohort
  // ============================================================
  'customer-demographics': {
    kpiMeasureNames: ['ltv_usd', 'csat_score', 'nps'],
    chartPicks: [
      {
        kind: 'scatter',
        measureXName: 'ltv_usd',
        measureYName: 'csat_score',
        title: 'LTV vs CSAT (per customer)',
      },
      // 4-year signup span → yearly bucketing in heatmap. Industry on Y
      // axis gives the classic cohort-by-vertical view.
      { kind: 'heatmap', dimName: 'industry', measureName: 'ltv_usd', title: 'LTV: Industry × signup year' },
      { kind: 'bar', measureName: 'ltv_usd', dimName: 'segment', title: 'LTV by Segment' },
      { kind: 'line', title: 'Signup count over time' },
    ],
  },
}

export function getDomainOverride(slug: string): DomainOverride | undefined {
  return OVERRIDES[slug]
}
