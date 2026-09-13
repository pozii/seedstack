import Link from "next/link";
import { Container, SectionHeading } from "@seedstack/ui";

export default function HomePage() {
  return (
    <main className="py-16">
      <Container>
        <SectionHeading
          title="Seedstack"
          description="Production-ready Next.js SaaS foundation."
        />
        <nav className="mt-8 flex gap-4 text-sm">
          <Link href="/pricing" className="underline">
            Pricing
          </Link>
          <Link href="/login" className="underline">
            Log in
          </Link>
          <Link href="/signup" className="underline">
            Sign up
          </Link>
          <Link href="/dashboard" className="underline">
            Dashboard
          </Link>
        </nav>
      </Container>
    </main>
  );
}
