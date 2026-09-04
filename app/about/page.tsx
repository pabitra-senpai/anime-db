import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <Container className="max-w-2xl space-y-4 py-12 text-fg-muted">
      <h1 className="text-2xl font-bold text-fg">About AnimeDB</h1>
      <p>
        AnimeDB is an independent anime database and discovery platform. It aggregates
        and normalizes public metadata from AniList, MyAnimeList and Kitsu to help you
        discover, search and track anime series and movies.
      </p>
      <p>
        AnimeDB is not affiliated with, endorsed by, or officially connected to AniList,
        MyAnimeList, Kitsu, SIMKL, or any anime studio or distributor.
      </p>
    </Container>
  );
}
