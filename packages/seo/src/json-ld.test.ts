import { describe, expect, it } from "vitest";
import { websiteJsonLd } from "./json-ld";

describe("websiteJsonLd", () => {
  it("builds schema.org website data from site info", () => {
    expect(
      websiteJsonLd({
        url: "https://seedstack.test",
        name: "Seedstack",
        description: "Test description.",
      }),
    ).toEqual({
      "@context": "https://schema.org",
      "@type": "WebSite",
      url: "https://seedstack.test",
      name: "Seedstack",
      description: "Test description.",
    });
  });
});
