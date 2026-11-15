import { describe, expect, it } from "vitest";
import { reviewConstructionFootCandidate } from "./constructionFootCandidateReview";

describe("Construction Foot candidate review", () => {
  it("[FOOT-8CO-001] recognises pa as a canonical CV frame, not a complete Foot", () => {
    const r = reviewConstructionFootCandidate("pa");
    expect(r.status).toBe("CANONICAL-CV-FRAME");
    expect(r.lexicalFootValidity).toBe("NOT-ESTABLISHED");
  });
  it("[FOOT-8CO-002] recognises all six canonical CV frame forms", () => {
    for (const form of ["pa", "ba", "ta", "da", "ka", "ga"]) {
      expect(reviewConstructionFootCandidate(form).status).toBe("CANONICAL-CV-FRAME");
    }
  });
  it("[FOOT-8CO-003] reports the provisional parameter family without making it executable", () => {
    const r = reviewConstructionFootCandidate("pa");
    expect(r.provisionalParameterFamily).toBe("Energy");
    expect(r.executable).toBe(false);
  });
  it("[FOOT-8CO-004] preserves TRAK frame-set association without assigning individual consonant meaning", () => {
    expect(reviewConstructionFootCandidate("pa").frameMacroAssociation).toBe("TRAK");
    expect(reviewConstructionFootCandidate("ba").frameMacroAssociation).toBe("KREN");
  });
  it("[FOOT-8CO-005] keeps an unrecorded frame-vowel pair unresolved", () => {
    expect(reviewConstructionFootCandidate("pu").status).toBe("UNRESOLVED-CV-COMBINATION");
  });
  it("[FOOT-8CO-006] distinguishes all 36 frame-vowel pairs from the six recorded forms", () => {
    const forms = ["a", "u", "o", "e", "i", "ə"].flatMap(v => ["p", "b", "t", "d", "k", "g"].map(c => c + v));
    const recognised = forms.filter(form => reviewConstructionFootCandidate(form).status === "CANONICAL-CV-FRAME");
    expect(recognised).toEqual(["pa", "ba", "ta", "da", "ka", "ga"]);
  });
  it("[FOOT-8CO-007] retains kan as a whole-token example without segmenting it", () => {
    const r = reviewConstructionFootCandidate("kan");
    expect(r.status).toBe("WHOLE-EXAMPLE-TOKEN");
    expect(r.frameConsonant).toBeNull();
    expect(r.relationCoda).toBeNull();
    expect(r.codaMembership).toBe("NOT-SEGMENTED");
  });
  it("[FOOT-8CO-008] retains ken as a whole-token example without segmenting it", () => {
    expect(reviewConstructionFootCandidate("ken").status).toBe("WHOLE-EXAMPLE-TOKEN");
  });
  it("[FOOT-8CO-009] retains kas as a whole-token example without segmenting it", () => {
    expect(reviewConstructionFootCandidate("kas").status).toBe("WHOLE-EXAMPLE-TOKEN");
  });
  it("[FOOT-8CO-010] reports a candidate CVC under both conflicting source readings", () => {
    const r = reviewConstructionFootCandidate("pan");
    expect(r.status).toBe("STRUCTURAL-CVC-CANDIDATE");
    expect(r.sourceReadings?.map(x => x.codaRequirement)).toEqual(["REQUIRED", "OPTIONAL"]);
    expect(r.sourceReadings?.every(x => x.conclusion === "UNRESOLVED")).toBe(true);
  });
  it("[FOOT-8CO-011] does not infer coda membership from a consonant-shaped final letter", () => {
    expect(reviewConstructionFootCandidate("pat").codaMembership).toBe("NOT-ESTABLISHED");
  });
  it("[FOOT-8CO-012] does not silently normalise uppercase forms", () => {
    expect(reviewConstructionFootCandidate("PA").status).toBe("UNSUPPORTED-OR-UNRESOLVED");
  });
  it("[FOOT-8CO-013] does not silently trim whitespace", () => {
    expect(reviewConstructionFootCandidate(" pa ").status).toBe("UNSUPPORTED-OR-UNRESOLVED");
  });
  it("[FOOT-8CO-014] rejects non-string and empty inputs without inventing forms", () => {
    expect(reviewConstructionFootCandidate("").status).toBe("UNSUPPORTED-OR-UNRESOLVED");
    expect(reviewConstructionFootCandidate(null).status).toBe("UNSUPPORTED-OR-UNRESOLVED");
  });
});
