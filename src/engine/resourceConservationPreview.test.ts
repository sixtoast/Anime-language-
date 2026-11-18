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
    expect(result.assumptions).toContain(
      "The opening balance is timestamped at the sample interval start, and the supplied event is strictly ordered before the sample observation; boundary-equal times are deliberately unresolved."
    );
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

  it("[RES19-PREVIEW-008] keeps unknown event-batch completeness separate from a passing conservation balance", () => {
    const result = evaluateResourceConservationPreview("EVENT-BATCH-COMPLETENESS-UNRESOLVED");
    expect(result.conservation.outcome).toBe("CONSERVATION-SATISFIED");
    expect(result.reconciliation.outcome).toBe("UNRESOLVED");
    expect(result.reconciliation.diagnostics).toContainEqual(expect.objectContaining({
      code: "RECONCILIATION-EVENT-BATCH-COMPLETENESS-UNRESOLVED"
    }));
    expect(result.assumptions).toContain(
      "Event-batch completeness is a synthetic caller-supplied assertion scoped to the sample contract, boundary, account set and observation time; it is not authenticated or independently verified."
    );
  });

  it("[RES19-PREVIEW-009] demonstrates matching source and destination account balances", () => {
    const result = evaluateResourceConservationPreview("TRANSFER-RECONCILED");
    expect(result.conservation.outcome).toBe("CONSERVATION-SATISFIED");
    expect(result.accountSetReconciliation).toMatchObject({
      outcome: "ACCOUNT-SET-RECONCILED",
      accountResults: [
        { accountId: "preview-account-source", expectedBalanceTicks: 80, observedBalanceTicks: 80 },
        { accountId: "preview-account-destination", expectedBalanceTicks: 30, observedBalanceTicks: 30 }
      ]
    });
  });

  it("[RES19-PREVIEW-010] keeps a source-less transfer unresolved despite a balanced aggregate sample", () => {
    const result = evaluateResourceConservationPreview("TRANSFER-SOURCE-DEBIT-MISSING");
    expect(result.conservation).toMatchObject({
      outcome: "CONSERVATION-SATISFIED", leftTotalTicks: 110, rightTotalTicks: 110
    });
    expect(result.accountSetReconciliation?.outcome).toBe("UNRESOLVED");
    expect(result.accountSetReconciliation?.accountResults.every((item) => item.outcome === "UNRESOLVED")).toBe(true);
  });

});
