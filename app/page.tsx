"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Heart, FolderOpen, Sparkles } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Discover Anime",
    description: "Search thousands of anime from AniList's database",
    href: "/search",
  },
  {
    icon: Heart,
    title: "Save Favorites",
    description: "Keep track of your all-time favorites",
    href: "/favorites",
  },
  {
    icon: FolderOpen,
    title: "Create Collections",
    description: "Organize anime into custom collections",
    href: "/collections",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-4 text-center"
      >
        <div className="rounded-full bg-primary/10 p-4">
          <Sparkles className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
          AniCatalog
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">
          Your personal anime catalog. Discover, collect, and organize your
          favorite anime with style.
        </p>
        <div className="flex gap-3">
          <Link href="/search">
            <Button size="lg" className="gap-2">
              <Search className="h-4 w-4" />
              Start Exploring
            </Button>
          </Link>
          <Link href="/collections">
            <Button variant="outline" size="lg" className="gap-2">
              <FolderOpen className="h-4 w-4" />
              My Collections
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid gap-4 sm:grid-cols-3"
      >
        {features.map((feature) => (
          <Link key={feature.href} href={feature.href}>
            <div className="flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
              <feature.icon className="h-8 w-8 text-primary" />
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-center text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          </Link>
        ))}
      </motion.div>
    </div>
  );
}
