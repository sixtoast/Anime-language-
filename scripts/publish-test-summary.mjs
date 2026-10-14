import fs from "node:fs";

const reportPath = "test-results/vitest.json";
const summaryPath = process.env.GITHUB_STEP_SUMMARY;

if (!fs.existsSync(reportPath)) {
  console.error(`Vitest JSON report not found: ${reportPath}`);
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
const tests = [];
for (const suite of report.testResults ?? []) {
  for (const assertion of suite.assertionResults ?? []) {
    const title = assertion.fullName || assertion.title || "Unnamed test";
    const match = title.match(/\[((?:PARSE|SURF|DIM|SEM|OPC|LEX|LEXAUD|CSV|LEXREG|FIX|EVID|RES|REG)-\d{3}|WEB-DOC-REG-\d{3})\]/);
    tests.push({
      id: match?.[1] ?? "UNMAPPED",
      title,
      status: assertion.status,
      durationMs: assertion.duration ?? null,
      file: suite.name?.replace(process.cwd() + "/", "") ?? "unknown"
    });
  }
}

const counts = {
  total: tests.length,
  passed: tests.filter((test) => test.status === "passed").length,
  failed: tests.filter((test) => test.status === "failed").length,
  skipped: tests.filter((test) => test.status === "pending" || test.status === "todo").length,
  unmapped: tests.filter((test) => test.id === "UNMAPPED").length
};

fs.mkdirSync("test-results", { recursive: true });
fs.writeFileSync("test-results/registry-results.json", JSON.stringify({
  generatedAt: new Date().toISOString(),
  commit: process.env.GITHUB_SHA ?? null,
  runId: process.env.GITHUB_RUN_ID ?? null,
  runAttempt: process.env.GITHUB_RUN_ATTEMPT ?? null,
  counts,
  tests
}, null, 2) + "\n");

const icon = (status) => status === "passed" ? "✅" : status === "failed" ? "❌" : "⏭️";
const lines = [
  "## Automated test results",
  "",
  `- **Total:** ${counts.total} · **Passed:** ${counts.passed} · **Failed:** ${counts.failed} · **Skipped:** ${counts.skipped}`,
  `- **Commit:** \`${process.env.GITHUB_SHA ?? "unknown"}\``,
  `- **Registry mapping:** ${counts.total - counts.unmapped}/${counts.total} test results have stable IDs; ${counts.unmapped} unmapped.`,
  "",
  "| ID | Test | Result | Duration |",
  "|---|---|---:|---:|",
  ...tests.map((test) => `| ${test.id} | ${test.title.replace(/\|/g, "\\|")} | ${icon(test.status)} ${test.status} | ${test.durationMs == null ? "—" : `${test.durationMs} ms`} |`),
  ""
];

if (summaryPath) fs.appendFileSync(summaryPath, lines.join("\n"));
console.log(lines.join("\n"));
if (counts.unmapped > 0) {
  console.warn(`Found ${counts.unmapped} test result(s) without a registry ID; these remain visible as UNMAPPED and do not fail the reporting step.`);
}
