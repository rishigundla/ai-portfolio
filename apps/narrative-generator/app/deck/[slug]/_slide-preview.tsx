import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { TrendingUp, TrendingDown, MessageCircle } from 'lucide-react'
import type { Fixture } from '@rishi/ai-core'
import type { DashboardFixture, KpiSpec } from '@/lib/full-dashboards'
import { getColorClasses, getDashboardIcon } from '@/lib/dashboards'
import { parseNarrativeSections, extractBullets } from '@/lib/parse-narrative'
import { formatKpiValue } from '@/lib/format-kpi'

/**
 * Slide-by-slide preview of the deck the narrative + dashboard pair
 * will produce. Rendered server-side from the fixture data — no
 * client interactivity needed on the slides themselves.
 *
 * The 7-slide sequence:
 *   1. Title slide        (dashboard meta)
 *   2. Headline metric    (hero KPI · big value · delta)
 *   3. What moved         (narrative section, markdown)
 *   4. So what            (narrative section, markdown)
 *   5. Talking points     (parsed bullet list)
 *   6. Risks + caveats    (narrative section, markdown)
 *   7. Closing recap      (5-KPI strip · questions CTA)
 *
 * PPTX export (W7.D1) will replay this same structure via pptxgenjs,
 * applying the design-system tokens to slide masters.
 */
interface SlidePreviewProps {
  dashboard: DashboardFixture
  narrative: Fixture
}

const TOTAL_SLIDES = 7

export function SlidePreview({ dashboard, narrative }: SlidePreviewProps) {
  const sections = parseNarrativeSections(narrative.text)
  const colors = getColorClasses(dashboard.metadata.colorToken)
  const Icon = getDashboardIcon(dashboard.metadata.icon)
  const heroKpi = dashboard.kpis[0]

  return (
    <div className="space-y-5">
      {/* Slide 1 — Title */}
      <Slide num={1} colors={colors}>
        <div className="flex h-full flex-col justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${colors.thumbBg} border ${colors.thumbBorder}`}
            >
              <Icon className={`h-6 w-6 ${colors.iconColor}`} strokeWidth={1.5} />
            </div>
            <div
              className={`inline-flex items-center font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded border ${colors.badgeBg} ${colors.badgeText} ${colors.badgeBorder}`}
            >
              {dashboard.metadata.domain}
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              {dashboard.metadata.title}
            </h2>
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl">
              {dashboard.metadata.tagline}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-text-muted">
            <span>{dashboard.metadata.period}</span>
            <span className="text-text-dim">·</span>
            <span>{dashboard.metadata.audience}</span>
          </div>
        </div>
      </Slide>

      {/* Slide 2 — Headline metric */}
      {heroKpi && (
        <Slide num={2} colors={colors}>
          <div className="flex h-full flex-col justify-between">
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
              {heroKpi.label}
            </p>
            <div className="space-y-4">
              <div className={`font-display font-bold tracking-tight leading-none ${colors.iconColor} text-6xl sm:text-7xl lg:text-8xl`}>
                {formatKpiValue(heroKpi)}
              </div>
              {typeof heroKpi.deltaPct === 'number' && heroKpi.deltaDirection && (
                <KpiDelta kpi={heroKpi} />
              )}
              {heroKpi.subtext && (
                <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
                  {heroKpi.subtext}
                </p>
              )}
            </div>
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
              {dashboard.metadata.title} · headline metric
            </p>
          </div>
        </Slide>
      )}

      {/* Slide 3 — What moved */}
      <ProseSlide num={3} colors={colors} heading="What moved" body={sections.byHeading['What moved']} />

      {/* Slide 4 — So what */}
      <ProseSlide num={4} colors={colors} heading="So what" body={sections.byHeading['So what']} />

      {/* Slide 5 — Talking points */}
      <Slide num={5} colors={colors}>
        <div className="flex h-full flex-col justify-between">
          <h3 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
            Talking points
          </h3>
          <ul className="space-y-3 max-w-3xl">
            {extractBullets(sections.byHeading['Talking points'] ?? '').map((bullet, i) => (
              <li key={i} className="flex gap-3 text-sm sm:text-base leading-relaxed">
                <span className={`font-mono text-sm font-semibold pt-0.5 shrink-0 ${colors.iconColor}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 text-text-secondary [&>strong]:text-text-primary [&>strong]:font-semibold">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={MARKDOWN_INLINE_ONLY}>
                    {bullet}
                  </ReactMarkdown>
                </div>
              </li>
            ))}
          </ul>
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
            For the QBR Q&amp;A
          </p>
        </div>
      </Slide>

      {/* Slide 6 — Risks + caveats */}
      <ProseSlide num={6} colors={colors} heading="Risks + caveats" body={sections.byHeading['Risks + caveats']} />

      {/* Slide 7 — Closing recap (5-KPI strip) */}
      <Slide num={7} colors={colors}>
        <div className="flex h-full flex-col justify-between">
          <h3 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
            Q3 in review
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {dashboard.kpis.slice(0, 5).map((kpi) => (
              <div key={kpi.id} className="space-y-1.5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted truncate">
                  {kpi.label}
                </p>
                <p className={`font-display font-semibold ${colors.iconColor} text-2xl truncate`}>
                  {formatKpiValue(kpi)}
                </p>
                {typeof kpi.deltaPct === 'number' && kpi.deltaDirection && (
                  <p className="font-mono text-[10px] text-text-muted">
                    {kpi.deltaDirection === 'up' ? '↑' : '↓'} {kpi.deltaPct.toFixed(1)}%
                  </p>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <MessageCircle className={`h-4 w-4 ${colors.iconColor}`} />
            <span>Questions? Detailed dashboard linked in the appendix.</span>
          </div>
        </div>
      </Slide>
    </div>
  )
}

export { TOTAL_SLIDES }

// ============================================================
// Internal slide primitives
// ============================================================

interface SlideProps {
  num: number
  colors: ReturnType<typeof getColorClasses>
  children: React.ReactNode
}

function Slide({ num, colors, children }: SlideProps) {
  return (
    <div
      className={`relative aspect-[16/9] rounded-xl border ${colors.thumbBorder} ${colors.thumbBg} overflow-hidden`}
    >
      <span className="absolute top-4 right-4 z-10 font-mono text-[10px] uppercase tracking-widest text-text-muted">
        Slide {num} / {TOTAL_SLIDES}
      </span>
      <div className="absolute inset-0 p-8 sm:p-10 lg:p-12 bg-surface/40">
        {children}
      </div>
    </div>
  )
}

function ProseSlide({
  num,
  colors,
  heading,
  body,
}: {
  num: number
  colors: ReturnType<typeof getColorClasses>
  heading: string
  body: string | undefined
}) {
  return (
    <Slide num={num} colors={colors}>
      <div className="flex h-full flex-col gap-4">
        <h3 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
          {heading}
        </h3>
        <div className="flex-1 max-w-3xl text-sm sm:text-base text-text-secondary leading-relaxed overflow-hidden [&_p]:mb-3 last:[&_p]:mb-0 [&_strong]:text-text-primary [&_strong]:font-semibold">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={MARKDOWN_PROSE}>
            {body ?? ''}
          </ReactMarkdown>
        </div>
      </div>
    </Slide>
  )
}

function KpiDelta({ kpi }: { kpi: KpiSpec }) {
  const Arrow = kpi.deltaDirection === 'up' ? TrendingUp : TrendingDown
  // For most KPIs "up" = good (revenue, NPS). For some it's bad
  // (attrition, latency, MTTR) — but the narrative narrates the
  // valence so the slide can just show neutral accent here.
  return (
    <div className="flex items-center gap-3 font-mono text-sm">
      <span className="inline-flex items-center gap-1.5 text-text-secondary">
        <Arrow className="h-4 w-4" />
        <span className="font-semibold text-text-primary">
          {kpi.deltaPct?.toFixed(1)}%
        </span>
      </span>
      {kpi.deltaWindow && (
        <span className="text-text-muted">{kpi.deltaWindow}</span>
      )}
    </div>
  )
}

// ReactMarkdown overrides — keep paragraphs lean; no links/headings inside slides.
const MARKDOWN_PROSE = {
  // Default paragraph styling is set by the parent's `[&_p]:mb-3`.
  // We just want to avoid ReactMarkdown injecting <h1>/<h2>/etc when
  // someone accidentally types `##` inside a section body.
  h1: ({ children }: { children?: React.ReactNode }) => <p>{children}</p>,
  h2: ({ children }: { children?: React.ReactNode }) => <p>{children}</p>,
  h3: ({ children }: { children?: React.ReactNode }) => <p>{children}</p>,
}

// Talking-points bullets are rendered as <li>; ReactMarkdown should
// only emit inline-level transforms (bold, em, code).
const MARKDOWN_INLINE_ONLY = {
  p: ({ children }: { children?: React.ReactNode }) => <span>{children}</span>,
}
