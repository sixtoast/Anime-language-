import { expect, test } from "@playwright/test";

async function openPlayground(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Playground", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Playground." })).toBeVisible();
}

test.describe("Playground Phase 6G parser integration", () => {
  test("parses a registered binary operator with two unit-closed numerals", async ({ page }) => {
    await openPlayground(page);
    await page.getByRole("textbox", { name: "Phase 6G surface-like expression editor" }).fill("frapa ki sho to sho");
    await page.getByRole("button", { name: "Parse surface-like notation" }).click();

    await expect(page.getByText("Unique structural parse produced")).toBeVisible();
    await expect(page.locator(".analysis-output pre")).toContainText('"operator": "FRAPA"');
    await expect(page.locator(".analysis-output pre")).toContainText('"value": "1"');
    await expect(page.locator(".analysis-output pre")).toContainText('"value": "2"');
    await expect(page.locator(".analysis-caveat")).toContainText("does not prove semantic correctness");
  });

  test("shows the surface parser's specific diagnostic for an unclosed numeral", async ({ page }) => {
    await openPlayground(page);
    await page.getByRole("textbox", { name: "Phase 6G surface-like expression editor" }).fill("frapa ki to");
    await page.getByRole("button", { name: "Parse surface-like notation" }).click();

    await expect(page.getByText("Expression rejected by the provisional parser")).toBeVisible();
    await expect(page.locator(".analysis-output")).toContainText("UNTERMINATED_NUMERAL");
    await expect(page.locator(".analysis-caveat")).toContainText("does not prove semantic correctness");
  });

  test("clearing the editor also clears stale parser output", async ({ page }) => {
    await openPlayground(page);
    await page.getByRole("textbox", { name: "Phase 6G surface-like expression editor" }).fill("frapa ki sho to sho");
    await page.getByRole("button", { name: "Parse surface-like notation" }).click();
    await expect(page.getByText("Unique structural parse produced")).toBeVisible();

    await page.getByRole("button", { name: "Clear editor" }).click();
    await expect(page.getByRole("textbox", { name: "Phase 6G surface-like expression editor" })).toHaveValue("");
    await expect(page.getByText("No analysis has been run")).toBeVisible();
  });

  test("labels the implementation as a provisional syntax-only parser", async ({ page }) => {
    await openPlayground(page);
    await expect(page.getByText("Phase 6G provisional surface parser connected")).toBeVisible();
    await expect(page.locator(".next-step")).toContainText("physical feasibility and spell execution remain separate tasks");
  });
});
