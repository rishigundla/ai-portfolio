import { ReactNode } from 'react'

export function Section({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className="section-container py-12 lg:py-16">
      <header className="mb-10 max-w-3xl">
        {eyebrow && (
          <div className="font-mono text-xs uppercase tracking-widest text-accent mb-2">
            {eyebrow}
          </div>
        )}
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary leading-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-4 text-text-secondary text-base sm:text-lg max-w-2xl">
            {description}
          </p>
        )}
      </header>
      {children}
    </section>
  )
}

export function SubSection({
  label,
  description,
  children,
}: {
  label: string
  description?: string
  children: ReactNode
}) {
  return (
    <div className="mt-12 first:mt-0">
      <div className="mb-5 border-b border-surface-border pb-2 flex items-baseline gap-3">
        <h2 className="font-display text-lg font-semibold text-text-primary">{label}</h2>
        {description && <p className="text-sm text-text-muted">{description}</p>}
      </div>
      {children}
    </div>
  )
}
