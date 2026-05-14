/**
 * Server-side PPTX builder.
 *
 * Renders the 7-slide deck the on-screen preview (_slide-preview.tsx)
 * shows, this time as a real .pptx binary the user can download and
 * drop into Monday's exec review.
 *
 * Same input shape (DashboardFixture + Fixture), same section parser
 * (parseNarrativeSections + extractBullets), same value formatter
 * (formatKpiValue from format-kpi.ts) — so the on-screen preview and
 * the downloaded file stay in lockstep. When the slide structure
 * changes, this module + _slide-preview.tsx change together.
 *
 * Why pptxgenjs over python-pptx via a Python service, or a raw OOXML
 * library: pptxgenjs is JS-native, runs in Node, has a clean fluent
 * API, and ships ~500 KB which Vercel handles fine. python-pptx would
 * have meant a separate runtime; raw OOXML manipulation would have
 * been a weekend of XML wrangling.
 */

import PptxGenJS from 'pptxgenjs'
import type { Fixture } from '@rishi/ai-core'
import type { DashboardFixture } from './full-dashboards'
import { parseNarrativeSections, extractBullets } from './parse-narrative'
import { formatKpiValue, formatKpiDelta, HEX_BY_TOKEN } from './format-kpi'

// ============================================================
// Geometry — 16:9 widescreen, inches (pptxgenjs convention)
// ============================================================

// LAYOUT_WIDE = 13.333 × 7.5 in (= 16:9). Standard widescreen.
const SLIDE_W = 13.333
const SLIDE_H = 7.5
const MARGIN = 0.6
const CONTENT_W = SLIDE_W - MARGIN * 2

// Color palette derived from the design system. pptxgenjs wants hex
// strings without the '#' prefix in some properties (we'll strip
// before passing). These are dark-mode portfolio colors.
const COLORS = {
  bgDark: '0a0a0f',         // base-900
  surface: '16161e',        // surface
  border: '2a2a3a',         // surface-border
  textPrimary: 'ffffff',
  textSecondary: '94a3b8',  // text-muted (post-W4.D2 lift)
  textMuted: '9ca3af',
  textDim: '4b5563',
}

// Pull the leading '#' off a hex like '#2dd4bf' → '2dd4bf'.
const hex = (s: string) => s.replace(/^#/, '')

// ============================================================
// Public API
// ============================================================

/**
 * Build the deck for a dashboard + narrative pair and return a
 * `nodebuffer` ready to send as a Response body. Caller is responsible
 * for setting Content-Type + Content-Disposition headers.
 */
export async function buildPptxBuffer(
  dashboard: DashboardFixture,
  narrative: Fixture,
): Promise<Buffer> {
  const pres = new PptxGenJS()
  pres.layout = 'LAYOUT_WIDE'
  pres.title = `${dashboard.metadata.title} · Executive readout`
  pres.author = 'Narrative Generator · ai-portfolio'
  pres.company = 'rishigundla'

  const sections = parseNarrativeSections(narrative.text)
  const accent = hex(HEX_BY_TOKEN[dashboard.metadata.colorToken] ?? '#2dd4bf')
  const heroKpi = dashboard.kpis[0]

  addTitleSlide(pres, dashboard, accent)
  if (heroKpi) addHeadlineSlide(pres, dashboard, accent)
  addProseSlide(pres, 'What moved', sections.byHeading['What moved'] ?? '', accent)
  addProseSlide(pres, 'So what', sections.byHeading['So what'] ?? '', accent)
  addTalkingPointsSlide(pres, sections.byHeading['Talking points'] ?? '', accent)
  addProseSlide(pres, 'Risks + caveats', sections.byHeading['Risks + caveats'] ?? '', accent)
  addClosingSlide(pres, dashboard, accent)

  // outputType: 'nodebuffer' returns a Buffer suitable for streaming
  // through a Next.js Route Handler Response.
  const buffer = (await pres.write({ outputType: 'nodebuffer' })) as Buffer
  return buffer
}

// ============================================================
// Slide builders
// ============================================================

function addTitleSlide(
  pres: PptxGenJS,
  dashboard: DashboardFixture,
  accent: string,
) {
  const slide = pres.addSlide()
  slide.background = { color: COLORS.bgDark }

  // Accent bar at the top
  slide.addShape('rect', {
    x: MARGIN,
    y: MARGIN,
    w: 0.5,
    h: 0.1,
    fill: { color: accent },
    line: { type: 'none' },
  })

  // Domain badge
  slide.addText(dashboard.metadata.domain.toUpperCase(), {
    x: MARGIN,
    y: MARGIN + 0.2,
    w: CONTENT_W,
    h: 0.3,
    fontFace: 'Inter',
    fontSize: 10,
    color: accent,
    bold: true,
    charSpacing: 4,
  })

  // Title
  slide.addText(dashboard.metadata.title, {
    x: MARGIN,
    y: 2.0,
    w: CONTENT_W,
    h: 2.0,
    fontFace: 'Space Grotesk',
    fontSize: 54,
    color: COLORS.textPrimary,
    bold: true,
    valign: 'top',
  })

  // Tagline
  slide.addText(dashboard.metadata.tagline, {
    x: MARGIN,
    y: 4.2,
    w: CONTENT_W * 0.7,
    h: 1.2,
    fontFace: 'Space Grotesk',
    fontSize: 20,
    color: COLORS.textSecondary,
    valign: 'top',
  })

  // Period · Audience footer
  slide.addText(`${dashboard.metadata.period}  ·  ${dashboard.metadata.audience}`, {
    x: MARGIN,
    y: SLIDE_H - MARGIN - 0.4,
    w: CONTENT_W,
    h: 0.3,
    fontFace: 'JetBrains Mono',
    fontSize: 10,
    color: COLORS.textMuted,
  })
}

function addHeadlineSlide(
  pres: PptxGenJS,
  dashboard: DashboardFixture,
  accent: string,
) {
  const slide = pres.addSlide()
  slide.background = { color: COLORS.bgDark }
  const kpi = dashboard.kpis[0]
  if (!kpi) return

  // KPI label
  slide.addText(kpi.label.toUpperCase(), {
    x: MARGIN,
    y: MARGIN + 0.5,
    w: CONTENT_W,
    h: 0.4,
    fontFace: 'JetBrains Mono',
    fontSize: 11,
    color: COLORS.textMuted,
    charSpacing: 4,
  })

  // Big value
  slide.addText(formatKpiValue(kpi), {
    x: MARGIN,
    y: 2.4,
    w: CONTENT_W,
    h: 2.2,
    fontFace: 'Space Grotesk',
    fontSize: 96,
    color: accent,
    bold: true,
    valign: 'top',
  })

  // Delta line
  const deltaText = formatKpiDelta(kpi)
  if (deltaText) {
    slide.addText(deltaText, {
      x: MARGIN,
      y: 4.9,
      w: CONTENT_W,
      h: 0.5,
      fontFace: 'JetBrains Mono',
      fontSize: 14,
      color: COLORS.textPrimary,
    })
  }

  // Subtext
  if (kpi.subtext) {
    slide.addText(kpi.subtext, {
      x: MARGIN,
      y: 5.6,
      w: CONTENT_W * 0.8,
      h: 0.8,
      fontFace: 'Space Grotesk',
      fontSize: 16,
      color: COLORS.textSecondary,
      valign: 'top',
    })
  }

  // Footer
  slide.addText(`${dashboard.metadata.title}  ·  headline metric`, {
    x: MARGIN,
    y: SLIDE_H - MARGIN - 0.4,
    w: CONTENT_W,
    h: 0.3,
    fontFace: 'JetBrains Mono',
    fontSize: 10,
    color: COLORS.textMuted,
  })
}

function addProseSlide(
  pres: PptxGenJS,
  heading: string,
  body: string,
  accent: string,
) {
  const slide = pres.addSlide()
  slide.background = { color: COLORS.bgDark }

  // Section heading
  slide.addText(heading, {
    x: MARGIN,
    y: MARGIN + 0.2,
    w: CONTENT_W,
    h: 0.6,
    fontFace: 'Space Grotesk',
    fontSize: 32,
    color: COLORS.textPrimary,
    bold: true,
  })

  // Accent underline
  slide.addShape('rect', {
    x: MARGIN,
    y: MARGIN + 0.85,
    w: 0.6,
    h: 0.05,
    fill: { color: accent },
    line: { type: 'none' },
  })

  // Body — pptxgenjs doesn't render markdown, so flatten to text with
  // basic paragraph separation. Bold + italic markdown survives the
  // flatten as visible asterisks; acceptable for v1, can upgrade in
  // W7.D2 to a richer pipeline if needed.
  const cleanBody = flattenMarkdown(body)
  slide.addText(cleanBody, {
    x: MARGIN,
    y: MARGIN + 1.4,
    w: CONTENT_W,
    h: SLIDE_H - (MARGIN * 2) - 1.6,
    fontFace: 'Space Grotesk',
    fontSize: 18,
    color: COLORS.textSecondary,
    valign: 'top',
    paraSpaceAfter: 12,
  })
}

function addTalkingPointsSlide(
  pres: PptxGenJS,
  body: string,
  accent: string,
) {
  const slide = pres.addSlide()
  slide.background = { color: COLORS.bgDark }

  // Section heading
  slide.addText('Talking points', {
    x: MARGIN,
    y: MARGIN + 0.2,
    w: CONTENT_W,
    h: 0.6,
    fontFace: 'Space Grotesk',
    fontSize: 32,
    color: COLORS.textPrimary,
    bold: true,
  })

  slide.addShape('rect', {
    x: MARGIN,
    y: MARGIN + 0.85,
    w: 0.6,
    h: 0.05,
    fill: { color: accent },
    line: { type: 'none' },
  })

  // Bullets
  const bullets = extractBullets(body).slice(0, 6)
  const yStart = MARGIN + 1.5
  const lineHeight = 0.78
  bullets.forEach((bullet, i) => {
    const y = yStart + i * lineHeight
    // Numbered prefix
    slide.addText(String(i + 1).padStart(2, '0'), {
      x: MARGIN,
      y,
      w: 0.6,
      h: lineHeight,
      fontFace: 'JetBrains Mono',
      fontSize: 14,
      color: accent,
      bold: true,
      valign: 'top',
    })
    // Bullet body
    slide.addText(flattenMarkdown(bullet), {
      x: MARGIN + 0.7,
      y,
      w: CONTENT_W - 0.7,
      h: lineHeight,
      fontFace: 'Space Grotesk',
      fontSize: 14,
      color: COLORS.textSecondary,
      valign: 'top',
    })
  })

  slide.addText('For the QBR Q&A', {
    x: MARGIN,
    y: SLIDE_H - MARGIN - 0.4,
    w: CONTENT_W,
    h: 0.3,
    fontFace: 'JetBrains Mono',
    fontSize: 10,
    color: COLORS.textMuted,
  })
}

function addClosingSlide(
  pres: PptxGenJS,
  dashboard: DashboardFixture,
  accent: string,
) {
  const slide = pres.addSlide()
  slide.background = { color: COLORS.bgDark }

  // Heading
  slide.addText('Q3 in review', {
    x: MARGIN,
    y: MARGIN + 0.2,
    w: CONTENT_W,
    h: 0.6,
    fontFace: 'Space Grotesk',
    fontSize: 32,
    color: COLORS.textPrimary,
    bold: true,
  })

  slide.addShape('rect', {
    x: MARGIN,
    y: MARGIN + 0.85,
    w: 0.6,
    h: 0.05,
    fill: { color: accent },
    line: { type: 'none' },
  })

  // 5-KPI strip
  const kpis = dashboard.kpis.slice(0, 5)
  const stripY = 2.6
  const stripH = 2.2
  const cellW = CONTENT_W / kpis.length
  kpis.forEach((kpi, i) => {
    const x = MARGIN + cellW * i + 0.1
    const w = cellW - 0.2
    // Label
    slide.addText(kpi.label.toUpperCase(), {
      x,
      y: stripY,
      w,
      h: 0.4,
      fontFace: 'JetBrains Mono',
      fontSize: 8,
      color: COLORS.textMuted,
      charSpacing: 3,
    })
    // Value
    slide.addText(formatKpiValue(kpi), {
      x,
      y: stripY + 0.5,
      w,
      h: 1.1,
      fontFace: 'Space Grotesk',
      fontSize: 28,
      color: accent,
      bold: true,
      valign: 'top',
    })
    // Delta
    if (typeof kpi.deltaPct === 'number' && kpi.deltaDirection) {
      const arrow = kpi.deltaDirection === 'up' ? '↑' : '↓'
      slide.addText(`${arrow} ${kpi.deltaPct.toFixed(1)}%`, {
        x,
        y: stripY + 1.6,
        w,
        h: 0.4,
        fontFace: 'JetBrains Mono',
        fontSize: 10,
        color: COLORS.textMuted,
      })
    }
  })

  // Closing line
  slide.addText('Questions?  Detailed dashboard linked in the appendix.', {
    x: MARGIN,
    y: SLIDE_H - MARGIN - 0.8,
    w: CONTENT_W,
    h: 0.5,
    fontFace: 'Space Grotesk',
    fontSize: 14,
    color: COLORS.textSecondary,
  })
}

// ============================================================
// Helpers
// ============================================================

/**
 * Strip the most common markdown syntax (bold, em, inline code) so
 * pptxgenjs renders the prose cleanly. Doesn't try to be a full
 * markdown engine — bold/italic emphasis gets lost. Acceptable for v1
 * because the narrative content reads fine without the emphasis;
 * W7.D2 polish could upgrade to pptxgenjs's rich-text array API.
 */
function flattenMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1') // **bold** → bold
    .replace(/\*(.+?)\*/g, '$1')     // *italic* → italic
    .replace(/`([^`]+)`/g, '$1')     // `code` → code
    .replace(/\n{3,}/g, '\n\n')       // collapse extra blank lines
    .trim()
}
