import { create } from "zustand";
import { persist } from "zustand/middleware";

export const ANIME_GENRES = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy",
  "Horror", "Mystery", "Romance", "Sci-Fi", "Slice of Life",
  "Sports", "Supernatural", "Thriller", "Ecchi", "Harem",
  "Isekai", "Mecha", "Military", "Music", "Parody",
  "Psychological", "School", "Seinen", "Shoujo", "Shounen",
  "Space", "Historical", "Mahou Shoujo",
] as const;

export interface UserPreferences {
  favoriteGenres: string[];
  excludedGenres: string[];
  showExcluded: boolean;
}

interface PreferencesState extends UserPreferences {
  setFavoriteGenres: (genres: string[]) => void;
  setExcludedGenres: (genres: string[]) => void;
  toggleExcludedGenre: (genre: string) => void;
  toggleShowExcluded: () => void;
  clearAll: () => void;
}

const defaults: UserPreferences = {
  favoriteGenres: [],
  excludedGenres: [],
  showExcluded: false,
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      ...defaults,

      setFavoriteGenres: (genres) => set({ favoriteGenres: genres }),

      setExcludedGenres: (genres) => set({ excludedGenres: genres }),

      toggleExcludedGenre: (genre) => {
        const { excludedGenres } = get();
        if (excludedGenres.includes(genre)) {
          set({ excludedGenres: excludedGenres.filter((g) => g !== genre) });
        } else {
          set({ excludedGenres: [...excludedGenres, genre] });
        }
      },

      toggleShowExcluded: () =>
        set((state) => ({ showExcluded: !state.showExcluded })),

      clearAll: () => set({ ...defaults }),
    }),
    {
      name: "anime-fav-preferences",
    },
  ),
);
