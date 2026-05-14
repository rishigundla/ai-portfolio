import { Download } from 'lucide-react'

/**
 * Download-PPTX CTA.
 *
 * Was a future-state Radix Dialog stub in W6.D5 (the W7.D1 modal pattern
 * from Project 1's Figma-export wireframe). After W7.D1 wired the real
 * server-side PPTX export at /api/deck/[slug], the stub became a plain
 * `<a href download>` link that triggers a file download.
 *
 * The component name stays `PptxExportModal` so the page import line
 * doesn't churn, even though it no longer renders a modal. Rename in a
 * later cleanup pass once we know the surrounding code is settled.
 */
interface Props {
  slug: string
}

export function PptxExportModal({ slug }: Props) {
  return (
    <a
      href={`/api/deck/${slug}`}
      download={`${slug}.pptx`}
      className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md bg-accent text-base-900 hover:bg-accent-light font-semibold text-xs shadow-glow-sm hover:shadow-glow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      aria-label="Download deck as PPTX"
    >
      <Download className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="hidden sm:inline">Download PPTX</span>
    </a>
  )
}
