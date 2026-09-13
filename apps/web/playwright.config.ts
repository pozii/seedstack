import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  webServer: {
    command: "pnpm start --port 3100",
    url: "http://localhost:3100/api/health",
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: "http://localhost:3100",
  },
});
