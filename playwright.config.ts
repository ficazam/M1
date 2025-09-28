import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  timeout: 30_000,
  use: {
    headless: true,
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
});