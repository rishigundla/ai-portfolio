'use client'

import * as React from 'react'
import { Wand2, ExternalLink, Sparkles } from 'lucide-react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  Button,
} from '@rishi/design-system/primitives'
import { buildWireframeLayout } from '@/lib/wireframe-engine'
import { type ColorClassSet, HEX_BY_TOKEN, type ColorToken } from '@/lib/datasets'
import { DashboardView } from '@/app/dashboard/[slug]/_dashboard-view'

interface WireframeViewProps {
  slug: string
  colors: ColorClassSet
}

/**
 * Client wrapper for the data-driven wireframe view.
 *
 * Renders the engine's output through the existing <DashboardView>. The
 * wireframe engine has a single canonical density (5-KPI strip + 4-chart
 * 2x2 grid) — earlier Sparse/Dense modes were removed in favour of one
 * polished default. Same data drives every wireframe; the engine picks
 * the chart mix from the per-slug profiling recommendation.
 *
 * Wireframe-specific chrome:
 * - "Wireframe" badge in the header (vs ad-hoc's "Live dashboard")
 * - No filter bar, no PDF export, no drill-down dialog (wireframes are
 *   static showcase — full filter machinery would imply real-time analytics)
 * - Export-to-Figma button opens an in-page modal explaining the
 *   future-state Figma MCP integration + why it's not wired today
 */
export function WireframeView({ slug, colors }: WireframeViewProps) {
  const wireframe = React.useMemo(() => buildWireframeLayout(slug), [slug])

  if (!wireframe) {
    return (
      <div className="section-container py-16">
        <p className="text-sm text-text-muted">Wireframe not found for slug: {slug}</p>
      </div>
    )
  }

  const { layout, dataset } = wireframe
  const accentHex =
    HEX_BY_TOKEN[dataset.metadata.colorToken as ColorToken] ?? HEX_BY_TOKEN.accent

  return (
    <div className="space-y-6">
      {/* Status row — wireframe badge on the left, Export-to-Figma on the right */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Wireframe header icon. Solid badge classes (matching the
              "Wireframe" tag below it) instead of the gradient thumbBg so
              the icon and tag share the same dashboard accent fill. */}
          <div
            className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${colors.badgeBg} border ${colors.badgeBorder}`}
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
            <p className="mt-1 text-xs text-text-muted">
              5-KPI strip · 4-chart grid · same density as the live dashboard
            </p>
          </div>
        </div>

        <ExportToFigmaModal />
      </div>

      {/* The engine output rendered through DashboardView */}
      <DashboardView layout={layout} colors={colors} accentHex={accentHex} />

      {/* Footer hint */}
      <p className="mt-8 max-w-2xl text-xs text-text-muted leading-relaxed">
        Chart selection is driven by the{' '}
        <span className="font-mono text-text-secondary">{dataset.id}</span> profiling fixture
        and the wireframe engine. Same machinery powers the ad-hoc dashboard at{' '}
        <span className="font-mono text-text-secondary">/dashboard/[slug]</span>; only the
        recommendation source differs.
      </p>
    </div>
  )
}

/**
 * Export-to-Figma modal trigger + content.
 *
 * Reuses the design-system Dialog primitive whose overlay is already
 * styled with `bg-base-900/80 backdrop-blur-sm` — the blurred backdrop
 * is built-in. Modal body is intentionally short: what the button would
 * do, why it's not wired today (Figma MCP needs desktop client + ongoing
 * API spend), and an explicit acknowledgement that for a personal-portfolio
 * project the costs aren't justified.
 */
function ExportToFigmaModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Export to Figma — opens an explanation modal"
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-surface-border bg-surface text-text-primary hover:border-accent/40 hover:text-accent transition-colors text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Export to Figma</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
              Future-state preview
            </span>
          </div>
          <DialogTitle>Export to Figma, not wired in this build</DialogTitle>
          <DialogDescription className="leading-relaxed">
            In a production deploy, clicking this button would hand the wireframe layout
            to Claude via the Figma MCP server, which would create an editable Figma file
            styled with the portfolio design system. That replaces the typical multi-day
            manual rebuild after a dashboard mockup is approved.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>
            The integration needs Figma desktop running locally plus ongoing API spend
            per export. For a personal portfolio project running on free Vercel hosting
            and sample data, those costs aren&apos;t justified, so this surface is a
            wireframe of the export feature itself.
          </p>
          <p className="text-xs text-text-muted">
            The architecture is in place: the engine already produces a typed{' '}
            <span className="font-mono text-text-secondary">WireframeLayout</span> ready
            for an MCP handoff. Wiring the Figma side becomes a matter of stable MCP
            access, not new product work.
          </p>
        </div>
        <div className="mt-2 flex justify-end">
          <DialogClose asChild>
            <Button variant="primary" size="sm">
              Got it
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
