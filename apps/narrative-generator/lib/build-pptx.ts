/**
 * Server side PPTX builder.
 *
 * Produces a 7 slide leadership readout from a dashboard fixture plus
 * narrative fixture. The output is intentionally rich. Big numbers,
 * a native chart visualization, themed color blocks, and proper bold
 * and italic emphasis carried through from the narrative markdown.
 *
 * Theme is consistent slide to slide. Every dashboard uses the same
 * layout grid. Only the accent color shifts per dashboard.
 *
 * Layout. 16:9 widescreen at 13.333 by 7.5 inches.
 */

import PptxGenJS from 'pptxgenjs'
import type { Fixture } from '@rishi/ai-core'
import type { DashboardFixture, KpiSpec, ChartSpec } from './full-dashboards'
import { parseNarrativeSections, extractBullets } from './parse-narrative'
import { formatKpiValue, formatKpiDelta, HEX_BY_TOKEN } from './format-kpi'

// ============================================================
// Geometry
// ============================================================

const SLIDE_W = 13.333
const SLIDE_H = 7.5
const MARGIN_X = 0.7
const MARGIN_Y = 0.55
const CONTENT_W = SLIDE_W - MARGIN_X * 2
const CONTENT_TOP = MARGIN_Y + 0.5
const FOOTER_Y = SLIDE_H - 0.55

// ============================================================
// Theme tokens
// ============================================================

const C = {
  bg: '0a0d16',
  surface: '141a26',
  surfaceElevated: '1c2333',
  divider: '2a3147',
  textPrimary: 'f8fafc',
  textSecondary: 'cbd5e1',
  textMuted: '94a3b8',
  textDim: '64748b',
}

const stripHash = (s: string) => s.replace(/^#/, '')

const FONT_DISPLAY = 'Space Grotesk'
const FONT_MONO = 'JetBrains Mono'

// ============================================================
// Public API
// ============================================================

export async function buildPptxBuffer(
  dashboard: DashboardFixture,
  narrative: Fixture,
): Promise<Buffer> {
  const pres = new PptxGenJS()
  pres.layout = 'LAYOUT_WIDE'
  pres.title = `${dashboard.metadata.title} leadership readout`
  pres.author = 'Narrative Generator on ai-portfolio'
  pres.company = 'rishigundla'

  const sections = parseNarrativeSections(narrative.text)
  const accent = stripHash(HEX_BY_TOKEN[dashboard.metadata.colorToken] ?? '#2dd4bf')
  const talkingPoints = extractBullets(sections.byHeading['Talking points'] ?? '')

  buildCoverSlide(pres, dashboard, accent, talkingPoints)
  buildHeadlineSlide(pres, dashboard, accent)
  buildSnapshotSlide(pres, dashboard, accent)
  buildMovementSlide(pres, dashboard, accent, sections.byHeading['What moved'] ?? '')
  buildAnalysisSlide(pres, dashboard, accent, sections.byHeading['So what'] ?? '', talkingPoints)
  buildTalkingPointsSlide(pres, dashboard, accent, sections.byHeading['Talking points'] ?? '')
  buildClosingSlide(pres, dashboard, accent, sections.byHeading['Risks + caveats'] ?? '')

  const buffer = (await pres.write({ outputType: 'nodebuffer' })) as Buffer
  return buffer
}

// ============================================================
// Insight utilities
//
// These derive leadership grade insights from the raw KPI deltas so
// the slide deck can highlight the same context an executive audience
// usually asks for verbally. They keep the build pipeline pure (no
// runtime API calls, no hidden dependencies) and surface the
// information from the fixtures the narrative already references.
// ============================================================

// Keywords whose KPIs are "good when going down" (cost or pain metrics).
// Everything not matching defaults to "good when going up".
const DOWN_IS_GOOD = [
  'attrition',
  'churn',
  'latency',
  'mttr',
  'burn',
  'cost',
  'cpl',
  'cpa',
  'payback',
  'defect',
  'error',
  'time to',
  'resolution',
  'risk',
  'incident',
]

function isPositiveMove(kpi: KpiSpec): boolean | null {
  if (typeof kpi.deltaPct !== 'number' || !kpi.deltaDirection) return null
  const label = kpi.label.toLowerCase()
  const downIsGood = DOWN_IS_GOOD.some((keyword) => label.includes(keyword))
  return downIsGood ? kpi.deltaDirection === 'down' : kpi.deltaDirection === 'up'
}

interface KpiHighlight {
  kpi: KpiSpec
  label: string
  value: string
  delta: string
  arrow: string
  pctMagnitude: number
}

function summarizeKpi(kpi: KpiSpec): KpiHighlight | null {
  if (typeof kpi.deltaPct !== 'number' || !kpi.deltaDirection) return null
  const arrow = kpi.deltaDirection === 'up' ? '↑' : '↓'
  return {
    kpi,
    label: kpi.label,
    value: formatKpiValue(kpi),
    delta: `${arrow} ${kpi.deltaPct.toFixed(1)}%`,
    arrow,
    pctMagnitude: Math.abs(kpi.deltaPct),
  }
}

function findTopWin(kpis: KpiSpec[]): KpiHighlight | null {
  const wins = kpis
    .filter((k) => isPositiveMove(k) === true)
    .map(summarizeKpi)
    .filter((s): s is KpiHighlight => s !== null)
    .sort((a, b) => b.pctMagnitude - a.pctMagnitude)
  return wins[0] ?? null
}

function findTopWatch(kpis: KpiSpec[]): KpiHighlight | null {
  const watches = kpis
    .filter((k) => isPositiveMove(k) === false)
    .map(summarizeKpi)
    .filter((s): s is KpiHighlight => s !== null)
    .sort((a, b) => b.pctMagnitude - a.pctMagnitude)
  return watches[0] ?? null
}

// Shorten a talking point bullet to the headline phrase (everything up
// to the first sentence break or the configured character limit). Keeps
// the bullet readable as a one liner on a sidebar.
function shortenBullet(bullet: string, maxChars = 110): string {
  const trimmed = bullet.replace(/\r/g, '').trim()
  if (trimmed.length <= maxChars) return trimmed
  const breakChars = ['. ', '? ', '! ', '\n']
  let cutAt = maxChars
  for (const ch of breakChars) {
    const idx = trimmed.indexOf(ch, 40)
    if (idx > 0 && idx < cutAt) cutAt = idx + 1
  }
  return trimmed.slice(0, cutAt).trim()
}

// Split a narrative section body into discrete sentence sized bullets so
// the slide content reads as a punchy list rather than a wall of prose.
// Tries paragraph breaks first, falls back to sentence splits, and skips
// scraps shorter than `minLen` so the output stays clean.
function splitIntoBullets(body: string, maxBullets = 6, minLen = 14): string[] {
  if (!body) return []
  const cleaned = body.replace(/\r/g, '').trim()
  const paragraphs = cleaned.split(/\n{2,}/)
  const bullets: string[] = []
  for (const paragraph of paragraphs) {
    const sentences = paragraph
      .trim()
      .split(/(?<=[.!?])\s+(?=[A-Z(])/)
    for (const sentence of sentences) {
      const text = sentence.trim().replace(/[.]+$/, '')
      if (text.length >= minLen) bullets.push(text)
      if (bullets.length >= maxBullets) return bullets
    }
  }
  return bullets
}

interface BulletBox {
  x: number
  y: number
  w: number
  h: number
}

function drawBulletList(
  slide: PptxGenJS.Slide,
  accent: string,
  bullets: string[],
  box: BulletBox,
  options: { fontSize?: number; markerSize?: number } = {},
) {
  if (bullets.length === 0) return
  const fontSize = options.fontSize ?? 14
  const markerSize = options.markerSize ?? 0.1
  const rowH = box.h / bullets.length
  const textX = box.x + 0.32
  const textW = box.w - 0.32
  bullets.forEach((bullet, i) => {
    const y = box.y + i * rowH
    slide.addShape('rect', {
      x: box.x,
      y: y + 0.22,
      w: markerSize,
      h: markerSize,
      fill: { color: accent },
      line: { type: 'none' },
    })
    slide.addText(toRichText(bullet, C.textPrimary), {
      x: textX,
      y,
      w: textW,
      h: rowH - 0.05,
      fontFace: FONT_DISPLAY,
      fontSize,
      color: C.textPrimary,
      valign: 'top',
      paraSpaceAfter: 4,
    })
  })
}

// ============================================================
// Slide builders
// ============================================================

function buildCoverSlide(
  pres: PptxGenJS,
  dashboard: DashboardFixture,
  accent: string,
  talkingPoints: string[],
) {
  const slide = pres.addSlide()
  slide.background = { color: C.bg }

  slide.addShape('rect', {
    x: 0,
    y: 0,
    w: SLIDE_W,
    h: 0.18,
    fill: { color: accent },
    line: { type: 'none' },
  })

  slide.addText(dashboard.metadata.domain.toUpperCase(), {
    x: MARGIN_X,
    y: MARGIN_Y + 0.4,
    w: CONTENT_W,
    h: 0.4,
    fontFace: FONT_MONO,
    fontSize: 11,
    color: accent,
    bold: true,
    charSpacing: 5,
  })

  slide.addText(dashboard.metadata.title, {
    x: MARGIN_X,
    y: 1.6,
    w: CONTENT_W,
    h: 1.6,
    fontFace: FONT_DISPLAY,
    fontSize: 52,
    color: C.textPrimary,
    bold: true,
    valign: 'top',
  })

  slide.addText(dashboard.metadata.tagline, {
    x: MARGIN_X,
    y: 3.4,
    w: CONTENT_W * 0.85,
    h: 1.1,
    fontFace: FONT_DISPLAY,
    fontSize: 18,
    color: C.textSecondary,
    valign: 'top',
    paraSpaceAfter: 6,
  })

  // Three takeaways for the room. Pulled from the first three talking
  // points so the cover doubles as a quick read for any leader who
  // does not scroll past the title slide.
  const takeaways = talkingPoints.slice(0, 3)
  if (takeaways.length > 0) {
    const cardY = 4.7
    const cardH = 1.5
    const gap = 0.2
    const cardCount = takeaways.length
    const cardW = (CONTENT_W - gap * (cardCount - 1)) / cardCount

    slide.addText('Three takeaways for the room', {
      x: MARGIN_X,
      y: cardY - 0.45,
      w: CONTENT_W,
      h: 0.3,
      fontFace: FONT_MONO,
      fontSize: 10,
      color: accent,
      bold: true,
      charSpacing: 3,
    })

    takeaways.forEach((bullet, i) => {
      const cardX = MARGIN_X + i * (cardW + gap)
      slide.addShape('roundRect', {
        x: cardX,
        y: cardY,
        w: cardW,
        h: cardH,
        fill: { color: C.surface },
        line: { color: C.divider, width: 1 },
        rectRadius: 0.08,
      })
      slide.addShape('rect', {
        x: cardX + 0.2,
        y: cardY + 0.2,
        w: 0.55,
        h: 0.45,
        fill: { color: accent },
        line: { type: 'none' },
      })
      slide.addText(`0${i + 1}`, {
        x: cardX + 0.2,
        y: cardY + 0.2,
        w: 0.55,
        h: 0.45,
        fontFace: FONT_MONO,
        fontSize: 14,
        color: C.bg,
        bold: true,
        align: 'center',
        valign: 'middle',
      })
      slide.addText(toRichText(shortenBullet(bullet, 140), C.textPrimary), {
        x: cardX + 0.2,
        y: cardY + 0.75,
        w: cardW - 0.4,
        h: cardH - 0.9,
        fontFace: FONT_DISPLAY,
        fontSize: 11,
        color: C.textPrimary,
        valign: 'top',
      })
    })
  }

  addFooter(slide, accent, dashboard, 1, 7)
}

function buildHeadlineSlide(
  pres: PptxGenJS,
  dashboard: DashboardFixture,
  accent: string,
) {
  const slide = pres.addSlide()
  slide.background = { color: C.bg }
  addHeader(slide, accent, 'Headline metric')

  const kpi = dashboard.kpis[0]
  if (!kpi) {
    addFooter(slide, accent, dashboard, 2, 7)
    return
  }

  slide.addText(kpi.label.toUpperCase(), {
    x: MARGIN_X,
    y: CONTENT_TOP + 0.4,
    w: CONTENT_W,
    h: 0.4,
    fontFace: FONT_MONO,
    fontSize: 12,
    color: C.textMuted,
    charSpacing: 5,
  })

  slide.addText(formatKpiValue(kpi), {
    x: MARGIN_X,
    y: CONTENT_TOP + 1.1,
    w: CONTENT_W * 0.65,
    h: 2.3,
    fontFace: FONT_DISPLAY,
    fontSize: 110,
    color: accent,
    bold: true,
    valign: 'top',
  })

  const deltaText = formatKpiDelta(kpi)
  if (deltaText) {
    slide.addText(deltaText, {
      x: MARGIN_X,
      y: CONTENT_TOP + 3.6,
      w: CONTENT_W * 0.6,
      h: 0.5,
      fontFace: FONT_MONO,
      fontSize: 18,
      color: C.textPrimary,
      bold: true,
    })
  }

  if (kpi.subtext) {
    slide.addText(kpi.subtext, {
      x: MARGIN_X,
      y: CONTENT_TOP + 4.2,
      w: CONTENT_W * 0.7,
      h: 0.9,
      fontFace: FONT_DISPLAY,
      fontSize: 16,
      color: C.textSecondary,
      valign: 'top',
    })
  }

  // Right column layout. The whole stack is anchored to a single
  // available band that runs from CONTENT_TOP+0.5 down to FOOTER_Y, so
  // every element below sits inside the slide regardless of whether the
  // KPI ships a sparkline.
  const rightX = MARGIN_X + CONTENT_W * 0.62
  const rightW = CONTENT_W * 0.36

  if (kpi.sparkline && kpi.sparkline.length > 1) {
    addSparklineChart(slide, kpi.sparkline, accent, {
      x: rightX,
      y: CONTENT_TOP + 0.5,
      w: rightW,
      h: 1.7,
    })
    slide.addText('Trailing trend', {
      x: rightX,
      y: CONTENT_TOP + 2.25,
      w: rightW,
      h: 0.25,
      fontFace: FONT_MONO,
      fontSize: 9,
      color: C.textMuted,
      align: 'center',
      charSpacing: 2,
    })
  }

  // Right column lower stack. Two callouts that frame the headline with
  // the audience's two next questions. What lifted us here, and what is
  // the offsetting concern. Both are positioned in absolute terms so they
  // never run below the footer line.
  const otherKpis = dashboard.kpis.filter((k) => k.id !== kpi.id)
  const topWin = findTopWin(otherKpis)
  const topWatch = findTopWatch(otherKpis)

  const topWinY = CONTENT_TOP + 2.7
  const topWatchY = CONTENT_TOP + 4.0
  const calloutH = 1.15

  if (topWin) {
    drawInsightCallout(slide, accent, {
      x: rightX,
      y: topWinY,
      w: rightW,
      h: calloutH,
      title: 'Top driver',
      label: topWin.label,
      value: topWin.value,
      delta: topWin.delta,
    })
  }
  if (topWatch) {
    drawInsightCallout(slide, accent, {
      x: rightX,
      y: topWatchY,
      w: rightW,
      h: calloutH,
      title: 'Watch',
      label: topWatch.label,
      value: topWatch.value,
      delta: topWatch.delta,
      muted: true,
    })
  }

  addFooter(slide, accent, dashboard, 2, 7)
}

interface CalloutSpec {
  x: number
  y: number
  w: number
  h: number
  title: string
  label: string
  value: string
  delta: string
  muted?: boolean
}

function drawInsightCallout(
  slide: PptxGenJS.Slide,
  accent: string,
  spec: CalloutSpec,
) {
  slide.addShape('roundRect', {
    x: spec.x,
    y: spec.y,
    w: spec.w,
    h: spec.h,
    fill: { color: C.surface },
    line: { color: spec.muted ? C.divider : accent, width: 1 },
    rectRadius: 0.06,
  })
  slide.addText(spec.title.toUpperCase(), {
    x: spec.x + 0.15,
    y: spec.y + 0.12,
    w: spec.w - 0.3,
    h: 0.25,
    fontFace: FONT_MONO,
    fontSize: 8,
    color: spec.muted ? C.textMuted : accent,
    bold: true,
    charSpacing: 3,
  })
  slide.addText(spec.label, {
    x: spec.x + 0.15,
    y: spec.y + 0.38,
    w: spec.w - 0.3,
    h: 0.3,
    fontFace: FONT_DISPLAY,
    fontSize: 11,
    color: C.textPrimary,
  })
  slide.addText(spec.value, {
    x: spec.x + 0.15,
    y: spec.y + 0.62,
    w: spec.w * 0.55,
    h: 0.3,
    fontFace: FONT_DISPLAY,
    fontSize: 14,
    color: accent,
    bold: true,
  })
  slide.addText(spec.delta, {
    x: spec.x + spec.w * 0.55,
    y: spec.y + 0.62,
    w: spec.w * 0.4,
    h: 0.3,
    fontFace: FONT_MONO,
    fontSize: 11,
    color: C.textSecondary,
    align: 'right',
  })
}

function buildSnapshotSlide(
  pres: PptxGenJS,
  dashboard: DashboardFixture,
  accent: string,
) {
  const slide = pres.addSlide()
  slide.background = { color: C.bg }
  addHeader(slide, accent, 'Performance snapshot')

  slide.addText('All five KPIs in one frame', {
    x: MARGIN_X,
    y: CONTENT_TOP + 0.3,
    w: CONTENT_W,
    h: 0.5,
    fontFace: FONT_DISPLAY,
    fontSize: 20,
    color: C.textSecondary,
  })

  const kpis = dashboard.kpis.slice(0, 5)
  const cardCount = kpis.length || 1
  const totalGap = 0.18 * (cardCount - 1)
  const cardW = (CONTENT_W - totalGap) / cardCount
  const cardH = 2.3
  const cardY = CONTENT_TOP + 1.2

  kpis.forEach((kpi, i) => {
    const cardX = MARGIN_X + i * (cardW + 0.18)
    drawKpiCard(slide, kpi, accent, cardX, cardY, cardW, cardH)
  })

  // Insight chip row. Two chips that pre answer the questions every
  // executive will ask after scanning the snapshot. Which KPI moved
  // the most in the right direction, and which one is bending the
  // wrong way.
  const insightY = cardY + cardH + 0.45
  const chipW = (CONTENT_W - 0.3) / 2
  const topWin = findTopWin(kpis)
  const topWatch = findTopWatch(kpis)

  if (topWin) {
    drawInsightCallout(slide, accent, {
      x: MARGIN_X,
      y: insightY,
      w: chipW,
      h: 0.9,
      title: 'Biggest gain',
      label: topWin.label,
      value: topWin.value,
      delta: topWin.delta,
    })
  }
  if (topWatch) {
    drawInsightCallout(slide, accent, {
      x: MARGIN_X + chipW + 0.3,
      y: insightY,
      w: chipW,
      h: 0.9,
      title: 'Watch',
      label: topWatch.label,
      value: topWatch.value,
      delta: topWatch.delta,
      muted: true,
    })
  }

  slide.addText(
    `${dashboard.metadata.period}  ·  ${dashboard.metadata.audience}`,
    {
      x: MARGIN_X,
      y: insightY + 1.05,
      w: CONTENT_W,
      h: 0.4,
      fontFace: FONT_MONO,
      fontSize: 10,
      color: C.textMuted,
      charSpacing: 2,
    },
  )

  addFooter(slide, accent, dashboard, 3, 7)
}

function buildMovementSlide(
  pres: PptxGenJS,
  dashboard: DashboardFixture,
  accent: string,
  body: string,
) {
  const slide = pres.addSlide()
  slide.background = { color: C.bg }
  addHeader(slide, accent, 'What moved')

  const bullets = splitIntoBullets(body, 6)
  drawBulletList(
    slide,
    accent,
    bullets,
    {
      x: MARGIN_X,
      y: CONTENT_TOP + 0.4,
      w: CONTENT_W * 0.48,
      h: 5.4,
    },
    { fontSize: 14 },
  )

  const chart = pickRepresentativeChart(dashboard.charts)
  if (chart) {
    const chartX = MARGIN_X + CONTENT_W * 0.52
    const chartY = CONTENT_TOP + 0.4
    const chartW = CONTENT_W * 0.48
    const chartH = 4.6

    slide.addText(chart.title, {
      x: chartX,
      y: chartY,
      w: chartW,
      h: 0.4,
      fontFace: FONT_DISPLAY,
      fontSize: 14,
      color: C.textPrimary,
      bold: true,
    })
    if (chart.subtitle) {
      slide.addText(chart.subtitle, {
        x: chartX,
        y: chartY + 0.4,
        w: chartW,
        h: 0.4,
        fontFace: FONT_MONO,
        fontSize: 10,
        color: C.textMuted,
      })
    }
    addFixtureChart(slide, chart, accent, {
      x: chartX,
      y: chartY + 0.85,
      w: chartW,
      h: chartH - 0.85,
    })
  }

  addFooter(slide, accent, dashboard, 4, 7)
}

function buildAnalysisSlide(
  pres: PptxGenJS,
  dashboard: DashboardFixture,
  accent: string,
  body: string,
  talkingPoints: string[],
) {
  const slide = pres.addSlide()
  slide.background = { color: C.bg }
  addHeader(slide, accent, 'So what')

  slide.addText('Why these numbers matter for the next quarter', {
    x: MARGIN_X,
    y: CONTENT_TOP + 0.3,
    w: CONTENT_W * 0.6,
    h: 0.6,
    fontFace: FONT_DISPLAY,
    fontSize: 20,
    color: C.textPrimary,
    bold: true,
  })

  const analysisBullets = splitIntoBullets(body, 5)
  drawBulletList(
    slide,
    accent,
    analysisBullets,
    {
      x: MARGIN_X,
      y: CONTENT_TOP + 1.1,
      w: CONTENT_W * 0.58,
      h: 4.7,
    },
    { fontSize: 14 },
  )

  // Recommended actions sidebar. Pulled from the first three talking
  // points. Each bullet starts action oriented in the narrative so they
  // double as decisions the room can take into the room.
  const sidebarX = MARGIN_X + CONTENT_W * 0.62
  const sidebarW = CONTENT_W * 0.38
  slide.addShape('roundRect', {
    x: sidebarX,
    y: CONTENT_TOP + 0.3,
    w: sidebarW,
    h: 5.5,
    fill: { color: C.surface },
    line: { color: C.divider, width: 1 },
    rectRadius: 0.1,
  })
  slide.addShape('rect', {
    x: sidebarX,
    y: CONTENT_TOP + 0.3,
    w: sidebarW,
    h: 0.08,
    fill: { color: accent },
    line: { type: 'none' },
  })
  slide.addText('RECOMMENDED ACTIONS', {
    x: sidebarX + 0.25,
    y: CONTENT_TOP + 0.55,
    w: sidebarW - 0.5,
    h: 0.35,
    fontFace: FONT_MONO,
    fontSize: 10,
    color: accent,
    bold: true,
    charSpacing: 4,
  })
  slide.addText('Three asks for the room', {
    x: sidebarX + 0.25,
    y: CONTENT_TOP + 0.92,
    w: sidebarW - 0.5,
    h: 0.35,
    fontFace: FONT_DISPLAY,
    fontSize: 13,
    color: C.textPrimary,
    bold: true,
  })

  const actions = talkingPoints.slice(0, 3)
  const actionY = CONTENT_TOP + 1.55
  const actionH = 1.2
  actions.forEach((action, i) => {
    const y = actionY + i * actionH

    slide.addShape('ellipse', {
      x: sidebarX + 0.25,
      y: y + 0.05,
      w: 0.4,
      h: 0.4,
      fill: { color: accent },
      line: { type: 'none' },
    })
    slide.addText(String(i + 1), {
      x: sidebarX + 0.25,
      y: y + 0.05,
      w: 0.4,
      h: 0.4,
      fontFace: FONT_MONO,
      fontSize: 12,
      color: C.bg,
      bold: true,
      align: 'center',
      valign: 'middle',
    })

    slide.addText(toRichText(shortenBullet(action, 160), C.textPrimary), {
      x: sidebarX + 0.75,
      y,
      w: sidebarW - 1.0,
      h: actionH - 0.1,
      fontFace: FONT_DISPLAY,
      fontSize: 10,
      color: C.textPrimary,
      valign: 'top',
    })
  })

  addFooter(slide, accent, dashboard, 5, 7)
}

function buildTalkingPointsSlide(
  pres: PptxGenJS,
  dashboard: DashboardFixture,
  accent: string,
  body: string,
) {
  const slide = pres.addSlide()
  slide.background = { color: C.bg }
  addHeader(slide, accent, 'Talking points')

  slide.addText('Ready for the next leadership Q and A', {
    x: MARGIN_X,
    y: CONTENT_TOP + 0.3,
    w: CONTENT_W,
    h: 0.5,
    fontFace: FONT_DISPLAY,
    fontSize: 18,
    color: C.textSecondary,
  })

  const bullets = extractBullets(body).slice(0, 5)
  const startY = CONTENT_TOP + 1.1
  const rowH = 0.95
  bullets.forEach((bullet, i) => {
    const y = startY + i * rowH

    slide.addShape('ellipse', {
      x: MARGIN_X,
      y: y + 0.05,
      w: 0.5,
      h: 0.5,
      fill: { color: accent },
      line: { type: 'none' },
    })
    slide.addText(String(i + 1).padStart(2, '0'), {
      x: MARGIN_X,
      y: y + 0.05,
      w: 0.5,
      h: 0.5,
      fontFace: FONT_MONO,
      fontSize: 13,
      color: C.bg,
      bold: true,
      align: 'center',
      valign: 'middle',
    })

    slide.addText(toRichText(bullet, C.textPrimary), {
      x: MARGIN_X + 0.7,
      y,
      w: CONTENT_W - 0.7,
      h: rowH - 0.1,
      fontFace: FONT_DISPLAY,
      fontSize: 15,
      color: C.textPrimary,
      valign: 'top',
    })
  })

  addFooter(slide, accent, dashboard, 6, 7)
}

function buildClosingSlide(
  pres: PptxGenJS,
  dashboard: DashboardFixture,
  accent: string,
  risksBody: string,
) {
  const slide = pres.addSlide()
  slide.background = { color: C.bg }
  addHeader(slide, accent, 'Risks and closing recap')

  slide.addText('Risks and caveats', {
    x: MARGIN_X,
    y: CONTENT_TOP + 0.3,
    w: CONTENT_W * 0.55,
    h: 0.5,
    fontFace: FONT_DISPLAY,
    fontSize: 18,
    color: C.textPrimary,
    bold: true,
  })

  const riskBullets = splitIntoBullets(risksBody, 5)
  drawBulletList(
    slide,
    accent,
    riskBullets,
    {
      x: MARGIN_X,
      y: CONTENT_TOP + 0.95,
      w: CONTENT_W * 0.55,
      h: 4.5,
    },
    { fontSize: 13 },
  )

  const stripX = MARGIN_X + CONTENT_W * 0.6
  const stripW = CONTENT_W * 0.4
  slide.addText('KPI recap', {
    x: stripX,
    y: CONTENT_TOP + 0.3,
    w: stripW,
    h: 0.5,
    fontFace: FONT_DISPLAY,
    fontSize: 18,
    color: C.textPrimary,
    bold: true,
  })

  const recapKpis = dashboard.kpis.slice(0, 5)
  const rowH = 0.55
  recapKpis.forEach((kpi, i) => {
    const y = CONTENT_TOP + 0.9 + i * rowH
    slide.addText(kpi.label, {
      x: stripX,
      y,
      w: stripW * 0.55,
      h: rowH - 0.05,
      fontFace: FONT_DISPLAY,
      fontSize: 11,
      color: C.textMuted,
      valign: 'middle',
    })
    slide.addText(formatKpiValue(kpi), {
      x: stripX + stripW * 0.5,
      y,
      w: stripW * 0.5,
      h: rowH - 0.05,
      fontFace: FONT_DISPLAY,
      fontSize: 13,
      color: accent,
      bold: true,
      align: 'right',
      valign: 'middle',
    })
  })

  // Watching next quarter block. Surfaces the watch items derived from
  // KPI deltas so the room leaves with a clear monitoring list rather
  // than just a closing prose paragraph.
  const watchY = CONTENT_TOP + 0.9 + recapKpis.length * rowH + 0.25
  const watchBlockH = SLIDE_H - 1.15 - watchY
  slide.addShape('roundRect', {
    x: stripX,
    y: watchY,
    w: stripW,
    h: watchBlockH,
    fill: { color: C.surface },
    line: { color: C.divider, width: 1 },
    rectRadius: 0.08,
  })
  slide.addText('WATCHING NEXT QUARTER', {
    x: stripX + 0.2,
    y: watchY + 0.1,
    w: stripW - 0.4,
    h: 0.3,
    fontFace: FONT_MONO,
    fontSize: 9,
    color: accent,
    bold: true,
    charSpacing: 3,
  })

  const watchItems: KpiHighlight[] = []
  const primaryWatch = findTopWatch(dashboard.kpis)
  if (primaryWatch) watchItems.push(primaryWatch)
  const otherWatches = dashboard.kpis
    .filter((k) => isPositiveMove(k) === false && k.id !== primaryWatch?.kpi.id)
    .map(summarizeKpi)
    .filter((s): s is KpiHighlight => s !== null)
    .sort((a, b) => b.pctMagnitude - a.pctMagnitude)
  watchItems.push(...otherWatches.slice(0, 1))
  if (watchItems.length === 0) {
    const win = findTopWin(dashboard.kpis)
    if (win) watchItems.push(win)
  }

  const watchRowH = 0.42
  watchItems.slice(0, 2).forEach((item, i) => {
    const y = watchY + 0.45 + i * watchRowH
    slide.addText(item.label, {
      x: stripX + 0.2,
      y,
      w: stripW * 0.55,
      h: watchRowH - 0.05,
      fontFace: FONT_DISPLAY,
      fontSize: 11,
      color: C.textSecondary,
      valign: 'middle',
    })
    slide.addText(item.delta, {
      x: stripX + stripW * 0.5,
      y,
      w: stripW * 0.45 - 0.2,
      h: watchRowH - 0.05,
      fontFace: FONT_MONO,
      fontSize: 11,
      color: accent,
      bold: true,
      align: 'right',
      valign: 'middle',
    })
  })

  slide.addText('Questions? The full dashboard is linked in the appendix.', {
    x: MARGIN_X,
    y: SLIDE_H - 1.05,
    w: CONTENT_W,
    h: 0.4,
    fontFace: FONT_DISPLAY,
    fontSize: 13,
    color: C.textSecondary,
    italic: true,
  })

  addFooter(slide, accent, dashboard, 7, 7)
}

// ============================================================
// Slide chrome helpers
// ============================================================

function addHeader(
  slide: PptxGenJS.Slide,
  accent: string,
  sectionLabel: string,
) {
  slide.addShape('rect', {
    x: 0,
    y: 0,
    w: 0.18,
    h: SLIDE_H,
    fill: { color: accent },
    line: { type: 'none' },
  })
  slide.addText(sectionLabel.toUpperCase(), {
    x: MARGIN_X,
    y: MARGIN_Y,
    w: CONTENT_W,
    h: 0.4,
    fontFace: FONT_MONO,
    fontSize: 10,
    color: accent,
    bold: true,
    charSpacing: 5,
  })
}

function addFooter(
  slide: PptxGenJS.Slide,
  accent: string,
  dashboard: DashboardFixture,
  slideNum: number,
  totalSlides: number,
) {
  slide.addShape('rect', {
    x: MARGIN_X,
    y: FOOTER_Y,
    w: CONTENT_W,
    h: 0.02,
    fill: { color: C.divider },
    line: { type: 'none' },
  })
  slide.addText(dashboard.metadata.title, {
    x: MARGIN_X,
    y: FOOTER_Y + 0.12,
    w: CONTENT_W * 0.6,
    h: 0.35,
    fontFace: FONT_MONO,
    fontSize: 9,
    color: C.textMuted,
    charSpacing: 2,
  })
  slide.addText(`${slideNum} / ${totalSlides}`, {
    x: MARGIN_X + CONTENT_W - 0.8,
    y: FOOTER_Y + 0.12,
    w: 0.8,
    h: 0.35,
    fontFace: FONT_MONO,
    fontSize: 9,
    color: accent,
    bold: true,
    align: 'right',
  })
}

// ============================================================
// Visual helpers
// ============================================================

interface Box {
  x: number
  y: number
  w: number
  h: number
}

function drawKpiCard(
  slide: PptxGenJS.Slide,
  kpi: KpiSpec,
  accent: string,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  slide.addShape('roundRect', {
    x,
    y,
    w,
    h,
    fill: { color: C.surface },
    line: { color: C.divider, width: 1 },
    rectRadius: 0.08,
  })

  slide.addShape('rect', {
    x: x + 0.18,
    y: y + 0.25,
    w: 0.08,
    h: 0.35,
    fill: { color: accent },
    line: { type: 'none' },
  })

  slide.addText(kpi.label, {
    x: x + 0.36,
    y: y + 0.2,
    w: w - 0.5,
    h: 0.45,
    fontFace: FONT_MONO,
    fontSize: 10,
    color: C.textMuted,
    valign: 'middle',
  })

  slide.addText(formatKpiValue(kpi), {
    x: x + 0.2,
    y: y + 0.75,
    w: w - 0.4,
    h: 0.9,
    fontFace: FONT_DISPLAY,
    fontSize: 28,
    color: accent,
    bold: true,
    valign: 'top',
  })

  const deltaText = formatKpiDelta(kpi)
  if (deltaText) {
    slide.addText(deltaText, {
      x: x + 0.2,
      y: y + h - 0.55,
      w: w - 0.4,
      h: 0.35,
      fontFace: FONT_MONO,
      fontSize: 10,
      color: C.textSecondary,
      valign: 'middle',
    })
  } else if (kpi.subtext) {
    slide.addText(kpi.subtext, {
      x: x + 0.2,
      y: y + h - 0.7,
      w: w - 0.4,
      h: 0.5,
      fontFace: FONT_DISPLAY,
      fontSize: 10,
      color: C.textSecondary,
      valign: 'top',
    })
  }
}

function addSparklineChart(
  slide: PptxGenJS.Slide,
  values: number[],
  accent: string,
  box: Box,
) {
  const data = [
    {
      name: 'Trend',
      labels: values.map((_, i) => `W${i + 1}`),
      values,
    },
  ]
  slide.addChart('line', data, {
    x: box.x,
    y: box.y,
    w: box.w,
    h: box.h,
    chartColors: [accent],
    chartColorsOpacity: 80,
    lineSize: 3,
    lineDataSymbol: 'none',
    catAxisHidden: true,
    valAxisHidden: true,
    showLegend: false,
    showTitle: false,
    plotArea: { fill: { color: C.bg } },
    fill: C.bg,
    border: { type: 'none', pt: 0, color: C.bg },
  })
}

function addFixtureChart(
  slide: PptxGenJS.Slide,
  chart: ChartSpec,
  accent: string,
  box: Box,
) {
  if (chart.type === 'donut') {
    slide.addChart(
      'doughnut',
      [
        {
          name: chart.title,
          labels: chart.data.map((d) => d.label),
          values: chart.data.map((d) => d.value),
        },
      ],
      {
        x: box.x,
        y: box.y,
        w: box.w,
        h: box.h,
        chartColors: chart.data.map((_, i) =>
          shadeAccent(accent, 0.5 + i * 0.09),
        ),
        showLegend: true,
        legendPos: 'r',
        legendFontFace: FONT_MONO,
        legendFontSize: 9,
        legendColor: C.textSecondary,
        dataLabelColor: C.textPrimary,
        dataLabelFontFace: FONT_MONO,
        dataLabelFontSize: 9,
        showPercent: true,
        holeSize: 55,
        plotArea: { fill: { color: C.bg } },
        fill: C.bg,
        border: { type: 'none', pt: 0, color: C.bg },
      },
    )
    return
  }

  const chartType: 'bar' | 'line' = chart.type === 'bar' ? 'bar' : 'line'
  const data = [
    {
      name: chart.title,
      labels: chart.data.map((d) => d.label),
      values: chart.data.map((d) => d.value),
    },
  ]
  slide.addChart(chartType, data, {
    x: box.x,
    y: box.y,
    w: box.w,
    h: box.h,
    barDir: 'bar',
    chartColors: [accent],
    chartColorsOpacity: 85,
    lineSize: 3,
    lineDataSymbol: 'circle',
    lineDataSymbolSize: 6,
    showLegend: false,
    showTitle: false,
    catAxisLabelFontFace: FONT_MONO,
    catAxisLabelFontSize: 9,
    catAxisLabelColor: C.textMuted,
    valAxisLabelFontFace: FONT_MONO,
    valAxisLabelFontSize: 9,
    valAxisLabelColor: C.textMuted,
    catAxisLineColor: C.divider,
    valAxisLineColor: C.divider,
    valGridLine: { style: 'dot', size: 0.5, color: C.divider },
    plotArea: { fill: { color: C.bg } },
    fill: C.bg,
    border: { type: 'none', pt: 0, color: C.bg },
  })
}

function pickRepresentativeChart(charts: ChartSpec[]): ChartSpec | undefined {
  return charts.find((c) => c.type === 'line') ?? charts.find((c) => c.type === 'bar') ?? charts[0]
}

/**
 * Shift the lightness of an accent hex toward white or black so a single
 * accent color yields visually distinct shades for a multi segment
 * donut chart. `mix` is in the range zero to one where zero returns
 * black, half returns the accent unchanged, and one returns white.
 * Inputs outside the range are clamped.
 */
function shadeAccent(hex: string, mix: number): string {
  const clamped = Math.max(0, Math.min(1, mix))
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)

  let nr: number
  let ng: number
  let nb: number
  if (clamped >= 0.5) {
    const factor = (clamped - 0.5) * 2
    nr = Math.round(r + (255 - r) * factor)
    ng = Math.round(g + (255 - g) * factor)
    nb = Math.round(b + (255 - b) * factor)
  } else {
    const factor = 1 - clamped * 2
    nr = Math.round(r * (1 - factor))
    ng = Math.round(g * (1 - factor))
    nb = Math.round(b * (1 - factor))
  }
  return (
    nr.toString(16).padStart(2, '0') +
    ng.toString(16).padStart(2, '0') +
    nb.toString(16).padStart(2, '0')
  )
}

// ============================================================
// Prose helpers
// ============================================================

// Retained for compatibility with any future caller that wants a hard
// length budget on a prose body. Not currently invoked since every
// prose slide moved to drawBulletList. Safe to remove if no slide
// reintroduces a prose only layout.
function condenseProse(body: string, maxChars: number): string {
  const cleaned = body.replace(/\r/g, '').trim()
  if (cleaned.length <= maxChars) return cleaned
  const truncated = cleaned.slice(0, maxChars)
  const lastBreak = Math.max(
    truncated.lastIndexOf('. '),
    truncated.lastIndexOf('\n\n'),
  )
  return (lastBreak > maxChars * 0.5
    ? truncated.slice(0, lastBreak + 1)
    : truncated) + (cleaned.length > maxChars ? ' ...' : '')
}

interface RichTextRun {
  text: string
  options?: PptxGenJS.TextPropsOptions
}

/**
 * Parse a small subset of markdown (bold, italic, line breaks) into the
 * rich text array shape that pptxgenjs accepts. Code spans collapse to
 * plain text. Bullet markers are stripped because callers pass already
 * extracted bullet bodies.
 */
function toRichText(body: string, baseColor: string): RichTextRun[] {
  const paragraphs = body
    .replace(/\r/g, '')
    .split(/\n{2,}/)
    .map((p) => p.replace(/^\s*[-*]\s+/, '').trim())
    .filter(Boolean)

  const runs: RichTextRun[] = []
  paragraphs.forEach((paragraph, paragraphIndex) => {
    parseInline(paragraph, baseColor).forEach((run) => runs.push(run))
    if (paragraphIndex < paragraphs.length - 1) {
      runs.push({ text: '', options: { breakLine: true } })
      runs.push({ text: '', options: { breakLine: true } })
    }
  })
  if (runs.length === 0) {
    return [{ text: body, options: { color: baseColor } }]
  }
  return runs
}

function parseInline(text: string, baseColor: string): RichTextRun[] {
  const runs: RichTextRun[] = []
  const pattern = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/g
  let lastIndex = 0

  for (const match of text.matchAll(pattern)) {
    const start = match.index ?? 0
    if (start > lastIndex) {
      runs.push({
        text: text.slice(lastIndex, start),
        options: { color: baseColor },
      })
    }
    if (match[2] !== undefined) {
      runs.push({
        text: match[2],
        options: { color: baseColor, bold: true },
      })
    } else if (match[3] !== undefined) {
      runs.push({
        text: match[3],
        options: { color: baseColor, italic: true },
      })
    } else if (match[4] !== undefined) {
      runs.push({
        text: match[4],
        options: { color: baseColor, fontFace: FONT_MONO },
      })
    }
    lastIndex = start + match[0].length
  }

  if (lastIndex < text.length) {
    runs.push({
      text: text.slice(lastIndex),
      options: { color: baseColor },
    })
  }
  return runs
}
