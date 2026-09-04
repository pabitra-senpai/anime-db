"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import clsx from "clsx";
import { toggleFavorite } from "@/lib/actions/user-library";

export function FavoriteButton({
  anilistId,
  slug,
  initialIsFavorited,
}: {
  anilistId: number;
  slug: string;
  initialIsFavorited: boolean;
}) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    const next = !isFavorited;
    setIsFavorited(next); // optimistic
    startTransition(async () => {
      try {
        const result = await toggleFavorite(anilistId, slug);
        setIsFavorited(result.isFavorited);
      } catch (err) {
        console.error("toggleFavorite failed", err);
        setIsFavorited(!next); // revert
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={isFavorited}
      className={clsx(
        "focus-ring flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-60",
        isFavorited
          ? "border-accent bg-accent/15 text-accent"
          : "border-border text-fg-muted hover:border-accent hover:text-accent"
      )}
    >
      <Heart className={clsx("h-4 w-4", isFavorited && "fill-current")} />
      {isFavorited ? "Favorited" : "Favorite"}
    </button>
  );
}
