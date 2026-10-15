import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { workbenchTests } from "../src/engine/testRegistry";

function collectVitestFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return collectVitestFiles(path);
    return entry.isFile() && entry.name.endsWith(".test.ts") ? [path] : [];
  });
}

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

  it("[REG-002] maps lexicon, fixture, workbench and documentation IDs to annotated source tests", () => {
    const traceableGroups = workbenchTests.filter((test) => test.group === "Lexicon" || test.group === "Fixture audit" || test.group === "Workbench integrity" || test.group === "Documentation");
    expect(traceableGroups).toHaveLength(55);
    for (const test of traceableGroups) {
      const source = readFileSync(resolve(process.cwd(), test.file), "utf8");
      expect(source, test.id + " in " + test.file).toContain(`[${test.id}] `);
    }
  });

  it("[REG-003] maps each provisional surface-parser test to its stable registry ID", () => {
    const surfaceTests = workbenchTests.filter((test) => test.group === "Surface parser");
    expect(surfaceTests).toHaveLength(20);
    const source = readFileSync(resolve(process.cwd(), "src/engine/surfaceParser.test.ts"), "utf8");
    for (const test of surfaceTests) {
      expect(source).toContain(`[${test.id}] `);
      expect(test.file).toBe("src/engine/surfaceParser.test.ts");
    }
  });

  it("[REG-004] keeps decimal-with-unit argument coverage registered", () => {
    const decimalCase = workbenchTests.find((test) => test.id === "SURF-002");
    expect(decimalCase).toMatchObject({
      group: "Surface parser",
      file: "src/engine/surfaceParser.test.ts"
    });
    expect(decimalCase?.description).toMatch(/second argument to FRAPA/i);
  });

  it("[REG-005] requires every Vitest test case to have exactly one registry entry", () => {
    const sourceIds: string[] = [];
    for (const file of collectVitestFiles(resolve(process.cwd(), "src"))) {
      const source = readFileSync(file, "utf8");
      for (const match of source.matchAll(/\bit\(\s*["'\x60]\[((?:[A-Z0-9]+-)+\d{3})\]\s/g)) {
        sourceIds.push(match[1]);
      }
    }
    for (const file of collectVitestFiles(resolve(process.cwd(), "tests"))) {
      const source = readFileSync(file, "utf8");
      for (const match of source.matchAll(/\bit\(\s*["'\x60]\[((?:[A-Z0-9]+-)+\d{3})\]\s/g)) {
        sourceIds.push(match[1]);
      }
    }
    expect(sourceIds.length).toBeGreaterThan(0);
    expect(new Set(sourceIds).size).toBe(sourceIds.length);
    expect([...sourceIds].sort()).toEqual(workbenchTests.map((test) => test.id).sort());
  });
});
