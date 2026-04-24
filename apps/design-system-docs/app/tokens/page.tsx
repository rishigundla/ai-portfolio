import { Section, SubSection } from '../_components/Section'

export default function TokensPage() {
  return (
    <Section
      eyebrow="01 · Tokens"
      title="Design tokens"
      description="CSS variables that power every visual surface. Change one token, every consumer updates. Typed constants are also exported for programmatic access."
    >
      <SubSection label="Accent" description="The single brand signature color">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Swatch name="accent" hex="#2dd4bf" cssVar="--color-accent" bg="bg-accent" fg="text-base-900" />
          <Swatch name="accent-light" hex="#5eead4" cssVar="--color-accent-light" bg="bg-accent-light" fg="text-base-900" />
          <Swatch name="accent-dark" hex="#14b8a6" cssVar="--color-accent-dark" bg="bg-accent-dark" fg="text-white" />
          <Swatch name="accent/10" hex="rgba(45, 212, 191, 0.1)" cssVar="--color-accent-glow" bg="bg-accent/10 border border-accent/30" fg="text-accent" />
        </div>
      </SubSection>

      <SubSection label="Base Scale" description="Layered dark surfaces from background to elevated">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Swatch name="base-900" hex="#0a0a0f" cssVar="--color-base-900" bg="bg-base-900 border border-surface-border" fg="text-text-primary" />
          <Swatch name="base-800" hex="#12121a" cssVar="--color-base-800" bg="bg-base-800 border border-surface-border" fg="text-text-primary" />
          <Swatch name="base-700" hex="#1a1a25" cssVar="--color-base-700" bg="bg-base-700" fg="text-text-primary" />
          <Swatch name="base-600" hex="#222230" cssVar="--color-base-600" bg="bg-base-600" fg="text-text-primary" />
        </div>
      </SubSection>

      <SubSection label="Surface & Text">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Swatch name="surface" hex="#16161e" cssVar="--color-surface" bg="bg-surface border border-surface-border" fg="text-text-primary" />
          <Swatch name="surface-hover" hex="#1e1e28" cssVar="--color-surface-hover" bg="bg-surface-hover" fg="text-text-primary" />
          <Swatch name="text-primary" hex="#ffffff" cssVar="--color-text-primary" bg="bg-surface border border-surface-border" fg="text-text-primary" />
          <Swatch name="text-secondary" hex="#9ca3af" cssVar="--color-text-secondary" bg="bg-surface border border-surface-border" fg="text-text-secondary" />
        </div>
      </SubSection>

      <SubSection label="Status & Severity" description="Used for progress, alerts, and severity routing across AI apps">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Swatch name="status-completed" hex="#10b981" cssVar="--color-status-completed" bg="bg-status-completed" fg="text-base-900" />
          <Swatch name="status-in-progress" hex="#f59e0b" cssVar="--color-status-in-progress" bg="bg-status-in-progress" fg="text-base-900" />
          <Swatch name="status-blocked" hex="#ef4444" cssVar="--color-status-blocked" bg="bg-status-blocked" fg="text-white" />
          <Swatch name="status-not-started" hex="#475569" cssVar="--color-status-not-started" bg="bg-status-not-started" fg="text-white" />
        </div>
      </SubSection>

      <SubSection label="Typography" description="Three font families, one motion language">
        <div className="space-y-6 rounded-xl border border-surface-border bg-surface p-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-text-muted mb-1">Display / Body · Space Grotesk</div>
            <div className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Turning data into clarity</div>
          </div>
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-text-muted mb-1">Mono · JetBrains Mono</div>
            <div className="font-mono text-lg">{`import { KpiCard } from '@rishi/design-system'`}</div>
          </div>
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-text-muted mb-1">Serif · Source Serif 4</div>
            <div className="font-serif italic text-lg text-text-secondary">Every chart should earn its place on the page.</div>
          </div>
        </div>
      </SubSection>

      <SubSection label="Motion" description="CSS keyframes plus Framer Motion variants, kept in sync">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <MotionDemo label="pulse-glow" className="animate-pulse-glow">Pulsing</MotionDemo>
          <MotionDemo label="float" className="animate-float">Floating</MotionDemo>
          <MotionDemo label="fade-in" className="animate-fade-in">Faded In</MotionDemo>
        </div>
      </SubSection>

      <SubSection label="Shadows">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ShadowDemo label="card" className="shadow-card" />
          <ShadowDemo label="card-hover" className="shadow-card-hover" />
          <ShadowDemo label="glow-lg" className="shadow-glow-lg" />
        </div>
      </SubSection>
    </Section>
  )
}

function Swatch({
  name,
  hex,
  cssVar,
  bg,
  fg,
}: {
  name: string
  hex: string
  cssVar: string
  bg: string
  fg: string
}) {
  return (
    <div className="rounded-lg overflow-hidden border border-surface-border">
      <div className={`${bg} ${fg} p-5 h-24 flex items-end`}>
        <span className="font-mono text-xs">{name}</span>
      </div>
      <div className="bg-surface-elevated px-4 py-3 border-t border-surface-border">
        <div className="font-mono text-xs text-text-secondary">{hex}</div>
        <div className="font-mono text-[10px] text-text-muted mt-0.5">{cssVar}</div>
      </div>
    </div>
  )
}

function MotionDemo({
  label,
  className,
  children,
}: {
  label: string
  className: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-surface-border bg-surface p-6 text-center">
      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 border border-accent/40 text-accent ${className}`}>
        {children}
      </div>
      <div className="mt-4 font-mono text-xs text-text-muted">{label}</div>
    </div>
  )
}

function ShadowDemo({ label, className }: { label: string; className: string }) {
  return (
    <div className="rounded-lg bg-surface p-8 text-center border border-surface-border">
      <div className={`w-full h-16 rounded-md bg-base-700 border border-surface-border ${className}`} />
      <div className="mt-4 font-mono text-xs text-text-muted">{label}</div>
    </div>
  )
}
