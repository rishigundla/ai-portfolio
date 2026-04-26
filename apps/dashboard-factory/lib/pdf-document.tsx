/**
 * PDF document for the Dashboard Factory export.
 *
 * Uses @react-pdf/renderer's component primitives — NOT regular React DOM.
 * The library has its own <Document> <Page> <View> <Text> tree and a
 * StyleSheet.create() API. Tailwind doesn't work here.
 *
 * Color palette is a LIGHT-THEME variant of the design tokens:
 *   - White background (recipients usually print or share via email)
 *   - Accent at #14b8a6 (darker teal) for contrast on white
 *   - Borders + dividers in light gray
 *
 * Imported dynamically by _dashboard-interactive.tsx so the ~200 kB
 * @react-pdf/renderer bundle only loads when the user clicks Export PDF.
 */

import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'
import type { DashboardLayout } from './dashboard-builder'
import type { DashboardFilters } from './filters'

// ============================================================
// Brand color palette (light-theme PDF variant)
// ============================================================

const COLORS = {
  bg: '#ffffff',
  text: '#1a1a2e',
  textMuted: '#6b7280',
  textDim: '#9ca3af',
  accent: '#14b8a6',
  accentLight: '#a7f3d0',
  border: '#e5e7eb',
  surface: '#f9fafb',
  // For donut slices, mirroring the on-screen 6-color palette in slightly
  // darker variants so they stay readable on white
  palette: ['#14b8a6', '#8b5cf6', '#3b82f6', '#f59e0b', '#f43f5e', '#10b981'],
}

// Donut palette is a tuple of strings for safe indexing
const DONUT_PALETTE = COLORS.palette

// ============================================================
// StyleSheet
// ============================================================

const styles = StyleSheet.create({
  page: {
    padding: 36,
    backgroundColor: COLORS.bg,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: COLORS.text,
  },

  // Header
  header: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 16,
    marginBottom: 20,
  },
  eyebrow: {
    fontSize: 8,
    color: COLORS.accent,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    fontSize: 8,
    color: COLORS.textMuted,
    fontFamily: 'Courier',
  },
  metaItem: {
    fontSize: 8,
    color: COLORS.textMuted,
    fontFamily: 'Courier',
  },
  metaItemAccent: {
    color: COLORS.accent,
    fontFamily: 'Courier-Bold',
  },

  // KPI section
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.text,
    marginTop: 18,
    marginBottom: 8,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  kpiCard: {
    width: '48.5%',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    backgroundColor: COLORS.surface,
    padding: 10,
  },
  kpiLabel: {
    fontSize: 8,
    color: COLORS.textMuted,
    fontFamily: 'Courier-Bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  kpiValue: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.accent,
  },

  // Bar list section
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    fontSize: 9,
  },
  barLabel: {
    width: '32%',
    color: COLORS.text,
    fontSize: 9,
  },
  barTrack: {
    flex: 1,
    height: 10,
    backgroundColor: COLORS.surface,
    borderRadius: 2,
    position: 'relative',
  },
  barFill: {
    height: 10,
    backgroundColor: COLORS.accent,
    borderRadius: 2,
    opacity: 0.7,
  },
  barValue: {
    width: '18%',
    textAlign: 'right',
    fontFamily: 'Courier',
    fontSize: 9,
    color: COLORS.textMuted,
  },

  // Donut summary section
  donutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 3,
    fontSize: 9,
  },
  donutSwatch: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  donutLabel: {
    flex: 1,
    color: COLORS.text,
    fontSize: 9,
  },
  donutValue: {
    fontFamily: 'Courier',
    fontSize: 9,
    color: COLORS.textMuted,
  },

  // Line summary section
  lineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    fontSize: 9,
  },

  // Empty state
  emptyMessage: {
    fontSize: 9,
    color: COLORS.textDim,
    fontStyle: 'italic',
    paddingVertical: 8,
  },

  // Footer
  footer: {
    position: 'absolute',
    left: 36,
    right: 36,
    bottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: COLORS.textDim,
    fontFamily: 'Courier',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
})

// ============================================================
// Document component
// ============================================================

export interface DashboardPdfProps {
  datasetTitle: string
  datasetTagline: string
  datasetDomain: string
  layout: DashboardLayout
  filters: DashboardFilters
  filterSegmentLabel?: string
  totalRows: number
  filteredRowCount: number
  generatedAt: Date
}

export function DashboardPdf({
  datasetTitle,
  datasetTagline,
  datasetDomain,
  layout,
  filters,
  filterSegmentLabel,
  totalRows,
  filteredRowCount,
  generatedAt,
}: DashboardPdfProps) {
  const dateStr = generatedAt.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

  const filterDescriptions: string[] = []
  if (filters.search) filterDescriptions.push(`search: "${filters.search}"`)
  if (filters.segmentValue !== 'all' && filterSegmentLabel) {
    filterDescriptions.push(`${filterSegmentLabel}: ${filters.segmentValue}`)
  }
  if (filters.dateRange === 'recent-30') filterDescriptions.push('last 30 days of data')
  if (filters.dateRange === 'recent-90') filterDescriptions.push('last 90 days of data')

  const barChart = layout.charts.find((c) => c.data.type === 'bar')
  const donutChart = layout.charts.find((c) => c.data.type === 'donut')
  const lineChart = layout.charts.find((c) => c.data.type === 'line')

  return (
    <Document title={`${datasetTitle} Dashboard`} author="Rishikesh Gundla">
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Dashboard Export · {datasetDomain.toUpperCase()}</Text>
          <Text style={styles.title}>{datasetTitle}</Text>
          <Text style={styles.tagline}>{datasetTagline}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaItem}>
              Generated <Text style={styles.metaItemAccent}>{dateStr}</Text>
            </Text>
            <Text style={styles.metaItem}>
              Rows{' '}
              <Text style={styles.metaItemAccent}>
                {filteredRowCount}
              </Text>{' '}
              of {totalRows}
            </Text>
            {filterDescriptions.length > 0 && (
              <Text style={styles.metaItem}>
                Filters{' '}
                <Text style={styles.metaItemAccent}>
                  {filterDescriptions.join(' · ')}
                </Text>
              </Text>
            )}
          </View>
        </View>

        {/* KPI grid */}
        <Text style={styles.sectionTitle}>Key metrics</Text>
        <View style={styles.kpiGrid}>
          {layout.kpis.map((kpi, i) => (
            <View key={i} style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>{kpi.label}</Text>
              <Text style={styles.kpiValue}>{kpi.value}</Text>
            </View>
          ))}
          {layout.kpis.length === 0 && (
            <Text style={styles.emptyMessage}>No KPIs in current view.</Text>
          )}
        </View>

        {/* Bar chart as ranked list */}
        {barChart && barChart.data.type === 'bar' && (
          <>
            <Text style={styles.sectionTitle}>{barChart.title}</Text>
            {barChart.data.bars.length > 0 ? (
              barChart.data.bars.map((bar, i) => {
                const pct =
                  barChart.data.type === 'bar' && barChart.data.max > 0
                    ? (bar.value / barChart.data.max) * 100
                    : 0
                return (
                  <View key={i} style={styles.barRow}>
                    <Text style={styles.barLabel}>{bar.label}</Text>
                    <View style={styles.barTrack}>
                      <View style={[styles.barFill, { width: `${pct}%` }]} />
                    </View>
                    <Text style={styles.barValue}>{formatBarValue(bar.value)}</Text>
                  </View>
                )
              })
            ) : (
              <Text style={styles.emptyMessage}>No data in this view.</Text>
            )}
          </>
        )}

        {/* Donut summary */}
        {donutChart && donutChart.data.type === 'donut' && (
          <>
            <Text style={styles.sectionTitle}>{donutChart.title}</Text>
            {donutChart.data.slices.length > 0 ? (
              donutChart.data.slices.map((slice, i) => (
                <View key={i} style={styles.donutRow}>
                  <View
                    style={[
                      styles.donutSwatch,
                      {
                        backgroundColor:
                          DONUT_PALETTE[i % DONUT_PALETTE.length] ?? COLORS.accent,
                      },
                    ]}
                  />
                  <Text style={styles.donutLabel}>{slice.label}</Text>
                  <Text style={styles.donutValue}>
                    {slice.value} · {slice.pct.toFixed(0)}%
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyMessage}>No distribution data.</Text>
            )}
          </>
        )}

        {/* Line summary as compact period list */}
        {lineChart && lineChart.data.type === 'line' && lineChart.data.points.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>{lineChart.title}</Text>
            {lineChart.data.points.map((p, i) => (
              <View key={i} style={styles.lineRow}>
                <Text style={{ color: COLORS.text }}>{p.label}</Text>
                <Text style={{ fontFamily: 'Courier', color: COLORS.textMuted }}>
                  {formatBarValue(p.value)}
                </Text>
              </View>
            ))}
          </>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>Dashboard Factory · ai-portfolio · rishikeshgundla.com</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  )
}

// ============================================================
// Helpers
// ============================================================

function formatBarValue(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  if (value % 1 !== 0) return value.toFixed(1)
  return String(Math.round(value))
}
