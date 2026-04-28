import { notFound } from 'next/navigation'
import { datasets, getDataset } from '@/lib/datasets'
import { getFullDataset } from '@/lib/full-datasets'
import { DashboardGuard } from './_guard'

// Pre-render every slug at build time
export function generateStaticParams() {
  return datasets.map((d) => ({ slug: d.id }))
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const summary = getDataset(slug)
  if (!summary) return { title: 'Not found' }
  return {
    title: `Dashboard · ${summary.title}`,
    description: `Interactive dashboard for the ${summary.title} dataset — KPIs, charts, filters, drill-downs.`,
  }
}

export default async function DashboardPage({ params }: PageProps) {
  const { slug } = await params
  const summary = getDataset(slug)
  const fullDataset = getFullDataset(slug)
  if (!summary || !fullDataset) notFound()

  // Pass the full dataset to the client guard. The interactive wrapper
  // recomputes the dashboard layout from filtered rows whenever filters
  // change. Pure-function builder (lib/dashboard-builder.ts) makes this
  // cheap on 30-50 row fixtures.
  return <DashboardGuard slug={slug} dataset={summary} fullDataset={fullDataset} />
}
