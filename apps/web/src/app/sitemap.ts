import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const modified = new Date();
  return ["/", "/pricing", "/login", "/signup"].map((path) => ({
    url: `${base}${path}`,
    lastModified: modified,
  }));
}
