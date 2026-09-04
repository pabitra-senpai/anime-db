"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function MobileNav({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="focus-ring flex h-9 w-9 items-center justify-center rounded-md text-fg hover:bg-bg-elevated"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-16 border-b border-border bg-bg p-4 shadow-card">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href as any}
                onClick={() => setOpen(false)}
                className="focus-ring rounded-md px-3 py-2 text-sm text-fg hover:bg-bg-elevated"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={"/profile" as any}
              onClick={() => setOpen(false)}
              className="focus-ring rounded-md px-3 py-2 text-sm text-fg hover:bg-bg-elevated"
            >
              Profile
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
