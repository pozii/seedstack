import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Container } from "./container";
import { SectionHeading } from "./section-heading";

describe("Container", () => {
  it("renders children inside a centered container", () => {
    const markup = renderToStaticMarkup(
      <Container>
        <span>hello</span>
      </Container>,
    );
    expect(markup).toContain("<span>hello</span>");
    expect(markup).toContain("max-w-5xl");
  });
});

describe("SectionHeading", () => {
  it("renders title and description", () => {
    const markup = renderToStaticMarkup(
      <SectionHeading title="Billing" description="Pay up." />,
    );
    expect(markup).toContain("Billing");
    expect(markup).toContain("Pay up.");
  });
});
