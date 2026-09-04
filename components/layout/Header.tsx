
import Link from "next/link";
import { Container } from "./Container";
import { SearchBar } from "@/components/search/SearchBar";
import { MobileNav } from "./MobileNav";

const NAV_LINKS = [
  { href: "/trending", label: "Trending" },
  { href: "/popular", label: "Popular" },
  { href: "/seasonal", label: "Seasonal" },
  { href: "/top-rated", label: "Top Rated" },
  { href: "/watchlist", label: "My List" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur">
      <Container className="flex h-16 items-center gap-4">
        <Link href="/" className="focus-ring shrink-0 text-lg font-bold tracking-tight text-fg">
          Anime<span className="text-accent">DB</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href as any}
              className="focus-ring rounded-md px-3 py-2 text-sm text-fg-muted transition-colors hover:bg-bg-elevated hover:text-fg"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <SearchBar className="ml-auto hidden w-full max-w-xs sm:block" />

        <Link
          href={"/profile" as any}
          className="focus-ring hidden rounded-md px-3 py-2 text-sm text-fg-muted hover:bg-bg-elevated hover:text-fg md:inline-flex"
        >
          Profile
        </Link>

        <MobileNav links={NAV_LINKS} />
      </Container>
      <div className="border-t border-border px-4 py-2 sm:hidden">
        <SearchBar />
      </div>
    </header>
  );
}
