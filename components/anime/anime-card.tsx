import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/favorites/favorite-button";
import { useSelectModeStore } from "@/lib/store/select-mode-store";
import type { AnimeSearchResult } from "@/lib/anilist/types";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AnimeCardProps {
  anime: AnimeSearchResult;
  index?: number;
}

export function AnimeCard({ anime, index = 0 }: AnimeCardProps) {
  const title = anime.title?.english ?? anime.title?.romaji ?? "Unknown";
  const coverImage = anime.coverImage?.extraLarge ?? anime.coverImage?.large;
  const selectEnabled = useSelectModeStore((s) => s.isEnabled);
  const selectedIds = useSelectModeStore((s) => s.selectedIds);
  const toggleSelect = useSelectModeStore((s) => s.toggleSelect);
  const isSelected = selectedIds.has(anime.id);

  const cardContent = (
    <Card
      className={cn(
        "group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1",
        selectEnabled && isSelected && "border-primary ring-2 ring-primary",
        selectEnabled && "cursor-pointer",
      )}
      {...(selectEnabled ? { onClick: () => toggleSelect(anime.id) } : {})}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        {selectEnabled && (
          <div className="absolute top-2 right-auto left-2 z-10">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleSelect(anime.id)}
              className="h-5 w-5 cursor-pointer rounded border-2 border-white/60 bg-black/30"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <span className="text-muted-foreground">No Image</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <FavoriteButton
            animeId={anime.id}
            anime={{
              id: anime.id,
              title,
              coverImage: coverImage ?? "",
              averageScore: anime.averageScore,
              format: anime.format,
              episodes: anime.episodes,
            }}
          />
        </div>
        {anime.averageScore && (
          <div className="absolute top-2 left-2">
            <Badge
              variant="secondary"
              className="bg-black/60 text-white backdrop-blur-sm"
            >
              ★ {anime.averageScore / 10}
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-3">
        <h3 className="line-clamp-1 text-sm font-medium">{title}</h3>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          {anime.format && <span>{anime.format}</span>}
          {anime.episodes && (
            <>
              <span>•</span>
              <span>{anime.episodes} eps</span>
            </>
          )}
          {anime.seasonYear && (
            <>
              <span>•</span>
              <span>{anime.seasonYear}</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      layout
    >
      {selectEnabled ? (
        cardContent
      ) : (
        <Link href={`/anime/${anime.id}`}>{cardContent}</Link>
      )}
    </motion.div>
  );
}
