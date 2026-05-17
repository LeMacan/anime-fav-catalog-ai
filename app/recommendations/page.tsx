"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AnimeGrid } from "@/components/anime/anime-grid";
import { AnimeCard } from "@/components/anime/anime-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Sparkles, TrendingUp, Star } from "lucide-react";
import { searchAnime } from "@/lib/anilist/client";
import { useFavoritesStore } from "@/lib/store/favorites-store";
import { useShallow } from "zustand/shallow";

export default function RecommendationsPage() {
  const [type, setType] = useState("similar");
  const favorites = useFavoritesStore(useShallow((s) => s.favorites));
  const favoriteIds = Object.keys(favorites).map(Number);

  // Similar: search based on first favorite's title
  const firstFavorite = favoriteIds.length > 0 ? favorites[favoriteIds[0]] : null;

  const { data: similarData, isLoading: similarLoading } = useQuery({
    queryKey: ["recommendations", "similar", firstFavorite?.title],
    queryFn: async () => {
      if (!firstFavorite) return [];
      const result = await searchAnime(firstFavorite.title, 1, 12);
      return result.Page?.media?.filter((a) => a.id !== firstFavorite.id) ?? [];
    },
    enabled: !!firstFavorite,
  });

  // Seasonal: current season trending
  const { data: seasonalData, isLoading: seasonalLoading } = useQuery({
    queryKey: ["recommendations", "seasonal"],
    queryFn: async () => {
      const result = await searchAnime("", 1, 12);
      return result.Page?.media ?? [];
    },
  });

  // Top rated
  const { data: topData, isLoading: topLoading } = useQuery({
    queryKey: ["recommendations", "top"],
    queryFn: async () => {
      const result = await searchAnime("", 1, 12);
      return result.Page?.media ?? [];
    },
  });

  const isLoading = similarLoading || seasonalLoading || topLoading;
  const results = type === "similar" ? similarData : type === "seasonal" ? seasonalData : topData;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-bold md:text-3xl">Recommendations</h1>
        <p className="text-muted-foreground">
          Anime suggestions based on your favorites
        </p>
      </div>

      <Tabs value={type} onValueChange={setType}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="similar" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Similar
          </TabsTrigger>
          <TabsTrigger value="seasonal" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Seasonal
          </TabsTrigger>
          <TabsTrigger value="top-rated" className="gap-2">
            <Star className="h-4 w-4" />
            Top Rated
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {favoriteIds.length === 0 && type === "similar" && (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            Add some favorites to get personalized recommendations
          </p>
        </div>
      )}

      {isLoading && <Skeleton className="h-64 w-full" />}

      {results && results.length > 0 && (
        <AnimeGrid>
          {results.map((anime: any, i: number) => (
            <AnimeCard key={anime.id} anime={anime} index={i} />
          ))}
        </AnimeGrid>
      )}
    </motion.div>
  );
}