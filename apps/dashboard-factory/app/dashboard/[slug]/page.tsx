import { notFound } from 'next/navigation'
import { datasets, getDataset } from '@/lib/datasets'
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
  if (!summary) notFound()

  return <DashboardGuard slug={slug} dataset={summary} />
}
