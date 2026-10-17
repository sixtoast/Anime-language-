import { expect, test } from "@playwright/test";

async function openPlayground(page: import("@playwright/test").Page) {
  await page.goto("/");
  const mobileMenu = page.getByRole("button", { name: "Open navigation" });
  if (await mobileMenu.isVisible()) await mobileMenu.click();
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

  test("recognises a source-backed lexical atom and reports its lexical class", async ({ page }) => {
    await openPlayground(page);
    await page.getByRole("textbox", { name: "Phase 6G surface-like expression editor" }).fill("pa");
    await page.getByRole("button", { name: "Parse surface-like notation" }).click();

    await expect(page.getByText("Unique structural parse produced")).toBeVisible();
    await expect(page.locator(".analysis-output pre")).toContainText('"form": "PA"');
    await expect(page.locator(".analysis-output pre")).toContainText('"lexicalClass": "AXIS"');
    await expect(page.locator(".engine-banner")).toContainText("v5-draft");
    await expect(page.locator(".engine-banner")).toContainText("does not promote entries to canon");
  });

  test("rejects source lexical collisions rather than guessing a meaning", async ({ page }) => {
    await openPlayground(page);
    await page.getByRole("textbox", { name: "Phase 6G surface-like expression editor" }).fill("ra");
    await page.getByRole("button", { name: "Parse surface-like notation" }).click();

    await expect(page.locator(".analysis-output")).toContainText("AMBIGUOUS_HOMOPHONE");
    await expect(page.locator(".analysis-output")).toContainText("disambiguation is not implemented");
  });

  test("does not rewrite legacy operator aliases by default", async ({ page }) => {
    await openPlayground(page);
    await page.getByRole("textbox", { name: "Phase 6G surface-like expression editor" }).fill("frata ki sho to sho");
    await page.getByRole("button", { name: "Parse surface-like notation" }).click();

    await expect(page.locator(".analysis-output")).toContainText("UNRESOLVED_OPERATOR");
    await expect(page.locator(".analysis-output")).toContainText("has no usable signature");
  });

  test("shows source gloss, lexical class and source status for an exact entry", async ({ page }) => {
    await openPlayground(page);
    await expect(page.getByRole("heading", { name: "Lexicon inspector" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Inspect source lexicon form" })).toHaveValue("pa");
    await expect(page.locator(".lexicon-record-grid")).toContainText("Lexical classes");
    await expect(page.locator(".lexicon-record-grid")).toContainText("AXIS");
    await expect(page.locator(".lexicon-record-grid")).toContainText("Source status");
    await expect(page.locator(".lexicon-provenance")).toContainText("Arcane_Lexicon_v5_draft.csv");
  });

  test("explains collisions in the inspector without selecting one analysis", async ({ page }) => {
    await openPlayground(page);
    await page.getByRole("textbox", { name: "Inspect source lexicon form" }).fill("ra");
    await expect(page.getByRole("status").filter({ hasText: "Collision warning" })).toContainText("refuses to choose a meaning");
  });

  test("shows documented alias evidence without enabling parser rewrites", async ({ page }) => {
    await openPlayground(page);
    await page.getByRole("textbox", { name: "Inspect source lexicon form" }).fill("frata");
    await expect(page.getByRole("status").filter({ hasText: "Recorded legacy alias" })).toContainText("frata → fraja");
    await expect(page.getByRole("status").filter({ hasText: "Recorded legacy alias" })).toContainText("parsing does not rewrite aliases by default");
  });

  test("reports an unknown exact form without declaring it invalid in all registers", async ({ page }) => {
    await openPlayground(page);
    await page.getByRole("textbox", { name: "Inspect source lexicon form" }).fill("not-a-word");
    await expect(page.getByRole("status").filter({ hasText: "No exact source entry found" })).toContainText("does not prove that the form is invalid");
  });

  test("keeps the lexicon inspector within a 360px viewport", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await openPlayground(page);
    await page.getByRole("textbox", { name: "Inspect source lexicon form" }).fill("frata");
    const sizes = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      page: document.documentElement.scrollWidth
    }));
    expect(sizes.page, "Playground and lexicon inspector should not overflow at 360px").toBeLessThanOrEqual(sizes.viewport);
  });

  test("loads a source fixture into the editor and runs it only after explicit action", async ({ page }) => {
    await openPlayground(page);
    const fixtureSelect = page.getByRole("combobox", { name: "Choose Phase 6G source fixture" });
    await expect(fixtureSelect).toHaveValue("P6G-FX-001");
    await expect(page.locator(".fixture-browser:not(.resource-fixture-browser) .fixture-browser-caveat")).toContainText("current parser observations and canon status are separate");
    await page.getByRole("button", { name: "Load fixture into editor" }).click();

    const editor = page.getByRole("textbox", { name: "Phase 6G surface-like expression editor" });
    await expect(editor).toHaveValue("ki to ma");
    await expect(page.getByText("No analysis has been run")).toBeVisible();
    await page.getByRole("button", { name: "Parse surface-like notation" }).click();
    await expect(page.getByText("Unique structural parse produced")).toBeVisible();
    await expect(page.locator(".analysis-output pre")).toContainText('"value": "12"');
  });

  test("loads a rejection fixture and exposes the current parser diagnostic separately", async ({ page }) => {
    await openPlayground(page);
    const fixtureSelect = page.getByRole("combobox", { name: "Choose Phase 6G source fixture" });
    await fixtureSelect.selectOption("P6G-FX-003");
    await expect(page.locator(".fixture-browser:not(.resource-fixture-browser) .fixture-browser-meta")).toContainText("reject");
    await page.getByRole("button", { name: "Load fixture into editor" }).click();
    await expect(page.getByRole("textbox", { name: "Phase 6G surface-like expression editor" })).toHaveValue("ki to");
    await page.getByRole("button", { name: "Parse surface-like notation" }).click();
    await expect(page.locator(".analysis-output")).toContainText("UNTERMINATED_NUMERAL");
  });

  test("browses all resource-accounting design fixtures without running a spell", async ({ page }) => {
    await openPlayground(page);
    const browser = page.locator(".resource-fixture-browser");
    await expect(browser.getByRole("heading", { name: "Incantation resource-accounting fixtures" })).toBeVisible();
    await expect(browser.getByText("60 design cases")).toBeVisible();
    await expect(browser).toContainText("not runs of a resource evaluator");
    await expect(browser.getByRole("link", { name: "Open full v1.9 specification" })).toHaveAttribute("href", /arcane-incantations-v1.9-resource-accounting-and-conservation-contracts/);
    await expect(browser.getByRole("combobox", { name: "Choose resource-accounting specification fixture" }).locator("option")).toHaveCount(60);
    await expect(browser).not.toContainText("RESOURCE-RECONCILED");
  });

  test("shows selected expected outcomes while retaining the non-runtime caveat", async ({ page }) => {
    await openPlayground(page);
    const browser = page.locator(".resource-fixture-browser");
    const select = browser.getByRole("combobox", { name: "Choose resource-accounting specification fixture" });
    await select.selectOption("RES19-10");
    await expect(browser.locator(".fixture-browser-meta").first()).toContainText("RES19-10");
    await expect(browser.locator(".fixture-browser-meta").first()).toContainText("BUDGET-EXCEEDED");
    await select.selectOption("RES19-26");
    await expect(browser.locator(".fixture-browser-meta").first()).toContainText("no implicit conversion");
    await expect(browser).toContainText("does not demonstrate physical feasibility");
    await expect(browser).not.toContainText("Parse resource fixture");
  });

  test("keeps the resource specification browser within a 360px viewport", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await openPlayground(page);
    await page.locator(".resource-fixture-browser").getByRole("combobox", { name: "Choose resource-accounting specification fixture" }).selectOption("RES19-60");
    const sizes = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      page: document.documentElement.scrollWidth
    }));
    expect(sizes.page, "Resource specification browser should not overflow at 360px").toBeLessThanOrEqual(sizes.viewport);
  });

  test("shows conditional source expectations without relabelling them as canonical", async ({ page }) => {
    await openPlayground(page);
    const fixtureSelect = page.getByRole("combobox", { name: "Choose Phase 6G source fixture" });
    await fixtureSelect.selectOption("P6G-FX-011");
    await expect(page.locator(".fixture-browser:not(.resource-fixture-browser) .fixture-browser-meta")).toContainText("reject-unless-context-resolves");
    await expect(page.locator(".fixture-browser:not(.resource-fixture-browser) .fixture-browser-meta")).toContainText("unresolved");
    await expect(page.locator(".fixture-browser:not(.resource-fixture-browser) .fixture-browser-caveat")).toContainText("known to diverge from the archived executable prototype");
  });
});
