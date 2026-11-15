import { describe, expect, it } from "vitest";
import {
  compareConstructionSurfacesAcrossVersions,
  handFlameFixtureTraceability,
  reviewHandFlameFixtureTraceability
} from "./constructionFixtureTraceability";

describe("Construction fixture phrase traceability", () => {
  it("[CON-FIXTURE-001] preserves the six exact historical phrase groups", () => {
    const review = reviewHandFlameFixtureTraceability();
    expect(review.phraseCount).toBe(6);
    expect(review.allPhraseSurfacesReconstructExactFixture).toBe(true);
  });
  it("[CON-FIXTURE-002] attaches claims and source references to exact phrase surfaces", () => {
    const spatial = handFlameFixtureTraceability.phrases[1];
    expect(spatial.surface).toBe("po da za shi to za ma");
    expect(spatial.evidenceReferences.length).toBeGreaterThan(0);
    expect(spatial.recordedClaims).toHaveLength(3);
  });
  it("[CON-FIXTURE-003] leaves the fifth phrase unresolved", () => {
    const phrase = handFlameFixtureTraceability.phrases[4];
    expect(phrase.surface).toBe("sa shi za se");
    expect(phrase.interpretationStatus).toBe("UNRESOLVED");
    expect(phrase.recordedClaims).toHaveLength(0);
  });
  it("[CON-FIXTURE-004] does not map six phrases to seven Construction stages", () => {
    const review = reviewHandFlameFixtureTraceability();
    expect(review.phraseCount).toBe(6);
    expect(review.stageMapping).toBe("NOT-ESTABLISHED");
  });
  it("[CON-FIXTURE-005] does not equate exact cross-version surface matches", () => {
    const comparison = compareConstructionSurfacesAcrossVersions("fixture-v1", "da", "inventory-v3", "da");
    expect(comparison.surfaceRelation).toBe("EXACT-SURFACE-MATCH");
    expect(comparison.tokenIdentity).toBe("NOT-ESTABLISHED");
    expect(comparison.semanticEquivalence).toBe("NOT-ESTABLISHED");
  });
  it("[CON-FIXTURE-006] keeps fixture traceability non-executable and canon-neutral", () => {
    const review = reviewHandFlameFixtureTraceability();
    expect(review.executable).toBe(false);
    expect(review.canonEffect).toBe("NONE");
    expect(review.grammarValidity).toBe("NOT-ASSESSED");
  });
});
