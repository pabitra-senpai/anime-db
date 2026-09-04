import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";

export const metadata: Metadata = { title: "Data Sources" };

const SOURCES = [
  { name: "AniList", url: "https://anilist.co", role: "Primary metadata source (GraphQL API)" },
  { name: "MyAnimeList (via Jikan)", url: "https://myanimelist.net", role: "Secondary metadata" },
  { name: "Kitsu", url: "https://kitsu.io", role: "Episode metadata" },
  { name: "SIMKL", url: "https://simkl.com", role: "Cross-service ID mapping" },
];

export default function DataSourcesPage() {
  return (
    <Container className="max-w-2xl space-y-4 py-12">
      <h1 className="text-2xl font-bold text-fg">Data Sources</h1>
      <ul className="space-y-3">
        {SOURCES.map((s) => (
          <li key={s.name} className="rounded-lg border border-border bg-bg-surface p-4">
            <a href={s.url} target="_blank" rel="noreferrer" className="font-medium text-accent">
              {s.name}
            </a>
            <p className="text-sm text-fg-muted">{s.role}</p>
          </li>
        ))}
      </ul>
      <p className="text-sm text-fg-subtle">
        Scores and ratings shown are sourced from the providers above and clearly
        represent their respective community scores, not an AnimeDB-original rating.
      </p>
    </Container>
  );
}
