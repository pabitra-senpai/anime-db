"use client";

import { useState } from "react";
import { PlayCircle } from "lucide-react";
import type { Episode } from "@/lib/api/types";
import { Card } from "@/components/ui/Card";

const PAGE_SIZE = 24;

function formatAirDate(airDate: string | null): string | null {
  if (!airDate) return null;
  const date = new Date(airDate);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function EpisodeList({ episodes }: { episodes: Episode[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  if (!episodes.length) return null;

  const visibleEpisodes = episodes.slice(0, visibleCount);
  const hasMore = visibleCount < episodes.length;

  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold text-fg sm:text-xl">Episodes</h2>
        <span className="text-xs text-fg-subtle">{episodes.length} total</span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {visibleEpisodes.map((ep) => {
          const airDate = formatAirDate(ep.airDate);
          return (
            <Card key={`${ep.source}-${ep.number}`} className="flex gap-3 p-3">
              <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-md bg-bg-elevated">
                {ep.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={ep.thumbnailUrl}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(e) => {
                      // Hide broken thumbnails from unpredictable third-party
                      // CDN hosts instead of showing a broken-image glyph.
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <PlayCircle className="h-6 w-6 text-fg-subtle" />
                  </div>
                )}
              </div>
              <div className="flex min-w-0 flex-col justify-center gap-0.5">
                <p className="text-xs font-medium text-fg-subtle">Episode {ep.number}</p>
                <p className="line-clamp-2 text-sm font-medium text-fg">
                  {ep.title ?? `Episode ${ep.number}`}
                </p>
                {airDate && <p className="text-xs text-fg-subtle">{airDate}</p>}
              </div>
            </Card>
          );
        })}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={() => setVisibleCount((c) => Math.min(c + PAGE_SIZE, episodes.length))}
          className="focus-ring w-full rounded-md border border-border bg-bg-surface py-2.5 text-sm font-medium text-fg-muted transition-colors hover:bg-bg-elevated hover:text-fg"
        >
          Load more ({episodes.length - visibleCount} remaining)
        </button>
      )}
    </section>
  );
}
