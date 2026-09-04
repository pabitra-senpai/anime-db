"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import clsx from "clsx";
import { setRating } from "@/lib/actions/user-library";

export function RatingWidget({
  anilistId,
  slug,
  initialRating,
}: {
  anilistId: number;
  slug: string;
  initialRating: number | null;
}) {
  const [rating, setRatingState] = useState(initialRating);
  const [hovered, setHovered] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  function choose(value: number) {
    const previous = rating;
    const next = rating === value ? null : value; // clicking the current value clears it
    setRatingState(next);
    startTransition(async () => {
      try {
        await setRating(anilistId, slug, next);
      } catch (err) {
        console.error("setRating failed", err);
        setRatingState(previous);
      }
    });
  }

  const displayValue = hovered ?? rating ?? 0;

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center"
        onMouseLeave={() => setHovered(null)}
        role="radiogroup"
        aria-label="Your rating"
      >
        {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={rating === value}
            aria-label={`Rate ${value} out of 10`}
            disabled={isPending}
            onMouseEnter={() => setHovered(value)}
            onClick={() => choose(value)}
            className="focus-ring p-0.5 disabled:opacity-60"
          >
            <Star
              className={clsx(
                "h-4 w-4 transition-colors",
                value <= displayValue ? "fill-accent text-accent" : "text-fg-subtle"
              )}
            />
          </button>
        ))}
      </div>
      <span className="w-10 text-xs text-fg-muted">{rating ? `${rating}/10` : "Rate"}</span>
    </div>
  );
}