"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { SearchBar } from "@/components/shared/search-bar";
import { AnimeGrid } from "@/components/anime/anime-grid";
import { AnimeCard } from "@/components/anime/anime-card";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { Sparkles } from "lucide-react";
import { searchAnime } from "@/lib/anilist/client";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["anime-search", query, page],
    queryFn: async () => {
      if (!query.trim()) return null;
      return await searchAnime(query, page, 24);
    },
    enabled: query.trim().length > 0,
    placeholderData: (prev) => prev,
  });

  const handleSearch = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  }, []);

  const results = data?.Page?.media ?? [];
  const pageInfo = data?.Page?.pageInfo;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-bold md:text-3xl">Search Anime</h1>
        <p className="text-muted-foreground">
          Find your favorite anime from the AniList database
        </p>
      </div>

      <SearchBar onSearch={handleSearch} />

      {!query.trim() && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 py-16"
        >
          <Sparkles className="h-12 w-12 text-primary/50" />
          <p className="text-lg text-muted-foreground">
            Type an anime title to start searching
          </p>
        </motion.div>
      )}

      {isLoading && <LoadingSkeleton count={12} />}

      {isError && (
        <div className="flex flex-col items-center gap-4 py-16">
          <p className="text-destructive">
            {error instanceof Error ? error.message : "Failed to search"}
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {results.length > 0 && (
        <>
          <AnimeGrid>
            {results.map((anime: any, i: number) => (
              <AnimeCard key={anime.id} anime={anime} index={i} />
            ))}
          </AnimeGrid>

          {pageInfo?.hasNextPage && (
            <div className="flex justify-center py-8">
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={isLoading}
              >
                Load More
              </Button>
            </div>
          )}
        </>
      )}

      {!isLoading && query.trim() && results.length === 0 && (
        <EmptyState
          type="search"
          message={`No results found for "${query}". Try a different search term.`}
          actionLabel="Clear Search"
          actionHref="/search"
        />
      )}
    </motion.div>
  );
}
