import { NextResponse } from 'next/server'
import { getFullDashboard } from '@/lib/full-dashboards'
import { getNarrativeFixture } from '@/lib/narratives'
import { buildPptxBuffer } from '@/lib/build-pptx'

/**
 * PPTX download endpoint.
 *
 * GET /api/deck/<slug> returns a .pptx binary built from the same
 * dashboard + narrative fixtures the /deck/<slug> on-screen preview
 * consumes. Same 7-slide structure, same formatting helpers, themed
 * to the dashboard's colorToken.
 *
 * The Download-PPTX CTA on /deck/[slug] points its href here with
 * `download` attribute, so the browser triggers a file save rather
 * than navigating to the response.
 */

// pptxgenjs uses Node-only APIs (Buffer + zip generation). Force the
// Node runtime — the Edge runtime would reject the import.
export const runtime = 'nodejs'

// Static export — the slug list is fixed (the 6 dashboard fixtures).
// Next.js will prerender the response bodies at build time, so the
// download is served from cache rather than recomputed per request.
export const dynamic = 'force-static'

export async function generateStaticParams() {
  // Mirror the dashboard slugs declared in fixtures/.../index.json.
  // Hard-coded here rather than imported because at module-load time
  // this is the simplest way to inform Next.js the route is fully
  // enumerable without pulling the dashboards loader into the API
  // bundle.
  return [
    { slug: 'revops-q3-readout' },
    { slug: 'marketing-q3-performance' },
    { slug: 'ops-uptime-quality' },
    { slug: 'finance-quarter-close' },
    { slug: 'hr-engagement-attrition' },
    { slug: 'cx-csat-nps' },
  ]
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params

  const dashboard = getFullDashboard(slug)
  const narrative = getNarrativeFixture(slug)

  if (!dashboard || !narrative) {
    return NextResponse.json({ error: 'deck not found' }, { status: 404 })
  }

  const buffer = await buildPptxBuffer(dashboard, narrative)

  return new Response(buffer as BodyInit, {
    headers: {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'Content-Disposition': `attachment; filename="${slug}.pptx"`,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
