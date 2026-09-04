"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { SearchFilters } from "@/lib/api/types";

const TYPES = ["TV", "TV_SHORT", "MOVIE", "SPECIAL", "OVA", "ONA", "MUSIC"];
const STATUSES = ["FINISHED", "RELEASING", "NOT_YET_RELEASED", "CANCELLED", "HIATUS"];
const SORTS: { value: NonNullable<SearchFilters["sort"]>; label: string }[] = [
  { value: "RELEVANCE", label: "Relevance" },
  { value: "POPULARITY", label: "Popularity" },
  { value: "SCORE", label: "Rating" },
  { value: "NEWEST", label: "Newest" },
];

export function SearchFiltersBar({ filters }: { filters: SearchFilters }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // reset pagination on filter change
    router.push(`${pathname}?${params.toString()}` as any);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <select
        value={filters.type ?? ""}
        onChange={(e) => updateParam("type", e.target.value)}
        className="focus-ring rounded-md border border-border bg-bg-elevated px-3 py-1.5 text-sm text-fg"
      >
        <option value="">All types</option>
        {TYPES.map((t) => (
          <option key={t} value={t}>
            {t.replace("_", " ")}
          </option>
        ))}
      </select>

      <select
        value={filters.status ?? ""}
        onChange={(e) => updateParam("status", e.target.value)}
        className="focus-ring rounded-md border border-border bg-bg-elevated px-3 py-1.5 text-sm text-fg"
      >
        <option value="">All statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s.replace(/_/g, " ")}
          </option>
        ))}
      </select>

      <select
        value={filters.sort ?? "RELEVANCE"}
        onChange={(e) => updateParam("sort", e.target.value)}
        className="focus-ring rounded-md border border-border bg-bg-elevated px-3 py-1.5 text-sm text-fg"
      >
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>
            Sort: {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}
