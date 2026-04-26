import Link from 'next/link'
import { Github } from 'lucide-react'

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-base-900/85 backdrop-blur-md border-b border-surface-border">
      <div className="section-container flex items-center justify-between gap-3 py-3">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group min-w-0">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-accent to-accent-dark font-mono font-bold text-base-900 text-sm shadow-glow-sm group-hover:shadow-glow-md transition-shadow">
            DF
          </span>
          <span className="hidden sm:inline font-display font-semibold text-sm tracking-tight truncate">
            Dashboard Factory
          </span>
          <span className="hidden md:inline-block font-mono text-[10px] px-2 py-0.5 rounded border border-accent/30 bg-accent/10 text-accent shrink-0">
            Project 01
          </span>
        </Link>
        <div className="flex items-center gap-1 shrink-0">
          <Link
            href="/datasets"
            className="inline-flex items-center min-h-[44px] text-sm font-medium text-text-muted hover:text-accent hover:bg-accent/10 px-3 sm:px-4 rounded-md transition-colors"
          >
            Datasets
          </Link>
          <a
            href="https://github.com/rishigundla/ai-portfolio/tree/main/apps/dashboard-factory"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
            className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-medium text-text-muted hover:text-accent hover:bg-accent/10 px-3 sm:px-4 rounded-md transition-colors"
          >
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </nav>
  )
}
