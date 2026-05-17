"use client";

import { useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useMoodsStore } from "@/lib/store/moods-store";
import { useShallow } from "zustand/shallow";
import { PREDEFINED_MOODS } from "@/lib/types/metadata";

interface MoodSelectorProps {
  animeId: number;
}

export function MoodSelector({ animeId }: MoodSelectorProps) {
  const moods = useMoodsStore(useShallow((s) => s.moods[animeId] || []));
  const addMood = useMoodsStore((s) => s.addMood);
  const removeMood = useMoodsStore((s) => s.removeMood);
  const loading = useMoodsStore(useShallow((s) => s.loading[animeId]));
  const [customMood, setCustomMood] = useState("");

  const currentMoodSet = new Set(moods.map((m) => m.mood));

  const handleToggleMood = useCallback(
    async (mood: string) => {
      const existing = moods.find((m) => m.mood === mood);
      if (existing) {
        await removeMood(animeId, existing.id);
      } else {
        await addMood(animeId, mood, false);
      }
    },
    [animeId, moods, addMood, removeMood],
  );

  const handleAddCustomMood = useCallback(async () => {
    const trimmed = customMood.trim();
    if (!trimmed) return;

    await addMood(animeId, trimmed, true);
    setCustomMood("");
  }, [animeId, customMood, addMood]);

  const handleCustomMoodKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddCustomMood();
      }
    },
    [handleAddCustomMood],
  );

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading moods...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Current moods */}
      {moods.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {moods.map((mood) => (
            <Badge
              key={mood.id}
              variant="secondary"
              className="flex items-center gap-1 pr-1"
            >
              {mood.mood}
              {mood.isCustom && (
                <span className="text-[10px] text-muted-foreground">(custom)</span>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:text-destructive"
                onClick={() => removeMood(animeId, mood.id)}
                title="Remove"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Predefined moods grid */}
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
        {PREDEFINED_MOODS.map((mood) => {
          const isSelected = currentMoodSet.has(mood);
          return (
            <button
              key={mood}
              onClick={() => handleToggleMood(mood)}
              className={`rounded-full px-3 py-1.5 text-xs transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {mood}
            </button>
          );
        })}
      </div>

      {/* Custom mood input */}
      <div className="flex gap-2">
        <Input
          value={customMood}
          onChange={(e) => setCustomMood(e.target.value)}
          onKeyDown={handleCustomMoodKeyDown}
          placeholder="Add custom mood..."
          className="flex-1"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddCustomMood}
          disabled={!customMood.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}