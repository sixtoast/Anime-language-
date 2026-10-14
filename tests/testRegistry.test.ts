import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { workbenchTests } from "../src/engine/testRegistry";

describe("workbench test registry", () => {
  it("[REG-001] keeps test IDs unique and source files present", () => {
    expect(new Set(workbenchTests.map((test) => test.id)).size).toBe(workbenchTests.length);
    for (const test of workbenchTests) {
      expect(test.id.trim()).not.toBe("");
      expect(test.title.trim()).not.toBe("");
      expect(test.description.trim()).not.toBe("");
      expect(test.sourceRule.trim()).not.toBe("");
      expect(existsSync(resolve(process.cwd(), test.file))).toBe(true);
    }
  });

  it("[REG-002] maps every lexicon and fixture-audit registry ID to an annotated source test", () => {
    const traceableGroups = workbenchTests.filter((test) => test.group === "Lexicon" || test.group === "Fixture audit");
    expect(traceableGroups).toHaveLength(31);
    for (const test of traceableGroups) {
      const source = readFileSync(resolve(process.cwd(), test.file), "utf8");
      expect(source, test.id + " in " + test.file).toContain(`[${test.id}] `);
    }
  });

  it("[REG-003] maps each provisional surface-parser test to its stable registry ID", () => {
    const surfaceTests = workbenchTests.filter((test) => test.group === "Surface parser");
    expect(surfaceTests).toHaveLength(19);
    const source = readFileSync(resolve(process.cwd(), "src/engine/surfaceParser.test.ts"), "utf8");
    for (const test of surfaceTests) {
      expect(source).toContain(`[${test.id}] `);
      expect(test.file).toBe("src/engine/surfaceParser.test.ts");
    }
  });

  it("[REG-004] keeps the known decimal-with-unit failure visible as a registered case", () => {
    const decimalCase = workbenchTests.find((test) => test.id === "SURF-002");
    expect(decimalCase).toMatchObject({
      group: "Surface parser",
      file: "src/engine/surfaceParser.test.ts"
    });
    expect(decimalCase?.description).toMatch(/known failing regression/i);
  });
});
