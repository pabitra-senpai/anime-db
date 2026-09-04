import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { AnimeSummary } from "@/lib/api/types";
import { AnimeCard } from "./AnimeCard";
import { EmptyState } from "@/components/ui/EmptyState";

export function AnimeGrid({ animes }: { animes: AnimeSummary[] }) {
  if (!animes.length) {
    return <EmptyState title="No anime found" description="Try adjusting your filters." />;
  }
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {animes.map((anime) => (
        <div key={anime.id} className="w-full [&>a]:w-full">
          <AnimeCard anime={anime} />
        </div>
      ))}
    </div>
  );
}

export function AnimeRail({
  title,
  description,
  animes,
  viewAllHref,
}: {
  title: string;
  description?: string;
  animes: AnimeSummary[];
  viewAllHref?: string;
}) {
  if (!animes.length) return null;
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-lg font-semibold text-fg sm:text-xl">{title}</h2>
          {description && <p className="text-sm text-fg-muted">{description}</p>}
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref as any}
            className="focus-ring flex items-center gap-1 text-sm text-fg-muted transition-colors hover:text-accent"
          >
            View all
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      <div className="rail -mx-4 flex gap-4 overflow-x-auto px-4 pb-2">
        {animes.map((anime) => (
          <AnimeCard key={anime.id} anime={anime} />
        ))}
      </div>
    </section>
  );
}
