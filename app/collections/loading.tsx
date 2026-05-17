import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export default function CollectionsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="h-10 w-36 animate-pulse rounded-lg bg-muted" />
      </div>
      <LoadingSkeleton count={3} />
    </div>
  );
}
