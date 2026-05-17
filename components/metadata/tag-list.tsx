"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Sparkles } from "lucide-react";
import { useTagsStore } from "@/lib/store/tags-store";
import { useShallow } from "zustand/shallow";
import type { AnimeTag } from "@/lib/types/metadata";

interface TagListProps {
  animeId: number;
}

export function TagList({ animeId }: TagListProps) {
  // Use useShallow to avoid infinite re-render loops (Zustand uses strict equality)
  const tags = useTagsStore(useShallow((s) => s.tags[animeId] ?? []));
  const removeTag = useTagsStore((s) => s.removeTag);
  const approveAiSuggestion = useTagsStore((s) => s.approveAiSuggestion);
  const loading = useTagsStore(useShallow((s) => s.loading[animeId]));

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading tags...</div>;
  }

  if (tags.length === 0) {
    return <div className="text-sm text-muted-foreground">No tags yet</div>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag: AnimeTag) => (
        <Badge
          key={tag.id}
          variant={tag.isAiSuggested && !tag.approved ? "outline" : "secondary"}
          className="flex items-center gap-1 pr-1"
        >
          {tag.isAiSuggested && !tag.approved && (
            <Sparkles className="h-3 w-3 text-amber-500" />
          )}
          {tag.tagName}
          {tag.isAiSuggested && !tag.approved ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 text-green-500 hover:text-green-600"
              onClick={() => approveAiSuggestion(animeId, tag.tagName)}
              title="Approve"
            >
              ✓
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:text-destructive"
              onClick={() => removeTag(animeId, tag.id)}
              title="Remove"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </Badge>
      ))}
    </div>
  );
}