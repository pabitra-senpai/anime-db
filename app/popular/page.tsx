import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { AnimeGrid } from "@/components/anime/AnimeGrid";
import { getPopular } from "@/lib/api/metadata-service";

export const metadata: Metadata = { title: "Popular Anime" };

export default async function PopularPage() {
  const animes = await getPopular(48);
  return (
    <Container className="space-y-6 py-8">
      <h1 className="text-2xl font-bold text-fg">Popular Anime</h1>
      <AnimeGrid animes={animes} />
    </Container>
  );
}
