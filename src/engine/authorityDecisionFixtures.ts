import authorityDecisionSpec from "../../docs/canon/arcane-incantations-v2.0-authority-and-authorization-decision-contracts.md?raw";

export interface AuthorityDecisionFixture {
  id: string;
  caseDescription: string;
  expectedOutcome: string;
}

/**
 * Parse the locked v2.0 specification table without interpreting or executing
 * the expected outcomes. These are design fixtures, not authority decisions.
 */
export function parseAuthorityDecisionFixtures(markdown: string): AuthorityDecisionFixture[] {
  const lines = markdown.split(/\r?\n/);
  const start = lines.findIndex((line) => /^\| ID \| Case \| Expected outcome \|$/.test(line.trim()));
  if (start < 0) throw new Error("Authority decision fixture table header not found.");

  const fixtures: AuthorityDecisionFixture[] = [];
  for (const line of lines.slice(start + 2)) {
    if (!line.trim().startsWith("|")) break;
    const cells = line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
    if (!/^AUTH20-\d{2}$/.test(cells[0] ?? "")) continue;
    if (cells.length !== 3 || !cells[1] || !cells[2]) {
      throw new Error("Malformed authority decision fixture row: " + line);
    }
    fixtures.push({
      id: cells[0],
      caseDescription: cells[1],
      expectedOutcome: cells[2]
    });
  }

  const ids = fixtures.map((fixture) => fixture.id);
  if (new Set(ids).size !== ids.length) throw new Error("Duplicate authority decision fixture ID.");
  return fixtures;
}

export const authorityDecisionFixtures = parseAuthorityDecisionFixtures(authorityDecisionSpec);
