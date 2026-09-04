"use client";

import { useState, useTransition } from "react";
import { Bookmark, ChevronDown, X } from "lucide-react";
import clsx from "clsx";
import { setWatchlistStatus, type WatchlistStatus } from "@/lib/actions/user-library";

const OPTIONS: { value: WatchlistStatus; label: string }[] = [
  { value: "WATCHING", label: "Watching" },
  { value: "PLAN_TO_WATCH", label: "Plan to Watch" },
  { value: "ON_HOLD", label: "On Hold" },
  { value: "COMPLETED", label: "Completed" },
  { value: "DROPPED", label: "Dropped" },
];

const LABEL_BY_VALUE: Record<WatchlistStatus, string> = Object.fromEntries(
  OPTIONS.map((o) => [o.value, o.label])
) as Record<WatchlistStatus, string>;

export function WatchlistButton({
  anilistId,
  slug,
  initialStatus,
}: {
  anilistId: number;
  slug: string;
  initialStatus: WatchlistStatus | null;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function choose(next: WatchlistStatus | null) {
    setOpen(false);
    const previous = status;
    setStatus(next); // optimistic
    startTransition(async () => {
      try {
        await setWatchlistStatus(anilistId, slug, next);
      } catch (err) {
        console.error("setWatchlistStatus failed", err);
        setStatus(previous);
      }
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={isPending}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={clsx(
          "focus-ring flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-60",
          status
            ? "border-accent bg-accent/15 text-accent"
            : "border-border text-fg-muted hover:border-accent hover:text-accent"
        )}
      >
        <Bookmark className={clsx("h-4 w-4", status && "fill-current")} />
        {status ? LABEL_BY_VALUE[status] : "Add to List"}
        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      {open && (
        <>
          {/* Click-outside catcher */}
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div
            role="listbox"
            className="absolute left-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-md border border-border bg-bg-surface shadow-card"
          >
            {OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={status === option.value}
                onClick={() => choose(option.value)}
                className={clsx(
                  "flex w-full items-center px-3 py-2 text-left text-sm transition-colors hover:bg-bg-elevated",
                  status === option.value ? "text-accent" : "text-fg"
                )}
              >
                {option.label}
              </button>
            ))}
            {status && (
              <button
                type="button"
                onClick={() => choose(null)}
                className="flex w-full items-center gap-1.5 border-t border-border px-3 py-2 text-left text-sm text-danger hover:bg-bg-elevated"
              >
                <X className="h-3.5 w-3.5" />
                Remove from list
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
