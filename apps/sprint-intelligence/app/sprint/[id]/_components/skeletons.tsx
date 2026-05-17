/**
 * Skeleton placeholders for the interactive panels on /sprint/[id].
 *
 * These mostly fill the brief window between page paint and React
 * client hydration. The data is baked at build time so a real loading
 * state is rare, but the skeleton keeps the layout from flashing empty
 * when the URL search param consumers hydrate after the rest of the
 * page renders. Each skeleton uses Tailwind animate-pulse to soften
 * the wait.
 */

const SKELETON_BAR = 'rounded-sm bg-base-700'

export function BriefSkeleton() {
  return (
    <div className="space-y-5 animate-pulse" aria-hidden="true">
      <div className="rounded-lg border border-surface-border bg-base-800/40 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className={`h-3 w-40 ${SKELETON_BAR}`} />
          <div className={`h-3 w-12 ${SKELETON_BAR}`} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className="h-6 w-6 rounded-full bg-base-700" />
              <div className={`h-3 flex-1 ${SKELETON_BAR}`} />
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2 rounded-lg border border-surface-border bg-surface p-5">
        <div className={`h-4 w-1/3 ${SKELETON_BAR}`} />
        <div className={`h-3 w-full ${SKELETON_BAR}`} />
        <div className={`h-3 w-11/12 ${SKELETON_BAR}`} />
        <div className={`h-3 w-3/4 ${SKELETON_BAR}`} />
        <div className={`h-3 w-5/6 ${SKELETON_BAR}`} />
      </div>
    </div>
  )
}

export function TeamWorkloadSkeleton() {
  return (
    <div className="flex flex-col gap-3 animate-pulse" aria-hidden="true">
      <div className="flex items-center justify-between">
        <div className={`h-2.5 w-48 ${SKELETON_BAR}`} />
        <div className={`h-2.5 w-32 ${SKELETON_BAR}`} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="flex items-center gap-3 py-1.5 px-2">
            <div className={`h-3 w-20 ${SKELETON_BAR}`} />
            <div className={`h-2 w-8 ${SKELETON_BAR}`} />
            <div className={`flex-1 h-1.5 ${SKELETON_BAR}`} />
            <div className={`h-2 w-10 ${SKELETON_BAR}`} />
          </div>
        ))}
      </div>
    </div>
  )
}

