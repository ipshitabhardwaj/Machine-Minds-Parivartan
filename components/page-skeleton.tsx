/** Instant placeholder shown while a page's data loads, so clicks always respond. */
export function PageSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div
      className="max-w-6xl mx-auto px-4 sm:px-6 py-8"
      role="status"
      aria-label="Loading"
    >
      <div className="h-8 w-56 bg-[var(--bg-card)] animate-pulse mb-3" />
      <div className="h-4 w-80 max-w-full bg-[var(--bg-card)] animate-pulse mb-8" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cards }).map((_, i) => (
          <div key={i} className="h-32 bg-[var(--bg-card)] animate-pulse" />
        ))}
      </div>
    </div>
  )
}
