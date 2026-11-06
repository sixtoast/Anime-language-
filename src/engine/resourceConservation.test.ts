import { describe, expect, it } from "vitest";
import {
  evaluateConservationContract,
  reconcileResourceBalance,
  type ConservationContractInput,
  type ConservationQuantity,
  type ResourceReconciliationInput
} from "./resourceConservation";

const quantity = (amountTicks: number, overrides: Partial<ConservationQuantity> = {}): ConservationQuantity => ({
  resourceKind: "mana-token",
  amountTicks,
  unit: "tick",
  unitContractId: "mana-tick-v1",
  evidence: "PASS",
  evidenceRef: "evidence:" + amountTicks,
  ...overrides
});

const contract = (overrides: Partial<ConservationContractInput> = {}): ConservationContractInput => ({
  contractId: "conservation-v1",
  resourceKind: "mana-token",
  unit: "tick",
  unitContractId: "mana-tick-v1",
  systemBoundary: "bounded-test-system",
  validInterval: { start: "2026-01-01T00:00:00Z", end: "2027-01-01T00:00:00Z" },
  evaluationTime: "2026-06-01T00:00:00Z",
  invariant: "SCALAR-ADDITIVE-BALANCE",
  toleranceTicks: 0,
  contractEvidence: "PASS",
  boundaryEvidence: "PASS",
  uncertaintyPolicyEvidence: "PASS",
  openingState: [quantity(100)],
  sources: [quantity(20)],
  permittedInputs: [],
  closingState: [quantity(110)],
  sinks: [],
  permittedOutputs: [quantity(10)],
  declaredLosses: [],
  ...overrides
});

const reconciliation = (overrides: Partial<ResourceReconciliationInput> = {}): ResourceReconciliationInput => ({
  reconciliationId: "recon-1",
  contractId: "conservation-v1",
  accountId: "account-a",
  resourceKind: "mana-token",
  unit: "tick",
  unitContractId: "mana-tick-v1",
  expectedBalanceTicks: 90,
  observedBalanceTicks: 90,
  toleranceTicks: 0,
  observedAt: "2026-06-01T00:00:00Z",
  evidence: "PASS",
  evidenceRef: "measurement:1",
  ...overrides
});

describe("Arcane Incantations v1.9 conservation and reconciliation", () => {
  it("[RES19-CONS-001] evaluates a balanced scalar contract within its declared boundary", () => {
    expect(evaluateConservationContract(contract())).toMatchObject({
      outcome: "CONSERVATION-SATISFIED",
      leftTotalTicks: 120,
      rightTotalTicks: 120,
      differenceTicks: 0
    });
  });

  it("[RES19-CONS-002] reports a mismatch outside explicit tolerance", () => {
    const result = evaluateConservationContract(contract({ closingState: [quantity(109)] }));
    expect(result).toMatchObject({ outcome: "CONSERVATION-MISMATCH", differenceTicks: 1 });
  });

  it("[RES19-CONS-003] accepts only an explicitly declared tolerance", () => {
    expect(evaluateConservationContract(contract({
      closingState: [quantity(109)],
      toleranceTicks: 1
    })).outcome).toBe("CONSERVATION-SATISFIED");
  });

  it("[RES19-CONS-004] does not infer a scalar invariant for unsupported resource structures", () => {
    expect(evaluateConservationContract(contract({ invariant: "VECTOR-RELATIONAL-INVARIANT" })).outcome)
      .toBe("CONSERVATION-UNRESOLVED");
  });

  it("[RES19-CONS-005] preserves unresolved boundary or measurement evidence", () => {
    expect(evaluateConservationContract(contract({ boundaryEvidence: "UNKNOWN" })).outcome)
      .toBe("CONSERVATION-UNRESOLVED");
    expect(evaluateConservationContract(contract({
      sources: [quantity(20, { evidence: "UNAVAILABLE" })]
    })).outcome).toBe("CONSERVATION-UNRESOLVED");
  });

  it("[RES19-CONS-006] rejects mismatched resource kinds and unit contracts", () => {
    const result = evaluateConservationContract(contract({
      permittedInputs: [quantity(1, { unitContractId: "other-contract" })]
    }));
    expect(result.outcome).toBe("CONSERVATION-UNRESOLVED");
    expect(result.diagnostics.some(item => item.code === "CONSERVATION-TERM-INVALID")).toBe(true);
  });

  it("[RES19-CONS-007] requires an explicit system boundary and valid interval", () => {
    expect(evaluateConservationContract(contract({ systemBoundary: "" })).outcome)
      .toBe("CONSERVATION-INVALID-CONTRACT");
    expect(evaluateConservationContract(contract({
      validInterval: { start: "2027-01-01T00:00:00Z", end: "2026-01-01T00:00:00Z" }
    })).outcome).toBe("CONSERVATION-INVALID-CONTRACT");
  });

  it("[RES19-CONS-008] does not claim conservation when the evaluation time is outside the contract interval", () => {
    expect(evaluateConservationContract(contract({
      evaluationTime: "2028-01-01T00:00:00Z"
    })).outcome).toBe("CONSERVATION-INVALID-CONTRACT");
  });

  it("[RES19-RECON-001] reconciles an observed balance against the expected ledger projection", () => {
    expect(reconcileResourceBalance(reconciliation())).toMatchObject({
      outcome: "RECONCILED",
      discrepancyTicks: 0
    });
  });

  it("[RES19-RECON-002] records a discrepancy without silently correcting the balance", () => {
    expect(reconcileResourceBalance(reconciliation({ observedBalanceTicks: 87 }))).toMatchObject({
      outcome: "DISCREPANCY",
      expectedBalanceTicks: 90,
      observedBalanceTicks: 87,
      discrepancyTicks: -3
    });
  });

  it("[RES19-RECON-003] preserves unknown and unavailable observations", () => {
    expect(reconcileResourceBalance(reconciliation({ evidence: "UNKNOWN" })).outcome).toBe("UNRESOLVED");
    expect(reconcileResourceBalance(reconciliation({ observedBalanceTicks: null })).outcome).toBe("UNRESOLVED");
  });

  it("[RES19-RECON-004] requires an explicit tolerance and evidence reference", () => {
    expect(reconcileResourceBalance(reconciliation({ toleranceTicks: -1 })).outcome)
      .toBe("INVALID-RECONCILIATION");
    expect(reconcileResourceBalance(reconciliation({ evidenceRef: "" })).outcome)
      .toBe("INVALID-RECONCILIATION");
  });

  it("[RES19-RECON-005] states that reconciliation never mutates the ledger or proves execution", () => {
    expect(reconcileResourceBalance(reconciliation()).limitations.join(" "))
      .toContain("no ledger entries or account balances are changed");
  });
});
