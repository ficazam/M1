// e2e/dashboard.spec.ts
import { test, expect } from "@playwright/test";
import { startMockApi } from "./utils/mockApi";

const API_PORT = Number(process.env.API_PORT ?? 3001);

test.describe.configure({ mode: "serial" });

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

  await expect(page.getByRole("heading", { name: /Dashboard/i })).toBeVisible();

  await expect(page.getByRole("heading", { name: /Invoices/i })).toBeVisible({ timeout: 7000 });
  await expect(page.getByText("INV-1")).toBeVisible({ timeout: 7000 });       // row cell
  await expect(page.getByText("Acme")).toBeVisible();                          // customer cell
  await expect(page.getByText(/USD 49\b/)).toBeVisible();                      // total cell
});

test("shows helpful error UI on failure", async ({ page }) => {
  ctrl.setMode({ kind: "fail", status: 500 });

  await page.goto("/dashboard");

  await expect(page.getByText(/Dashboard failed to load/i)).toBeVisible({ timeout: 5000 });
  await expect(page.getByRole("button", { name: /Retry/i })).toBeVisible();
});
