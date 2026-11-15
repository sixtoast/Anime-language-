import { describe, expect, it } from "vitest";
import {
  evaluateConservationContract,
  reconcileResourceBalance,
  type ConservationContractInput,
  type ConservationQuantity,
  type ConservationLossQuantity,
  type ResourceReconciliationInput,
  type ResourceBalanceObservation
} from "./resourceConservation";
import { projectResourceLedger, type LedgerAccount, type LedgerEvent } from "./resourceLedger";

const quantity = (amountTicks: number, overrides: Partial<ConservationQuantity> = {}): ConservationQuantity => ({
  resourceKind: "mana-token",
  amountTicks,
  unit: "tick",
  unitContractId: "mana-tick-v1",
  evidence: "PASS",
  evidenceRef: "evidence:" + amountTicks,
  ...overrides
});

const lossQuantity = (
  amountTicks: number,
  overrides: Partial<ConservationLossQuantity> = {}
): ConservationLossQuantity => ({
  ...quantity(amountTicks),
  permittedPathwayRef: "loss-pathway:v1",
  permittedPathwayEvidence: "PASS",
  permittedPathwayEvidenceRef: "loss-pathway:evidence",
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
  contractEvidenceRef: "contract:evidence",
  boundaryEvidence: "PASS",
  boundaryEvidenceRef: "boundary:evidence",
  uncertaintyRuleRef: "uncertainty-rule:v1",
  uncertaintyPolicyEvidence: "PASS",
  uncertaintyPolicyEvidenceRef: "uncertainty:evidence",
  openingState: [quantity(100)],
  sources: [quantity(20)],
  permittedInputs: [],
  closingState: [quantity(110)],
  sinks: [],
  permittedOutputs: [quantity(10)],
  declaredLosses: [],
  ...overrides
});

const accounts = (): LedgerAccount[] => [{
  accountId: "account-a",
  resourceKind: "mana-token",
  unit: "tick",
  unitContractId: "mana-tick-v1",
  openingBalanceTicks: 100
}];

const ledgerEvent = (overrides: Partial<LedgerEvent> = {}): LedgerEvent => ({
  eventId: "consume-1",
  invocationId: "invocation-1",
  resourceKind: "mana-token",
  eventKind: "CONSUME",
  fromAccount: "account-a",
  amountTicks: 10,
  unit: "tick",
  unitContractId: "mana-tick-v1",
  status: "CONFIRMED",
  evidence: "PASS",
  idempotencyKey: "consume-1",
  ...overrides
});

const measurementObservation = (
  overrides: Partial<ResourceBalanceObservation> = {}
): ResourceBalanceObservation => ({
  category: "MEASUREMENT",
  balanceTicks: 90,
  observedAt: "2026-06-01T00:00:00Z",
  methodRef: "method:account-meter-v1",
  uncertaintyRef: "uncertainty:measurement-1",
  provenanceRef: "provenance:source-1",
  evidence: "PASS",
  evidenceRef: "measurement:1",
  policyAcceptanceEvidence: "PASS",
  policyAcceptanceEvidenceRef: "uncertainty-policy-acceptance:1",
  ...overrides
});

const reconciliation = (overrides: Partial<ResourceReconciliationInput> = {}): ResourceReconciliationInput => ({
  reconciliationId: "recon-1",
  contract: contract(),
  accountId: "account-a",
  accounts: accounts(),
  events: [ledgerEvent()],
  observation: measurementObservation(),
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

  it("[RES19-CONS-002] reports mismatches and accepts only the explicit tolerance", () => {
    expect(evaluateConservationContract(contract({ closingState: [quantity(109)] })))
      .toMatchObject({ outcome: "CONSERVATION-MISMATCH", differenceTicks: 1 });
    expect(evaluateConservationContract(contract({
      closingState: [quantity(109)],
      toleranceTicks: 1
    })).outcome).toBe("CONSERVATION-SATISFIED");
  });

  it("[RES19-CONS-003] preserves unsupported invariants and unresolved evidence", () => {
    expect(evaluateConservationContract(contract({ invariant: "VECTOR-RELATIONAL-INVARIANT" })).outcome)
      .toBe("CONSERVATION-UNRESOLVED");
    expect(evaluateConservationContract(contract({ boundaryEvidence: "UNKNOWN" })).outcome)
      .toBe("CONSERVATION-UNRESOLVED");
    expect(evaluateConservationContract(contract({
      sources: [quantity(20, { evidence: "UNAVAILABLE" })]
    })).outcome).toBe("CONSERVATION-UNRESOLVED");
  });

  it("[RES19-CONS-004] requires explicit boundary, interval and uncertainty-rule evidence references", () => {
    expect(evaluateConservationContract(contract({ systemBoundary: "" })).outcome)
      .toBe("CONSERVATION-INVALID-CONTRACT");
    expect(evaluateConservationContract(contract({
      validInterval: { start: "2027-01-01T00:00:00Z", end: "2026-01-01T00:00:00Z" }
    })).outcome).toBe("CONSERVATION-INVALID-CONTRACT");
    expect(evaluateConservationContract(contract({ uncertaintyRuleRef: "" })).outcome)
      .toBe("CONSERVATION-INVALID-CONTRACT");
    expect(evaluateConservationContract(contract({ evaluationTime: "June 2026" })).outcome)
      .toBe("CONSERVATION-INVALID-CONTRACT");
  });

  it("[RES19-CONS-005] rejects unsafe integer accumulation rather than using floating-point totals", () => {
    expect(evaluateConservationContract(contract({
      openingState: [quantity(Number.MAX_SAFE_INTEGER), quantity(1)],
      sources: []
    })).outcome).toBe("CONSERVATION-UNRESOLVED");
  });

  it("[RES19-CONS-006] refuses to count a declared loss without a permitted pathway and evidence references", () => {
    const missingPathway = evaluateConservationContract(contract({
      openingState: [quantity(100)],
      sources: [],
      closingState: [quantity(90)],
      declaredLosses: [lossQuantity(10, { permittedPathwayRef: "" })]
    }));
    expect(missingPathway.outcome).toBe("CONSERVATION-UNRESOLVED");
    expect(missingPathway.diagnostics).toContainEqual(expect.objectContaining({
      code: "CONSERVATION-LOSS-PATHWAY-MISSING"
    }));

    const missingEvidenceReference = evaluateConservationContract(contract({
      openingState: [quantity(100)],
      sources: [],
      closingState: [quantity(90)],
      declaredLosses: [lossQuantity(10, { permittedPathwayEvidenceRef: "" })]
    }));
    expect(missingEvidenceReference.outcome).toBe("CONSERVATION-UNRESOLVED");
    expect(missingEvidenceReference.diagnostics).toContainEqual(expect.objectContaining({
      code: "CONSERVATION-LOSS-PATHWAY-MISSING"
    }));
  });

  it("[RES19-CONS-007] keeps declared losses unresolved when permitted-pathway evidence is not passing", () => {
    for (const evidence of ["FAIL", "UNKNOWN", "UNAVAILABLE"] as const) {
      const result = evaluateConservationContract(contract({
        openingState: [quantity(100)],
        sources: [],
        closingState: [quantity(90)],
        declaredLosses: [lossQuantity(10, { permittedPathwayEvidence: evidence })]
      }));
      expect(result.outcome).toBe("CONSERVATION-UNRESOLVED");
      expect(result.diagnostics).toContainEqual(expect.objectContaining({
        code: "CONSERVATION-LOSS-PATHWAY-EVIDENCE-UNRESOLVED"
      }));
    }
  });

  it("[RES19-CONS-008] counts a declared loss only when its permitted pathway is explicitly evidenced", () => {
    const result = evaluateConservationContract(contract({
      openingState: [quantity(100)],
      sources: [],
      closingState: [quantity(90)],
      permittedOutputs: [],
      declaredLosses: [lossQuantity(10)]
    }));
    expect(result).toMatchObject({
      outcome: "CONSERVATION-SATISFIED",
      leftTotalTicks: 100,
      rightTotalTicks: 100,
      differenceTicks: 0
    });
  });

  it("[RES19-RECON-001] derives the expected account balance from the confirmed ledger projection", () => {
    expect(reconcileResourceBalance(reconciliation())).toMatchObject({
      outcome: "ACCOUNT-BALANCE-RECONCILED",
      scope: "ACCOUNT-BALANCE-ONLY",
      expectedBalanceTicks: 90,
      observedBalanceTicks: 90,
      discrepancyTicks: 0,
      ledgerOutcome: "LEDGER-PROJECTED"
    });
  });

  it("[RES19-RECON-002] preserves a signed discrepancy without correcting the ledger", () => {
    expect(reconcileResourceBalance(reconciliation({ observation: measurementObservation({ balanceTicks: 87 }) }))).toMatchObject({
      outcome: "ACCOUNT-BALANCE-DISCREPANCY",
      expectedBalanceTicks: 90,
      observedBalanceTicks: 87,
      discrepancyTicks: -3
    });
  });

  it("[RES19-RECON-003] leaves partial ledger projections and unavailable observations unresolved", () => {
    const partialEvents = [ledgerEvent({ amountTicks: 101 })];
    expect(reconcileResourceBalance(reconciliation({ events: partialEvents })).outcome).toBe("UNRESOLVED");
    expect(reconcileResourceBalance(reconciliation({ observation: measurementObservation({ evidence: "UNKNOWN" }) })).outcome).toBe("UNRESOLVED");
    expect(reconcileResourceBalance(reconciliation({ observation: measurementObservation({ balanceTicks: null }) })).outcome).toBe("UNRESOLVED");
    expect(reconcileResourceBalance(reconciliation({
      contract: { ...contract(), uncertaintyPolicyEvidence: "UNKNOWN" }
    })).outcome).toBe("UNRESOLVED");
  });

  it("[RES19-RECON-004] requires the selected account to match the declared contract", () => {
    expect(reconcileResourceBalance(reconciliation({
      contract: { ...contract(), unitContractId: "other-unit-contract" }
    })).outcome).toBe("INVALID-RECONCILIATION");
    expect(reconcileResourceBalance(reconciliation({ accounts: [] })).outcome)
      .toBe("INVALID-RECONCILIATION");
  });

  it("[RES19-RECON-005] requires the contract's explicit non-negative tolerance and an observation evidence reference", () => {
    expect(reconcileResourceBalance(reconciliation({
      contract: { ...contract(), toleranceTicks: -1 }
    })).outcome).toBe("INVALID-RECONCILIATION");
    expect(reconcileResourceBalance(reconciliation({ observation: measurementObservation({ evidenceRef: "" }) })).outcome)
      .toBe("INVALID-RECONCILIATION");
  });

  it("[RES19-RECON-009] uses only the tolerance declared by the conservation contract", () => {
    const withinTolerance = reconcileResourceBalance(reconciliation({
      contract: { ...contract(), toleranceTicks: 3 },
      observation: measurementObservation({ balanceTicks: 87 })
    }));
    expect(withinTolerance).toMatchObject({
      outcome: "ACCOUNT-BALANCE-RECONCILED",
      discrepancyTicks: -3,
      toleranceTicks: 3
    });

    const outsideTolerance = reconcileResourceBalance(reconciliation({
      contract: { ...contract(), toleranceTicks: 2 },
      observation: measurementObservation({ balanceTicks: 87 })
    }));
    expect(outsideTolerance).toMatchObject({
      outcome: "ACCOUNT-BALANCE-DISCREPANCY",
      discrepancyTicks: -3,
      toleranceTicks: 2
    });
  });

  it("[RES19-RECON-006] rejects observations outside the contract valid interval", () => {
    expect(reconcileResourceBalance(reconciliation({
      observation: measurementObservation({ observedAt: "2028-01-01T00:00:00Z" })
    })).outcome).toBe("INVALID-RECONCILIATION");
  });

  it("[RES19-RECON-007] compares gross balance rather than treating a held reservation as consumption", () => {
    const reserve = ledgerEvent({
      eventId: "reserve-1",
      eventKind: "RESERVE",
      amountTicks: 40,
      reservationId: "reservation-1",
      idempotencyKey: "reserve-1"
    });
    const result = reconcileResourceBalance(reconciliation({
      events: [reserve],
      observation: measurementObservation({ balanceTicks: 100 })
    }));
    expect(result).toMatchObject({
      outcome: "ACCOUNT-BALANCE-RECONCILED",
      expectedBalanceTicks: 100
    });
    const projection = projectResourceLedger(accounts(), [reserve]);
    expect(projection.available["account-a"]).toBe(60);
    expect(projection.balances["account-a"]).toBe(100);
  });

  it("[RES19-RECON-008] leaves ledger inputs unchanged and does not claim whole-resource reconciliation", () => {
    const input = reconciliation();
    const before = JSON.stringify({ accounts: input.accounts, events: input.events });
    const result = reconcileResourceBalance(input);
    expect(JSON.stringify({ accounts: input.accounts, events: input.events })).toBe(before);
    expect(result.scope).toBe("ACCOUNT-BALANCE-ONLY");
    expect(result.limitations.join(" ")).toContain("does not by itself satisfy the whole-resource RESOURCE-RECONCILED stage");
  });

  it("[RES19-RECON-010] rejects an estimate presented as a measured account balance", () => {
    const result = reconcileResourceBalance(reconciliation({
      observation: measurementObservation({ category: "ESTIMATE" })
    }));
    expect(result.outcome).toBe("UNRESOLVED");
    expect(result.diagnostics).toContainEqual(expect.objectContaining({
      code: "RECONCILIATION-EVIDENCE-CATEGORY-SUBSTITUTION"
    }));
  });

  it("[RES19-RECON-011] requires measurement method, time, uncertainty and provenance", () => {
    for (const overrides of [
      { methodRef: "" },
      { uncertaintyRef: "" },
      { provenanceRef: "" }
    ]) {
      const result = reconcileResourceBalance(reconciliation({
        observation: measurementObservation(overrides)
      }));
      expect(result.outcome).toBe("UNRESOLVED");
      expect(result.diagnostics).toContainEqual(expect.objectContaining({
        code: "RECONCILIATION-MEASUREMENT-METADATA-MISSING"
      }));
    }

    expect(reconcileResourceBalance(reconciliation({
      observation: measurementObservation({ observedAt: "" })
    })).outcome).toBe("INVALID-RECONCILIATION");
  });

  it("[RES19-RECON-012] requires explicit passing acceptance under the uncertainty policy", () => {
    for (const evidence of ["FAIL", "UNKNOWN", "UNAVAILABLE"] as const) {
      const result = reconcileResourceBalance(reconciliation({
        observation: measurementObservation({ policyAcceptanceEvidence: evidence })
      }));
      expect(result.outcome).toBe("UNRESOLVED");
      expect(result.diagnostics).toContainEqual(expect.objectContaining({
        code: "RECONCILIATION-MEASUREMENT-POLICY-UNRESOLVED"
      }));
    }

    const missingAcceptanceReference = reconcileResourceBalance(reconciliation({
      observation: measurementObservation({ policyAcceptanceEvidenceRef: "" })
    }));
    expect(missingAcceptanceReference.outcome).toBe("UNRESOLVED");
    expect(missingAcceptanceReference.diagnostics).toContainEqual(expect.objectContaining({
      code: "RECONCILIATION-MEASUREMENT-METADATA-MISSING"
    }));
  });

});
