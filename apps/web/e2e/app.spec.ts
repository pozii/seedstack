import { expect, test } from "@playwright/test";

test("home renders tagline, navigation, and structured data", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByText("Production-ready Next.js SaaS foundation."),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Pricing" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Log in" })).toBeVisible();
  const structured = await page
    .locator('script[type="application/ld+json"]')
    .textContent();
  expect(structured ?? "").toContain("https://schema.org");
});

test("health endpoint reports ok", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBe(true);
  expect(await response.json()).toEqual({
    status: "ok",
    service: "seedstack-web",
  });
});

test("anonymous dashboard access redirects to login", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login$/);
});

test("anonymous billing access redirects to login", async ({ page }) => {
  await page.goto("/dashboard/billing");
  await expect(page).toHaveURL(/\/login$/);
});

test("login page shows email and password fields", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByPlaceholder("Email")).toBeVisible();
  await expect(page.getByPlaceholder("Password")).toBeVisible();
});

test("pricing explains missing billing configuration", async ({ page }) => {
  await page.goto("/pricing");
  await expect(page.getByText("Billing is not configured yet.")).toBeVisible();
});

test("sitemap lists public routes", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.ok()).toBe(true);
  const body = await response.text();
  expect(body).toContain("/pricing");
  expect(body).toContain("/signup");
});

test("robots keeps dashboard and api out of crawlers", async ({ request }) => {
  const response = await request.get("/robots.txt");
  expect(response.ok()).toBe(true);
  const body = await response.text();
  expect(body).toContain("Disallow: /dashboard");
  expect(body).toContain("sitemap.xml");
});
