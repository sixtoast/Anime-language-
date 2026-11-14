import { describe, expect, it } from "vitest";
import { constructionFootSourceRecovery, reviewConstructionFootSourceForm } from "./constructionFootSourceRecovery";

describe("Phase 8AX Construction Foot source recovery", () => {
  it("CON-FOOT-SRC-001 recognises canonical CV forms as frame forms only", () => {
    for (const form of ["pa", "ba", "ta", "da", "ka", "ga"]) {
      expect(reviewConstructionFootSourceForm(form).status).toBe("CANONICAL-CV-FRAME-FORM");
    }
    expect(reviewConstructionFootSourceForm("pa").message).toContain("not a complete CVC Foot");
  });
  it("CON-FOOT-SRC-002 records KAN as a whole example token", () => {
    expect(reviewConstructionFootSourceForm("kan").status).toBe("OBSERVED-WHOLE-EXAMPLE-TOKEN");
    expect(reviewConstructionFootSourceForm("kan").message).toContain("TRAK ENRA");
  });
  it("CON-FOOT-SRC-003 records KEN as a whole example token", () => {
    expect(reviewConstructionFootSourceForm("ken").message).toContain("FREM / structure held");
  });
  it("CON-FOOT-SRC-004 records KAS as a whole example token", () => {
    expect(reviewConstructionFootSourceForm("kas").message).toContain("SHREN / release");
  });
  it("CON-FOOT-SRC-005 does not treat n and s as a complete coda inventory", () => {
    expect(constructionFootSourceRecovery.observedFinalLetters).toEqual(["n", "s"]);
    expect(constructionFootSourceRecovery.codaInventoryStatus).toBe("INCOMPLETE-AND-UNRESOLVED");
  });
  it("CON-FOOT-SRC-006 preserves the CVC versus optional-coda conflict", () => {
    expect(constructionFootSourceRecovery.footShapeDiscrepancy.status).toBe("UNRESOLVED-SOURCE-DISCREPANCY");
  });
  it("CON-FOOT-SRC-007 does not infer segment meanings from aliases", () => {
    expect(constructionFootSourceRecovery.observedWholeTokens.every(item => item.segmentationStatus === "NOT-ESTABLISHED")).toBe(true);
  });
  it("CON-FOOT-SRC-008 leaves other CVC-shaped forms unresolved", () => {
    expect(reviewConstructionFootSourceForm("pan").status).toBe("STRUCTURE-ONLY-UNRESOLVED");
    expect(reviewConstructionFootSourceForm("paz").status).toBe("STRUCTURE-ONLY-UNRESOLVED");
  });
  it("CON-FOOT-SRC-009 retains provisional parameter families", () => {
    expect(constructionFootSourceRecovery.parameterFamilies.every(item => item.status === "PROVISIONAL")).toBe(true);
  });
  it("CON-FOOT-SRC-010 records source provenance and non-executable boundary", () => {
    expect(constructionFootSourceRecovery.source.gitBlobSha).toBe("e6202bdf9a3c726e4103aece1ba711a287d5899d");
    expect(constructionFootSourceRecovery.executable).toBe(false);
    expect(constructionFootSourceRecovery.canonEffect).toBe("NONE");
  });
});
