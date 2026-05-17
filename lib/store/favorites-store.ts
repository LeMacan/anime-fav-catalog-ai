import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface StoredAnime {
  id: number;
  title: string;
  coverImage: string;
  averageScore?: number;
  format?: string;
  episodes?: number;
  genres?: string[];
}

interface FavoritesState {
  favorites: Record<number, StoredAnime>;
  addFavorite: (anime: StoredAnime) => void;
  removeFavorite: (animeId: number) => void;
  isFavorite: (animeId: number) => boolean;
  getFavoritesList: () => StoredAnime[];
  clearAll: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: {},

      addFavorite: (anime) =>
        set((state) => ({
          favorites: { ...state.favorites, [anime.id]: anime },
        })),

      removeFavorite: (animeId) =>
        set((state) => {
          const { [animeId]: _, ...rest } = state.favorites;
          return { favorites: rest };
        }),

      isFavorite: (animeId) => animeId in get().favorites,

      getFavoritesList: () => Object.values(get().favorites),

      clearAll: () => set({ favorites: {} }),
    }),
    {
      name: "anime-fav-favorites",
    },
  ),
);
