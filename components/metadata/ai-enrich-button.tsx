"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useTagsStore } from "@/lib/store/tags-store";
import { useMoodsStore } from "@/lib/store/moods-store";

interface AiEnrichButtonProps {
  animeId: number;
  title: string;
  description?: string | null;
}

export function AiEnrichButton({
  animeId,
  title,
  description,
}: AiEnrichButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const addTag = useTagsStore((s) => s.addTag);
  const addMood = useMoodsStore((s) => s.addMood);

  // Check environment flag
  const isEnabled = process.env.NEXT_PUBLIC_ENABLE_AI_SUGGESTIONS === "true";

  // Check daily limit from localStorage
  const checkDailyLimit = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    const usage = localStorage.getItem("ai-usage-date");
    const count = localStorage.getItem("ai-usage-count");

    if (usage === today) {
      const dailyCount = parseInt(count || "0", 10);
      // Daily limit: 10 enrichments
      return dailyCount >= 10;
    }
    return false;
  }, []);

  const incrementUsage = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    const current = parseInt(localStorage.getItem("ai-usage-count") || "0", 10);
    localStorage.setItem("ai-usage-date", today);
    localStorage.setItem("ai-usage-count", String(current + 1));
  }, []);

  const isLimited = checkDailyLimit();

  const handleEnrich = useCallback(async () => {
    if (!isEnabled || isLimited) {
      toast.error(
        isLimited
          ? "Daily AI limit reached (10/day)"
          : "AI suggestions disabled",
      );
      return;
    }

    setIsLoading(true);
    setProgress("Analyzing...");

    try {
      // Get deviceId for analytics
      const deviceId = localStorage.getItem("deviceId") || 
        (() => {
          const id = crypto.randomUUID();
          localStorage.setItem("deviceId", id);
          return id;
        })();

      const response = await fetch("/api/ai/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          animeId,
          deviceId,
          title,
          description,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to analyze");
      }

      // Parse JSON response (blocking)
      const json = await response.json();
      const result = json.data;

      if (result.cached) {
        setProgress("Using cached analysis");
      }

      const { suggestedTags, suggestedMoods } = result;

      // Add tags
      for (const tag of suggestedTags || []) {
        await addTag(animeId, tag);
      }

      // Add moods
      for (const mood of suggestedMoods || []) {
        await addMood(animeId, mood, false);
      }

      setProgress("");
      toast.success(
        `Added ${suggestedTags?.length || 0} tags and ${suggestedMoods?.length || 0} moods`,
      );
      incrementUsage();
    } catch (error) {
      console.error("AI enrich error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to analyze anime",
      );
    } finally {
      setIsLoading(false);
      setProgress("");
    }
  }, [animeId, title, description, isEnabled, isLimited, addTag, addMood, incrementUsage]);

  if (!isEnabled) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={handleEnrich}
        disabled={isLoading || isLimited}
        variant="outline"
        className="gap-2"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        {isLoading ? "Analyzing..." : "AI Analyze"}
      </Button>

      {isLoading && progress && (
        <p className="text-sm text-muted-foreground animate-pulse">
          {progress}
        </p>
      )}

      {isLimited && !isLoading && (
        <p className="text-xs text-muted-foreground">
          Daily limit reached (10/day)
        </p>
      )}
    </div>
  );
}