import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-fg">Page not found</h1>
      <p className="max-w-sm text-fg-muted">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link href="/">
        <Button>Back to home</Button>
      </Link>
    </Container>
  );
}
