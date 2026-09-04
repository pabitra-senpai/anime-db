import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <Container className="max-w-2xl space-y-4 py-12 text-fg-muted">
      <h1 className="text-2xl font-bold text-fg">Terms of Service</h1>
      <p>
        This placeholder terms page should be replaced with your actual terms before
        launch, covering acceptable use, account responsibilities, and disclaimers
        regarding third-party metadata accuracy.
      </p>
    </Container>
  );
}
