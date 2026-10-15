import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { evidenceChains, validateEvidenceChains } from "../src/evidenceLinks";

describe("shared evidence chains", () => {
  it("[EVID-001] links only to repository paths that currently exist", () => {
    const missing = evidenceChains.flatMap((chain) => chain.nodes
      .filter((node) => !existsSync(resolve(process.cwd(), node.path)))
      .map((node) => `${chain.id}: ${node.path}`));
    expect(missing).toEqual([]);
  });

  it("[EVID-002] uses unique stable IDs and provides an explicit caveat for every chain", () => {
    expect(validateEvidenceChains()).toEqual([]);
    expect(new Set(evidenceChains.map((chain) => chain.id)).size).toBe(evidenceChains.length);
    expect(evidenceChains.every((chain) => chain.caveat.trim().length > 0)).toBe(true);
  });

  it("[EVID-003] links the provisional operator audit to its implementation and regression tests", () => {
    const chain = evidenceChains.find((item) => item.id === "EVID-LAN-005-006");
    expect(chain?.ruleIds).toEqual(["LAN-005", "LAN-006"]);
    expect(chain?.nodes.map((node) => node.path)).toContain("src/engine/auditParser.md");
    expect(chain?.nodes.map((node) => node.path)).toContain("src/engine/auditParser.test.ts");
    expect(chain?.nodes.find((node) => node.path === "src/engine/auditParser.test.ts")?.recordIds).toContain("PARSE-003");
    expect(chain?.caveat).toMatch(/does not establish full semantic typing/i);
  });

  it("[EVID-004] keeps dimensional primitives explicitly separate from full semantic validation", () => {
    const chain = evidenceChains.find((item) => item.id === "EVID-LAN-010-011");
    expect(chain?.nodes.map((node) => node.path)).toContain("src/engine/dimensions.test.ts");
    expect(chain?.nodes.find((node) => node.path === "src/engine/dimensions.test.ts")?.recordIds).toContain("DIM-003");
    expect(chain?.caveat).toMatch(/not integrated with parsed expressions/i);
  });

  it("[EVID-005] preserves Phase 6G fixture observations as provisional evidence, not canon", () => {
    const chain = evidenceChains.find((item) => item.id === "EVID-P6G-FIXTURES");
    expect(chain?.status).toBe("provisional observation");
    expect(chain?.nodes.map((node) => node.path)).toContain("tests/fixtures/phase6g-surface-parser-cases.json");
    expect(chain?.nodes.find((node) => node.path === "tests/fixtures/phase6g-surface-parser-cases.json")?.recordIds).toContain("P6G-FX-016");
    expect(chain?.caveat).toMatch(/not authoritative grammar/i);
  });

  it("[EVID-006] detects duplicate IDs, repeated paths, and missing relationship explanations", () => {
    const base = evidenceChains[0];
    const invalid = [
      base,
      {
        ...base,
        nodes: [
          ...base.nodes,
          { ...base.nodes[0], relationship: "" }
        ]
      }
    ];
    const issues = validateEvidenceChains(invalid);
    expect(issues.some((issue) => issue.includes("Duplicate evidence-chain ID"))).toBe(true);
    expect(issues.some((issue) => issue.includes("repeats path"))).toBe(true);
    expect(issues.some((issue) => issue.includes("unexplained relationship"))).toBe(true);
  });
});
