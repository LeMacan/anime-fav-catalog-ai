"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useTagsStore } from "@/lib/store/tags-store";

interface TagInputProps {
  animeId: number;
}

export function TagInput({ animeId }: TagInputProps) {
  const [value, setValue] = useState("");
  const addTag = useTagsStore((s) => s.addTag);

  const handleSubmit = useCallback(async () => {
    const trimmed = value.trim();

    // Validation: 1-50 characters
    if (trimmed.length < 1 || trimmed.length > 50) {
      toast.error("Tag must be 1-50 characters");
      return;
    }

    // Submit on Enter/comma (handled by onKeyDown)
    await addTag(animeId, trimmed);
    setValue("");
  }, [animeId, value, addTag]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      // Only update if under 50 chars or if deleting
      if (val.length <= 50 || val.length < value.length) {
        setValue(val);
      }
    },
    [value.length],
  );

  return (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Add a tag (press Enter or ,)"
        className="flex-1"
        maxLength={50}
      />
      <span className="flex items-center text-xs text-muted-foreground">
        {value.length}/50
      </span>
    </div>
  );
}