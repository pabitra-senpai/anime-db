import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { AnimeGrid } from "@/components/anime/AnimeGrid";
import { searchAnime } from "@/lib/api/metadata-service";

export const metadata: Metadata = { title: "Currently Airing" };

export default async function AiringPage() {
  const result = await searchAnime({ status: "RELEASING", sort: "POPULARITY", perPage: 48 });
  return (
    <Container className="space-y-6 py-8">
      <h1 className="text-2xl font-bold text-fg">Currently Airing</h1>
      <AnimeGrid animes={result.items} />
    </Container>
  );
}
