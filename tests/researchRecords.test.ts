import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { evidenceChains } from "../src/evidenceLinks";
import { researchRecords, validateResearchRecords } from "../src/researchRecords";

describe("curated research record register", () => {
  it("keeps stable unique IDs, source files, caveats, and next actions", () => {
    expect(validateResearchRecords()).toEqual([]);
    expect(new Set(researchRecords.map((record) => record.id)).size).toBe(researchRecords.length);
    for (const record of researchRecords) {
      expect(existsSync(resolve(process.cwd(), record.sourcePath))).toBe(true);
      expect(record.summary.trim()).not.toBe("");
      expect(record.nextAction.trim()).not.toBe("");
      expect(record.caveat.trim()).not.toBe("");
    }
  });

  it("links only to existing curated evidence chains", () => {
    for (const record of researchRecords) {
      if (record.relatedChainId) {
        expect(evidenceChains.some((chain) => chain.id === record.relatedChainId)).toBe(true);
      }
    }
  });

  it("ties the RE/RA discrepancy to the two preserved fixture IDs without promoting it to canon", () => {
    const record = researchRecords.find((item) => item.id === "RES-P6G-RE-RA-001");
    const fixtureFile = JSON.parse(readFileSync(resolve(process.cwd(), "tests/fixtures/phase6g-surface-parser-cases.json"), "utf8")) as { cases: Array<{ id: string }> };
    const fixtureIds = new Set(fixtureFile.cases.map((item) => item.id));
    expect(record?.relatedFixtureIds).toEqual(["P6G-FX-011", "P6G-FX-012"]);
    expect(record?.relatedFixtureIds.every((id) => fixtureIds.has(id))).toBe(true);
    expect(record?.caveat).toMatch(/not a decision to change aliases, lexicon, grammar, or parser behaviour/i);
  });

  it("rejects duplicate IDs, missing caveats, and unknown chain links", () => {
    const base = researchRecords[0];
    expect(validateResearchRecords([
      base,
      { ...base, title: "Duplicate" }
    ])).toContain(`Duplicate research record ID: ${base.id}`);
    expect(validateResearchRecords([
      { ...base, caveat: "" }
    ])).toContain(`Research record ${base.id} needs a summary, next action, and caveat.`);
    expect(validateResearchRecords([
      { ...base, relatedChainId: "EVID-DOES-NOT-EXIST" }
    ])).toContain(`Research record ${base.id} references unknown evidence chain EVID-DOES-NOT-EXIST.`);
  });
});
