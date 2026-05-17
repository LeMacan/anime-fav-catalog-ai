import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export default function SearchLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-64 animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="h-12 animate-pulse rounded-lg bg-muted" />
      <LoadingSkeleton count={12} />
    </div>
  );
}
