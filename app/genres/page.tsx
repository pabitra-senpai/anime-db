import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";

export const metadata: Metadata = { title: "Browse by Genre" };

const GENRES = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror",
  "Mahou Shoujo", "Mecha", "Music", "Mystery", "Psychological",
  "Romance", "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller",
];

export default function GenresPage() {
  return (
    <Container className="space-y-6 py-8">
      <h1 className="text-2xl font-bold text-fg">Browse by Genre</h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {GENRES.map((genre) => (
          <Link
            key={genre}
            href={`/genre/${genre.toLowerCase().replace(/\s+/g, "-")}`}
            className="focus-ring rounded-lg border border-border bg-bg-surface p-4 text-center font-medium text-fg transition-colors hover:border-accent hover:text-accent"
          >
            {genre}
          </Link>
        ))}
      </div>
    </Container>
  );
}
