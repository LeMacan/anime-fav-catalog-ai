import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Collection {
  id: string;
  name: string;
  description?: string;
  animeIds: number[];
  createdAt: number;
  updatedAt: number;
}

interface CollectionCardProps {
  collection: Collection;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  index?: number;
}

export function CollectionCard({
  collection,
  onRename,
  onDelete,
  index = 0,
}: CollectionCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/collections/${collection.id}`}>
        <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
          {/* Cover mosaic preview */}
          <div className="flex h-40 overflow-hidden">
            {collection.animeIds.length > 0 ? (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                <span className="text-5xl font-bold text-muted-foreground/50">
                  {collection.animeIds.length}
                </span>
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                <span className="text-4xl font-bold text-muted-foreground/30">
                  {collection.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-3">
            <div>
              <h3 className="font-semibold">{collection.name}</h3>
              {collection.description && (
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {collection.description}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div
            className="absolute top-2 right-2"
            onClick={(e) => e.preventDefault()}
          >
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md bg-black/60 text-white backdrop-blur-sm hover:bg-black/80">
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    const name = prompt("New name:", collection.name);
                    if (name) onRename(collection.id, name);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => {
                    if (confirm("Delete this collection?")) {
                      onDelete(collection.id);
                    }
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
