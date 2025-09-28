import { test, expect } from "@playwright/test";

test("streams dashboard (skeleton then data)", async ({ page }) => {
  await page.route("**/dashboard", async (route) => {
    setTimeout(() => route.continue(), 800);
  });

  await page.goto("/dashboard");
  await expect(page.getByText(/Dashboard/i)).toBeVisible();
  await expect(page.getByText(/Invoices/i)).toBeVisible({ timeout: 5000 });
});

test("shows helpful error UI on failure", async ({ page }) => {
  await page.route("**/dashboard", async (route) => {
    await route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ error: "boom" }),
    });
  });

  await page.goto("/dashboard");
  await expect(page.getByText(/failed to load/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /retry/i })).toBeVisible();
});