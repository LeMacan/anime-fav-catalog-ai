import { Badge } from "@/components/ui/badge";

interface AnimeGenresProps {
  genres?: string[];
}

export function AnimeGenres({ genres }: AnimeGenresProps) {
  if (!genres || genres.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {genres.map((genre) => (
        <Badge
          key={genre}
          variant="outline"
          className="border-primary/30 bg-primary/5 text-sm hover:bg-primary/10"
        >
          {genre}
        </Badge>
      ))}
    </div>
  );
}
