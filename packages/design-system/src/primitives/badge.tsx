import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-md border font-mono text-[10px] uppercase tracking-wider font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-surface-border bg-surface text-text-secondary',
        accent: 'border-accent/30 bg-accent/10 text-accent',
        success: 'border-status-completed/30 bg-status-completed/10 text-status-completed',
        warning: 'border-status-in-progress/30 bg-status-in-progress/10 text-status-in-progress',
        danger: 'border-status-blocked/30 bg-status-blocked/10 text-status-blocked',
        muted: 'border-text-dim/30 bg-base-700 text-text-muted',
      },
      size: {
        sm: 'px-2 py-0.5 text-[9px]',
        md: 'px-2.5 py-1 text-[10px]',
        lg: 'px-3 py-1.5 text-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size, className }))} {...props} />
}

export { badgeVariants }
