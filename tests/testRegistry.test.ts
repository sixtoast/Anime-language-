import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { workbenchTests } from "../src/engine/testRegistry";

describe("workbench test registry", () => {
  it("keeps test IDs unique and source files present", () => {
    expect(new Set(workbenchTests.map((test) => test.id)).size).toBe(workbenchTests.length);
    for (const test of workbenchTests) {
      expect(test.id.trim()).not.toBe("");
      expect(test.title.trim()).not.toBe("");
      expect(test.description.trim()).not.toBe("");
      expect(test.sourceRule.trim()).not.toBe("");
      expect(existsSync(resolve(process.cwd(), test.file))).toBe(true);
    }
  });

  it("maps each provisional surface-parser test to its stable registry ID", () => {
    const surfaceTests = workbenchTests.filter((test) => test.group === "Surface parser");
    expect(surfaceTests).toHaveLength(19);
    const source = readFileSync(resolve(process.cwd(), "src/engine/surfaceParser.test.ts"), "utf8");
    for (const test of surfaceTests) {
      expect(source).toContain(`[${test.id}] `);
      expect(test.file).toBe("src/engine/surfaceParser.test.ts");
    }
  });

  it("keeps the known decimal-with-unit failure visible as a registered case", () => {
    const decimalCase = workbenchTests.find((test) => test.id === "SURF-002");
    expect(decimalCase).toMatchObject({
      group: "Surface parser",
      file: "src/engine/surfaceParser.test.ts"
    });
    expect(decimalCase?.description).toMatch(/known failing regression/i);
  });
});
