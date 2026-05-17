"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Palette, Sparkles, Trash2, Database } from "lucide-react";
import { toast } from "sonner";
import { useFavoritesStore } from "@/lib/store/favorites-store";
import { useCollectionsStore } from "@/lib/store/collections-store";
import { useTagsStore } from "@/lib/store/tags-store";
import { useMoodsStore } from "@/lib/store/moods-store";
import { useNotesStore } from "@/lib/store/notes-store";
import { useShallow } from "zustand/shallow";

export default function SettingsPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [accentColor, setAccentColor] = useState("cyan");
  const [theme, setTheme] = useState("dark");

  const favorites = useFavoritesStore(useShallow((s) => s.favorites));
  const collections = useCollectionsStore(useShallow((s) => s.collections));
  const tags = useTagsStore(useShallow((s) => s.tags));
  const moods = useMoodsStore(useShallow((s) => s.moods));
  const notes = useNotesStore(useShallow((s) => s.notes));

  const handleExportJSON = async () => {
    setIsExporting(true);
    try {
      const data = {
        favorites,
        collections,
        tags,
        moods,
        notes,
        exportedAt: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `anime-favorites-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Exported as JSON");
    } catch (error) {
      toast.error("Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const headers = ["id", "title", "coverImage", "averageScore", "format", "episodes"];
      const rows = Object.values(favorites).map((f: any) =>
        [f.id, `"${f.title}"`, f.coverImage, f.averageScore || "", f.format || "", f.episodes || ""].join(",")
      );
      const csv = [headers.join(","), ...rows].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `anime-favorites-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Exported as CSV");
    } catch (error) {
      toast.error("Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  const clearAllData = () => {
    if (confirm("Are you sure? This will delete ALL your data permanently.")) {
      localStorage.clear();
      // Also clear database in future
      toast.success("All local data cleared");
      setTimeout(() => window.location.reload(), 500);
    }
  };

  const colors = [
    { name: "Cyan", value: "cyan", hex: "#06b6d4" },
    { name: "Magenta", value: "magenta", hex: "#d946ef" },
    { name: "Gold", value: "gold", hex: "#f59e0b" },
    { name: "Emerald", value: "emerald", hex: "#10b981" },
    { name: "Violet", value: "violet", hex: "#8b5cf6" },
    { name: "Rose", value: "rose", hex: "#f43f5e" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-2xl"
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-bold md:text-3xl">Settings</h1>
        <p className="text-muted-foreground">
          Customize your experience and manage your data
        </p>
      </div>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Data
          </CardTitle>
          <CardDescription>
            Download your favorites, tags, moods, notes, and collections
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button onClick={handleExportJSON} disabled={isExporting} className="gap-2">
            <Database className="h-4 w-4" />
            Export JSON
          </Button>
          <Button variant="outline" onClick={handleExportCSV} disabled={isExporting} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </CardContent>
      </Card>

      {/* Theme Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize the look and feel of your catalog
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <span>Theme</span>
            <div className="flex gap-1 rounded-md border p-1">
              <button
                onClick={() => setTheme("dark")}
                className={`px-3 py-1 rounded ${theme === "dark" ? "bg-primary text-primary-foreground" : ""}`}
              >
                Dark
              </button>
              <button
                onClick={() => setTheme("light")}
                className={`px-3 py-1 rounded ${theme === "light" ? "bg-primary text-primary-foreground" : ""}`}
              >
                Light
              </button>
            </div>
          </div>

          {/* Accent Color */}
          <div className="space-y-2">
            <span>Accent Color</span>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setAccentColor(c.value)}
                  className={`h-8 w-8 rounded-full transition-transform ${
                    accentColor === c.value ? "scale-110 ring-2 ring-offset-2 ring-offset-background" : ""
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Theme customization coming in next update!
          </p>
        </CardContent>
      </Card>

      {/* AI Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Features
          </CardTitle>
          <CardDescription>
            Configure AI-powered recommendations and analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span>AI Recommendations</span>
            <Button variant="outline" size="sm">
              Enabled
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions - proceed with caution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={clearAllData} className="gap-2">
            <Trash2 className="h-4 w-4" />
            Clear All Data
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}