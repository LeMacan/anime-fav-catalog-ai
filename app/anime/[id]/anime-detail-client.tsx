"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AnimeHero } from "@/components/anime/anime-hero";
import { AnimeInfo } from "@/components/anime/anime-info";
import { AnimeGenres } from "@/components/anime/anime-genres";
import { AnimeCharacters } from "@/components/anime/anime-characters";
import { AddToCollection } from "@/components/collections/add-to-collection";
import { useCollectionsStore } from "@/lib/store/collections-store";
import { TagInput } from "@/components/metadata/tag-input";
import { TagList } from "@/components/metadata/tag-list";
import { MoodSelector } from "@/components/metadata/mood-selector";
import { NoteEditor } from "@/components/metadata/note-editor";
import { AiEnrichButton } from "@/components/metadata/ai-enrich-button";
import { useTagsStore } from "@/lib/store/tags-store";
import { useMoodsStore } from "@/lib/store/moods-store";
import { useNotesStore } from "@/lib/store/notes-store";
import { getAnimeDetail } from "@/lib/anilist/client";
import { useEffect } from "react";
import AnimeDetailLoading from "./loading";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface AnimeDetailClientProps {
  id: string;
}

export default function AnimeDetailClient({ id }: AnimeDetailClientProps) {
  const animeId = Number(id);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["anime-detail", animeId],
    queryFn: async () => {
      return await getAnimeDetail(animeId);
    },
    enabled: !!animeId,
  });

  const collections = useCollectionsStore((s) => s.collections);
  const anime = data?.Media;

  // Load metadata on mount
  const loadTags = useTagsStore((s) => s.loadTags);
  const loadMoods = useMoodsStore((s) => s.loadMoods);
  const loadNote = useNotesStore((s) => s.loadNote);

  useEffect(() => {
    if (animeId && !isLoading && anime) {
      loadTags(animeId);
      loadMoods(animeId);
      loadNote(animeId);
    }
  }, [animeId, isLoading, anime, loadTags, loadMoods, loadNote]);

  if (isLoading) return <AnimeDetailLoading />;

  if (isError || !anime) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-lg text-destructive">Anime not found</p>
        <Link href="/search">
          <Button variant="outline">Back to search</Button>
        </Link>
      </div>
    );
  }

  const handleAddToCollection = async (collectionId: string, animeId: number) => {
    const store = useCollectionsStore.getState();
    if (store.collections.find((c) => c.id === collectionId)?.animeIds.includes(animeId)) {
      store.removeAnimeFromCollection(collectionId, animeId);
    } else {
      store.addAnimeToCollection(collectionId, animeId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-16"
    >
      <AnimeHero anime={anime} />

      <div className="space-y-8 px-4 md:px-8">
        {/* Genres */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <AnimeGenres genres={anime.genres} />
        </motion.div>

        {/* Synopsis */}
        {anime.description && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="space-y-2"
          >
            <h2 className="text-lg font-semibold">Synopsis</h2>
            <p
              className="leading-relaxed text-muted-foreground"
              dangerouslySetInnerHTML={{
                __html: anime.description.replace(/<br\s*\/?>/g, "\n"),
              }}
            />
          </motion.div>
        )}

        {/* Info Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-2"
        >
          <h2 className="text-lg font-semibold">Details</h2>
          <AnimeInfo anime={anime} />
        </motion.div>

        {/* Characters */}
        {anime.characters?.nodes && anime.characters.nodes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="space-y-2"
          >
            <h2 className="text-lg font-semibold">Characters</h2>
            <AnimeCharacters characters={anime.characters} />
          </motion.div>
        )}

        {/* Add to Collection */}
        <div>
          <AddToCollection
            animeId={animeId}
            collections={collections}
            onAdd={handleAddToCollection}
          />
        </div>

        {/* Tags Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <h2 className="text-lg font-semibold">Tags</h2>
          <TagInput animeId={animeId} />
          <TagList animeId={animeId} />
        </motion.div>

        {/* Moods Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="space-y-3"
        >
          <h2 className="text-lg font-semibold">Moods</h2>
          <MoodSelector animeId={animeId} />
        </motion.div>

        {/* AI Enrichment Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-3"
        >
          <h2 className="text-lg font-semibold">AI Analysis</h2>
          <AiEnrichButton
            animeId={animeId}
            title={anime.title?.english ?? anime.title?.romaji ?? "Unknown"}
            description={anime.description}
          />
        </motion.div>

        {/* Notes Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="space-y-3"
        >
          <h2 className="text-lg font-semibold">Notes</h2>
          <NoteEditor animeId={animeId} />
        </motion.div>
      </div>
    </motion.div>
  );
}