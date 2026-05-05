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
          Dense flip the chart-row grid via CSS rules in globals.css that
          target [data-density="sparse"] / [data-density="dense"] descendants
          (Tailwind's arbitrary-variant approach didn't reliably emit CSS
          for the escaped colon class names, so a regular CSS rule keeps
          things deterministic). */}
      <div data-density={density}>
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

