"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, FolderPlus } from "lucide-react";

interface AddToCollectionProps {
  animeId: number;
  collections: { id: string; name: string }[];
  onAdd: (collectionId: string, animeId: number) => void;
}

export function AddToCollection({
  animeId,
  collections,
  onAdd,
}: AddToCollectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" className="gap-2" onClick={() => setOpen(true)}>
        <FolderPlus className="h-4 w-4" />
        Add to Collection
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Collection</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {collections.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No collections yet. Create one first!
            </p>
          ) : (
            collections.map((col) => (
              <Button
                key={col.id}
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={() => {
                  onAdd(col.id, animeId);
                  setOpen(false);
                }}
              >
                <Plus className="h-4 w-4" />
                {col.name}
              </Button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
