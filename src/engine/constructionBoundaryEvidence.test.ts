import { describe, expect, it } from "vitest";
import { auditConstructionFixtureBoundaries, constructionBoundaryEvidence } from "./constructionBoundaryEvidence";
import { constructionFixtureProfile } from "./constructionParseTreeContract";

describe("Construction boundary evidence", () => {
  it("[CON-BOUND-001] records five middle-dot separators in the six-phrase fixture", () => {
    expect(constructionBoundaryEvidence.marker).toBe("·");
    expect(constructionBoundaryEvidence.occurrences).toBe(5);
    expect(constructionBoundaryEvidence.separatesPhraseIndices).toEqual([1,2,3,4,5]);
  });
  it("[CON-BOUND-002] accepts only the exact recovered fixture", () => {
    expect(auditConstructionFixtureBoundaries(constructionFixtureProfile.exactSurface).accepted).toBe(true);
    expect(auditConstructionFixtureBoundaries("mel po da za shi to za ma · kan ken").accepted).toBe(false);
  });
  it("[CON-BOUND-003] does not promote fixture punctuation to universal syntax", () => {
    expect(constructionBoundaryEvidence.generalRuleEstablished).toBe(false);
    expect(constructionBoundaryEvidence.clauseSemanticsEstablished).toBe(false);
    expect(auditConstructionFixtureBoundaries(constructionFixtureProfile.exactSurface).generalParser).toBe(false);
  });
  it("[CON-BOUND-004] distinguishes phrase boundaries from whitespace tokenisation", () => {
    expect(auditConstructionFixtureBoundaries(constructionFixtureProfile.exactSurface).phraseCount).toBe(6);
    expect(auditConstructionFixtureBoundaries(constructionFixtureProfile.exactSurface).markerCount).toBe(5);
  });
});
