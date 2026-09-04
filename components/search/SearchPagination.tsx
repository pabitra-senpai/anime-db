import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { SearchFilters } from "@/lib/api/types";

function buildHref(filters: SearchFilters, page: number): string {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  if (filters.type) params.set("type", filters.type);
  if (filters.status) params.set("status", filters.status);
  if (filters.year) params.set("year", String(filters.year));
  if (filters.genre) params.set("genre", filters.genre);
  if (filters.sort) params.set("sort", filters.sort);
  params.set("page", String(page));
  return `/search?${params.toString()}`;
}

export function SearchPagination({
  currentPage,
  hasNextPage,
  filters,
}: {
  currentPage: number;
  hasNextPage: boolean;
  filters: SearchFilters;
}) {
  return (
    <div className="flex items-center justify-center gap-4 pt-4">
      <Link
        href={buildHref(filters, Math.max(1, currentPage - 1)) as any}
        aria-disabled={currentPage <= 1}
        className={`focus-ring flex items-center gap-1 rounded-md border border-border px-3 py-2 text-sm ${
          currentPage <= 1 ? "pointer-events-none opacity-40" : "hover:bg-bg-elevated"
        }`}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Link>
      <span className="text-sm text-fg-muted">Page {currentPage}</span>
      <Link
        href={buildHref(filters, currentPage + 1) as any}
        aria-disabled={!hasNextPage}
        className={`focus-ring flex items-center gap-1 rounded-md border border-border px-3 py-2 text-sm ${
          !hasNextPage ? "pointer-events-none opacity-40" : "hover:bg-bg-elevated"
        }`}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
