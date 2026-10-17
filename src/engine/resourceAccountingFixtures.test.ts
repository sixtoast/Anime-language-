import { describe, expect, it } from "vitest";
import resourceAccountingSpec from "../../docs/canon/arcane-incantations-v1.9-resource-accounting-and-conservation-contracts.md?raw";
import { parseResourceAccountingFixtures, resourceAccountingFixtures } from "./resourceAccountingFixtures";

describe("Arcane Incantations v1.9 resource-accounting specification fixtures", () => {
  it("[RES19-TEST-001] reads all 60 fixtures directly from the canonical specification", () => {
    expect(resourceAccountingFixtures).toHaveLength(60);
    expect(resourceAccountingFixtures[0]?.id).toBe("RES19-01");
    expect(resourceAccountingFixtures.at(-1)?.id).toBe("RES19-60");
  });

  it("[RES19-TEST-002] preserves unique stable fixture identities", () => {
    const ids = resourceAccountingFixtures.map((fixture) => fixture.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(Array.from({ length: 60 }, (_, index) => "RES19-" + String(index + 1).padStart(2, "0")));
  });

  it("[RES19-TEST-003] retains the conservative budget-bound case", () => {
    expect(resourceAccountingFixtures.find((fixture) => fixture.id === "RES19-10")).toMatchObject({
      caseDescription: "Expected consumption is under cap but required upper bound exceeds cap",
      expectedResult: "BUDGET-EXCEEDED"
    });
  });

  it("[RES19-TEST-004] retains the prohibition on implicit mana-to-energy conversion", () => {
    expect(resourceAccountingFixtures.find((fixture) => fixture.id === "RES19-26")?.expectedResult)
      .toContain("no implicit conversion");
  });

  it("[RES19-TEST-005] distinguishes preflight readiness from execution", () => {
    expect(resourceAccountingFixtures.find((fixture) => fixture.id === "RES19-38")?.expectedResult)
      .toContain("RESOURCE-READY at most");
  });

  it("[RES19-TEST-006] rejects malformed fixture rows rather than silently truncating them", () => {
    expect(() => parseResourceAccountingFixtures("# no fixture table")).toThrow("table header not found");
    expect(() => parseResourceAccountingFixtures(
      resourceAccountingSpec.replace(
        "| RES19-01 | Resource kind is declared but dimension/unit contract is absent where required | RESOURCE-SPEC-UNDERSPECIFIED |",
        "| RES19-01 | broken row |"
      )
    )).toThrow("Malformed resource accounting fixture row");
  });

  it("[RES19-TEST-007] exposes fixture source text with explicit design/runtime boundary", () => {
    expect(resourceAccountingSpec).toContain("not evidence of an executable resource evaluator");
    expect(resourceAccountingSpec).toContain("No generic transformation from mana to energy");
  });
});
