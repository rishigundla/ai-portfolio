/**
 * Streaming Suspense fallback for /dashboard/[slug].
 *
 * Next.js 15 automatically wraps this in a <Suspense> boundary at the route
 * level, so it shows during initial nav (e.g. clicking from the gallery)
 * and disappears as soon as the server-rendered page is ready to stream.
 *
 * Mirror the live layout shape so the transition feels like a paint refresh
 * rather than a destination change.
 */

export default function DashboardLoading() {
  return (
    <div className="section-container py-8 lg:py-10">
      {/* Header skeleton */}
      <div className="space-y-3 max-w-3xl mb-8">
        <div className="h-3 w-32 bg-surface-border rounded animate-pulse" />
        <div className="h-9 w-64 bg-surface-border rounded animate-pulse" />
        <div className="h-4 w-96 bg-surface-border rounded animate-pulse" />
      </div>

      {/* Filter bar skeleton */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="h-9 w-72 bg-surface-border rounded-md animate-pulse" />
        <div className="h-9 w-44 bg-surface-border rounded-md animate-pulse" />
        <div className="h-9 w-40 bg-surface-border rounded-md animate-pulse" />
      </div>

      {/* Counter row skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-3 w-48 bg-surface-border rounded animate-pulse" />
        <div className="h-9 w-32 bg-surface-border rounded-md animate-pulse" />
      </div>

      {/* KPI strip skeleton — 4 up */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-surface-border bg-surface p-5 space-y-3 animate-pulse"
          >
            <div className="h-3 w-24 bg-surface-border rounded" />
            <div className="h-8 w-32 bg-surface-border rounded" />
            <div className="h-3 w-16 bg-surface-border rounded" />
          </div>
        ))}
      </div>

      {/* Chart grid skeleton — 2x2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <ChartSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

function ChartSkeleton() {
  return (
    <div className="rounded-xl border border-surface-border bg-surface p-5 min-h-[240px] flex flex-col gap-4">
      <div className="space-y-2">
        <div className="h-4 w-40 bg-surface-border rounded animate-pulse" />
        <div className="h-3 w-24 bg-surface-border rounded animate-pulse" />
      </div>
      <div className="flex-1 min-h-[160px] flex items-end gap-2 px-2 animate-pulse">
        {[40, 65, 45, 80, 55, 90, 70, 50].map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-surface-border rounded-t"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  )
}
