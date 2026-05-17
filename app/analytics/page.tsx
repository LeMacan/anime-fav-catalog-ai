"use client";

import { motion } from "framer-motion";
import { useFavoritesStore, StoredAnime } from "@/lib/store/favorites-store";
import { useMemo } from "react";
import { TrendingUp, Clock, Film, Calendar } from "lucide-react";

export default function AnalyticsPage() {
  const favorites = useFavoritesStore((s) => s.favorites);
  const favoriteList = useMemo(() => Object.values(favorites), [favorites]);

  const analytics = useMemo(() => {
    // Format breakdown
    const formatCounts: Record<string, number> = {};
    // Genre breakdown  
    const genreCounts: Record<string, number> = {};
    // Rating distribution
    const ratingBuckets = { "90+": 0, "80-89": 0, "70-79": 0, "60-69": 0, "<60": 0 };
    // Year distribution
    const yearCounts: Record<string, number> = {};
    
    let totalEpisodes = 0;
    let totalScore = 0;
    let scoredCount = 0;

    favoriteList.forEach((anime: StoredAnime) => {
      // Format
      if (anime.format) {
        formatCounts[anime.format] = (formatCounts[anime.format] || 0) + 1;
      }

      // Genres
      (anime.genres || []).forEach((g: string) => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      });

      // Rating
      if (anime.averageScore) {
        if (anime.averageScore >= 90) ratingBuckets["90+"]++;
        else if (anime.averageScore >= 80) ratingBuckets["80-89"]++;
        else if (anime.averageScore >= 70) ratingBuckets["70-79"]++;
        else if (anime.averageScore >= 60) ratingBuckets["60-69"]++;
        else ratingBuckets["<60"]++;
        totalScore += anime.averageScore;
        scoredCount++;
      }

      // Episodes
      if (anime.episodes) {
        totalEpisodes += anime.episodes;
      }
    });

    const avgScore = scoredCount > 0 ? (totalScore / scoredCount / 10).toFixed(1) : "N/A";
    const estimatedHours = Math.round(totalEpisodes * 23 / 60); // ~23 min per episode

    return {
      totalAnime: favoriteList.length,
      totalEpisodes,
      estimatedHours,
      avgScore,
      formatCounts,
      genreCounts,
      ratingBuckets,
    };
  }, [favoriteList]);

  const topGenres = Object.entries(analytics.genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-bold md:text-3xl">Analytics</h1>
        <p className="text-muted-foreground">
          Insights into your anime watching habits
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card/50 p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Film className="h-4 w-4" />
            Total Anime
          </div>
          <div className="mt-2 text-3xl font-bold">{analytics.totalAnime}</div>
        </div>
        <div className="rounded-lg border bg-card/50 p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            Watch Time
          </div>
          <div className="mt-2 text-3xl font-bold">{analytics.estimatedHours}h</div>
          <div className="text-xs text-muted-foreground">{analytics.totalEpisodes} episodes</div>
        </div>
        <div className="rounded-lg border bg-card/50 p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            Avg Score
          </div>
          <div className="mt-2 text-3xl font-bold">{analytics.avgScore}</div>
        </div>
        <div className="rounded-lg border bg-card/50 p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Top Genre
          </div>
          <div className="mt-2 text-xl font-bold">{topGenres[0]?.[0] || "N/A"}</div>
          <div className="text-xs text-muted-foreground">{topGenres[0]?.[1]} anime</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Genre Distribution */}
        <div className="rounded-lg border bg-card/50 p-6">
          <h3 className="mb-4 font-semibold">Genre Distribution</h3>
          <div className="space-y-2">
            {topGenres.map(([genre, count]) => (
              <div key={genre} className="flex items-center gap-3">
                <span className="w-24 truncate text-sm">{genre}</span>
                <div className="flex-1 rounded-full bg-muted h-2 overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${(count / analytics.totalAnime) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Format Distribution */}
        <div className="rounded-lg border bg-card/50 p-6">
          <h3 className="mb-4 font-semibold">Format Distribution</h3>
          <div className="space-y-2">
            {Object.entries(analytics.formatCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([format, count]) => (
                <div key={format} className="flex items-center gap-3">
                  <span className="w-24 truncate text-sm">{format}</span>
                  <div className="flex-1 rounded-full bg-muted h-2 overflow-hidden">
                    <div
                      className="h-full bg-secondary"
                      style={{ width: `${(count / analytics.totalAnime) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">{count}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="rounded-lg border bg-card/50 p-6">
          <h3 className="mb-4 font-semibold">Rating Distribution</h3>
          <div className="grid grid-cols-5 gap-2 text-center">
            {Object.entries(analytics.ratingBuckets).map(([range, count]) => (
              <div key={range} className="space-y-1">
                <div className="rounded bg-muted py-2 font-bold">{count}</div>
                <div className="text-xs text-muted-foreground">{range}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Watch Time Estimate */}
        <div className="rounded-lg border bg-card/50 p-6">
          <h3 className="mb-4 font-semibold">Estimated Watch Time</h3>
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">{analytics.estimatedHours}h</div>
              <div className="text-sm text-muted-foreground">
                ~{Math.round(analytics.estimatedHours / 24)} days of anime
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}