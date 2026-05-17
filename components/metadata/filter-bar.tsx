"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const ANIME_FORMATS = [
  "TV",
  "TV_SHORT",
  "MOVIE",
  "SPECIAL",
  "OVA",
  "ONA",
  "MUSIC",
] as const;

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isExpanded, setIsExpanded] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // Filter state from URL
  const [tagMode, setTagMode] = useState<"include" | "all" | "exclude">(
    (searchParams.get("tagMode") as "include" | "all" | "exclude") || "include",
  );
  const [tags, setTags] = useState(searchParams.get("tags") || "");
  const [moods, setMoods] = useState(searchParams.get("moods") || "");
  const [ratingMin, setRatingMin] = useState(searchParams.get("ratingMin") || "");
  const [ratingMax, setRatingMax] = useState(searchParams.get("ratingMax") || "");
  const [format, setFormat] = useState(searchParams.get("format") || "");

  // Build URL with debounce
  const updateUrl = useCallback(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      const params = new URLSearchParams();

      if (tagMode !== "include") params.set("tagMode", tagMode);
      if (tags) params.set("tags", tags);
      if (moods) params.set("moods", moods);
      if (ratingMin) params.set("ratingMin", ratingMin);
      if (ratingMax) params.set("ratingMax", ratingMax);
      if (format) params.set("format", format);

      const queryString = params.toString();
      router.push(queryString ? `?${queryString}` : "/favorites", { scroll: false });
    }, 300);

    setDebounceTimer(timer);
  }, [tagMode, tags, moods, ratingMin, ratingMax, format, router, debounceTimer]);

  // Auto-update on state change
  useEffect(() => {
    updateUrl();
  }, [tagMode, tags, moods, ratingMin, ratingMax, format]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [debounceTimer]);

  // Check if any filter is active
  const hasActiveFilters = useMemo(() => {
    return (
      tagMode !== "include" ||
      tags ||
      moods ||
      ratingMin ||
      ratingMax ||
      format
    );
  }, [tagMode, tags, moods, ratingMin, ratingMax, format]);

  const clearFilters = useCallback(() => {
    setTagMode("include");
    setTags("");
    setMoods("");
    setRatingMin("");
    setRatingMax("");
    setFormat("");
  }, []);

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      {/* Header with expand/collapse */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-2"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
          Filters
          {hasActiveFilters && (
            <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              Active
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-1 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Expanded filter options */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-4 overflow-hidden"
          >
            {/* Tag mode and tags */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tag Mode</label>
                <Select
                  value={tagMode}
                  onValueChange={(v: "include" | "all" | "exclude") => setTagMode(v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="include">Include Any</SelectItem>
                    <SelectItem value="all">Include All</SelectItem>
                    <SelectItem value="exclude">Exclude</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tags (comma-separated)</label>
                <Input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g., action, sci-fi"
                />
              </div>
            </div>

            {/* Moods */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Moods (comma-separated)</label>
              <Input
                value={moods}
                onChange={(e) => setMoods(e.target.value)}
                placeholder="e.g., Happy, Sad"
              />
            </div>

            {/* Rating range */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Min Rating (0-100)</label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={ratingMin}
                  onChange={(e) => setRatingMin(e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Max Rating (0-100)</label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={ratingMax}
                  onChange={(e) => setRatingMax(e.target.value)}
                  placeholder="100"
                />
              </div>
            </div>

            {/* Format */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Format</label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="All formats" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Formats</SelectItem>
                  {ANIME_FORMATS.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active filter summary (collapsed) */}
      {!isExpanded && hasActiveFilters && (
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          {tags && <span>Tags: {tags}</span>}
          {moods && <span>Moods: {moods}</span>}
          {ratingMin && ratingMax && (
            <span>
              Rating: {ratingMin}-{ratingMax}
            </span>
          )}
          {format && <span>Format: {format}</span>}
        </div>
      )}
    </div>
  );
}