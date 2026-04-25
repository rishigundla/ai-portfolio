import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Section } from '../../_components/Section'
import { datasets, getDataset, getDatasetIcon, getColorClasses } from '@/lib/datasets'
import { getFullDataset } from '@/lib/full-datasets'
import { getProfilingFixture } from '@/lib/profiling'
import { StreamingPanel } from './_streaming-panel'
import { DatasetPreview } from './_dataset-preview'

// Pre-render every dataset's profiling page at build time
export function generateStaticParams() {
  return datasets.map((d) => ({ slug: d.id }))
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const summary = getDataset(slug)
  if (!summary) return { title: 'Not found · Dashboard Factory' }
  return {
    title: `Profiling · ${summary.title} · Dashboard Factory`,
    description: `Watch Claude profile the ${summary.title} dataset and recommend KPIs and charts before building the dashboard.`,
  }
}

export default async function GeneratePage({ params }: PageProps) {
  const { slug } = await params
  const summary = getDataset(slug)
  const fullDataset = getFullDataset(slug)
  if (!summary || !fullDataset) notFound()

  const Icon = getDatasetIcon(summary.icon)
  const colors = getColorClasses(summary.colorToken)

  // Curated profiling fixture if available, else generated placeholder.
  // All 6 datasets have curated fixtures as of Day 5.
  const fixture = getProfilingFixture(slug, fullDataset)

  return (
    <>
      {/* Back link */}
      <div className="section-container pt-8">
        <Link
          href="/datasets"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to datasets
        </Link>
      </div>

      <Section
        eyebrow={`Step 2 of 3 · Profiling · ${summary.domain}`}
        title={summary.title}
        description={summary.tagline}
      >
        {/* Dataset header strip */}
        <div className="flex items-center gap-4 mb-10 -mt-2">
          <div
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border ${colors.thumbBorder} ${colors.thumbBg}`}
          >
            <Icon className={`h-7 w-7 ${colors.iconColor}`} strokeWidth={1.5} />
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs">
            <span className="text-text-muted">
              <span className="text-text-secondary">{fullDataset.rows.length}</span> rows
            </span>
            <span className="text-text-muted">
              <span className="text-text-secondary">{fullDataset.metadata.schema.length}</span> columns
            </span>
            <span className="text-text-muted">
              domain · <span className="text-text-secondary">{summary.domain}</span>
            </span>
          </div>
        </div>

        {/* Preview */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-base font-semibold text-text-primary">
              Preview
            </h2>
            <span className="font-mono text-xs text-text-muted">
              First 10 of {fullDataset.rows.length} rows
            </span>
          </div>
          <DatasetPreview
            rows={fullDataset.rows}
            schema={fullDataset.metadata.schema}
          />
        </div>

        {/* Streaming */}
        <StreamingPanel fixture={fixture} datasetSlug={slug} />
      </Section>
    </>
  )
}
