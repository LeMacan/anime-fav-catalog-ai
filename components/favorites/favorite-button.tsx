"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavoritesStore, type StoredAnime } from "@/lib/store/favorites-store";

interface FavoriteButtonProps {
  animeId: number;
  anime: StoredAnime;
  size?: "sm" | "lg";
}

export function FavoriteButton({ animeId, anime, size = "sm" }: FavoriteButtonProps) {
  const isFavorite = useFavoritesStore((s) => s.isFavorite(animeId));
  const addFavorite = useFavoritesStore((s) => s.addFavorite);
  const removeFavorite = useFavoritesStore((s) => s.removeFavorite);

  const toggle = () => {
    if (isFavorite) {
      removeFavorite(animeId);
    } else {
      addFavorite(anime);
    }
  };

  const sizeClasses = size === "lg" ? "h-10 gap-2 px-4" : "h-8 w-8 p-0";

  return (
    <motion.div whileTap={{ scale: 0.8 }}>
      <Button
        variant={isFavorite ? "default" : "secondary"}
        size="sm"
        className={sizeClasses}
        onClick={toggle}
      >
        <motion.div
          animate={{
            scale: isFavorite ? [1, 1.3, 1] : 1,
            color: isFavorite ? "#ef4444" : undefined,
          }}
          transition={{ duration: 0.3 }}
        >
          <Heart
            className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
          />
        </motion.div>
        {size === "lg" && (isFavorite ? "Favorited" : "Add to Favorites")}
      </Button>
    </motion.div>
  );
}
