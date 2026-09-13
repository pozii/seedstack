import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { websiteJsonLd } from "@seedstack/seo";
import { Container, SectionHeading } from "@seedstack/ui";
import { siteUrl } from "@/lib/site";

export default async function HomePage() {
  const t = await getTranslations("home");
  const nav = await getTranslations("nav");
  const base = siteUrl();
  const jsonLd = websiteJsonLd({
    url: base,
    name: t("title"),
    description: t("description"),
  });

  return (
    <main className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container>
        <SectionHeading title={t("title")} description={t("description")} />
        <nav className="mt-8 flex gap-4 text-sm">
          <Link href="/pricing" className="underline">
            {nav("pricing")}
          </Link>
          <Link href="/login" className="underline">
            {nav("login")}
          </Link>
          <Link href="/signup" className="underline">
            {nav("signup")}
          </Link>
          <Link href="/dashboard" className="underline">
            {nav("dashboard")}
          </Link>
        </nav>
      </Container>
    </main>
  );
}
