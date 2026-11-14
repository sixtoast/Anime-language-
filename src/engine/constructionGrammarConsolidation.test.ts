import { describe, expect, it } from "vitest";
import { auditConstructionGrammarEvidence, constructionGrammarConsolidation, constructionGrammarEvidenceSummary } from "./constructionGrammarConsolidation";
import { constructionFixtureProfile } from "./constructionParseTreeContract";

describe("Phase 8AW Construction grammar evidence consolidation", () => {
  it("CON-GRAM-001 recognises only the exact historical fixture as valid", () => {
    const result = auditConstructionGrammarEvidence(constructionFixtureProfile.exactSurface);
    expect(result.classification).toBe("VALID");
    expect(result.scope).toBe("EXACT-HISTORICAL-FIXTURE");
    expect(result.accepted).toBe(true);
  });
  it("CON-GRAM-002 classifies a partial ordered stage sequence as incomplete", () => {
    const result = auditConstructionGrammarEvidence(["reference", "spatial-role-vector", "construction-feet"]);
    expect(result.classification).toBe("INCOMPLETE");
    expect(result.accepted).toBe(false);
  });
  it("CON-GRAM-003 preserves the CVC versus optional-coda conflict", () => {
    expect(constructionGrammarConsolidation.footMorphology).toBe("AMBIGUOUS-CVC-VS-OPTIONAL-CODA");
  });
  it("CON-GRAM-004 does not map six phrases one-to-one to seven stages", () => {
    expect(constructionGrammarConsolidation.fixtureProfile.phraseCount).toBe(6);
    expect(constructionGrammarConsolidation.performedStages).toHaveLength(7);
    expect(constructionGrammarConsolidation.phraseToStageMapping).toBe("NOT-ESTABLISHED");
    expect(constructionGrammarConsolidation.explicitControlPhraseInFixtureTree).toBe(false);
  });
  it("CON-GRAM-005 retains provisional coupling status", () => {
    expect(constructionGrammarConsolidation.layers.find(layer => layer.id === "COUPLING-AND-MACROS")?.status).toBe("PROVISIONAL-OR-EXAMPLE-LEVEL");
  });
  it("CON-GRAM-006 does not generalise K-series example aliases", () => {
    expect(constructionGrammarConsolidation.limitations.some(item => item.includes("KAN/KEN/KAS"))).toBe(true);
  });
  it("CON-GRAM-007 classifies arbitrary strings as unsupported", () => {
    expect(auditConstructionGrammarEvidence("mel po unknown").classification).toBe("UNSUPPORTED");
  });
  it("CON-GRAM-008 keeps fixture quantity tables version-scoped", () => {
    expect(constructionGrammarConsolidation.limitations.some(item => item.includes("digit, unit, axis and role"))).toBe(true);
  });
  it("CON-GRAM-009 does not back-project v3.0-L spatial inventory", () => {
    expect(constructionGrammarConsolidation.limitations.some(item => item.includes("not back-projected"))).toBe(true);
  });
  it("CON-GRAM-010 remains non-executable and canon-neutral", () => {
    const result = auditConstructionGrammarEvidence(constructionFixtureProfile.exactSurface);
    expect(result.executable).toBe(false);
    expect(result.canonEffect).toBe("NONE");
    expect(constructionGrammarEvidenceSummary().stageCount).toBe(7);
  });
});
