import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <Container className="max-w-2xl space-y-4 py-12 text-fg-muted">
      <h1 className="text-2xl font-bold text-fg">Privacy Policy</h1>
      <p>
        This placeholder privacy policy should be replaced with your actual data handling
        practices before launch: what account data is stored, how watchlist/favorites/
        ratings data is used, cookie usage, and third-party data sharing (if any).
      </p>
    </Container>
  );
}
