/**
 * Dashboard Factory client state.
 *
 * Tiny Zustand store + persist middleware so the same browser remembers
 * which datasets the user has already profiled. This prevents the
 * streaming animation from auto-replaying every time the user back-
 * navigates from /dashboard/[slug] to /generate/[slug].
 *
 * Anything URL-derivable (current slug, current route) is NOT in the
 * store. Read it from useParams() / usePathname() instead.
 */

'use client'

import { useEffect, useState } from 'react'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface DashboardStoreState {
  /** Map of slug → has the user completed the profiling stream once? */
  profilingComplete: Record<string, boolean>
}

interface DashboardStoreActions {
  markProfilingComplete: (slug: string) => void
  resetProfiling: (slug: string) => void
}

type DashboardStore = DashboardStoreState & DashboardStoreActions

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      profilingComplete: {},
      markProfilingComplete: (slug) =>
        set((state) => ({
          profilingComplete: { ...state.profilingComplete, [slug]: true },
        })),
      resetProfiling: (slug) =>
        set((state) => {
          const next = { ...state.profilingComplete }
          delete next[slug]
          return { profilingComplete: next }
        }),
    }),
    {
      name: 'dashboard-factory-state',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
)

/**
 * Returns true after Zustand has hydrated from localStorage.
 * Use this to gate UI that depends on persisted state to avoid SSR /
 * client mismatch flashes.
 *
 *   const hydrated = useStoreHydrated()
 *   if (!hydrated) return <Loading />
 *   // safe to read store values
 */
export function useStoreHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    // Account for two cases:
    // 1. Hydration already finished by the time this effect runs
    // 2. Hydration still in flight — subscribe and flip when done
    if (useDashboardStore.persist.hasHydrated()) {
      setHydrated(true)
      return
    }
    const unsub = useDashboardStore.persist.onFinishHydration(() => setHydrated(true))
    return unsub
  }, [])

  return hydrated
}
