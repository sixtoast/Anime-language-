import { describe, expect, it } from "vitest";
import { reviewConstructionFootMorphology, footMorphologyEvidenceBoundary } from "./constructionFootMorphologyReview";

describe("Phase 8CD Construction Foot morphology evidence review", () => {
  it("[FOOT-MORPH-001] recognises all six source-backed CV frame forms", () => {
    expect(["pa","ba","ta","da","ka","ga"].map(x => reviewConstructionFootMorphology(x).status))
      .toEqual(Array(6).fill("FRAME-FORM-RECORDED"));
  });
  it("[FOOT-MORPH-002] does not classify a CV frame as a complete Foot", () => {
    expect(reviewConstructionFootMorphology("pa").lexicalFootValidity).toBe("NOT-ESTABLISHED");
    expect(footMorphologyEvidenceBoundary.frameFormsAreCompleteFeet).toBe(false);
  });
  it("[FOOT-MORPH-003] recognises CVC shape only as a structural candidate", () => {
    const result = reviewConstructionFootMorphology("pat");
    expect(result.status).toBe("CVC-STRUCTURE-CANDIDATE");
    expect(result.lexicalFootValidity).toBe("NOT-ESTABLISHED");
  });
  it("[FOOT-MORPH-004] does not infer coda meaning from an arbitrary final consonant", () => {
    const result = reviewConstructionFootMorphology("pak");
    expect(result.relationCoda).toBe("k");
    expect(result.codaMeaning).toBe("NOT-RECOVERED");
  });
  it("[FOOT-MORPH-005] keeps parameter-vowel families provisional", () => {
    expect(reviewConstructionFootMorphology("pa").parameterFamily).toBe("Energy");
    expect(footMorphologyEvidenceBoundary.parameterFamiliesAreProvisional).toBe(true);
  });
  it("[FOOT-MORPH-006] keeps TRAK and KREN frame groups distinct", () => {
    expect(reviewConstructionFootMorphology("pa").macroAssociation).toBe("TRAK");
    expect(reviewConstructionFootMorphology("ba").macroAssociation).toBe("KREN");
  });
  it("[FOOT-MORPH-007] preserves KREN owner-confirmation status", () => {
    const result = reviewConstructionFootMorphology("ba");
    expect(result.macroAssociation).toBe("KREN");
    expect(result.explanation).toContain("does not define individual consonant meaning");
  });
  it("[FOOT-MORPH-008] does not infer individual frame-consonant semantics", () => {
    expect(reviewConstructionFootMorphology("ta").lexicalFootValidity).toBe("NOT-ESTABLISHED");
    expect(reviewConstructionFootMorphology("ta").macroAssociation).toBe("TRAK");
  });
  it("[FOOT-MORPH-009] fails closed for unknown or malformed forms", () => {
    expect(reviewConstructionFootMorphology("xa").status).toBe("UNRECOGNISED-SHAPE");
    expect(reviewConstructionFootMorphology("paa").status).toBe("UNRECOGNISED-SHAPE");
    expect(reviewConstructionFootMorphology("")).toBeTruthy();
  });
  it("[FOOT-MORPH-010] never marks a recognised form executable", () => {
    for (const form of ["pa","ba","pat","bak"]) expect(reviewConstructionFootMorphology(form).executable).toBe(false);
  });
});
