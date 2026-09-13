import { describe, expect, it } from "vitest";
import { siteMetadata } from "./metadata";

const SITE = {
  baseUrl: "https://seedstack.test",
  name: "Seedstack",
  description: "Test description.",
};

describe("siteMetadata", () => {
  it("builds metadata base and title template from site info", () => {
    const metadata = siteMetadata(SITE);
    expect(metadata.metadataBase?.href).toBe("https://seedstack.test/");
    expect(metadata.title).toEqual({
      default: "Seedstack",
      template: "%s | Seedstack",
    });
    expect(metadata.description).toBe("Test description.");
  });

  it("points open graph and twitter cards at the generated image", () => {
    const metadata = siteMetadata(SITE);
    expect(metadata.openGraph).toMatchObject({
      type: "website",
      siteName: "Seedstack",
      images: [{ url: "/opengraph-image" }],
    });
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
  });

  it("allows indexing and following by default", () => {
    expect(siteMetadata(SITE).robots).toEqual({ index: true, follow: true });
  });
});
