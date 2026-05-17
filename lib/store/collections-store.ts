import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Collection {
  id: string;
  name: string;
  description?: string;
  animeIds: number[];
  createdAt: number;
  updatedAt: number;
}

interface CollectionsState {
  collections: Collection[];
  addCollection: (name: string, description?: string) => Collection;
  updateCollection: (id: string, name: string, description?: string) => void;
  deleteCollection: (id: string) => void;
  addAnimeToCollection: (collectionId: string, animeId: number) => void;
  removeAnimeFromCollection: (collectionId: string, animeId: number) => void;
  getCollection: (id: string) => Collection | undefined;
}

export const useCollectionsStore = create<CollectionsState>()(
  persist(
    (set, get) => ({
      collections: [],

      addCollection: (name, description) => {
        const newCollection: Collection = {
          id: crypto.randomUUID(),
          name,
          description,
          animeIds: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({
          collections: [...state.collections, newCollection],
        }));
        return newCollection;
      },

      updateCollection: (id, name, description) => {
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === id ? { ...c, name, description, updatedAt: Date.now() } : c
          ),
        }));
      },

      deleteCollection: (id) => {
        set((state) => ({
          collections: state.collections.filter((c) => c.id !== id),
        }));
      },

      addAnimeToCollection: (collectionId, animeId) => {
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === collectionId && !c.animeIds.includes(animeId)
              ? { ...c, animeIds: [...c.animeIds, animeId], updatedAt: Date.now() }
              : c
          ),
        }));
      },

      removeAnimeFromCollection: (collectionId, animeId) => {
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === collectionId
              ? { ...c, animeIds: c.animeIds.filter((id) => id !== animeId), updatedAt: Date.now() }
              : c
          ),
        }));
      },

      getCollection: (id) => get().collections.find((c) => c.id === id),
    }),
    {
      name: "anime-fav-collections",
    }
  )
);