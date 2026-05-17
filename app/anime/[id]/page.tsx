import AnimeDetailClient from "./anime-detail-client";

// Pre-render some popular anime for static export
export function generateStaticParams() {
  const popularAnime = [
    1, 5114, 16498, 1535, 20, 11061, 21, 19, 269, 30276,
    31043, 32281, 34599, 38000, 40748, 41467, 42938, 44511, 48569, 49387,
    50265, 51009, 51535, 52991, 53998, 54492, 55700, 56784, 57864, 58426,
  ];
  return popularAnime.map((id) => ({ id: id.toString() }));
}

export default async function AnimeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AnimeDetailClient id={id} />;
}