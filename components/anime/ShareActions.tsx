"use client";

import { useState } from "react";
import { Check, Link2, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ShareActions({
  title,
  trailerUrl,
}: {
  title: string;
  trailerUrl: string | null;
}) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // user cancelled share sheet, fall through to copy
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-wrap gap-2 pt-1">
      <Button variant="secondary" size="sm" onClick={handleShare}>
        {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
        {copied ? "Copied" : "Share"}
      </Button>
      {trailerUrl && (
        <a
          href={trailerUrl}
          target="_blank"
          rel="noreferrer"
          className="focus-ring inline-flex h-8 items-center justify-center gap-2 rounded-md border border-border px-3 text-sm font-medium text-fg transition-colors duration-150 hover:bg-bg-elevated"
        >
          <Play className="h-4 w-4" />
          Trailer
        </a>
      )}
    </div>
  );
}
