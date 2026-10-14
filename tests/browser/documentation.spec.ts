import { expect, test } from "@playwright/test";

test.describe("Documentation catalogue browser acceptance", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Documentation", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Documentation." })).toBeVisible();
  });

  test("search, status and provenance filters combine and reset", async ({ page }) => {
    await expect(page.getByRole("status").filter({ hasText: "19 of 19 sources" })).toBeVisible();
    await page.getByLabel("Filter documentation by source status").selectOption("Canonical");
    await expect(page.getByRole("status").filter({ hasText: "2 of 19 sources" })).toBeVisible();

    await page.getByLabel("Filter documentation by source status").selectOption("Provisional");
    await page.getByLabel("Filter documentation by provenance type").selectOption("Original historical source file");
    await expect(page.getByRole("status").filter({ hasText: "2 of 19 sources" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Phase 4 — ambiguity audit/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Phase 5 — semantic audit/ })).toBeVisible();

    await page.getByRole("button", { name: "Reset filters" }).click();
    await expect(page.getByRole("status").filter({ hasText: "19 of 19 sources" })).toBeVisible();
  });

  test("shows an understandable empty state and recovers from it", async ({ page }) => {
    const search = page.getByRole("textbox", { name: "Search documentation catalogue" });
    await search.fill("no-source-should-match-this-query-7391");
    await expect(page.getByRole("status").filter({ hasText: "0 of 19 sources" })).toBeVisible();
    await expect(page.getByText(/No sources match these filters/)).toBeVisible();
    await search.fill("magic system");
    await expect(page.getByRole("button", { name: /Magic system v3.0/ })).toBeVisible();
    await expect(page.getByText(/No sources match these filters/)).toHaveCount(0);
  });

  test("every catalogue entry exposes its repository source link", async ({ page }) => {
    const entries = page.locator(".doc-list .doc-row");
    await expect(entries).toHaveCount(19);
    for (let i = 0; i < 19; i += 1) {
      const entry = entries.nth(i);
      const title = (await entry.locator("strong").innerText()).trim();
      await entry.click();
      const sourceLink = page.getByRole("link", { name: "Open source document: " + title });
      await expect(sourceLink).toBeVisible();
      const href = await sourceLink.getAttribute("href");
      expect(href).toMatch(/^https:\/\/github\.com\/sixtoast\/Anime-language-\/blob\/main\//);
    }
  });

  test("catalogue controls fit a narrow viewport without page-level horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.reload();
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("button", { name: "Documentation", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Documentation." })).toBeVisible();
    const sizes = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      page: document.documentElement.scrollWidth,
      filter: document.querySelector(".doc-filter-bar")?.getBoundingClientRect().width ?? 0
    }));
    expect(sizes.page, "page should not overflow horizontally at 360px").toBeLessThanOrEqual(sizes.viewport);
    expect(sizes.filter).toBeGreaterThan(0);
  });
});
