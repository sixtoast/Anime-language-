import { expect, test, type Page } from "@playwright/test";

async function openPlayground(page: Page) {
  await page.route("https://api.github.com/**", async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ workflow_runs: [], jobs: [] }) });
  });
  await page.route("https://raw.githubusercontent.com/sixtoast/Anime-language-/**", async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ generatedAt: "2026-11-08T00:00:00Z", commit: null, runId: null, runAttempt: null, counts: { total: 0, passed: 0, failed: 0, skipped: 0, unmapped: 0 }, tests: [] }) });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Playground" }).click();
}

test.describe("Formal Arcane versioned operator profiles", () => {
  test("operator explorer switches primary spellings with the selected profile", async ({ page }) => {
    await openPlayground(page);
    await expect(page.getByRole("heading", { name: "Operator explorer" })).toBeVisible();
    await expect(page.locator(".operator-explorer-record summary").filter({ hasText: "FRAJA" })).toBeVisible();
    await page.getByLabel("Operator spelling profile").selectOption("v3.0-L");
    await expect(page.locator(".operator-explorer-record summary").filter({ hasText: "FRATA" })).toBeVisible();
    await expect(page.locator(".operator-explorer-record summary").filter({ hasText: "FRAJA" })).toHaveCount(0);
  });

  test("playground requires alias opt-in and retains entered spelling", async ({ page }) => {
    await openPlayground(page);
    const editor = page.getByRole("textbox", { name: "Phase 6G surface-like expression editor" });
    await editor.fill("frata ki sho to sho");
    await page.getByRole("button", { name: /Parse surface-like notation/ }).click();
    await expect(page.getByText("OPERATOR_ALIAS_DISABLED", { exact: true })).toBeVisible();

    await page.getByLabel("Accept documented historical aliases").check();
    await page.getByRole("button", { name: /Parse surface-like notation/ }).click();
    await expect(page.locator(".analysis-output pre")).toContainText('"operator": "FRAJA"');
    await expect(page.locator(".analysis-output pre")).toContainText('"surfaceForm": "FRATA"');
    await expect(page.locator(".analysis-output pre")).toContainText('"operatorId": "subtract"');
  });
});
