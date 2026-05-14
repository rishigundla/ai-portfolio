'use client'

import { Download, Sparkles } from 'lucide-react'
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

/**
 * Download-PPTX CTA + future-state modal.
 *
 * Mirrors the Project 1 Export-to-Figma modal pattern. The button looks
 * shippable; clicking opens a blurred-backdrop dialog explaining that
 * PPTX export is wired in W7.D1 (next week) and what it'll do.
 *
 * Why a modal stub vs disabling the button: the CTA is part of the
 * "story" the recruiter visits — they should SEE the export affordance
 * and the architectural readiness signal even before the binary lands.
 */
export function PptxExportModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Download PPTX — opens an explanation modal"
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-surface-border bg-surface text-text-primary hover:border-accent/40 hover:text-accent transition-colors text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Download className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Download PPTX</span>
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
          <DialogTitle>Download PPTX, wiring in W7.D1</DialogTitle>
          <DialogDescription className="leading-relaxed">
            In the next iteration, this button will generate a PPTX file from the slides
            above using <span className="font-mono text-text-secondary">pptxgenjs</span>{' '}
            server-side. Design-system tokens (colors, typography, accent fills) will be
            applied to slide masters so the export matches the live preview pixel for pixel.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>
            The slide structure is already final — title + headline metric + four narrative
            sections + closing recap. The W7.D1 work is plumbing the server-side render to
            the typed dashboard + narrative fixtures, which both already exist (see W6.D3,
            W6.D4 activity entries).
          </p>
          <p className="text-xs text-text-muted">
            Why the stub today? Same reason Project 1's Export-to-Figma modal exists: showing
            the CTA + the architectural readiness signal is part of the recruiter-facing
            story, and the binary export is a known-quantity follow-up.
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
