import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { AnimeGrid } from "@/components/anime/AnimeGrid";
import { searchAnime } from "@/lib/api/metadata-service";

interface PageProps {
  params: { slug: string };
}

function toGenreLabel(slug: string) {
  return slug
    .split("-")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}

export function generateMetadata({ params }: PageProps): Metadata {
  return { title: `${toGenreLabel(params.slug)} Anime` };
}

export default async function GenrePage({ params }: PageProps) {
  const label = toGenreLabel(params.slug);
  const result = await searchAnime({ genre: label, sort: "POPULARITY", perPage: 48 });
  return (
    <Container className="space-y-6 py-8">
      <h1 className="text-2xl font-bold text-fg">{label} Anime</h1>
      <AnimeGrid animes={result.items} />
    </Container>
  );
}
