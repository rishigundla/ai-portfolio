interface KpiCardProps {
  eyebrow: string
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}

export function KpiCard({ eyebrow, title, subtitle, children, className = '' }: KpiCardProps) {
  return (
    <div className={`rounded-lg border border-surface-border bg-surface p-5 flex flex-col gap-4 ${className}`}>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
          {eyebrow}
        </p>
        <h3 className="font-display text-base font-semibold tracking-tight mt-1">
          {title}
        </h3>
        {subtitle && (
          <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  )
}
