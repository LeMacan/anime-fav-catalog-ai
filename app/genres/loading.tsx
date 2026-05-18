export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-48 animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-24 w-full animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    </div>
  );
}