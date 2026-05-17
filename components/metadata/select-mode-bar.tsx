"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSelectModeStore } from "@/lib/store/select-mode-store";
import { toast } from "sonner";

interface SelectModeBarProps {
  totalCount?: number;
  animeIds?: number[];
}

export function SelectModeBar({
  totalCount = 0,
  animeIds = [],
}: SelectModeBarProps) {
  const [openBatchModal, setOpenBatchModal] = useState(false);
  const isEnabled = useSelectModeStore((s) => s.isEnabled);
  const selectedIds = useSelectModeStore((s) => s.selectedIds);
  const selectAll = useSelectModeStore((s) => s.selectAll);
  const deselectAll = useSelectModeStore((s) => s.deselectAll);

  if (!isEnabled) return null;

  const count = selectedIds.size;

  const handleSelectAll = () => {
    if (count === totalCount) {
      deselectAll();
    } else {
      selectAll(animeIds);
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 p-4 shadow-lg backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span className="text-sm font-medium">
            {count} of {totalCount} selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
            >
              {count === totalCount ? "Deselect All" : "Select All"}
            </Button>
            {count > 0 && (
              <Button
                variant="default"
                size="sm"
                onClick={() => setOpenBatchModal(true)}
              >
                Add Tag / Mood
              </Button>
            )}
          </div>
        </div>
      </div>

      {openBatchModal && (
        <BatchModalContent
          selectedIds={Array.from(selectedIds)}
          onClose={() => setOpenBatchModal(false)}
        />
      )}
    </>
  );
}

function BatchModalContent({
  selectedIds,
  onClose,
}: {
  selectedIds: number[];
  onClose: () => void;
}) {
  const [operation, setOperation] = useState<"addTags" | "addMoods">("addTags");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const deviceId = localStorage.getItem("deviceId") ?? "";
      const res = await fetch("/api/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operation,
          animeIds: selectedIds,
          deviceId,
          payload: input
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Bulk operation failed");
      }

      toast.success(`Applied to ${selectedIds.length} anime`);
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold">Bulk Operation</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Apply to {selectedIds.length} selected anime
        </p>

        <div className="mb-4 space-y-2">
          <label className="text-sm font-medium">Operation</label>
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value as "addTags" | "addMoods")}
            className="w-full rounded-md border bg-background p-2"
          >
            <option value="addTags">Add Tags</option>
            <option value="addMoods">Add Moods</option>
          </select>
        </div>

        <div className="mb-6 space-y-2">
          <label className="text-sm font-medium">
            {operation === "addTags" ? "Tags" : "Moods"} (comma-separated)
          </label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              operation === "addTags"
                ? "e.g., action, sci-fi"
                : "e.g., Happy, Exciting"
            }
            className="w-full rounded-md border bg-background p-2"
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={loading || !input.trim()}>
            {loading ? "Applying..." : "Confirm"}
          </Button>
        </div>
      </div>
    </div>
  );
}
