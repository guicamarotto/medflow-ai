export default function PatientDetailLoading() {
  return (
    <div className="flex-1 p-6">
      <div className="max-w-5xl mx-auto grid gap-6 lg:grid-cols-3 animate-pulse">
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-xl border bg-card p-4 space-y-3">
            <div className="h-4 w-36 bg-muted rounded" />
            <div className="h-3 w-full bg-muted rounded" />
            <div className="h-3 w-4/5 bg-muted rounded" />
          </div>
        </div>
        <div className="lg:col-span-2 rounded-xl border bg-card h-96" />
      </div>
    </div>
  )
}
