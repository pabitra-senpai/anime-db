import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { AnimeGrid } from "@/components/anime/AnimeGrid";
import { getTopRated } from "@/lib/api/metadata-service";

export const metadata: Metadata = { title: "Top Rated Anime" };

export default async function TopRatedPage() {
  const animes = await getTopRated(48);
  return (
    <Container className="space-y-6 py-8">
      <h1 className="text-2xl font-bold text-fg">Top Rated</h1>
      <AnimeGrid animes={animes} />
    </Container>
  );
}
