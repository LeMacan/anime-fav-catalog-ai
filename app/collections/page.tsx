"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { CollectionGrid } from "@/components/collections/collection-grid";
import { CollectionCard } from "@/components/collections/collection-card";
import { FavoritesCollectionCard } from "@/components/collections/favorites-collection-card";
import { EmptyState } from "@/components/shared/empty-state";
import { useCollectionsStore } from "@/lib/store/collections-store";
import { useFavoritesStore } from "@/lib/store/favorites-store";
import { useShallow } from "zustand/shallow";

export default function CollectionsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const collections = useCollectionsStore(useShallow((s) => s.collections));
  const addCollection = useCollectionsStore((s) => s.addCollection);
  const updateCollection = useCollectionsStore((s) => s.updateCollection);
  const deleteCollection = useCollectionsStore((s) => s.deleteCollection);

  const favoritesList = useFavoritesStore((s) => s.getFavoritesList());
  const favoritesCount = favoritesList.length;

  const handleCreate = () => {
    if (!newName.trim()) return;
    addCollection(newName.trim(), newDesc.trim() || undefined);
    setCreateOpen(false);
    setNewName("");
    setNewDesc("");
  };

  const handleRename = (id: string, name: string) => {
    updateCollection(id, name, undefined);
  };

  const handleDelete = (id: string) => {
    deleteCollection(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold md:text-3xl">Collections</h1>
          <p className="text-muted-foreground">
            {collections.length} collections
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <Button className="gap-2" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            New Collection
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Collection</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g., Best Shonen"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Optional description"
                />
              </div>
              <Button
                className="w-full"
                disabled={!newName.trim()}
                onClick={handleCreate}
              >
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {collections.length === 0 && favoritesCount === 0 ? (
        <EmptyState type="collection" message="No collections yet. Create your first one!" />
      ) : (
        <CollectionGrid>
          <FavoritesCollectionCard count={favoritesCount} index={0} />
          {collections.map((col, i) => (
            <CollectionCard
              key={col.id}
              collection={col}
              index={i + 1}
              onRename={handleRename}
              onDelete={handleDelete}
            />
          ))}
        </CollectionGrid>
      )}
    </motion.div>
  );
}
