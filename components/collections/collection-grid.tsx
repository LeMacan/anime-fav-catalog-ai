import type { ReactNode } from "react";

interface CollectionGridProps {
  children: ReactNode;
}

export function CollectionGrid({ children }: CollectionGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
}
