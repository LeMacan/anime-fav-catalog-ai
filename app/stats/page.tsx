"use client";

import { motion } from "framer-motion";
import { useFavoritesStore, StoredAnime } from "@/lib/store/favorites-store";
import { useCollectionsStore } from "@/lib/store/collections-store";
import { useMemo } from "react";
import { useShallow } from "zustand/shallow";
import { StatsCard } from "@/components/metadata/stats-card";

export default function StatsPage() {
  const favorites = useFavoritesStore(useShallow((s) => s.favorites));
  const collections = useCollectionsStore(useShallow((s) => s.collections));
  const favoriteList = useMemo(() => Object.values(favorites), [favorites]);

  const stats = useMemo(() => {
    const formatCounts: Record<string, number> = {};
    const genreCounts: Record<string, number> = {};
    const ratingBuckets = { "90+": 0, "80-89": 0, "70-79": 0, "60-69": 0, "<60": 0 };
    const yearCounts: Record<string, number> = {};
    let totalEpisodes = 0;
    let totalScore = 0;
    let scoredCount = 0;

    favoriteList.forEach((anime: StoredAnime) => {
      if (anime.format) {
        formatCounts[anime.format] = (formatCounts[anime.format] || 0) + 1;
      }
      (anime.genres || []).forEach((g: string) => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      });
      if (anime.averageScore) {
        if (anime.averageScore >= 90) ratingBuckets["90+"]++;
        else if (anime.averageScore >= 80) ratingBuckets["80-89"]++;
        else if (anime.averageScore >= 70) ratingBuckets["70-79"]++;
        else if (anime.averageScore >= 60) ratingBuckets["60-69"]++;
        else ratingBuckets["<60"]++;
        totalScore += anime.averageScore;
        scoredCount++;
      }
      if (anime.episodes) {
        totalEpisodes += anime.episodes;
      }
    });

    return {
      totalFavorites: favoriteList.length,
      totalCollections: collections.length,
      totalEpisodes,
      avgScore: scoredCount > 0 ? Math.round(totalScore / scoredCount / 10 * 10) / 10 : 0,
      formatBreakdown: Object.entries(formatCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([format, count]) => ({ format, count })),
      genreBreakdown: Object.entries(genreCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([genre, count]) => ({ genre, count })),
      ratingDistribution: ratingBuckets,
      yearBreakdown: Object.entries(yearCounts)
        .sort((a, b) => b[0].localeCompare(a[0]))
        .map(([year, count]) => ({ year, count })),
    };
  }, [favoriteList, collections]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-bold md:text-3xl">Statistics</h1>
        <p className="text-muted-foreground">
          Insights from your anime collection
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Favorites"
          data={{ count: stats.totalFavorites }}
        />
        <StatsCard
          title="Collections"
          data={{ count: stats.totalCollections }}
        />
        <StatsCard
          title="Total Episodes"
          data={{ episodes: stats.totalEpisodes }}
        />
        <StatsCard
          title="Avg Score"
          data={{ score: stats.avgScore > 0 ? stats.avgScore : 0 }}
        />
      </div>

      {stats.formatBreakdown.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Format Breakdown</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {stats.formatBreakdown.map(({ format, count }) => (
              <div key={format} className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm">{format}</span>
                <span className="text-sm font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.genreBreakdown.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Top Genres</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stats.genreBreakdown.map(({ genre, count }) => (
              <div key={genre} className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm">{genre}</span>
                <span className="text-sm font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {favoriteList.length === 0 && (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            Add some favorites to see your statistics
          </p>
        </div>
      )}
    </motion.div>
  );
}