import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search, Heart, FolderPlus, FilterX } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  type: "search" | "favorites" | "collection" | "filter-empty";
  message?: string;
  actionLabel?: string;
  actionHref?: string;
  onClearFilters?: () => void;
}

export function EmptyState({
  type,
  message,
  actionLabel,
  actionHref,
  onClearFilters,
}: EmptyStateProps) {
  const defaults = {
    search: {
      icon: Search,
      message: "Search for your favorite anime to get started",
      actionLabel: "Browse Trending",
      actionHref: "/search",
    },
    favorites: {
      icon: Heart,
      message: "No favorites yet. Start by searching for anime!",
      actionLabel: "Discover Anime",
      actionHref: "/search",
    },
    collection: {
      icon: FolderPlus,
      message: "This collection is empty. Add some anime!",
      actionLabel: "Browse Anime",
      actionHref: "/search",
    },
    "filter-empty": {
      icon: FilterX,
      message: "No anime match your filters",
      actionLabel: "Clear Filters",
    },
  };

  const config = defaults[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-4 py-20"
    >
      <div className="rounded-full bg-muted p-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="text-center text-lg text-muted-foreground">
        {message ?? config.message}
      </p>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button>{actionLabel}</Button>
        </Link>
      )}
    </motion.div>
  );
}
