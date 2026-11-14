import { describe, expect, it } from "vitest";
import { constructionSpatialEvidenceAudit, reviewConstructionSpatialProfile } from "./constructionSpatialEvidenceAudit";

describe("version-bounded Construction spatial evidence", () => {
  it("[CON-SPATIAL-001] keeps the historical fixture profile exact and local", () => {
    const p = reviewConstructionSpatialProfile("HISTORICAL-PHASE-5.22-FIXTURE");
    expect(p?.id).toBe("HISTORICAL-PHASE-5.22-FIXTURE");
    if (p?.id === "HISTORICAL-PHASE-5.22-FIXTURE") {
      expect(p.roleToken).toEqual({ form: "po", reading: "position", status: "FIXTURE-READ" });
      expect(p.axisToken).toEqual({ form: "da", reading: "+Y", status: "FIXTURE-READ" });
      expect(p.generalisable).toBe(false);
    }
  });
  it("[CON-SPATIAL-002] keeps v3.0-L spatial vocabulary separately versioned", () => {
    const p = reviewConstructionSpatialProfile("ARCANE-V3.0-L-SPATIAL-INVENTORY");
    expect(p?.id).toBe("ARCANE-V3.0-L-SPATIAL-INVENTORY");
    if (p?.id === "ARCANE-V3.0-L-SPATIAL-INVENTORY") {
      expect(p.signedAxisForms).toEqual(["PA", "BA", "TA", "DA", "KA", "GA"]);
      expect(p.relationForms).toEqual(["JO", "JUR", "JA", "JE", "JI"]);
      expect(p.geometryForms).toEqual(["PI", "LEN", "PLA", "SUR", "VOM", "PAR"]);
      expect(p.historicalPhase4Equivalence).toBe("NOT-ESTABLISHED");
    }
  });
  it("[CON-SPATIAL-003] does not equate shared da spelling across profiles", () => {
    expect(constructionSpatialEvidenceAudit.crossProfileChecks.find(item => item.surface === "da")?.equivalence).toBe("NOT-ESTABLISHED");
  });
  it("[CON-SPATIAL-004] does not infer a v3.0-L operator from fixture po", () => {
    expect(constructionSpatialEvidenceAudit.crossProfileChecks.find(item => item.surface === "po")?.equivalence).toBe("NOT-ESTABLISHED");
  });
  it("[CON-SPATIAL-005] preserves missing coordinate and quantity contracts", () => {
    expect(constructionSpatialEvidenceAudit.missingDimensions).toContain("coordinate frame selection");
    expect(constructionSpatialEvidenceAudit.missingDimensions).toContain("unit conversion and quantity attachment");
  });
  it("[CON-SPATIAL-006] remains non-executable and does not back-project versions", () => {
    expect(constructionSpatialEvidenceAudit.limits).toEqual({ fixtureGrammarGeneralised: false, v3InventoryBackProjectedToPhase4: false, sharedSpellingImpliesIdentity: false, executable: false, canonEffect: "NONE" });
    expect(reviewConstructionSpatialProfile("UNKNOWN")).toBeNull();
  });
});
