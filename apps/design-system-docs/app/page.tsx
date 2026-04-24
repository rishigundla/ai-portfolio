import Link from 'next/link'
import { Section } from './_components/Section'

export default function HomePage() {
  return (
    <>
      <Section
        eyebrow="@rishi/design-system"
        title="Design system for the AI Portfolio"
        description="Tokens, primitives, and AI-specific components used across five AI-native portfolio projects. Extracted from rishikeshgundla.com and extended for streaming UIs, KPI dashboards, and narrative-heavy interfaces."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CatalogCard
            href="/tokens"
            number="01"
            title="Tokens"
            description="Colors, typography, spacing, motion, shadows. CSS variables + typed constants."
          />
          <CatalogCard
            href="/primitives"
            number="02"
            title="Primitives"
            description="14 accessible base components built on Radix UI + cva, themed to tokens."
          />
          <CatalogCard
            href="/components"
            number="03"
            title="Components"
            description="5 AI-specific components. Live streaming demo, sortable grid, KPI cards with sparklines."
          />
        </div>

        <div className="mt-14 rounded-xl border border-surface-border bg-surface p-6">
          <h3 className="font-display text-lg font-semibold mb-4">Quick start</h3>
          <pre className="bg-base-900 rounded-md p-4 overflow-x-auto text-sm leading-relaxed">
            <code className="font-mono text-text-secondary">
              <span className="text-text-muted">{`// layout.tsx`}</span>
              {`\n`}
              <span className="text-accent-light">import</span> <span className="text-accent">{`'@rishi/design-system/tokens'`}</span>
              {`\n\n`}
              <span className="text-text-muted">{`// any component file`}</span>
              {`\n`}
              <span className="text-accent-light">import</span> {`{ Button, Card, KpiCard, AiNarrativeBlock }`} <span className="text-accent-light">from</span> <span className="text-accent">{`'@rishi/design-system/components'`}</span>
            </code>
          </pre>
        </div>
      </Section>
    </>
  )
}

function CatalogCard({
  href,
  number,
  title,
  description,
}: {
  href: string
  number: string
  title: string
  description: string
}) {
  return (
    <Link
      href={href}
      className="group relative rounded-xl border border-surface-border bg-surface p-6 transition-all hover:border-accent/40 hover:shadow-card-hover"
    >
      <div className="font-mono text-3xl font-light text-accent mb-3 tracking-tight">
        {number}
      </div>
      <h3 className="font-display text-lg font-semibold mb-2 text-text-primary">
        {title}
      </h3>
      <p className="text-sm text-text-muted leading-relaxed">{description}</p>
      <div className="absolute top-0 left-0 w-1 h-0 bg-accent rounded-l-xl transition-all group-hover:h-full" />
    </Link>
  )
}
