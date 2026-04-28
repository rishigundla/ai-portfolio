import Link from 'next/link'
import { ArrowLeft, ArrowRight, Wand2 } from 'lucide-react'
import { TEMPLATES, type TemplateId } from '@/lib/wireframe-templates'
import { getColorClasses } from '@/lib/datasets'
import { Section } from '../_components/Section'

export const metadata = {
  title: 'Wireframe templates',
  description:
    'Three layout archetypes (Executive, Operational, Exploratory) for developers running a discovery session. Pick a template, get a clickable hi-fi mockup.',
}

export default function WireframeGalleryPage() {
  return (
    <>
      {/* Back link */}
      <div className="section-container pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </div>

      <Section
        eyebrow="For Developers · Discovery mode"
        title="Pick a layout archetype"
        description="Three patterns that cover most enterprise dashboard requests. Use these as a starting point for the discovery conversation. Share the URL, refine in Figma, then build with confidence."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TEMPLATES.map((template) => {
            const colors = getColorClasses(template.colorToken)
            return (
              <Link
                key={template.id}
                href={`/wireframe/${template.id}`}
                className="group rounded-xl border border-surface-border bg-surface overflow-hidden transition-all hover:border-accent/40 hover:shadow-card-hover hover:-translate-y-0.5"
              >
                {/* Thumbnail — mini layout sketch */}
                <div
                  className={`relative aspect-[16/10] ${colors.thumbBg} border-b ${colors.thumbBorder} overflow-hidden`}
                >
                  <ThumbnailSketch id={template.id} />
                  <div className="absolute inset-0 dot-pattern opacity-20" aria-hidden="true" />
                </div>

                {/* Body */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`inline-flex items-center font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded border ${colors.badgeBg} ${colors.badgeText} ${colors.badgeBorder}`}
                    >
                      {template.density} layout
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                      Template
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-semibold tracking-tight mb-1 group-hover:text-accent transition-colors">
                    {template.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed mb-3">
                    {template.tagline}
                  </p>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-text-dim mb-4">
                    Best for · {template.audience}
                  </p>
                  <div className="inline-flex items-center gap-1.5 text-sm font-medium text-accent group-hover:gap-2.5 transition-all">
                    <Wand2 className="h-3.5 w-3.5" />
                    Open this template
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <p className="mt-12 max-w-2xl text-sm text-text-muted leading-relaxed">
          These wireframes use hand-curated demo data so the layouts read true.
          The same components ship in the live <code className="text-accent font-mono text-xs">/dashboard/[slug]</code> route. What you see here is exactly the visual language stakeholders will get in production.
        </p>
      </Section>
    </>
  )
}

// ============================================================
// Mini layout sketches — visual previews of each template
// ============================================================

function ThumbnailSketch({ id }: { id: TemplateId }) {
  if (id === 'executive') return <ExecutiveSketch />
  if (id === 'operational') return <OperationalSketch />
  return <ExploratorySketch />
}

function ExecutiveSketch() {
  return (
    <svg
      viewBox="0 0 240 150"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {/* Big headline KPI block */}
      <rect x="20" y="18" width="200" height="55" rx="4" fill="#14b8a6" fillOpacity="0.18" />
      <rect x="32" y="30" width="60" height="6" rx="1.5" fill="#14b8a6" opacity="0.7" />
      <rect x="32" y="42" width="120" height="14" rx="2" fill="#14b8a6" />
      <rect x="32" y="61" width="40" height="4" rx="1" fill="#14b8a6" opacity="0.5" />

      {/* 3 sub-KPIs */}
      <rect x="20" y="80" width="60" height="22" rx="3" fill="rgba(165, 171, 195, 0.15)" />
      <rect x="90" y="80" width="60" height="22" rx="3" fill="rgba(165, 171, 195, 0.15)" />
      <rect x="160" y="80" width="60" height="22" rx="3" fill="rgba(165, 171, 195, 0.15)" />

      {/* Anchor line chart */}
      <rect x="20" y="108" width="200" height="30" rx="3" fill="rgba(165, 171, 195, 0.08)" />
      <polyline
        fill="none"
        stroke="#14b8a6"
        strokeWidth="1.5"
        points="28,128 60,122 90,118 120,114 150,116 180,110 210,114"
      />
    </svg>
  )
}

function OperationalSketch() {
  return (
    <svg
      viewBox="0 0 240 150"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {/* 6 KPI strip */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect
          key={i}
          x={20 + i * 34}
          y="18"
          width="30"
          height="22"
          rx="2"
          fill="#fbbf24"
          fillOpacity={0.15 + i * 0.04}
        />
      ))}

      {/* 2x2 chart grid */}
      <rect x="20" y="48" width="100" height="42" rx="3" fill="rgba(251, 191, 36, 0.1)" />
      {/* bars */}
      {[36, 26, 18, 12, 6].map((w, i) => (
        <rect
          key={i}
          x="28"
          y={54 + i * 7}
          width={w}
          height="4"
          rx="1"
          fill="#fbbf24"
          opacity="0.7"
        />
      ))}

      <rect x="124" y="48" width="100" height="42" rx="3" fill="rgba(251, 191, 36, 0.08)" />
      {/* line */}
      <polyline
        fill="none"
        stroke="#fbbf24"
        strokeWidth="1.5"
        points="132,82 148,76 164,80 180,68 196,72 212,62"
      />

      <rect x="20" y="96" width="100" height="42" rx="3" fill="rgba(251, 191, 36, 0.08)" />
      {/* donut */}
      <circle cx="50" cy="117" r="13" fill="none" stroke="rgba(165, 171, 195, 0.2)" strokeWidth="4" />
      <circle
        cx="50"
        cy="117"
        r="13"
        fill="none"
        stroke="#fbbf24"
        strokeWidth="4"
        strokeDasharray="50 82"
        transform="rotate(-90 50 117)"
      />

      <rect x="124" y="96" width="100" height="42" rx="3" fill="rgba(251, 191, 36, 0.08)" />
      {/* tiny bars */}
      {[8, 18, 32, 14].map((h, i) => (
        <rect
          key={i}
          x={132 + i * 18}
          y={132 - h}
          width="12"
          height={h}
          rx="1"
          fill="#fb7185"
          opacity="0.7"
        />
      ))}
    </svg>
  )
}

function ExploratorySketch() {
  return (
    <svg
      viewBox="0 0 240 150"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {/* Filter rail */}
      <rect x="14" y="18" width="56" height="120" rx="3" fill="rgba(167, 139, 250, 0.12)" />
      <rect x="22" y="28" width="20" height="3" rx="1" fill="#a78bfa" />
      <rect x="22" y="38" width="40" height="6" rx="1" fill="rgba(165, 171, 195, 0.3)" />
      <rect x="22" y="50" width="40" height="6" rx="1" fill="rgba(165, 171, 195, 0.3)" />
      <rect x="22" y="62" width="40" height="6" rx="1" fill="rgba(165, 171, 195, 0.3)" />
      <rect x="22" y="78" width="20" height="3" rx="1" fill="#a78bfa" />
      <rect x="22" y="86" width="40" height="6" rx="1" fill="rgba(165, 171, 195, 0.2)" />
      <rect x="22" y="98" width="40" height="6" rx="1" fill="rgba(165, 171, 195, 0.2)" />
      <rect x="22" y="110" width="40" height="6" rx="1" fill="rgba(165, 171, 195, 0.2)" />

      {/* KPI row */}
      <rect x="78" y="18" width="36" height="22" rx="2" fill="rgba(167, 139, 250, 0.18)" />
      <rect x="118" y="18" width="36" height="22" rx="2" fill="rgba(167, 139, 250, 0.15)" />
      <rect x="158" y="18" width="36" height="22" rx="2" fill="rgba(167, 139, 250, 0.13)" />
      <rect x="198" y="18" width="28" height="22" rx="2" fill="rgba(167, 139, 250, 0.11)" />

      {/* Heatmap */}
      <rect x="78" y="48" width="148" height="44" rx="3" fill="rgba(167, 139, 250, 0.08)" />
      {[0, 1, 2, 3, 4, 5].map((r) =>
        [0, 1, 2, 3, 4, 5].map((c) => (
          <rect
            key={`${r}-${c}`}
            x={84 + c * 23}
            y={54 + r * 6}
            width="20"
            height="4"
            rx="0.5"
            fill="#a78bfa"
            opacity={0.15 + (r + c) * 0.05}
          />
        )),
      )}

      {/* 2-up bottom */}
      <rect x="78" y="100" width="72" height="38" rx="3" fill="rgba(167, 139, 250, 0.08)" />
      <circle cx="100" cy="119" r="11" fill="none" stroke="rgba(165, 171, 195, 0.2)" strokeWidth="3" />
      <circle
        cx="100"
        cy="119"
        r="11"
        fill="none"
        stroke="#a78bfa"
        strokeWidth="3"
        strokeDasharray="40 70"
        transform="rotate(-90 100 119)"
      />

      <rect x="154" y="100" width="72" height="38" rx="3" fill="rgba(167, 139, 250, 0.08)" />
      {[28, 18, 12, 8, 4].map((w, i) => (
        <rect
          key={i}
          x="160"
          y={106 + i * 6}
          width={w}
          height="3"
          rx="1"
          fill="#a78bfa"
          opacity="0.7"
        />
      ))}
    </svg>
  )
}
