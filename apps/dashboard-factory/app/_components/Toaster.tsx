'use client'

import * as React from 'react'
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@rishi/design-system/primitives'
import { useToastStore, type ToastVariant } from '@/lib/toast-store'

/**
 * Mounts the global toast queue. Place once near the root layout.
 *
 * The Radix <Toast> handles its own dismiss timer; when Radix fires
 * onOpenChange(false), we drop the entry from the Zustand store.
 */
export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  return (
    <ToastProvider swipeDirection="right">
      {toasts.map((t) => (
        <Toast
          key={t.id}
          variant={t.variant}
          duration={t.durationMs}
          onOpenChange={(open) => {
            if (!open) dismiss(t.id)
          }}
        >
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Icon variant={t.variant} />
            <div className="flex-1 min-w-0">
              <ToastTitle>{t.title}</ToastTitle>
              {t.description && (
                <ToastDescription className="mt-0.5 text-text-secondary">
                  {t.description}
                </ToastDescription>
              )}
            </div>
          </div>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}

function Icon({ variant }: { variant: ToastVariant }) {
  const cls = 'h-4 w-4 shrink-0 mt-0.5'
  if (variant === 'success') return <CheckCircle2 className={cls} />
  if (variant === 'danger') return <AlertCircle className={cls} />
  if (variant === 'warning') return <AlertTriangle className={cls} />
  return <Info className={cls} />
}
