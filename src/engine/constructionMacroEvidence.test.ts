import { describe, expect, it } from "vitest";
import { constructionMacroEvidence, reviewConstructionMacro } from "./constructionMacroEvidence";
describe("Operational Construction macro evidence", () => {
  it("[CON-MACRO-001] preserves all six recorded operational forms", () => {
    expect(constructionMacroEvidence.map(item => item.form)).toEqual(["TRAK", "KREN", "FREM", "SHREN", "BRAN", "VARE"]);
  });
  it("[CON-MACRO-002] distinguishes TRAK's described discrete-change pattern", () => {
    expect(reviewConstructionMacro("trak").entry?.recoveredEvidence).toContain("p, t and k");
  });
  it("[CON-MACRO-003] keeps KREN as a proposal requiring confirmation", () => {
    expect(reviewConstructionMacro("KREN").status).toBe("PROPOSED");
    expect(reviewConstructionMacro("KREN").entry?.unresolvedContract).toContain("owner confirmation");
  });
  it("[CON-MACRO-004] preserves FREM and SHREN as partial examples", () => {
    expect(reviewConstructionMacro("FREM").status).toBe("PARTIAL-EXAMPLE");
    expect(reviewConstructionMacro("SHREN").status).toBe("PARTIAL-EXAMPLE");
  });
  it("[CON-MACRO-005] keeps BRAN composition unresolved", () => {
    expect(reviewConstructionMacro("BRAN").entry?.unresolvedContract).toContain("participant order");
  });
  it("[CON-MACRO-006] records VARE as a described role, not an executable contract", () => {
    expect(reviewConstructionMacro("VARE").status).toBe("ROLE-DESCRIBED");
    expect(reviewConstructionMacro("VARE").entry?.executable).toBe(false);
  });
  it("[CON-MACRO-007] never marks a recovered macro executable", () => {
    expect(constructionMacroEvidence.every(item => item.executable === false)).toBe(true);
  });
  it("[CON-MACRO-008] fails closed for unknown and blank input", () => {
    expect(reviewConstructionMacro("UNKNOWN").status).toBe("UNRECOGNISED");
    expect(reviewConstructionMacro(" ").status).toBe("EMPTY");
  });
});
