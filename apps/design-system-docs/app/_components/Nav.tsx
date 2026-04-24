import Link from 'next/link'

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-base-900/85 backdrop-blur-md border-b border-surface-border">
      <div className="section-container flex items-center justify-between py-3.5">
        <Link
          href="/"
          className="flex items-center gap-3 group"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-accent to-accent-dark font-mono font-bold text-base-900 text-sm shadow-glow-sm group-hover:shadow-glow-md transition-shadow">
            DS
          </span>
          <span className="font-display font-semibold text-sm tracking-tight">
            Design System
          </span>
          <span className="hidden sm:inline-block font-mono text-[10px] px-2 py-0.5 rounded border border-accent/30 bg-accent/10 text-accent">
            v0.1
          </span>
        </Link>
        <div className="flex items-center gap-1.5">
          <NavLink href="/tokens">Tokens</NavLink>
          <NavLink href="/primitives">Primitives</NavLink>
          <NavLink href="/components">Components</NavLink>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-xs sm:text-sm font-medium text-text-muted hover:text-accent hover:bg-accent/10 px-3 py-1.5 rounded-md transition-colors"
    >
      {children}
    </Link>
  )
}
