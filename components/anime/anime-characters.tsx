import type { AnimeDetail } from "@/lib/anilist/types";

interface AnimeCharactersProps {
  characters?: AnimeDetail["characters"];
}

export function AnimeCharacters({ characters }: AnimeCharactersProps) {
  if (!characters?.nodes || characters.nodes.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
      {characters.nodes.map((char) => (
        <div
          key={char.id}
          className="flex flex-col items-center gap-2 rounded-lg bg-card/50 p-3 backdrop-blur-sm"
        >
          {char.image?.large ? (
            <img
              src={char.image.large}
              alt={char.name.full}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-muted" />
          )}
          <p className="text-center text-xs font-medium line-clamp-2">
            {char.name.full}
          </p>
        </div>
      ))}
    </div>
  );
}
