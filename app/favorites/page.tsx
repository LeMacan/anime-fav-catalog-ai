"use client";

import { useState, useMemo, useCallback } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown, ArrowUpAZ, ArrowDownAZ, Star, Calendar } from "lucide-react";

type SortOption = "dateAdded" | "title" | "score";

export default function FavoritesPage() {
  const favorites = useFavoritesStore(useShallow((s) => s.favorites));
  const favoriteList = useMemo(
    () => Object.values(favorites),
    [favorites],
  );
  const toggleSelectMode = useSelectModeStore((s) => s.toggleSelectMode);
  const searchParams = useSearchParams();
  const [sortBy, setSortBy] = useState<SortOption>("dateAdded");

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
        dateAdded: (fav as any).dateAdded ?? 0,
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

    let results = animeResults;

    if (tags || moods || ratingMin || ratingMax || (format && format !== "all")) {
      results = animeResults.filter((anime) => {
        if (format && format !== "all") {
          if (anime.format?.toUpperCase() !== format) return false;
        }
        if (ratingMin && (anime.averageScore ?? 0) < Number(ratingMin)) return false;
        if (ratingMax && (anime.averageScore ?? 0) > Number(ratingMax)) return false;
        return true;
      });
    }

    // Apply sorting
    const sorted = [...results].sort((a, b) => {
      switch (sortBy) {
        case "title":
          return (a.title.english ?? a.title.romaji ?? "").localeCompare(
            b.title.english ?? b.title.romaji ?? ""
          );
        case "score":
          return (b.averageScore ?? 0) - (a.averageScore ?? 0);
        case "dateAdded":
        default:
          return (b.dateAdded ?? 0) - (a.dateAdded ?? 0);
      }
    });

    return sorted;
  }, [animeResults, searchParams, sortBy]);

  const clearFilters = useCallback(() => {
    window.history.replaceState(null, "", "/favorites");
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold md:text-3xl">My Favorites</h1>
          <p className="text-muted-foreground">
            {filteredResults.length} of {favoriteList.length} saved anime
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Sort controls */}
          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dateAdded">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date Added
                  </span>
                </SelectItem>
                <SelectItem value="title">
                  <span className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    Title A-Z
                  </span>
                </SelectItem>
                <SelectItem value="score">
                  <span className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Score High-Low
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
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
      </div>

      <FilterBar />

      {favoriteList.length === 0 ? (
        <EmptyState type="favorites" />
      ) : filteredResults.length === 0 ? (
        <EmptyState type="filter-empty" onClearFilters={clearFilters} />
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