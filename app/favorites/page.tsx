"use client";

import { motion } from "framer-motion";
import { AnimeGrid } from "@/components/anime/anime-grid";
import { AnimeCard } from "@/components/anime/anime-card";
import { EmptyState } from "@/components/shared/empty-state";
import { useFavoritesStore } from "@/lib/store/favorites-store";
import { useSelectModeStore } from "@/lib/store/select-mode-store";
import { useShallow } from "zustand/shallow";
import { FilterBar } from "@/components/metadata/filter-bar";
import { SelectModeBar } from "@/components/metadata/select-mode-bar";
import { useSearchParams } from "next/navigation";
import { useMemo, useCallback } from "react";

export default function FavoritesPage() {
  const favorites = useFavoritesStore(useShallow((s) => s.favorites));
  const favoriteList = useMemo(
    () => Object.values(favorites),
    [favorites],
  );
  const toggleSelectMode = useSelectModeStore((s) => s.toggleSelectMode);
  const searchParams = useSearchParams();

  const animeResults = useMemo(
    () =>
      favoriteList.map((fav) => ({
        id: fav.id,
        title: {
          romaji: fav.title,
          english: fav.title,
        },
        coverImage: {
          large: fav.coverImage,
          extraLarge: fav.coverImage,
        },
        averageScore: fav.averageScore,
        format: fav.format,
        episodes: fav.episodes,
        genres: fav.genres,
      })),
    [favoriteList],
  );

  // Apply URL search param filters
  const filteredResults = useMemo(() => {
    const tags = searchParams.get("tags")?.toLowerCase();
    const moods = searchParams.get("moods")?.toLowerCase();
    const ratingMin = searchParams.get("ratingMin");
    const ratingMax = searchParams.get("ratingMax");
    const format = searchParams.get("format");

    if (!tags && !moods && !ratingMin && !ratingMax && !format) {
      return animeResults;
    }

    return animeResults.filter((anime) => {
      // Filter by format
      if (format && format !== "all") {
        if (anime.format?.toUpperCase() !== format) return false;
      }

      // Filter by rating range
      if (ratingMin && (anime.averageScore ?? 0) < Number(ratingMin)) return false;
      if (ratingMax && (anime.averageScore ?? 0) > Number(ratingMax)) return false;

      return true;
    });
  }, [animeResults, searchParams]);

  const clearFilters = useCallback(() => {
    window.history.replaceState(null, "", "/favorites");
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold md:text-3xl">My Favorites</h1>
          <p className="text-muted-foreground">
            {filteredResults.length} of {favoriteList.length} saved anime
          </p>
        </div>
        {favoriteList.length > 0 && (
          <button
            onClick={() => {
              toggleSelectMode();
            }}
            className="rounded-md border px-3 py-1.5 text-sm transition-colors hover:bg-accent"
          >
            Select
          </button>
        )}
      </div>

      <FilterBar />

      {favoriteList.length === 0 ? (
        <EmptyState type="favorites" />
      ) : filteredResults.length === 0 ? (
        <EmptyState
          type="filter-empty"
          onClearFilters={clearFilters}
        />
      ) : (
        <AnimeGrid>
          {filteredResults.map((anime: any, i: number) => (
            <AnimeCard key={anime.id} anime={anime} index={i} />
          ))}
        </AnimeGrid>
      )}

      <SelectModeBar
        totalCount={animeResults.length}
        animeIds={animeResults.map((a) => a.id)}
      />
    </motion.div>
  );
}
