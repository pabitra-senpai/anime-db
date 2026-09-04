import Link from "next/link";

export function GenreChips({ genres, limit = 4 }: { genres: string[]; limit?: number }) {
  if (!genres.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {genres.slice(0, limit).map((genre) => (
        <Link
          key={genre}
          href={`/genre/${genre.toLowerCase()}`}
          className="focus-ring rounded-sm border border-border px-2 py-0.5 text-xs text-fg-muted transition-colors hover:border-accent hover:text-accent"
        >
          {genre}
        </Link>
      ))}
    </div>
  );
}
