"use client";

import { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimeGrid } from "@/components/anime/anime-grid";
import { AnimeCard } from "@/components/anime/anime-card";
import { EmptyState } from "@/components/shared/empty-state";
import { useFavoritesStore } from "@/lib/store/favorites-store";
import { useShallow } from "zustand/shallow";
import { X } from "lucide-react";

interface GenreCount {
  name: string;
  count: number;
}

export default function GenresPage() {
  const searchParams = useSearchParams();
  const genreParam = searchParams.get("genre");

  const favorites = useFavoritesStore(useShallow((s) => s.favorites));
  const favoritesList = Object.values(favorites);

  // Derive genres from favorites with counts
  const genreCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    favoritesList.forEach((anime) => {
      if (anime.genres && anime.genres.length > 0) {
        anime.genres.forEach((genre) => {
          counts[genre] = (counts[genre] || 0) + 1;
        });
      }
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count); // Sort by count descending
  }, [favoritesList]);

  // Filter and transform anime when genre param exists
  const filteredAnime = useMemo(() => {
    if (!genreParam) return [];
    const decodedGenre = decodeURIComponent(genreParam);
    return favoritesList
      .filter((anime) => anime.genres?.includes(decodedGenre))
      .map((fav) => ({
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
      }));
  }, [favoritesList, genreParam]);

  // URL management using replaceState for static export compatibility
  const [currentGenre, setCurrentGenre] = useState<string | null>(genreParam);

  useEffect(() => {
    setCurrentGenre(genreParam);
  }, [genreParam]);

  const handleGenreClick = (genreName: string) => {
    const encoded = encodeURIComponent(genreName);
    window.history.replaceState(null, "", `?genre=${encoded}`);
    setCurrentGenre(genreName);
  };

  const handleClearFilter = () => {
    window.history.replaceState(null, "", "/genres");
    setCurrentGenre(null);
  };

  // Handle invalid genre param
  const isValidGenre = genreParam
    ? genreCounts.some(
        (g) => g.name === decodeURIComponent(genreParam)
      )
    : true;

  // Edge case: invalid genre param
  if (genreParam && !isValidGenre) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold md:text-3xl">Genres</h1>
            <p className="text-muted-foreground">
              {genreCounts.length} genres from {favoritesList.length} favorites
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-12">
          <p className="mb-4 text-muted-foreground">
            Invalid genre: "{decodeURIComponent(genreParam)}"
          </p>
          <Button onClick={handleClearFilter} variant="outline">
            View All Genres
          </Button>
        </div>
      </motion.div>
    );
  }

  // Show filtered anime when genre is selected
  if (currentGenre) {
    const decodedGenre = decodeURIComponent(currentGenre);
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold md:text-3xl">{decodedGenre}</h1>
            <p className="text-muted-foreground">
              {filteredAnime.length} anime in this genre
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilter}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Clear Filter
          </Button>
        </div>

        {filteredAnime.length === 0 ? (
          <EmptyState
            type="filter-empty"
            message={`No anime found in ${decodedGenre} genre`}
          />
        ) : (
          <AnimeGrid>
            {filteredAnime.map((anime, index) => (
              <AnimeCard key={anime.id} anime={anime} index={index} />
            ))}
          </AnimeGrid>
        )}
      </motion.div>
    );
  }

  // Show genre cards grid
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold md:text-3xl">Genres</h1>
          <p className="text-muted-foreground">
            {genreCounts.length} genres from {favoritesList.length} favorites
          </p>
        </div>
      </div>

      {favoritesList.length === 0 ? (
        <EmptyState
          type="favorites"
          message="Add some favorites to see genre statistics!"
        />
      ) : genreCounts.length === 0 ? (
        <EmptyState
          type="favorites"
          message="None of your favorites have genres yet."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {genreCounts.map((genre, index) => (
            <motion.div
              key={genre.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Link href="#" onClick={() => handleGenreClick(genre.name)}>
                <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                  <CardContent className="flex h-24 flex-col items-center justify-center p-4">
                    <span className="text-lg font-semibold">{genre.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {genre.count} {genre.count === 1 ? "anime" : "anime"}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}