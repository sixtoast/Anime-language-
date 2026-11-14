import { describe, expect, it } from "vitest";
import { evaluateResourceConservationPreview } from "./resourceConservationPreview";

describe("read-only v1.9 conservation and account-reconciliation preview", () => {
  it("[RES19-PREVIEW-001] evaluates a balanced synthetic conservation and account sample", () => {
    const result = evaluateResourceConservationPreview("BALANCED");
    expect(result.conservation).toMatchObject({
      outcome: "CONSERVATION-SATISFIED",
      leftTotalTicks: 120,
      rightTotalTicks: 120,
      differenceTicks: 0,
      toleranceTicks: 0
    });
    expect(result.reconciliation).toMatchObject({
      outcome: "ACCOUNT-BALANCE-RECONCILED",
      scope: "ACCOUNT-BALANCE-ONLY",
      expectedBalanceTicks: 90,
      observedBalanceTicks: 90,
      discrepancyTicks: 0,
      toleranceTicks: 0
    });
  });

  it("[RES19-PREVIEW-002] keeps conservation mismatch separate from account reconciliation", () => {
    const result = evaluateResourceConservationPreview("CONSERVATION-MISMATCH");
    expect(result.conservation).toMatchObject({
      outcome: "CONSERVATION-MISMATCH",
      leftTotalTicks: 120,
      rightTotalTicks: 119,
      differenceTicks: 1
    });
    expect(result.reconciliation.outcome).toBe("ACCOUNT-BALANCE-RECONCILED");
  });

  it("[RES19-PREVIEW-003] preserves a signed account discrepancy without correction", () => {
    const result = evaluateResourceConservationPreview("ACCOUNT-DISCREPANCY");
    expect(result.conservation.outcome).toBe("CONSERVATION-SATISFIED");
    expect(result.reconciliation).toMatchObject({
      outcome: "ACCOUNT-BALANCE-DISCREPANCY",
      expectedBalanceTicks: 90,
      observedBalanceTicks: 88,
      discrepancyTicks: -2
    });
  });

  it("[RES19-PREVIEW-004] refuses to substitute an estimate for a measurement", () => {
    const result = evaluateResourceConservationPreview("ESTIMATE-AS-MEASUREMENT");
    expect(result.conservation.outcome).toBe("CONSERVATION-SATISFIED");
    expect(result.reconciliation.outcome).toBe("UNRESOLVED");
    expect(result.reconciliation.diagnostics).toContainEqual(expect.objectContaining({
      code: "RECONCILIATION-EVIDENCE-CATEGORY-SUBSTITUTION"
    }));
  });

  it("[RES19-PREVIEW-005] keeps unknown measurement-policy acceptance unresolved", () => {
    const result = evaluateResourceConservationPreview("MEASUREMENT-POLICY-UNRESOLVED");
    expect(result.conservation.outcome).toBe("CONSERVATION-SATISFIED");
    expect(result.reconciliation.outcome).toBe("UNRESOLVED");
    expect(result.reconciliation.diagnostics).toContainEqual(expect.objectContaining({
      code: "RECONCILIATION-MEASUREMENT-POLICY-UNRESOLVED"
    }));
  });

  it("[RES19-PREVIEW-006] never turns unresolved contract evidence into a passing result", () => {
    const result = evaluateResourceConservationPreview("CONTRACT-EVIDENCE-UNRESOLVED");
    expect(result.conservation.outcome).toBe("CONSERVATION-UNRESOLVED");
    expect(result.reconciliation.outcome).toBe("UNRESOLVED");
    expect(result.reconciliation.diagnostics).toContainEqual(expect.objectContaining({
      code: "RECONCILIATION-CONTRACT-EVIDENCE-UNRESOLVED"
    }));
  });

  it("[RES19-PREVIEW-007] preserves an unknown resource outcome beside a structurally present audit record", () => {
    const result = evaluateResourceConservationPreview("AUDIT-STRUCTURE-PRESENT-UNKNOWN-OUTCOME");
    expect(result.conservation.outcome).toBe("CONSERVATION-UNRESOLVED");
    expect(result.reconciliation.outcome).toBe("UNRESOLVED");
    expect(result.auditStructure).toMatchObject({
      status: "AUDIT-STRUCTURE-PRESENT",
      reportedResourceOutcome: "RESOURCE-OUTCOME-UNKNOWN",
      outcomeInterpretation: "NOT-ASSESSED",
      missingSections: []
    });
    expect(result.auditStructure?.limitations).toContain(
      "Only the presence of the 14 top-level v1.9 record sections is checked; their shapes, contents and internal completeness are not validated."
    );
  });
});
