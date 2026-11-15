import { describe, expect, it } from "vitest";
import { constructionStageInterfaceAudit, reviewConstructionStageInterfaceAudit } from "./constructionStageInterfaceAudit";

describe("Construction stage interface evidence audit", () => {
  it("[CON-IFACE-001] audits all six recovered adjacent stage boundaries", () => {
    expect(constructionStageInterfaceAudit.boundaries).toHaveLength(6);
    expect(constructionStageInterfaceAudit.boundaries.map(item => item.id)).toEqual([
      "reference->spatial-role-vector",
      "spatial-role-vector->construction-feet",
      "construction-feet->couplings",
      "couplings->quantity",
      "quantity->control",
      "control->release"
    ]);
  });
  it("[CON-IFACE-002] distinguishes precedence from data dependency", () => {
    for (const boundary of constructionStageInterfaceAudit.boundaries) {
      expect(boundary.orderEvidence).toBe("SOURCE-BACKED-PRECEDENCE");
      expect(boundary.interfaceStatus).toBe("UNRECOVERED");
      expect(boundary.dataDependency).toBe("NOT-ESTABLISHED");
    }
  });
  it("[CON-IFACE-003] keeps all six interface dimensions unresolved", () => {
    for (const boundary of constructionStageInterfaceAudit.boundaries) {
      expect(boundary.unresolvedDimensions).toEqual([
        "INPUT-TYPE", "OUTPUT-TYPE", "ATTACHMENT", "CARDINALITY", "OMISSION", "FAILURE-BEHAVIOUR"
      ]);
    }
  });
  it("[CON-IFACE-004] reports a known boundary as precedence-only", () => {
    const result = reviewConstructionStageInterfaceAudit("construction-feet->couplings");
    expect(result.status).toBe("PRECEDENCE-ONLY");
    expect(result.unresolvedCount).toBe(6);
    expect(result.executable).toBe(false);
  });
  it("[CON-IFACE-005] rejects unknown boundary identifiers without inventing a relation", () => {
    expect(reviewConstructionStageInterfaceAudit("reference->release").status).toBe("UNKNOWN-BOUNDARY");
    expect(reviewConstructionStageInterfaceAudit(null).status).toBe("UNKNOWN-BOUNDARY");
  });
  it("[CON-IFACE-006] cannot promote the audit into an executable grammar", () => {
    expect(constructionStageInterfaceAudit.limits).toEqual({
      executable: false, canonEffect: "NONE", noDataFlowInference: true
    });
  });
});
