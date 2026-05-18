import { Badge } from "@/components/ui/badge";

interface AnimeGenresProps {
  genres?: string[];
  maxItems?: number; // default: show all, use for limiting display
}

export function AnimeGenres({ genres, maxItems }: AnimeGenresProps) {
  if (!genres || genres.length === 0) return null;

  const displayGenres = maxItems ? genres.slice(0, maxItems) : genres;
  const hasMore = maxItems && genres.length > maxItems;

  return (
    <div className="flex flex-wrap gap-2">
      {displayGenres.map((genre) => (
        <Badge
          key={genre}
          variant="outline"
          className="border-primary/30 bg-primary/5 text-sm hover:bg-primary/10"
        >
          {genre}
        </Badge>
      ))}
      {hasMore && (
        <Badge
          variant="secondary"
          className="bg-muted text-xs text-muted-foreground"
        >
          +{genres.length - maxItems} more
        </Badge>
      )}
    </div>
  );
}
