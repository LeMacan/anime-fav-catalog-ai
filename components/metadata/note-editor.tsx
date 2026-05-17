"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useNotesStore } from "@/lib/store/notes-store";
import { toast } from "sonner";

interface NoteEditorProps {
  animeId: number;
}

export function NoteEditor({ animeId }: NoteEditorProps) {
  const note = useNotesStore((s) => s.notes[animeId]);
  const loading = useNotesStore((s) => s.loading[animeId]);
  const saving = useNotesStore((s) => s.saving[animeId]);
  const loadNote = useNotesStore((s) => s.loadNote);
  const upsertNote = useNotesStore((s) => s.upsertNote);
  const deleteNote = useNotesStore((s) => s.deleteNote);

  const [content, setContent] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Load note on mount
  useEffect(() => {
    loadNote(animeId);
  }, [animeId, loadNote]);

  // Sync content with loaded note
  useEffect(() => {
    if (note) {
      setContent(note.content);
    }
  }, [note]);

  // Debounced auto-save (500ms)
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Only save if content changed and is not empty
    if (content && content !== note?.content) {
      debounceRef.current = setTimeout(async () => {
        await upsertNote(animeId, content);
        toast.success("Note saved");
      }, 500);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [content, animeId, note?.content, upsertNote]);

  const handleDelete = useCallback(async () => {
    await deleteNote(animeId);
    setContent("");
    toast.success("Note deleted");
  }, [animeId, deleteNote]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= 2000) {
      setContent(val);
    }
  }, []);

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading note...</div>;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={`text-xs ${content.length >= 1900 ? "text-destructive" : "text-muted-foreground"}`}>
          {content.length}/2000
        </span>
        {saving && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            Saving...
          </span>
        )}
      </div>

      <Textarea
        value={content}
        onChange={handleChange}
        placeholder="Write your thoughts about this anime..."
        className="min-h-[120px] resize-y"
        maxLength={2000}
      />

      {note && content && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Delete Note
          </Button>
        </div>
      )}
    </div>
  );
}