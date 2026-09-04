import Image from "next/image";
import { PlayCircle } from "lucide-react";
import type { Episode } from "@/lib/api/types";
import { Card } from "@/components/ui/Card";

function formatAirDate(airDate: string | null): string | null {
  if (!airDate) return null;
  const date = new Date(airDate);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function EpisodeList({ episodes }: { episodes: Episode[] }) {
  if (!episodes.length) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-fg sm:text-xl">Episodes</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {episodes.map((ep) => {
          const airDate = formatAirDate(ep.airDate);
          return (
            <Card key={`${ep.source}-${ep.number}`} className="flex gap-3 p-3">
              <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-md bg-bg-elevated">
                {ep.thumbnailUrl ? (
                  <Image src={ep.thumbnailUrl} alt="" fill sizes="112px" className="object-cover" />
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
    </section>
  );
}
