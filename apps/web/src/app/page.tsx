import { Container, SectionHeading } from "@seedstack/ui";

export default function HomePage() {
  return (
    <main className="py-16">
      <Container>
        <SectionHeading
          title="Seedstack"
          description="Production-ready Next.js SaaS foundation."
        />
      </Container>
    </main>
  );
}
