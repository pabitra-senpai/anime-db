import Link from "next/link";
import { Container } from "./Container";

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Contact" },
  { href: "/data-sources", label: "Data Sources" },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border">
      <Container className="flex flex-col items-center gap-4 py-8 text-sm text-fg-subtle sm:flex-row sm:justify-between">
        <p>
          Anime metadata courtesy of{" "}
          <a href="https://anilist.co" className="hover:text-fg" target="_blank" rel="noreferrer">
            AniList
          </a>
          ,{" "}
          <a href="https://myanimelist.net" className="hover:text-fg" target="_blank" rel="noreferrer">
            MyAnimeList
          </a>{" "}
          and{" "}
          <a href="https://kitsu.io" className="hover:text-fg" target="_blank" rel="noreferrer">
            Kitsu
          </a>
          . Not affiliated with any of the above.
        </p>
        <nav className="flex gap-4">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href as any} className="hover:text-fg">
              {link.label}
            </Link>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
