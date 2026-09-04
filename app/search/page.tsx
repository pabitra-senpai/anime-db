import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { AnimeGrid } from "@/components/anime/AnimeGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { searchAnime } from "@/lib/api/metadata-service";
import type { SearchFilters } from "@/lib/api/types";
import { SearchFiltersBar } from "@/components/search/SearchFiltersBar";
import { SearchPagination } from "@/components/search/SearchPagination";

export const metadata: Metadata = {
  title: "Search",
};

interface SearchPageProps {
  searchParams: {
    q?: string;
    type?: string;
    status?: string;
    year?: string;
    genre?: string;
    sort?: string;
    page?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const filters: SearchFilters = {
    query: searchParams.q,
    type: searchParams.type as SearchFilters["type"],
    status: searchParams.status as SearchFilters["status"],
    year: searchParams.year ? Number(searchParams.year) : undefined,
    genre: searchParams.genre,
    sort: (searchParams.sort as SearchFilters["sort"]) ?? "RELEVANCE",
    page: searchParams.page ? Number(searchParams.page) : 1,
    perPage: 24,
  };

  const hasQuery = Boolean(filters.query || filters.genre || filters.year || filters.type);
  const result = hasQuery
    ? await searchAnime(filters)
    : { items: [], page: 1, hasNextPage: false, total: 0 };

  return (
    <Container className="space-y-6 py-8">
      <div>
        <h1 className="text-2xl font-bold text-fg">Search</h1>
        {filters.query && (
          <p className="text-fg-muted">
            {result.total} result{result.total === 1 ? "" : "s"} for &ldquo;{filters.query}&rdquo;
          </p>
        )}
      </div>

      <SearchFiltersBar filters={filters} />

      {!hasQuery ? (
        <EmptyState
          title="Search for anime"
          description="Type a title, or use the filters above to browse by genre, year or status."
        />
      ) : result.items.length === 0 ? (
        <EmptyState
          title="NO RESULTS"
          description={`We couldn't find an anime matching "${filters.query}". Try another spelling or title.`}
        />
      ) : (
        <>
          <AnimeGrid animes={result.items} />
          <SearchPagination
            currentPage={result.page}
            hasNextPage={result.hasNextPage}
            filters={filters}
          />
        </>
      )}
    </Container>
  );
}
