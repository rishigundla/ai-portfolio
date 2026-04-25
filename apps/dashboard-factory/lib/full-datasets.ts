/**
 * Full dataset JSON loader.
 *
 * Statically imports all 6 dataset JSONs so webpack can tree-shake unused
 * datasets per route at build time. Each `/generate/[slug]` page loads only
 * its own dataset's JSON in its bundle.
 *
 * The gallery at /datasets uses lib/datasets.ts (manifest only, ~1 kB).
 * This module is heavier and should only be imported by routes that
 * actually need row-level data.
 */

import revopsSales from '../../../fixtures/dashboard-factory/datasets/revops-sales.json'
import marketingCampaigns from '../../../fixtures/dashboard-factory/datasets/marketing-campaigns.json'
import pulseTelemetry from '../../../fixtures/dashboard-factory/datasets/pulse-telemetry.json'
import supplyChain from '../../../fixtures/dashboard-factory/datasets/supply-chain.json'
import financialComplaints from '../../../fixtures/dashboard-factory/datasets/financial-complaints.json'
import customerDemographics from '../../../fixtures/dashboard-factory/datasets/customer-demographics.json'
import type { ColorToken } from './datasets'

// ============================================================
// Types
// ============================================================

export type ColumnType = 'id' | 'dimension' | 'measure' | 'time'

export interface ColumnSchema {
  name: string
  type: ColumnType
  label: string
  values?: string[]
  unit?: string
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max'
}

export interface FullDataset {
  id: string
  metadata: {
    title: string
    tagline: string
    domain: string
    colorToken: ColorToken
    icon: string
    thumbnail: string
    rowCount: number
    currency?: string
    schema: ColumnSchema[]
  }
  rows: Record<string, unknown>[]
}

// ============================================================
// Static map — webpack inlines each JSON at build time
// ============================================================

const FULL_DATASETS: Record<string, FullDataset> = {
  'revops-sales': revopsSales as FullDataset,
  'marketing-campaigns': marketingCampaigns as FullDataset,
  'pulse-telemetry': pulseTelemetry as FullDataset,
  'supply-chain': supplyChain as FullDataset,
  'financial-complaints': financialComplaints as FullDataset,
  'customer-demographics': customerDemographics as FullDataset,
}

export function getFullDataset(slug: string): FullDataset | undefined {
  return FULL_DATASETS[slug]
}

export function getAllSlugs(): string[] {
  return Object.keys(FULL_DATASETS)
}

// ============================================================
// Cell formatters — used by DataGrid render fns
// ============================================================

const numberFormat = new Intl.NumberFormat('en-US')
const currencyFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})
const compactCurrencyFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})
const percentFormat = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  maximumFractionDigits: 1,
})
const dateFormat = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

export function formatCell(value: unknown, column: ColumnSchema): string {
  if (value === null || value === undefined || value === '') return '—'

  if (column.type === 'time') {
    const date = new Date(String(value))
    if (Number.isNaN(date.getTime())) return String(value)
    return dateFormat.format(date)
  }

  if (column.type === 'measure' && typeof value === 'number') {
    if (column.unit === '$') {
      return value >= 100_000 ? compactCurrencyFormat.format(value) : currencyFormat.format(value)
    }
    if (column.unit === '%' || column.unit === '/100') {
      return `${percentFormat.format(value)}${column.unit === '%' ? '%' : ''}`
    }
    if (column.unit === 'ms' || column.unit === 'days') {
      return `${numberFormat.format(value)} ${column.unit}`
    }
    return numberFormat.format(value)
  }

  return String(value)
}
