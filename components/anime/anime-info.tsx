import type { AnimeDetail } from "@/lib/anilist/types";

interface AnimeInfoProps {
  anime: AnimeDetail;
}

export function AnimeInfo({ anime }: AnimeInfoProps) {
  const infoRows = [
    { label: "Format", value: anime.format },
    { label: "Episodes", value: anime.episodes?.toString() },
    { label: "Duration", value: anime.duration ? `${anime.duration} min` : null },
    { label: "Status", value: anime.status },
    { label: "Season", value: anime.season },
    { label: "Year", value: anime.seasonYear?.toString() },
    { label: "Score", value: anime.averageScore ? `${anime.averageScore / 10}/10` : null },
    { label: "Popularity", value: anime.popularity?.toLocaleString() },
    { label: "Source", value: anime.source },
    { label: "Studio", value: anime.studios?.nodes?.[0]?.name },
  ].filter((row) => row.value);

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
      {infoRows.map((row) => (
        <div
          key={row.label}
          className="rounded-lg bg-card/50 p-3 backdrop-blur-sm"
        >
          <p className="text-xs text-muted-foreground">{row.label}</p>
          <p className="mt-0.5 text-sm font-medium">{row.value}</p>
        </div>
      ))}
    </div>
  );
}
