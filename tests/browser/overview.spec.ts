import { expect, test, type Page, type Route } from "@playwright/test";

const sha = "a".repeat(40);

function workflowRun(commit = sha) {
  return {
    workflow_runs: [{
      id: 12345,
      name: "CI",
      run_number: 495,
      status: "completed",
      conclusion: "success",
      html_url: "https://github.com/sixtoast/Anime-language-/actions/runs/12345",
      created_at: "2026-10-17T10:00:00Z",
      updated_at: "2026-10-17T10:01:00Z",
      head_sha: commit,
      head_commit: { message: "test: deterministic overview status" },
      event: "push"
    }]
  };
}

function jobsReport() {
  return {
    jobs: [{
      id: 67890,
      name: "verify",
      status: "completed",
      conclusion: "success",
      html_url: "https://github.com/sixtoast/Anime-language-/actions/runs/12345/job/67890",
      steps: [{
        name: "Type-check and build",
        status: "completed",
        conclusion: "success",
        number: 8
      }]
    }]
  };
}

function perTestReport(commit = sha) {
  return {
    generatedAt: "2026-10-17T10:01:00Z",
    commit,
    runId: "12345",
    runAttempt: "1",
    counts: { total: 40, passed: 40, failed: 0, skipped: 0, unmapped: 0 },
    tests: []
  };
}

async function mockHealthEndpoints(
  page: Page,
  options: { workflowStatus?: number; reportCommit?: string; buildConclusion?: string } = {}
) {
  await page.route("https://api.github.com/**", async (route: Route) => {
    const url = route.request().url();
    if (url.includes("/actions/runs?branch=main")) {
      if (options.workflowStatus && options.workflowStatus !== 200) {
        await route.fulfill({ status: options.workflowStatus, contentType: "application/json", body: JSON.stringify({ message: "simulated API outage" }) });
      } else {
        await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(workflowRun()) });
      }
      return;
    }
    if (url.includes("/actions/runs/12345/jobs")) {
      const result = jobsReport();
      if (options.buildConclusion) {
        result.jobs[0].steps[0].conclusion = options.buildConclusion;
      }
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(result) });
      return;
    }
    await route.continue();
  });

  await page.route("https://raw.githubusercontent.com/sixtoast/Anime-language-/**", async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(perTestReport(options.reportCommit ?? sha))
    });
  });
}

test.describe("Overview live health browser acceptance", () => {
  test("shows workflow, build and per-test report as separate matching signals", async ({ page }) => {
    await mockHealthEndpoints(page);
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Project health at a glance" })).toBeVisible();

    const metrics = page.locator(".cockpit-metrics > div");
    await expect(metrics).toHaveCount(3);
    await expect(metrics.nth(0).locator("strong")).toHaveText("success");
    await expect(metrics.nth(0)).toContainText("Run #495");
    await expect(metrics.nth(1).locator("strong")).toHaveText("success");
    await expect(metrics.nth(2).locator("strong")).toHaveText("Report loaded");
    await expect(metrics.nth(2)).toContainText("40 passed · 0 failed · 0 unmapped");
    await expect(page.locator(".cockpit-note")).toContainText("Workflow state comes from GitHub Actions");
    await expect(page.getByRole("heading", { name: "Expose authority-decision specification fixtures" })).toBeVisible();
  });

  test("flags a per-test report from a different commit", async ({ page }) => {
    await mockHealthEndpoints(page, { reportCommit: "b".repeat(40) });
    await page.goto("/");
    const report = page.locator(".cockpit-metrics > div").nth(2);
    await expect(report.locator("strong")).toHaveText("Stale / different commit");
    await expect(report).toContainText("40 passed · 0 failed · 0 unmapped");
  });

  test("keeps a valid per-test report visible when the workflow endpoint fails", async ({ page }) => {
    await mockHealthEndpoints(page, { workflowStatus: 503 });
    await page.goto("/");
    await expect(page.locator(".cockpit-metrics > div").nth(0).locator("strong")).toHaveText("Unavailable");
    await expect(page.locator(".cockpit-metrics > div").nth(2).locator("strong")).toHaveText("Report loaded");
    await expect(page.locator(".cockpit-note")).toContainText("Live workflow data could not be confirmed");
  });

  test("reports build failure separately from a successful workflow conclusion", async ({ page }) => {
    await mockHealthEndpoints(page, { buildConclusion: "failure" });
    await page.goto("/");
    await expect(page.locator(".cockpit-metrics > div").nth(0).locator("strong")).toHaveText("success");
    await expect(page.locator(".cockpit-metrics > div").nth(1).locator("strong")).toHaveText("failure");
  });

  test("overview remains within a 360px viewport", async ({ page }) => {
    await mockHealthEndpoints(page);
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Project health at a glance" })).toBeVisible();
    const sizes = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      page: document.documentElement.scrollWidth
    }));
    expect(sizes.page, "Overview should not overflow horizontally at 360px").toBeLessThanOrEqual(sizes.viewport);
  });
});
