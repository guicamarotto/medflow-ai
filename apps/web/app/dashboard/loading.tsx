export default function DashboardLoading() {
  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="h-4 w-48 bg-muted animate-pulse rounded" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-4 space-y-3">
            <div className="flex justify-between">
              <div className="space-y-1.5">
                <div className="h-3.5 w-28 bg-muted animate-pulse rounded" />
                <div className="h-3 w-36 bg-muted animate-pulse rounded" />
              </div>
              <div className="h-5 w-16 bg-muted animate-pulse rounded-full" />
            </div>
            <div className="h-3 w-full bg-muted animate-pulse rounded" />
            <div className="h-3 w-4/5 bg-muted animate-pulse rounded" />
            <div className="flex gap-1">
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
