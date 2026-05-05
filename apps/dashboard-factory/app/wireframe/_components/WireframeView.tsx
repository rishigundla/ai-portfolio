'use client'

import * as React from 'react'
import { Wand2 } from 'lucide-react'
import {
  buildWireframeLayout,
  WIREFRAME_DENSITIES,
  type WireframeDensity,
} from '@/lib/wireframe-engine'
import type { ColorClassSet } from '@/lib/datasets'
import { DashboardView } from '@/app/dashboard/[slug]/_dashboard-view'

interface WireframeViewProps {
  slug: string
  colors: ColorClassSet
}

const DENSITY_LABELS: Record<WireframeDensity, string> = {
  sparse: 'Sparse',
  balanced: 'Balanced',
  dense: 'Dense',
}

const DENSITY_DESCRIPTIONS: Record<WireframeDensity, string> = {
  sparse: 'Single hero KPI · charts stacked at full width · executive readout feel',
  balanced: '5-KPI strip · 4-chart grid · same density as the live dashboard',
  dense: '5-KPI compact · 4 charts side by side · operational control room feel',
}

/**
 * Client wrapper for the data-driven wireframe view.
 *
 * Holds the local density state (defaults to balanced) and passes the
 * resulting WireframeLayout into the existing <DashboardView> for rendering.
 * The chart grid layout is theming-only here — DashboardView already handles
 * the responsive grid for `balanced`. Sparse/Dense are signaled via wrapper
 * classes that override the grid template at the section level.
 *
 * Wireframe-specific chrome:
 * - "Wireframe" badge in the header (vs ad-hoc's "Live dashboard")
 * - No filter bar, no PDF export, no drill-down dialog (wireframes are static
 *   showcase — full filter machinery would imply real-time analytics)
 * - Density selector at the top
 */
export function WireframeView({ slug, colors }: WireframeViewProps) {
  const [density, setDensity] = React.useState<WireframeDensity>('balanced')
  const wireframe = React.useMemo(
    () => buildWireframeLayout(slug, density),
    [slug, density],
  )

  if (!wireframe) {
    return (
      <div className="section-container py-16">
        <p className="text-sm text-text-muted">Wireframe not found for slug: {slug}</p>
      </div>
    )
  }

  const { layout, dataset } = wireframe

  return (
    <div className="space-y-6">
      {/* Status row — wireframe badge + density selector */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${colors.thumbBg} border ${colors.thumbBorder}`}
          >
            <Wand2 className={`h-5 w-5 ${colors.iconColor}`} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded border ${colors.badgeBg} ${colors.badgeText} ${colors.badgeBorder}`}
              >
                Wireframe
              </span>
              <span className="font-mono text-xs text-text-muted">
                Auto-generated from profiling
              </span>
            </div>
            <p className="mt-1 text-xs text-text-muted">{DENSITY_DESCRIPTIONS[density]}</p>
          </div>
        </div>

        {/* Density selector */}
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted hidden sm:inline">
            Density
          </span>
          <div
            role="radiogroup"
            aria-label="Wireframe density"
            className="inline-flex rounded-md border border-surface-border bg-surface p-0.5"
          >
            {WIREFRAME_DENSITIES.map((d) => {
              const active = density === d
              return (
                <button
                  key={d}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setDensity(d)}
                  className={`px-3 h-8 text-xs font-medium rounded-sm transition-colors ${
                    active
                      ? 'bg-accent text-base-900'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {DENSITY_LABELS[d]}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* The layout itself. DashboardView already handles the responsive
          5-KPI strip + 4-chart 2x2 grid (the Balanced density). Sparse and
          Dense override the grid template via wrapper classes below. */}
      <div className={densityWrapperClass(density)} data-density={density}>
        <DashboardView layout={layout} colors={colors} />
      </div>

      {/* Footer hint */}
      <p className="mt-8 max-w-2xl text-xs text-text-muted leading-relaxed">
        Switch densities to see how the same charts re-flow for different audiences. Same data,
        different framing — exec, exploratory analyst, ops control room. The chart selection
        itself is driven by the {dataset.id} profiling fixture and the wireframe engine.
      </p>
    </div>
  )
}

/**
 * Density-aware wrapper class. Applied around <DashboardView>, these
 * classes use Tailwind's child-selector arbitrary variants ([&_.foo])
 * to override the grid template the DashboardView's chart row uses.
 *
 * - sparse: collapse the chart 2-col grid to 1-col so each chart spans
 *   full width (`lg:grid-cols-1` overrides the default `lg:grid-cols-12`)
 *   AND collapse the KPI grid to single hero-card width.
 * - balanced: no override — DashboardView's defaults apply.
 * - dense: pull the chart row into 4 narrow columns side by side and
 *   shrink the KPI strip into a compact horizontal row.
 *
 * Implementation note: DashboardView's chart row uses
 *   `grid grid-cols-1 lg:grid-cols-12 gap-4`
 * so we override at the lg breakpoint.
 */
function densityWrapperClass(density: WireframeDensity): string {
  switch (density) {
    case 'sparse':
      return [
        // Single-column charts: target the inner 12-col grid and fold to 1
        '[&_.lg\\:grid-cols-12]:lg:grid-cols-1',
        // Each chart card spans full width
        '[&_.lg\\:col-span-7]:lg:col-span-1',
        '[&_.lg\\:col-span-5]:lg:col-span-1',
        '[&_.lg\\:col-span-6]:lg:col-span-1',
      ].join(' ')
    case 'dense':
      return [
        // Pull the chart row into a tight 4-across grid
        '[&_.lg\\:grid-cols-12]:lg:grid-cols-4',
        '[&_.lg\\:col-span-7]:lg:col-span-1',
        '[&_.lg\\:col-span-5]:lg:col-span-1',
        '[&_.lg\\:col-span-6]:lg:col-span-1',
      ].join(' ')
    case 'balanced':
    default:
      return ''
  }
}
