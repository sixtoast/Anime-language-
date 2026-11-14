import { describe, expect, it } from "vitest";
import {
  constructionMacroVersionProvenanceAudit as audit,
  reviewConstructionMacroVersionProvenance
} from "./constructionMacroVersionProvenanceAudit";

describe("Phase 8CJ Construction macro version provenance", () => {
  it("[MACRO-CJ-001] compares all six recorded macro forms", () => {
    expect(audit.comparisons.map(item => item.form)).toEqual(["TRAK", "KREN", "FREM", "SHREN", "BRAN", "VARE"]);
  });
  it("[MACRO-CJ-002] finds all six forms in the v3.0 canon section", () => {
    expect(audit.currentCanonSection.forms).toHaveLength(6);
    expect(audit.conclusions.v3CanonVocabularyPresence).toBe("SOURCE-CONFIRMED");
  });
  it("[MACRO-CJ-003] records gloss agreement without claiming morphology continuity", () => {
    expect(audit.conclusions.matchingGlossCount).toBe(6);
    expect(audit.comparisons.every(item => item.glossSurfaceAgreement)).toBe(true);
    expect(audit.comparisons.every(item => item.morphologyContinuity === "NOT-ESTABLISHED")).toBe(true);
  });
  it("[MACRO-CJ-004] preserves Phase 4 KREN proposal status", () => {
    expect(reviewConstructionMacroVersionProvenance("kren")?.phase4EvidenceStatus).toBe("PROPOSED");
  });
  it("[MACRO-CJ-005] does not backfill later canon into historical evidence", () => {
    expect(audit.comparisons.every(item => item.permissionToBackfillPhase4 === false)).toBe(true);
  });
  it("[MACRO-CJ-006] preserves the CSV section citation verbatim", () => {
    expect(audit.draftLexiconCitationAudit.rows.every(row => row.source === "Magic v3.0 §26")).toBe(true);
  });
  it("[MACRO-CJ-007] flags the available Markdown §13 versus CSV §26 discrepancy", () => {
    expect(audit.draftLexiconCitationAudit.citationConsistency).toBe("SECTION-REFERENCE-MISMATCH-REQUIRES-REVIEW");
  });
  it("[MACRO-CJ-008] does not assume the citation mismatch's cause", () => {
    expect(audit.draftLexiconCitationAudit.explanation).toContain("does not assume either explanation");
  });
  it("[MACRO-CJ-009] leaves macro signatures unresolved", () => {
    expect(audit.conclusions.macroSignatures).toBe("UNRESOLVED");
    expect(audit.comparisons.every(item => item.signatureContinuity === "NOT-ESTABLISHED")).toBe(true);
  });
  it("[MACRO-CJ-010] fails closed for unknown forms", () => {
    expect(reviewConstructionMacroVersionProvenance("unknown")).toBeNull();
    expect(reviewConstructionMacroVersionProvenance(null)).toBeNull();
  });
  it("[MACRO-CJ-011] keeps the cross-version audit non-executable", () => {
    expect(audit.conclusions.executable).toBe(false);
  });
  it("[MACRO-CJ-012] has no canon effect", () => {
    expect(audit.conclusions.canonEffect).toBe("NONE");
  });
});
