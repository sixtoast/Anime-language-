import { describe, expect, it } from "vitest";
import { constructionFootMorphologyAudit, reviewConstructionFootFrameVowel } from "./constructionFootMorphologyAudit";

describe("Construction Foot productive morphology evidence audit", () => {
  it("[CON-FOOT-MORPH-001] builds the complete 6 by 6 comparison matrix", () => {
    expect(constructionFootMorphologyAudit.frameVowelMatrix).toHaveLength(36);
    expect(constructionFootMorphologyAudit.coverage.pairCount).toBe(36);
  });
  it("[CON-FOOT-MORPH-002] marks only the six documented CV forms as canonical frame forms", () => {
    const canonical = ["pa", "ba", "ta", "da", "ka", "ga"];
    expect(constructionFootMorphologyAudit.frameVowelMatrix.filter(cell => cell.status === "CANONICAL-CV-FRAME").map(cell => cell.form)).toEqual(canonical);
  });
  it("[CON-FOOT-MORPH-003] does not promote unrecorded combinations to invalid or canonical", () => {
    const result = reviewConstructionFootFrameVowel("p", "u");
    expect(result?.status).toBe("UNRESOLVED-COMBINATION");
    expect(result?.completeFoot).toBe("NOT-ESTABLISHED");
    expect(reviewConstructionFootFrameVowel("x", "a")).toBeNull();
  });
  it("[CON-FOOT-MORPH-004] preserves kan ken kas as whole-token examples", () => {
    expect(constructionFootMorphologyAudit.wholeTokenEvidence.map(item => item.token)).toEqual(["kan", "ken", "kas"]);
    expect(constructionFootMorphologyAudit.wholeTokenEvidence.every(item => item.segmentationStatus === "NOT-ESTABLISHED")).toBe(true);
  });
  it("[CON-FOOT-MORPH-005] does not promote observed final letters to a coda inventory", () => {
    expect(constructionFootMorphologyAudit.observedFinalLetters.letters).toEqual(["n", "s"]);
    expect(constructionFootMorphologyAudit.observedFinalLetters.status).toBe("OCCURRENCES-ONLY-NOT-CODA-INVENTORY");
  });
  it("[CON-FOOT-MORPH-006] preserves both source readings and non-executable status", () => {
    expect(constructionFootMorphologyAudit.sourceConflict.resolution).toBe("UNRESOLVED");
    expect(constructionFootMorphologyAudit.limits).toEqual({
      productiveParadigmRecovered: false, codaInventoryComplete: false,
      parameterSemanticsExecutable: false, completeFootGrammarRecovered: false,
      executable: false, canonEffect: "NONE"
    });
  });
});
