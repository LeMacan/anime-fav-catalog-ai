import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";
import { Heart } from "lucide-react";

interface FavoritesCollectionCardProps {
  count: number;
  index?: number;
}

export function FavoritesCollectionCard({
  count,
  index = 0,
}: FavoritesCollectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href="/favorites">
        <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
          {/* Cover preview - gradient with heart */}
          <div className="flex h-40 items-center justify-center bg-gradient-to-br from-red-500/20 to-pink-500/20">
            <Heart className="h-16 w-16 text-red-500/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-3">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                Favorites
              </h3>
              <p className="text-xs text-muted-foreground">
                {count} {count === 1 ? "anime" : "anime"}
              </p>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}