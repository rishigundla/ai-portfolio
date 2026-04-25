import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { datasets, getDatasetIcon, getColorClasses } from '@/lib/datasets'
import { Section } from '../_components/Section'

export const metadata = {
  title: 'Sample datasets · Dashboard Factory',
  description:
    'Six curated sample datasets across sales, marketing, product telemetry, operations, and customer experience domains. Pick one to start.',
}

export default function DatasetsPage() {
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
        eyebrow="Step 1 of 3 · Pick a dataset"
        title="Six curated samples to choose from"
        description="Each is anonymised but follows realistic patterns from enterprise data work — Nutanix-style products, distribution by region, and the kind of edge cases real BI teams encounter. Click any card to watch Claude profile it."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {datasets.map((dataset) => {
            const Icon = getDatasetIcon(dataset.icon)
            const colors = getColorClasses(dataset.colorToken)
            return (
              <Link
                key={dataset.id}
                href={`/generate/${dataset.id}`}
                className="group rounded-xl border border-surface-border bg-surface overflow-hidden transition-all hover:border-accent/40 hover:shadow-card-hover hover:-translate-y-0.5"
              >
                {/* Thumbnail */}
                <div
                  className={`relative aspect-[16/10] ${colors.thumbBg} border-b ${colors.thumbBorder} flex items-center justify-center overflow-hidden`}
                >
                  <Icon className={`h-12 w-12 ${colors.iconColor} relative z-10`} strokeWidth={1.5} />
                  <div className="absolute inset-0 dot-pattern opacity-30" aria-hidden="true" />
                </div>

                {/* Body */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`inline-flex items-center font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded border ${colors.badgeBg} ${colors.badgeText} ${colors.badgeBorder}`}
                    >
                      {dataset.domain}
                    </span>
                    <span className="font-mono text-xs text-text-muted">
                      {dataset.rowCount} rows
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-semibold tracking-tight mb-1 group-hover:text-accent transition-colors">
                    {dataset.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed line-clamp-2">
                    {dataset.tagline}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent group-hover:gap-2.5 transition-all">
                    Profile this dataset
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Footer hint */}
        <p className="mt-12 max-w-2xl text-sm text-text-muted leading-relaxed">
          Want to use your own data? Real-data upload is in the production design but disabled in
          this portfolio demo to keep the experience fast and reliable. The architecture supports
          it — every fixture in this gallery follows the same schema your CSV would.
        </p>
      </Section>
    </>
  )
}
