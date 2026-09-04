"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const [value, setValue] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const query = value.trim();
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <form onSubmit={handleSubmit} className={className} role="search">
      <label htmlFor="site-search" className="sr-only">
        Search anime
      </label>
      <div className="focus-within:ring-accent relative flex items-center rounded-md border border-border bg-bg-elevated focus-within:ring-2">
        <Search className="ml-3 h-4 w-4 shrink-0 text-fg-subtle" />
        <input
          id="site-search"
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search anime titles..."
          className="w-full bg-transparent px-2 py-2 text-sm text-fg placeholder:text-fg-subtle focus:outline-none"
        />
      </div>
    </form>
  );
}
