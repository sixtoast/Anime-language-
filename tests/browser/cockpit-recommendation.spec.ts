import { expect, test, type Page } from "@playwright/test";

async function mockCi(page: Page, browserConclusion: string | null, browserStatus = "completed", registryReport: unknown = null) {
  await page.route(/api\.github\.com\/repos\/sixtoast\/Anime-language-\/actions\/runs\?branch=main/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        workflow_runs: [{
          id: 123,
          name: "CI",
          run_number: 188,
          status: "completed",
          conclusion: browserConclusion === "failure" ? "failure" : "success",
          html_url: "https://github.com/sixtoast/Anime-language-/actions/runs/123",
          created_at: "2026-10-14T20:00:00Z",
          updated_at: "2026-10-14T20:05:00Z",
          head_sha: "abc123def456",
          head_commit: { message: "Test cockpit evidence state" },
          event: "push"
        }]
      })
    });
  });
  await page.route(/api\.github\.com\/repos\/sixtoast\/Anime-language-\/actions\/runs\/123\/jobs/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        jobs: [{
          id: 456,
          name: "verify",
          status: "completed",
          conclusion: browserConclusion === "failure" ? "failure" : "success",
          html_url: "https://github.com/sixtoast/Anime-language-/actions/runs/123",
          steps: [
            { name: "Type-check and build", number: 8, status: "completed", conclusion: "success" },
            { name: "Run website browser acceptance", number: 10, status: browserStatus, conclusion: browserConclusion }
          ]
        }]
      })
    });
  });
  await page.route(/raw\.githubusercontent\.com\/sixtoast\/Anime-language-\/ci-results\/latest\.json/, async (route) => {
    if (registryReport) {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(registryReport) });
    } else {
      await route.fulfill({ status: 404, body: "No published test report in this isolated test." });
    }
  });
}

test.describe("Development Cockpit next-task evidence", () => {
  test("advances to shared evidence links only when browser acceptance succeeds", async ({ page }) => {
    await mockCi(page, "success");
    await page.goto("/");
    const recommendation = page.locator(".next-task-panel");
    await expect(recommendation).toHaveAttribute("data-browser-acceptance", "passed");
    await expect(page.getByRole("heading", { name: "Connect source, research and fixture evidence" })).toBeVisible();
    await expect(recommendation.getByText(/shared-record foundation/i)).toBeVisible();
  });

  test("keeps browser failures as the blocking task", async ({ page }) => {
    await mockCi(page, "failure");
    await page.goto("/");
    const recommendation = page.locator(".next-task-panel");
    await expect(recommendation).toHaveAttribute("data-browser-acceptance", "failed");
    await expect(page.getByRole("heading", { name: "Resolve browser acceptance failures" })).toBeVisible();
    await expect(recommendation.getByText(/strict viewport and interaction checks intact/i)).toBeVisible();
  });

  test("does not treat a skipped or cancelled browser step as a pass", async ({ page }) => {
    await mockCi(page, "cancelled");
    await page.goto("/");
    const recommendation = page.locator(".next-task-panel");
    await expect(recommendation).toHaveAttribute("data-browser-acceptance", "inconclusive");
    await expect(page.getByRole("heading", { name: "Recover trustworthy browser acceptance evidence" })).toBeVisible();
    await expect(recommendation.getByText(/skipped or cancelled is not a pass/i)).toBeVisible();
  });

  test("withholds per-test statuses when the stored report belongs to a different CI run", async ({ page }) => {
    await mockCi(page, "success", "completed", {
      generatedAt: "2026-10-14T20:01:00Z", commit: "older-sha", runId: "122", runAttempt: "1",
      counts: { total: 1, passed: 1, failed: 0, skipped: 0, unmapped: 0 },
      tests: [{ id: "PARSE-001", title: "Parses binary operator", status: "passed", durationMs: 4, file: "src/engine/auditParser.test.ts" }]
    });
    await page.goto("/");
    await page.getByRole("button", { name: "Test suite", exact: true }).click();
    await expect(page.locator(".registry-results-meta")).toHaveAttribute("data-report-freshness", "stale");
    await expect(page.getByText("STALE REPORT — per-test statuses are withheld")).toBeVisible();
    const testCase = page.locator(".test-case").filter({ hasText: "PARSE-001" });
    await expect(testCase.getByText("STALE REPORT")).toBeVisible();
    await expect(testCase.getByText("passed", { exact: true })).toHaveCount(0);
  });

  test("shows individual outcomes only when both CI run ID and commit match", async ({ page }) => {
    await mockCi(page, "success", "completed", {
      generatedAt: "2026-10-14T20:01:00Z", commit: "abc123def456", runId: "123", runAttempt: "1",
      counts: { total: 1, passed: 1, failed: 0, skipped: 0, unmapped: 0 },
      tests: [{ id: "PARSE-001", title: "Parses binary operator", status: "passed", durationMs: 4, file: "src/engine/auditParser.test.ts" }]
    });
    await page.goto("/");
    await page.getByRole("button", { name: "Test suite", exact: true }).click();
    await expect(page.locator(".registry-results-meta")).toHaveAttribute("data-report-freshness", "current");
    const testCase = page.locator(".test-case").filter({ hasText: "PARSE-001" });
    await expect(testCase.getByText("passed", { exact: true })).toBeVisible();
    await expect(testCase.getByText("4 ms")).toBeVisible();
  });
});
