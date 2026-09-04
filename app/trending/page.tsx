import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { AnimeGrid } from "@/components/anime/AnimeGrid";
import { getTrending } from "@/lib/api/metadata-service";

export const metadata: Metadata = { title: "Trending Anime" };

export default async function TrendingPage() {
  const animes = await getTrending(48);
  return (
    <Container className="space-y-6 py-8">
      <h1 className="text-2xl font-bold text-fg">Trending Now</h1>
      <AnimeGrid animes={animes} />
    </Container>
  );
}
