import { describe, expect, it } from "vitest";
import {
  branCouplingAssociation, handFlameCouplingObservation, hSeriesDomainRecords,
  reviewBranCouplingAssociation, reviewHandFlameCouplingPhrase, reviewHSeriesComposition
} from "./constructionHSeriesComposition";

describe("Phase 8BZ H-series coupling composition evidence", () => {
  it("[HCOUP-001] records six H-series domain labels", () => {
    expect(hSeriesDomainRecords.map(item => item.form)).toEqual(["hə", "he", "ha", "hu", "hi", "ho"]);
  });
  it("[HCOUP-002] preserves versioned source glosses", () => {
    expect(hSeriesDomainRecords.map(item => item.gloss)).toEqual(["mana", "matter", "energy", "living", "information", "field"]);
    expect(hSeriesDomainRecords.every(item => item.version === "v2.0")).toBe(true);
  });
  it("[HCOUP-003] distinguishes a domain label from a coupling instruction", () => {
    const result = reviewHSeriesComposition("he");
    expect(result.status).toBe("DOMAIN-GLOSS-RECORDED");
    expect(result.record?.argumentSignature).toBe("UNRESOLVED");
    expect(result.executable).toBe(false);
  });
  it("[HCOUP-004] records the exact he ha fixture co-occurrence", () => {
    expect(reviewHandFlameCouplingPhrase("he ha").observation).toEqual(handFlameCouplingObservation);
  });
  it("[HCOUP-005] does not infer participant order from he ha", () => {
    const result = reviewHandFlameCouplingPhrase("he ha");
    expect(result.observation?.orderMeaning).toBe("NOT-ESTABLISHED");
    expect(result.observation?.participantMapping).toBe("NOT-ESTABLISHED");
  });
  it("[HCOUP-006] keeps BRAN family association separate from expansion", () => {
    expect(reviewBranCouplingAssociation().macroStatus).toBe("PATTERN-DESCRIBED");
    expect(branCouplingAssociation.expansion).toBe("NOT-RECOVERED");
  });
  it("[HCOUP-007] keeps physical mappings provisional and signatures unresolved", () => {
    expect(hSeriesDomainRecords.every(item => item.physicalMapping === "PROVISIONAL" && item.argumentSignature === "UNRESOLVED")).toBe(true);
  });
  it("[HCOUP-008] fails closed for unknown and blank inputs", () => {
    expect(reviewHSeriesComposition("hx").status).toBe("UNRECOGNISED");
    expect(reviewHSeriesComposition(" ").status).toBe("EMPTY");
    expect(reviewHandFlameCouplingPhrase("he hu").status).toBe("NOT-RECORDED");
  });
  it("[HCOUP-009] normalises repeated whitespace in the exact fixture phrase", () => {
    expect(reviewHandFlameCouplingPhrase("  HE   HA  ").status).toBe("FIXTURE-COOCCURRENCE-RECORDED");
  });
  it("[HCOUP-010] records archived HE/HA annotations as provisional fixture-only evidence", () => {
    const result = reviewHandFlameCouplingPhrase("he ha");
    expect(result.observation?.archivedParser.status).toBe("FIXTURE-ONLY-ARCHIVED-PARSER-ANNOTATION");
    expect(result.observation?.archivedParser.he).toContain("provisional");
    expect(result.observation?.archivedParser.ha).toContain("provisional");
    expect(result.observation?.participantMapping).toBe("NOT-ESTABLISHED");
  });
});
