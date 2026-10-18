import policyProfileSpec from "../../docs/canon/arcane-incantations-v2.1-policy-profile-composition-and-conflict-resolution.md?raw";

export interface PolicyProfileCompositionFixture {
  id: string;
  caseDescription: string;
  expectedOutcome: string;
}

/**
 * Parse the locked v2.1 specification table without interpreting or executing
 * policy composition. These are normative design fixtures, not policy results.
 */
export function parsePolicyProfileCompositionFixtures(markdown: string): PolicyProfileCompositionFixture[] {
  const lines = markdown.split(/\r?\n/);
  const start = lines.findIndex((line) => /^\| ID \| Case \| Expected outcome \|$/.test(line.trim()));
  if (start < 0) throw new Error("Policy-profile composition fixture table header not found.");

  const fixtures: PolicyProfileCompositionFixture[] = [];
  for (const line of lines.slice(start + 2)) {
    if (!line.trim().startsWith("|")) break;
    const cells = line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
    if (!/^POL21-\d{2}$/.test(cells[0] ?? "")) continue;
    if (cells.length !== 3 || !cells[1] || !cells[2]) {
      throw new Error("Malformed policy-profile composition fixture row: " + line);
    }
    fixtures.push({ id: cells[0], caseDescription: cells[1], expectedOutcome: cells[2] });
  }

  const ids = fixtures.map((fixture) => fixture.id);
  if (new Set(ids).size !== ids.length) throw new Error("Duplicate policy-profile composition fixture ID.");
  return fixtures;
}

export const policyProfileCompositionFixtures = parsePolicyProfileCompositionFixtures(policyProfileSpec);
