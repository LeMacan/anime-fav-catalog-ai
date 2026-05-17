import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export default function FavoritesLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
      <LoadingSkeleton count={6} />
    </div>
  );
}
