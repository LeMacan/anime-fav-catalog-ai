import { create } from "zustand";
import type { AnimeTag } from "@/lib/types/metadata";
import { getDeviceId } from "@/lib/device-id";

interface TagsState {
  tags: Record<number, AnimeTag[]>; // animeId -> tags
  loading: Record<number, boolean>;
  loadTags: (animeId: number) => Promise<void>;
  addTag: (animeId: number, tagName: string) => Promise<void>;
  removeTag: (animeId: number, tagId: string) => Promise<void>;
  approveAiSuggestion: (animeId: number, tagName: string) => Promise<void>;
}

export const useTagsStore = create<TagsState>((set, get) => ({
  tags: {},
  loading: {},

  loadTags: async (animeId: number) => {
    set((state) => ({ loading: { ...state.loading, [animeId]: true } }));

    const deviceId = getDeviceId();
    if (!deviceId) return;

    try {
      const response = await fetch(`/api/anime/${animeId}/tags?deviceId=${deviceId}`);
      const json = await response.json();

      if (json.data) {
        set((state) => ({
          tags: { ...state.tags, [animeId]: json.data },
          loading: { ...state.loading, [animeId]: false },
        }));
      }
    } catch (error) {
      console.error("Failed to load tags:", error);
      set((state) => ({ loading: { ...state.loading, [animeId]: false } }));
    }
  },

  addTag: async (animeId: number, tagName: string) => {
    const deviceId = getDeviceId();
    if (!deviceId) return;

    // Optimistic update
    const tempId = `temp-${Date.now()}`;
    const optimisticTag: AnimeTag = {
      id: tempId,
      animeId,
      tagName,
      deviceId,
      isAiSuggested: false,
      approved: true,
      createdAt: new Date(),
    };

    set((state) => ({
      tags: {
        ...state.tags,
        [animeId]: [...(state.tags[animeId] || []), optimisticTag],
      },
    }));

    try {
      const response = await fetch(`/api/anime/${animeId}/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tagName, deviceId }),
      });

      const json = await response.json();

      if (json.error) {
        // Revert on error
        set((state) => ({
          tags: {
            ...state.tags,
            [animeId]: (state.tags[animeId] || []).filter((t) => t.id !== tempId),
          },
        }));
      } else if (json.data) {
        // Replace temp with real
        set((state) => ({
          tags: {
            ...state.tags,
            [animeId]: (state.tags[animeId] || []).map((t) =>
              t.id === tempId ? json.data : t,
            ),
          },
        }));
      }
    } catch (error) {
      console.error("Failed to add tag:", error);
      // Revert on error
      set((state) => ({
        tags: {
          ...state.tags,
          [animeId]: (state.tags[animeId] || []).filter((t) => t.id !== tempId),
        },
      }));
    }
  },

  removeTag: async (animeId: number, tagId: string) => {
    // Optimistic update
    const previousTags = get().tags[animeId];
    set((state) => ({
      tags: {
        ...state.tags,
        [animeId]: (state.tags[animeId] || []).filter((t) => t.id !== tagId),
      },
    }));

    try {
      await fetch(`/api/anime/${animeId}/tags`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tagId }),
      });
    } catch (error) {
      console.error("Failed to remove tag:", error);
      // Revert on error
      set((state) => ({
        tags: { ...state.tags, [animeId]: previousTags },
      }));
    }
  },

  approveAiSuggestion: async (animeId: number, tagName: string) => {
    const deviceId = getDeviceId();
    if (!deviceId) return;

    // Optimistic: convert to regular tag
    set((state) => ({
      tags: {
        ...state.tags,
        [animeId]: (state.tags[animeId] || []).map((t) =>
          t.tagName === tagName && t.isAiSuggested
            ? { ...t, approved: true, isAiSuggested: false }
            : t,
        ),
      },
    }));

    // Create actual tag in DB
    await get().addTag(animeId, tagName);
  },
}));