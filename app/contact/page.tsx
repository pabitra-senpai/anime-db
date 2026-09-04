import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <Container className="max-w-2xl space-y-4 py-12 text-fg-muted">
      <h1 className="text-2xl font-bold text-fg">Contact</h1>
      <p>Replace this with your real contact email or a contact form.</p>
    </Container>
  );
}
