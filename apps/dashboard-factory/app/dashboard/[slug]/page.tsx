import { notFound } from 'next/navigation'
import { datasets, getDataset } from '@/lib/datasets'
import { getFullDataset } from '@/lib/full-datasets'
import { buildDashboardLayout } from '@/lib/dashboard-builder'
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
  if (!summary) return { title: 'Not found · Dashboard Factory' }
  return {
    title: `Dashboard · ${summary.title} · Dashboard Factory`,
    description: `Interactive dashboard for the ${summary.title} dataset — KPIs, charts, filters, drill-downs.`,
  }
}

export default async function DashboardPage({ params }: PageProps) {
  const { slug } = await params
  const summary = getDataset(slug)
  const fullDataset = getFullDataset(slug)
  if (!summary || !fullDataset) notFound()

  // Build the dashboard layout server-side from the dataset rows.
  // The result is JSON-serializable, so it crosses cleanly into the
  // client-side guard / view.
  const layout = buildDashboardLayout(fullDataset)

  return <DashboardGuard slug={slug} dataset={summary} layout={layout} />
}
