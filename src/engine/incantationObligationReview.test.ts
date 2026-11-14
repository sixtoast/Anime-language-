import { describe, expect, it } from "vitest";
import {
  INCANTATION_OBLIGATION_IDS,
  INCANTATION_OBLIGATION_PROFILE,
  reviewIncantationObligations,
  type IncantationObligationSet
} from "./incantationObligationReview";

const completeLedger = (): IncantationObligationSet => ({
  "OPERATION": { applicability: "REQUIRED", resolution: "RESOLVED", evidenceRef: "spell.operation", basis: "EXPLICIT" },
  "TARGET-REFERENCE": { applicability: "REQUIRED", resolution: "RESOLVED", evidenceRef: "spell.target-binding", basis: "VISIBLE-BINDING" },
  "MECHANISM-COUPLING": { applicability: "NOT-APPLICABLE", resolution: "RESOLVED", evidenceRef: "analysis.mechanism", rationale: "The declared operation is a symbolic assignment and has no physical coupling in this profile." },
  "SPATIAL-ROLE": { applicability: "NOT-APPLICABLE", resolution: "RESOLVED", evidenceRef: "analysis.spatial", rationale: "The operation does not declare a spatially relevant role." },
  "CONSTRAINTS": { applicability: "REQUIRED", resolution: "RESOLVED", evidenceRef: "spell.constraints", basis: "EXPLICIT" },
  "RESOURCE-FEASIBILITY": { applicability: "REQUIRED", resolution: "RESOLVED", evidenceRef: "spell.resource-feasibility", basis: "EXPLICIT" },
  "OUTCOME": { applicability: "REQUIRED", resolution: "RESOLVED", evidenceRef: "spell.outcome", basis: "EXPLICIT" }
});

describe("Phase 8CQ evidence-aware Incantation obligation review", () => {
  it("[INC-OBL-001] fixes the seven v1.0 semantic obligation identifiers", () => {
    expect(INCANTATION_OBLIGATION_IDS).toEqual([
      "OPERATION", "TARGET-REFERENCE", "MECHANISM-COUPLING", "SPATIAL-ROLE",
      "CONSTRAINTS", "RESOURCE-FEASIBILITY", "OUTCOME"
    ]);
  });

  it("[INC-OBL-002] requires the exact versioned obligation profile", () => {
    const result = reviewIncantationObligations({ profile: "LATEST", obligations: completeLedger() });
    expect(result.disposition).toBe("INVALID-REVIEW-SHAPE");
    expect(result.issues[0]).toContain(INCANTATION_OBLIGATION_PROFILE);
  });

  it("[INC-OBL-003] rejects non-object review inputs", () => {
    expect(reviewIncantationObligations(null).disposition).toBe("INVALID-REVIEW-SHAPE");
    expect(reviewIncantationObligations("spell").disposition).toBe("INVALID-REVIEW-SHAPE");
  });

  it("[INC-OBL-004] requires all seven obligation declarations", () => {
    const ledger = completeLedger() as unknown as Record<string, unknown>;
    delete ledger["OUTCOME"];
    const result = reviewIncantationObligations({ profile: INCANTATION_OBLIGATION_PROFILE, obligations: ledger });
    expect(result.disposition).toBe("REQUIRED-OBLIGATION-UNRESOLVED");
    expect(result.results.find((entry) => entry.id === "OUTCOME")?.status).toBe("INVALID-ENTRY");
  });

  it("[INC-OBL-005] does not permit operation to be declared not applicable", () => {
    const ledger = completeLedger();
    ledger.OPERATION.applicability = "NOT-APPLICABLE";
    expect(reviewIncantationObligations({ profile: INCANTATION_OBLIGATION_PROFILE, obligations: ledger }).disposition)
      .toBe("INVALID-REVIEW-SHAPE");
  });

  it("[INC-OBL-006] does not permit target/reference to be declared not applicable", () => {
    const ledger = completeLedger();
    ledger["TARGET-REFERENCE"].applicability = "NOT-APPLICABLE";
    expect(reviewIncantationObligations({ profile: INCANTATION_OBLIGATION_PROFILE, obligations: ledger }).disposition)
      .toBe("INVALID-REVIEW-SHAPE");
  });

  it("[INC-OBL-007] accepts an explicit evidence basis for a required obligation", () => {
    const result = reviewIncantationObligations({ profile: INCANTATION_OBLIGATION_PROFILE, obligations: completeLedger() });
    expect(result.results.find((entry) => entry.id === "OPERATION")?.status).toBe("SATISFIED-BY-EXPLICIT-EVIDENCE");
  });

  it("[INC-OBL-008] accepts a separately visible binding as the target evidence basis", () => {
    const result = reviewIncantationObligations({ profile: INCANTATION_OBLIGATION_PROFILE, obligations: completeLedger() });
    expect(result.results.find((entry) => entry.id === "TARGET-REFERENCE")?.status).toBe("SATISFIED-BY-VISIBLE-BINDING");
  });

  it("[INC-OBL-009] blocks a required obligation without an evidence reference", () => {
    const ledger = completeLedger();
    delete ledger.OUTCOME.evidenceRef;
    const result = reviewIncantationObligations({ profile: INCANTATION_OBLIGATION_PROFILE, obligations: ledger });
    expect(result.disposition).toBe("REQUIRED-OBLIGATION-UNRESOLVED");
    expect(result.results.find((entry) => entry.id === "OUTCOME")?.status).toBe("REQUIRED-EVIDENCE-UNRESOLVED");
  });

  it("[INC-OBL-010] blocks a required obligation without an explicit or visible-binding basis", () => {
    const ledger = completeLedger();
    delete ledger.OPERATION.basis;
    const result = reviewIncantationObligations({ profile: INCANTATION_OBLIGATION_PROFILE, obligations: ledger });
    expect(result.results.find((entry) => entry.id === "OPERATION")?.status).toBe("REQUIRED-EVIDENCE-UNRESOLVED");
  });

  it("[INC-OBL-011] requires a rationale and evidence reference for not-applicable roles", () => {
    const ledger = completeLedger();
    ledger["SPATIAL-ROLE"].rationale = " ";
    const result = reviewIncantationObligations({ profile: INCANTATION_OBLIGATION_PROFILE, obligations: ledger });
    expect(result.disposition).toBe("NOT-APPLICABLE-JUSTIFICATION-MISSING");
  });

  it("[INC-OBL-012] keeps unresolved applicability distinct from not applicable", () => {
    const ledger = completeLedger();
    ledger["MECHANISM-COUPLING"] = { applicability: "UNRESOLVED", resolution: "UNRESOLVED" };
    const result = reviewIncantationObligations({ profile: INCANTATION_OBLIGATION_PROFILE, obligations: ledger });
    expect(result.disposition).toBe("APPLICABILITY-UNRESOLVED");
    expect(result.results.find((entry) => entry.id === "MECHANISM-COUPLING")?.status).toBe("APPLICABILITY-UNRESOLVED");
  });

  it("[INC-OBL-013] rejects unexpected obligation keys rather than silently ignoring them", () => {
    const ledger = { ...completeLedger(), "INVENTED-OPERATOR": { applicability: "REQUIRED", resolution: "RESOLVED" } };
    const result = reviewIncantationObligations({ profile: INCANTATION_OBLIGATION_PROFILE, obligations: ledger });
    expect(result.disposition).toBe("INVALID-REVIEW-SHAPE");
  });

  it("[INC-OBL-014] never upgrades an accounted ledger into grammar validity or execution", () => {
    const result = reviewIncantationObligations({ profile: INCANTATION_OBLIGATION_PROFILE, obligations: completeLedger() });
    expect(result.disposition).toBe("OBLIGATIONS-ACCOUNTED-FOR");
    expect(result.grammarValidation).toBe("NOT-PERFORMED");
    expect(result.semanticValidation).toBe("NOT-PERFORMED");
    expect(result.feasibility).toBe("NOT-ASSESSED");
    expect(result.authorisation).toBe("NOT-ASSESSED");
    expect(result.executable).toBe(false);
    expect(result.canonEffect).toBe("NONE");
  });
});
