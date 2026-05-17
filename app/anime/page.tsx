"use client";

import { Suspense } from "react";
import AnimeDetailClient from "./_components/anime-detail-client";
import AnimeDetailLoading from "./loading";

export default function AnimeDetailPage() {
  return (
    <Suspense fallback={<AnimeDetailLoading />}>
      <AnimeDetailClient />
    </Suspense>
  );
}