"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ImageOff, Info } from "lucide-react";
import clsx from "clsx";
import type { AnimeSummary } from "@/lib/api/types";
import { ScoreBadge } from "./ScoreBadge";
import { GenreChips } from "./GenreChips";

const FORMAT_LABEL: Record<string, string> = {
  TV: "TV",
  TV_SHORT: "TV Short",
  MOVIE: "Movie",
  SPECIAL: "Special",
  OVA: "OVA",
  ONA: "ONA",
  MUSIC: "Music",
  UNKNOWN: "",
};

const AUTOPLAY_MS = 6000;

export function HeroBanner({ animes }: { animes: AnimeSummary[] }) {
  const slides = animes.slice(0, 5);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, slides.length]);

  if (!slides.length) return null;

  function goTo(index: number) {
    setActive(((index % slides.length) + slides.length) % slides.length);
  }

  function handleTouchStart(e: React.TouchEvent) {
    const touch = e.touches[0];
    if (!touch) return;
    touchStartX.current = touch.clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const touch = e.changedTouches[0];
    if (!touch) {
      touchStartX.current = null;
      return;
    }
    const delta = touch.clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      goTo(active + (delta < 0 ? 1 : -1));
    }
    touchStartX.current = null;
  }

  const anime = slides[active];

  return (
    <section
      aria-label="Featured anime"
      className="focus-ring relative -mx-4 h-[280px] overflow-hidden rounded-none sm:mx-0 sm:h-[400px] sm:rounded-xl lg:h-[480px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Backdrop */}
      {anime.bannerUrl ? (
        <Image
          key={anime.id}
          src={anime.bannerUrl}
          alt=""
          fill
          priority={active === 0}
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-bg-elevated">
          <ImageOff className="h-10 w-10 text-fg-subtle" />
        </div>
      )}

      {/* Legibility overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg/80 via-transparent to-transparent sm:from-bg/70" />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4 sm:max-w-xl sm:gap-4 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <ScoreBadge score={anime.score} />
          {FORMAT_LABEL[anime.format] && (
            <span className="rounded-sm bg-bg-elevated px-2 py-0.5 text-xs font-medium text-fg-muted">
              {FORMAT_LABEL[anime.format]}
            </span>
          )}
          {anime.seasonYear && (
            <span className="text-xs text-fg-subtle">{anime.seasonYear}</span>
          )}
        </div>

        <h1 className="line-clamp-2 text-2xl font-bold text-fg drop-shadow-sm sm:text-4xl">
          {anime.title}
        </h1>

        {anime.genres.length > 0 && (
          <div className="hidden sm:block">
            <GenreChips genres={anime.genres.slice(0, 3)} />
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <Link
            href={`/anime/${anime.slug}`}
            className="focus-ring inline-flex h-10 items-center justify-center rounded-md bg-accent px-4 text-sm font-medium text-accent-fg transition-colors duration-150 hover:opacity-90"
          >
            View details
          </Link>
          <Link
            href={`/anime/${anime.slug}#episodes`}
            className="focus-ring hidden h-10 items-center justify-center gap-2 rounded-md border border-border px-4 text-sm font-medium text-fg transition-colors duration-150 hover:bg-bg-elevated sm:inline-flex"
          >
            <Info className="h-4 w-4" />
            More info
          </Link>
        </div>
      </div>

      {/* Prev/next arrows — desktop only, swipe handles mobile */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous"
            onClick={() => goTo(active - 1)}
            className="focus-ring absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-bg/60 p-2 text-fg hover:bg-bg/80 sm:block"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => goTo(active + 1)}
            className="focus-ring absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-bg/60 p-2 text-fg hover:bg-bg/80 sm:block"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 right-4 flex gap-1.5 sm:bottom-4">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === active}
              onClick={() => goTo(i)}
              className={clsx(
                "h-1.5 rounded-full transition-all duration-150",
                i === active ? "w-6 bg-accent" : "w-1.5 bg-fg/40 hover:bg-fg/60"
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}
