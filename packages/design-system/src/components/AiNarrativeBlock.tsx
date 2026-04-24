import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Sparkles } from 'lucide-react'
import { cn } from '../lib/cn'

export interface AiNarrativeBlockProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The narrative text (markdown supported) to display. */
  text: string
  /** When true, shows a blinking cursor at the end of the text. */
  streaming?: boolean
  /** Optional icon override; defaults to Sparkles. */
  icon?: React.ReactNode
  /** Optional title ribbon shown above the narrative. */
  title?: React.ReactNode
  variant?: 'default' | 'accent' | 'muted'
}

const variantStyles = {
  default: 'bg-surface border-surface-border text-text-primary',
  accent:
    'bg-accent/5 border-accent/30 text-text-primary shadow-glow-sm',
  muted: 'bg-base-800 border-surface-border text-text-secondary',
} as const

/**
 * AI narrative display with markdown rendering + streaming cursor.
 * Use for Claude-generated explanations, meeting briefs, RCA hypotheses, etc.
 */
export const AiNarrativeBlock = React.forwardRef<HTMLDivElement, AiNarrativeBlockProps>(
  ({ text, streaming = false, icon, title, variant = 'default', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-xl border p-5 transition-colors',
          variantStyles[variant],
          className,
        )}
        {...props}
      >
        {(title || icon !== null) && (
          <div className="flex items-center gap-2 mb-3 text-xs font-mono uppercase tracking-wider">
            <span className="text-accent">{icon ?? <Sparkles className="h-3.5 w-3.5" />}</span>
            {title && <span className="text-text-muted">{title}</span>}
            {!title && <span className="text-text-muted">AI-generated</span>}
          </div>
        )}

        <div className="prose-narrative text-sm leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <p className="mb-3 last:mb-0 text-text-primary">{children}</p>,
              strong: ({ children }) => (
                <strong className="font-semibold text-text-primary">{children}</strong>
              ),
              em: ({ children }) => <em className="italic text-text-secondary">{children}</em>,
              ul: ({ children }) => (
                <ul className="mb-3 list-none space-y-1 pl-0">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="mb-3 list-decimal space-y-1 pl-5">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="relative pl-4 text-text-primary before:absolute before:left-0 before:text-accent before:content-['→']">
                  {children}
                </li>
              ),
              code: ({ children }) => (
                <code className="rounded bg-base-700 px-1.5 py-0.5 font-mono text-xs text-accent">
                  {children}
                </code>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-accent underline underline-offset-2 hover:text-accent-light"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              h1: ({ children }) => (
                <h3 className="mb-2 font-display text-base font-semibold text-text-primary">{children}</h3>
              ),
              h2: ({ children }) => (
                <h4 className="mb-2 font-display text-sm font-semibold text-text-primary">{children}</h4>
              ),
              h3: ({ children }) => (
                <h5 className="mb-1 font-display text-sm font-semibold text-text-primary">{children}</h5>
              ),
            }}
          >
            {text}
          </ReactMarkdown>
          {streaming && (
            <span
              className="inline-block ml-0.5 h-4 w-[2px] bg-accent align-middle animate-blink"
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    )
  },
)
AiNarrativeBlock.displayName = 'AiNarrativeBlock'
