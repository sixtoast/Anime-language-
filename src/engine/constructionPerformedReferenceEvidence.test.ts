import { describe, expect, it } from "vitest";
import { performedReferenceEvidence, reviewPerformedReferenceEvidence } from "./constructionPerformedReferenceEvidence";

describe("partially recovered Performed reference homophones", () => {
  it("[CON-REF-SRC-001] records re as TARGET-surface", () => {
    const result = reviewPerformedReferenceEvidence("re");
    expect(result.status).toBe("PARTIALLY-RECOVERED");
    expect(result.entry?.performedReading).toBe("TARGET-surface");
    expect(result.entry?.sharedCollision).toContain("digit 4");
  });
  it("[CON-REF-SRC-002] records ra as TARGET-path", () => {
    const result = reviewPerformedReferenceEvidence("ra");
    expect(result.status).toBe("PARTIALLY-RECOVERED");
    expect(result.entry?.performedReading).toBe("TARGET-path");
    expect(result.entry?.sharedCollision).toContain("radian");
  });
  it("[CON-REF-SRC-003] preserves slot-sensitive homophone limits", () => {
    expect(performedReferenceEvidence).toHaveLength(2);
    expect(performedReferenceEvidence.every(item => item.status === "PARTIALLY-RECOVERED")).toBe(true);
    expect(reviewPerformedReferenceEvidence("re").message).toContain("slot-sensitive");
  });
  it("never creates a formal reference binding", () => {
    expect(reviewPerformedReferenceEvidence("re").createsBinding).toBe(false);
    expect(reviewPerformedReferenceEvidence("ra").createsBinding).toBe(false);
  });
  it("normalises case and surrounding whitespace", () => {
    expect(reviewPerformedReferenceEvidence(" RA ").entry?.form).toBe("ra");
  });
  it("returns bounded results for empty and unknown input", () => {
    expect(reviewPerformedReferenceEvidence(" ").status).toBe("EMPTY");
    expect(reviewPerformedReferenceEvidence("ri").status).toBe("UNRECOGNISED");
  });
});
