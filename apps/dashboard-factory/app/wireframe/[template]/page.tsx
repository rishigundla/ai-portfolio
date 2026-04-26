import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Wand2 } from 'lucide-react'
import {
  TEMPLATES,
  getTemplate,
  type TemplateId,
} from '@/lib/wireframe-templates'
import { getColorClasses } from '@/lib/datasets'
import { ExecutiveLayout } from '../_components/ExecutiveLayout'
import { OperationalLayout } from '../_components/OperationalLayout'
import { ExploratoryLayout } from '../_components/ExploratoryLayout'

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ template: t.id }))
}

interface PageProps {
  params: Promise<{ template: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { template } = await params
  const t = getTemplate(template)
  if (!t) return { title: 'Not found · Dashboard Factory' }
  return {
    title: `${t.title} wireframe · Dashboard Factory`,
    description: `${t.tagline} ${t.audience}.`,
  }
}

const LAYOUTS: Record<TemplateId, () => React.JSX.Element> = {
  executive: ExecutiveLayout,
  operational: OperationalLayout,
  exploratory: ExploratoryLayout,
}

export default async function WireframeTemplatePage({ params }: PageProps) {
  const { template } = await params
  const t = getTemplate(template)
  if (!t) notFound()

  const Layout = LAYOUTS[t.id]
  const colors = getColorClasses(t.colorToken)
  const otherTemplates = TEMPLATES.filter((x) => x.id !== t.id)

  return (
    <>
      {/* Back link */}
      <div className="section-container pt-8">
        <Link
          href="/wireframe"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to wireframe gallery
        </Link>
      </div>

      {/* Header */}
      <section className="section-container pt-6 pb-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="font-mono text-xs uppercase tracking-widest text-accent mb-2 inline-flex items-center gap-2">
              <Wand2 className="h-3 w-3" />
              Wireframe · {t.density} layout
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary">
              {t.title}
            </h1>
            <p className="mt-3 text-text-secondary text-base sm:text-lg max-w-2xl">
              {t.tagline}
            </p>
            <p className="mt-2 font-mono text-xs uppercase tracking-wider text-text-dim">
              For · {t.audience}
            </p>
          </div>

          {/* Variant switcher */}
          <div className="flex flex-wrap gap-2">
            {otherTemplates.map((other) => {
              const oc = getColorClasses(other.colorToken)
              return (
                <Link
                  key={other.id}
                  href={`/wireframe/${other.id}`}
                  className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-all ${oc.badgeBorder} ${oc.badgeBg} ${oc.badgeText} hover:bg-surface-hover`}
                >
                  Try {other.title}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              )
            })}
          </div>
        </div>

        {/* Mockup banner */}
        <div className={`mt-6 rounded-md border ${colors.thumbBorder} ${colors.thumbBg} px-4 py-2.5 inline-flex items-center gap-2.5 text-xs font-mono`}>
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span className="text-text-secondary">
            <span className="text-accent">Mockup mode</span> · static demo data ·
            ready to share with stakeholders
          </span>
        </div>
      </section>

      {/* Layout */}
      <section className="section-container pb-16">
        <Layout />
      </section>
    </>
  )
}
