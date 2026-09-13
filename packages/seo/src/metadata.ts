import type { Metadata } from "next";

export type SiteInfo = {
  baseUrl: string;
  name: string;
  description: string;
};

export function siteMetadata({
  baseUrl,
  name,
  description,
}: SiteInfo): Metadata {
  return {
    metadataBase: new URL(baseUrl),
    title: { default: name, template: `%s | ${name}` },
    description,
    openGraph: {
      type: "website",
      siteName: name,
      title: name,
      description,
      images: [{ url: "/opengraph-image" }],
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description,
    },
    robots: { index: true, follow: true },
  };
}
