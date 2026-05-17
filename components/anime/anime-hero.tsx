import { motion } from "framer-motion";
import { FavoriteButton } from "@/components/favorites/favorite-button";
import type { AnimeDetail } from "@/lib/anilist/types";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnimeHeroProps {
  anime: AnimeDetail;
}

export function AnimeHero({ anime }: AnimeHeroProps) {
  const title = anime.title?.english ?? anime.title?.romaji ?? "Unknown";
  const romajiTitle = anime.title?.romaji;
  const nativeTitle = anime.title?.native;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      {/* Banner Background */}
      {anime.bannerImage ? (
        <div className="absolute inset-0 h-[400px] overflow-hidden">
          <img
            src={anime.bannerImage}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />
        </div>
      ) : (
        <div className="absolute inset-0 h-[400px] bg-gradient-to-b from-primary/10 to-background" />
      )}

      {/* Back Button */}
      <div className="relative z-10 p-4">
        <Link href="/search">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Button>
        </Link>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col gap-6 px-4 pb-6 md:flex-row md:px-8">
        {/* Cover Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto w-48 shrink-0 md:mx-0"
        >
          <div className="overflow-hidden rounded-xl shadow-2xl">
            {anime.coverImage?.extraLarge ? (
              <img
                src={anime.coverImage.extraLarge}
                alt={title}
                className="w-full"
              />
            ) : (
              <div className="aspect-[3/4] bg-muted" />
            )}
          </div>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col justify-end gap-3"
        >
          <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
          {romajiTitle && romajiTitle !== title && (
            <p className="text-lg text-muted-foreground">{romajiTitle}</p>
          )}
          {nativeTitle && (
            <p className="text-base text-muted-foreground">{nativeTitle}</p>
          )}
          <div className="flex items-center gap-3">
            <FavoriteButton
              animeId={anime.id}
              anime={{
                id: anime.id,
                title,
                coverImage: anime.coverImage?.extraLarge ?? anime.coverImage?.large ?? "",
                averageScore: anime.averageScore,
                format: anime.format,
                episodes: anime.episodes,
                genres: anime.genres,
              }}
              size="lg"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
