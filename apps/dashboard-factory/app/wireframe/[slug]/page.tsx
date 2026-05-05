import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import {
  getAllWireframeSlugs,
  getWireframeDataset,
} from '@/lib/wireframe-datasets'
import { getWireframeRecommendation } from '@/lib/wireframe-recommendations'
import { getColorClasses, type ColorToken } from '@/lib/datasets'
import { WireframeView } from '../_components/WireframeView'

interface WireframePageProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return getAllWireframeSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: WireframePageProps) {
  const { slug } = await params
  const dataset = getWireframeDataset(slug)
  if (!dataset) {
    return { title: 'Wireframe not found' }
  }
  return {
    title: `${dataset.metadata.title} · Wireframe`,
    description: dataset.metadata.tagline,
  }
}

/**
 * Dynamic wireframe route — one page per dataset slug, statically generated
 * at build time over the registered wireframe slugs. The actual rendering
 * is driven by the wireframe engine (lib/wireframe-engine.ts) which reuses
 * the ad-hoc DashboardView for chart layout. Density is a client-side
 * concern handled by <WireframeView>.
 */
export default async function WireframePage({ params }: WireframePageProps) {
  const { slug } = await params
  const dataset = getWireframeDataset(slug)
  const recommendation = getWireframeRecommendation(slug)
  if (!dataset || !recommendation) notFound()

  const colors = getColorClasses(dataset.metadata.colorToken as ColorToken)

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

      <section className="section-container pt-8 pb-16 lg:pb-24">
        <div className="max-w-4xl mb-8">
          <div className="font-mono text-xs uppercase tracking-widest text-accent mb-2">
            For Developers · {dataset.metadata.domain}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            {dataset.metadata.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-text-secondary leading-relaxed">
            {dataset.metadata.tagline}
          </p>
        </div>

        <WireframeView slug={slug} colors={colors} />
      </section>
    </>
  )
}
