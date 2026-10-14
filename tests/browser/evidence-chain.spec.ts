import { expect, test } from "@playwright/test";

test.describe("shared evidence chain explorer", () => {
  test("renders the three explicit evidence chains with source, implementation and test links", async ({ page }) => {
    await page.goto("/");
    await page.locator(".feature-card").filter({ hasText: "Research & review" }).click();

    const section = page.getByRole("heading", { name: "Follow a claim across its records" });
    await expect(section).toBeVisible();

    const operatorChain = page.locator(".evidence-chain").filter({ has: page.getByRole("heading", { name: "Provisional operator arity" }) });
    await expect(operatorChain.getByText("LAN-005, LAN-006")).toBeVisible();
    await expect(operatorChain.locator('a[href*="docs/canon/arcane-language-v3.0-L.md"]')).toHaveCount(1);
    await expect(operatorChain.locator('a[href*="src/engine/auditParser.test.ts"]')).toHaveCount(1);
    await expect(operatorChain.getByText("PARSE-003")).toBeVisible();

    const dimensionChain = page.locator(".evidence-chain").filter({ has: page.getByRole("heading", { name: "Dimensional algebra primitives" }) });
    await expect(dimensionChain.locator('a[href*="src/engine/dimensions.test.ts"]')).toHaveCount(1);
    await expect(dimensionChain.getByText(/not integrated with parsed expressions/i)).toBeVisible();

    const fixtureChain = page.locator(".evidence-chain").filter({ has: page.getByRole("heading", { name: "Recovered Phase 6G fixture observations" }) });
    await expect(fixtureChain.locator('a[href*="tests/fixtures/phase6g-surface-parser-cases.json"]')).toHaveCount(1);
    await expect(fixtureChain.getByText("P6G-FX-016")).toBeVisible();
    await expect(fixtureChain.locator('a[href*="src/engine/phase6gFixtureAudit.test.ts"]')).toHaveCount(1);
    await expect(fixtureChain.getByText(/not authoritative grammar/i)).toBeVisible();

    await page.getByLabel("Filter evidence by rule ID").selectOption("LAN-005");
    await expect(page.getByRole("status").filter({ hasText: "1 related chains" })).toBeVisible();
    await expect(page.locator(".evidence-chain")).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "Provisional operator arity" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Dimensional algebra primitives" })).toHaveCount(0);
    await page.getByRole("button", { name: "Clear rule filter" }).click();
    await expect(page.locator(".evidence-chain")).toHaveCount(3);
  });

  test("evidence links remain inside the viewport on a 360px screen", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/");
    await page.locator(".feature-card").filter({ hasText: "Research & review" }).click();
    await expect(page.getByRole("heading", { name: "Follow a claim across its records" })).toBeVisible();
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth
    }));
    expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport);
  });
});
