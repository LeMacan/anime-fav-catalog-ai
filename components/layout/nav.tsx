"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Heart, FolderOpen, Grid3X3, Sparkles, Wand2, BarChart3, Settings, TrendingUp } from "lucide-react";
import { useFavoritesStore } from "@/lib/store/favorites-store";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/search", label: "Search", icon: Search },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/collections", label: "Collections", icon: FolderOpen },
  { href: "/genres", label: "Genres", icon: Grid3X3 },
  { href: "/recommendations", label: "For You", icon: Wand2 },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Nav() {
  const pathname = usePathname();
  const favCount = useFavoritesStore((s) => Object.keys(s.favorites).length);

  return (
    <>
      {/* Desktop Nav */}
      <header className="sticky top-0 z-50 hidden border-b border-border/50 bg-background/80 backdrop-blur-xl md:block">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">AniCatalog</span>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg bg-primary/10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <item.icon className="relative h-4 w-4" />
                  <span className="relative">{item.label}</span>
                  {item.href === "/favorites" && favCount > 0 && (
                    <span className="relative flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                      {favCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/80 backdrop-blur-xl md:hidden">
        <div className="flex items-center justify-around py-2">
          <Link
            href="/"
            className="flex flex-col items-center gap-0.5 px-3 py-1"
          >
            <Sparkles className="h-5 w-5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">Home</span>
          </Link>
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center gap-0.5 px-3 py-1"
              >
                <item.icon
                  className={cn(
                    "h-5 w-5",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                />
                <span
                  className={cn(
                    "text-[10px]",
                    isActive ? "text-primary font-medium" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </span>
                {item.href === "/favorites" && favCount > 0 && (
                  <span className="absolute -top-0.5 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[8px] font-bold text-primary-foreground">
                    {favCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
