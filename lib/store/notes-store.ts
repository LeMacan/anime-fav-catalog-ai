import { create } from "zustand";
import type { AnimeNote } from "@/lib/types/metadata";
import { getDeviceId } from "@/lib/device-id";

interface NotesState {
  notes: Record<number, AnimeNote | null>; // animeId -> note or null
  loading: Record<number, boolean>;
  saving: Record<number, boolean>;
  loadNote: (animeId: number) => Promise<void>;
  upsertNote: (animeId: number, content: string) => Promise<void>;
  deleteNote: (animeId: number) => Promise<void>;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: {},
  loading: {},
  saving: {},

  loadNote: async (animeId: number) => {
    set((state) => ({ loading: { ...state.loading, [animeId]: true } }));

    const deviceId = getDeviceId();
    if (!deviceId) return;

    try {
      const response = await fetch(`/api/anime/${animeId}/notes?deviceId=${deviceId}`);
      const json = await response.json();

      set((state) => ({
        notes: { ...state.notes, [animeId]: json.data || null },
        loading: { ...state.loading, [animeId]: false },
      }));
    } catch (error) {
      console.error("Failed to load note:", error);
      set((state) => ({ loading: { ...state.loading, [animeId]: false } }));
    }
  },

  upsertNote: async (animeId: number, content: string) => {
    const deviceId = getDeviceId();
    if (!deviceId) return;

    set((state) => ({ saving: { ...state.saving, [animeId]: true } }));

    // Optimistic update
    const previousNote = get().notes[animeId];
    const optimisticNote: AnimeNote = {
      id: previousNote?.id || `temp-${Date.now()}`,
      animeId,
      deviceId,
      content,
      createdAt: previousNote?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    set((state) => ({
      notes: { ...state.notes, [animeId]: optimisticNote },
    }));

    try {
      const response = await fetch(`/api/anime/${animeId}/notes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, deviceId }),
      });

      const json = await response.json();

      if (json.error) {
        // Revert on error
        set((state) => ({
          notes: { ...state.notes, [animeId]: previousNote || null },
        }));
      } else if (json.data) {
        // Replace with actual
        set((state) => ({
          notes: { ...state.notes, [animeId]: json.data },
        }));
      }
    } catch (error) {
      console.error("Failed to save note:", error);
      // Revert on error
      set((state) => ({
        notes: { ...state.notes, [animeId]: previousNote || null },
      }));
    } finally {
      set((state) => ({ saving: { ...state.saving, [animeId]: false } }));
    }
  },

  deleteNote: async (animeId: number) => {
    const deviceId = getDeviceId();
    if (!deviceId) return;

    // Optimistic update
    const previousNote = get().notes[animeId];
    set((state) => ({
      notes: { ...state.notes, [animeId]: null },
    }));

    try {
      await fetch(`/api/anime/${animeId}/notes`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId }),
      });
    } catch (error) {
      console.error("Failed to delete note:", error);
      // Revert on error
      set((state) => ({
        notes: { ...state.notes, [animeId]: previousNote },
      }));
    }
  },
}));