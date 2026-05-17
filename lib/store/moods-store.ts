import { create } from "zustand";
import type { AnimeMood } from "@/lib/types/metadata";
import { getDeviceId } from "@/lib/device-id";

interface MoodsState {
  moods: Record<number, AnimeMood[]>; // animeId -> moods
  loading: Record<number, boolean>;
  loadMoods: (animeId: number) => Promise<void>;
  addMood: (animeId: number, mood: string, isCustom?: boolean) => Promise<void>;
  removeMood: (animeId: number, moodId: string) => Promise<void>;
}

export const useMoodsStore = create<MoodsState>((set, get) => ({
  moods: {},
  loading: {},

  loadMoods: async (animeId: number) => {
    set((state) => ({ loading: { ...state.loading, [animeId]: true } }));

    const deviceId = getDeviceId();
    if (!deviceId) return;

    try {
      const response = await fetch(`/api/anime/${animeId}/moods?deviceId=${deviceId}`);
      const json = await response.json();

      if (json.data) {
        set((state) => ({
          moods: { ...state.moods, [animeId]: json.data },
          loading: { ...state.loading, [animeId]: false },
        }));
      }
    } catch (error) {
      console.error("Failed to load moods:", error);
      set((state) => ({ loading: { ...state.loading, [animeId]: false } }));
    }
  },

  addMood: async (animeId: number, mood: string, isCustom = false) => {
    const deviceId = getDeviceId();
    if (!deviceId) return;

    // Optimistic update (allow duplicates in UI, server will ignore)
    const tempId = `temp-${Date.now()}`;
    const optimisticMood: AnimeMood = {
      id: tempId,
      animeId,
      mood,
      deviceId,
      isCustom,
      createdAt: new Date(),
    };

    set((state) => ({
      moods: {
        ...state.moods,
        [animeId]: [...(state.moods[animeId] || []), optimisticMood],
      },
    }));

    try {
      const response = await fetch(`/api/anime/${animeId}/moods`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, deviceId, isCustom }),
      });

      const json = await response.json();

      if (json.data) {
        // Replace temp with real
        set((state) => ({
          moods: {
            ...state.moods,
            [animeId]: (state.moods[animeId] || []).map((m) =>
              m.id === tempId ? json.data : m,
            ),
          },
        }));
      } else {
        // Server ignored duplicate - remove temp
        set((state) => ({
          moods: {
            ...state.moods,
            [animeId]: (state.moods[animeId] || []).filter((m) => m.id !== tempId),
          },
        }));
      }
    } catch (error) {
      console.error("Failed to add mood:", error);
      // Revert on error
      set((state) => ({
        moods: {
          ...state.moods,
          [animeId]: (state.moods[animeId] || []).filter((m) => m.id !== tempId),
        },
      }));
    }
  },

  removeMood: async (animeId: number, moodId: string) => {
    // Optimistic update
    const previousMoods = get().moods[animeId];
    set((state) => ({
      moods: {
        ...state.moods,
        [animeId]: (state.moods[animeId] || []).filter((m) => m.id !== moodId),
      },
    }));

    try {
      await fetch(`/api/anime/${animeId}/moods`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moodId }),
      });
    } catch (error) {
      console.error("Failed to remove mood:", error);
      // Revert on error
      set((state) => ({
        moods: { ...state.moods, [animeId]: previousMoods },
      }));
    }
  },
}));