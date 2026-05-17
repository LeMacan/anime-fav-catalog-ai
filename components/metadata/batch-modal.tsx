"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BatchModalProps {
  selectedIds: number[];
  onClose: () => void;
}

export function BatchModal({ selectedIds, onClose }: BatchModalProps) {
  const [operation, setOperation] = useState<"addTags" | "addMoods">("addTags");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operation,
          animeIds: selectedIds,
          deviceId:
            typeof window !== "undefined"
              ? localStorage.getItem("deviceId")
              : null,
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
            onChange={(e) =>
              setOperation(e.target.value as "addTags" | "addMoods")
            }
            className="w-full rounded-md border bg-background p-2 text-sm"
          >
            <option value="addTags">Add Tags</option>
            <option value="addMoods">Add Moods</option>
          </select>
        </div>

        <div className="mb-6 space-y-2">
          <label className="text-sm font-medium">
            {operation === "addTags" ? "Tags" : "Moods"}{" "}
            (comma-separated)
          </label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              operation === "addTags"
                ? "e.g., action, sci-fi"
                : "e.g., Happy, Exciting"
            }
            className="w-full rounded-md border bg-background p-2 text-sm"
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
