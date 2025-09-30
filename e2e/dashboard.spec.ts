import { test, expect } from "@playwright/test";
import { startMockApi } from "./utils/mockApi";

const API_PORT = Number(process.env.API_PORT ?? 3001);

test.describe.configure({ mode: "serial" }); // share one mock server for both tests

let ctrl: Awaited<ReturnType<typeof startMockApi>>;

test.beforeAll(async () => {
  ctrl = await startMockApi(API_PORT, { kind: "ok", delayMs: 0 });
});

test.afterAll(async () => {
  await ctrl.stop();
});

test("streams dashboard (skeleton then data)", async ({ page }) => {
  ctrl.setMode({ kind: "ok", delayMs: 800 });

  await page.goto("/dashboard");

  await expect(page.getByText(/Dashboard/i)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Invoices" })).toBeVisible({ timeout: 7000 });
});

test("shows helpful error UI on failure", async ({ page }) => {
  ctrl.setMode({ kind: "fail", status: 500, delayMs: 0 });

  await page.goto("/dashboard");

  await expect(page.getByText(/failed to load/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /retry/i })).toBeVisible();
});
