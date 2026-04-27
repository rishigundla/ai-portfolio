import { create } from 'zustand'

export type ToastVariant = 'default' | 'success' | 'danger' | 'warning'

export interface ToastEntry {
  id: string
  title: string
  description?: string
  variant: ToastVariant
  /** Auto-dismiss duration in ms. 0 = sticky. */
  durationMs: number
}

interface ToastState {
  toasts: ToastEntry[]
  push: (toast: Omit<ToastEntry, 'id'>) => string
  dismiss: (id: string) => void
}

const DEFAULT_DURATION_MS = 4000

/**
 * Tiny in-memory toast queue powered by Zustand.
 *
 * The <Toaster /> component subscribes and renders one Radix <Toast>
 * per entry. A toast removes itself from the queue when its
 * onOpenChange fires false (Radix handles the dismiss timer).
 */
export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (toast) => {
    const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
    set((s) => ({ toasts: [...s.toasts, { id, ...toast }] }))
    return id
  },
  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

/**
 * Imperative shortcut. Use from event handlers without subscribing:
 *   toast.success('Filters cleared')
 *   toast.error('PDF export failed', { description: err.message })
 */
export const toast = {
  show: (title: string, opts: Partial<Omit<ToastEntry, 'id' | 'title'>> = {}) =>
    useToastStore.getState().push({
      title,
      description: opts.description,
      variant: opts.variant ?? 'default',
      durationMs: opts.durationMs ?? DEFAULT_DURATION_MS,
    }),
  success: (title: string, description?: string) =>
    useToastStore.getState().push({
      title,
      description,
      variant: 'success',
      durationMs: DEFAULT_DURATION_MS,
    }),
  error: (title: string, description?: string) =>
    useToastStore.getState().push({
      title,
      description,
      variant: 'danger',
      durationMs: 6000,
    }),
  info: (title: string, description?: string) =>
    useToastStore.getState().push({
      title,
      description,
      variant: 'default',
      durationMs: DEFAULT_DURATION_MS,
    }),
}
