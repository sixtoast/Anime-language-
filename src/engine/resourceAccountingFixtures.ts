import resourceAccountingSpec from "../../docs/canon/arcane-incantations-v1.9-resource-accounting-and-conservation-contracts.md?raw";

export interface ResourceAccountingFixture {
  id: string;
  caseDescription: string;
  expectedResult: string;
}

export function parseResourceAccountingFixtures(markdown: string): ResourceAccountingFixture[] {
  const lines = markdown.split(/\r?\n/);
  const start = lines.findIndex((line) => /^\| ID \| Case \| Expected result \|$/.test(line.trim()));
  if (start < 0) throw new Error("Resource accounting fixture table header not found.");

  const fixtures: ResourceAccountingFixture[] = [];
  for (const line of lines.slice(start + 2)) {
    if (!line.trim().startsWith("|")) break;
    const cells = line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
    if (!/^RES19-\d{2}$/.test(cells[0] ?? "")) continue;
    if (cells.length !== 3 || !cells[1] || !cells[2]) {
      throw new Error("Malformed resource accounting fixture row: " + line);
    }
    fixtures.push({
      id: cells[0],
      caseDescription: cells[1],
      expectedResult: cells[2]
    });
  }

  const ids = fixtures.map((fixture) => fixture.id);
  if (new Set(ids).size !== ids.length) throw new Error("Duplicate resource accounting fixture ID.");
  return fixtures;
}

export const resourceAccountingFixtures = parseResourceAccountingFixtures(resourceAccountingSpec);
