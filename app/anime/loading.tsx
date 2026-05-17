import { Skeleton } from "@/components/ui/skeleton";

export default function AnimeDetailLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[400px] w-full rounded-xl" />
      <div className="space-y-4 px-4 md:px-8">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-5 w-1/3" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}