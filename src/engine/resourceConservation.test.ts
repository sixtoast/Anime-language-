import { describe, expect, it } from "vitest";
import {
  evaluateConservationContract,
  reconcileResourceBalance,
  reconcileResourceAccountSet,
  type ConservationContractInput,
  type ConservationQuantity,
  type ConservationLossQuantity,
  type ResourceReconciliationInput,
  type ResourceReconciliationAccount,
  type ResourceReconciliationBatchEvidence,
  type ResourceReconciliationEvent,
  type ResourceBalanceObservation,
  type ResourceAccountBalanceObservation,
  type ResourceAccountSetReconciliationInput
} from "./resourceConservation";
import { projectResourceLedger } from "./resourceLedger";

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

const contract = (overrides: Partial<ConservationContractInput> = {}): ConservationContractInput & { preflightContractVersionRef: string } => ({
  contractId: "conservation-v1",
  preflightContractVersionRef: "resource-contract:v1",
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

const accounts = (): ResourceReconciliationAccount[] => [{
  accountId: "account-a",
  resourceKind: "mana-token",
  unit: "tick",
  unitContractId: "mana-tick-v1",
  openingBalanceTicks: 100,
  openingBalanceAsOf: "2026-01-01T00:00:00Z"
}];

const ledgerEvent = (overrides: Partial<ResourceReconciliationEvent> = {}): ResourceReconciliationEvent => ({
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
  validTime: "2026-05-01T00:00:00Z",
  contractVersionRef: "resource-contract:v1",
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

const batchEvidence = (
  overrides: Partial<ResourceReconciliationBatchEvidence> = {}
): ResourceReconciliationBatchEvidence => ({
  contractId: "conservation-v1",
  systemBoundary: "bounded-test-system",
  accountIds: ["account-a"],
  openingSnapshotAsOf: "2026-01-01T00:00:00Z",
  observationTime: "2026-06-01T00:00:00Z",
  contractVersionRef: "resource-contract:v1",
  completenessEvidence: "PASS",
  completenessEvidenceRef: "event-batch:evidence",
  ...overrides
});

const reconciliation = (overrides: Partial<ResourceReconciliationInput> = {}): ResourceReconciliationInput => ({
  reconciliationId: "recon-1",
  contract: contract(),
  accountId: "account-a",
  accounts: accounts(),
  events: [ledgerEvent()],
  eventBatchEvidence: batchEvidence(),
  observation: measurementObservation(),
  ...overrides
});


const accountSetReconciliation = (
  overrides: Partial<ResourceAccountSetReconciliationInput> = {}
): ResourceAccountSetReconciliationInput => {
  const accountA: ResourceReconciliationAccount = {
    accountId: "account-a", resourceKind: "mana-token", unit: "tick",
    unitContractId: "mana-tick-v1", openingBalanceTicks: 100,
    openingBalanceAsOf: "2026-01-01T00:00:00Z"
  };
  const accountB: ResourceReconciliationAccount = {
    accountId: "account-b", resourceKind: "mana-token", unit: "tick",
    unitContractId: "mana-tick-v1", openingBalanceTicks: 10,
    openingBalanceAsOf: "2026-01-01T00:00:00Z"
  };
  const observations: ResourceAccountBalanceObservation[] = [
    { accountId: "account-a", ...measurementObservation({ balanceTicks: 80 }) },
    { accountId: "account-b", ...measurementObservation({ balanceTicks: 30 }) }
  ];
  return {
    reconciliationId: "recon-account-set-1",
    contract: contract(),
    accounts: [accountA, accountB],
    events: [ledgerEvent({
      eventId: "transfer-1", eventKind: "TRANSFER", fromAccount: "account-a",
      toAccount: "account-b", amountTicks: 20, idempotencyKey: "transfer-1"
    })],
    eventBatchEvidence: batchEvidence({ accountIds: ["account-a", "account-b"] }),
    observations,
    ...overrides
  };
};

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

  it("[RES19-CONS-009] leaves exact valid-interval boundaries unresolved", () => {
    const base = contract();
    const boundaryTimes = [
      base.validInterval.start,
      base.validInterval.end,
      "2025-12-31T19:00:00-05:00",
      "2026-12-31T19:00:00-05:00"
    ];

    for (const evaluationTime of boundaryTimes) {
      const result = evaluateConservationContract(contract({ evaluationTime }));
      expect(result.outcome).toBe("CONSERVATION-UNRESOLVED");
      expect(result.diagnostics).toContainEqual(expect.objectContaining({
        code: "CONSERVATION-EVALUATION-TIME-BOUNDARY-AMBIGUOUS"
      }));
    }

    expect(evaluateConservationContract(contract({ evaluationTime: "2026-06-01T00:00:00Z" })).outcome)
      .toBe("CONSERVATION-SATISFIED");
    expect(evaluateConservationContract(contract({ evaluationTime: "2027-01-01T00:00:01Z" })).outcome)
      .toBe("CONSERVATION-INVALID-CONTRACT");
  });

  it("[RES19-TIME-001] preserves nanosecond ordering and timezone-offset equivalence", () => {
    const preciseInterval = {
      start: "2026-01-01T00:00:00.000000001Z",
      end: "2026-01-01T00:00:00.000000003Z"
    };
    expect(evaluateConservationContract(contract({
      validInterval: preciseInterval,
      evaluationTime: "2026-01-01T02:00:00.000000002+02:00"
    })).outcome).toBe("CONSERVATION-SATISFIED");

    const equivalentBoundary = evaluateConservationContract(contract({
      validInterval: preciseInterval,
      evaluationTime: "2026-01-01T02:00:00.000000001+02:00"
    }));
    expect(equivalentBoundary.outcome).toBe("CONSERVATION-UNRESOLVED");
    expect(equivalentBoundary.diagnostics).toContainEqual(expect.objectContaining({
      code: "CONSERVATION-EVALUATION-TIME-BOUNDARY-AMBIGUOUS"
    }));

    const observationTime = "2026-06-01T02:00:00.000000003+02:00";
    const firstEvent = ledgerEvent({
      eventId: "consume-precision-1",
      idempotencyKey: "consume-precision-1",
      amountTicks: 5,
      validTime: "2026-05-01T00:00:00.000000001Z"
    });
    const secondEvent = ledgerEvent({
      eventId: "consume-precision-2",
      idempotencyKey: "consume-precision-2",
      amountTicks: 5,
      validTime: "2026-05-01T02:00:00.000000002+02:00"
    });
    const reconciled = reconcileResourceBalance(reconciliation({
      events: [firstEvent, secondEvent],
      observation: measurementObservation({ balanceTicks: 90, observedAt: observationTime }),
      eventBatchEvidence: batchEvidence({ observationTime: "2026-06-01T00:00:00.000000003Z" })
    }));
    expect(reconciled).toMatchObject({
      outcome: "ACCOUNT-BALANCE-RECONCILED",
      expectedBalanceTicks: 90,
      observedBalanceTicks: 90
    });

    const sameInstantEvent = ledgerEvent({
      eventId: "consume-precision-2",
      idempotencyKey: "consume-precision-2",
      amountTicks: 5,
      validTime: "2026-05-01T02:00:00.000000001+02:00"
    });
    const ambiguousOrder = reconcileResourceBalance(reconciliation({
      events: [firstEvent, sameInstantEvent],
      observation: measurementObservation({ balanceTicks: 90, observedAt: observationTime }),
      eventBatchEvidence: batchEvidence({ observationTime: "2026-06-01T00:00:00.000000003Z" })
    }));
    expect(ambiguousOrder.outcome).toBe("UNRESOLVED");
    expect(ambiguousOrder.diagnostics).toContainEqual(expect.objectContaining({
      code: "RECONCILIATION-EVENT-ORDER-AMBIGUOUS"
    }));
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

  it("[RES19-CONS-010] does not infer zero from an undeclared opening or closing state", () => {
    const missingOpening = evaluateConservationContract(contract({ openingState: [] }));
    expect(missingOpening.outcome).toBe("CONSERVATION-UNRESOLVED");
    expect(missingOpening.diagnostics).toContainEqual(expect.objectContaining({ code: "CONSERVATION-STATE-UNDECLARED" }));

    const missingClosing = evaluateConservationContract(contract({ closingState: [] }));
    expect(missingClosing.outcome).toBe("CONSERVATION-UNRESOLVED");
    expect(missingClosing.diagnostics).toContainEqual(expect.objectContaining({ code: "CONSERVATION-STATE-UNDECLARED" }));

    const explicitZero = evaluateConservationContract(contract({
      openingState: [quantity(0)],
      sources: [quantity(20)],
      closingState: [quantity(20)],
      permittedOutputs: []
    }));
    expect(explicitZero.outcome).toBe("CONSERVATION-SATISFIED");
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

  it("[RES19-RECON-013] requires every opening balance snapshot to match the contract interval start", () => {
    const missingTime = { ...accounts()[0]! } as ResourceReconciliationAccount;
    delete (missingTime as Partial<ResourceReconciliationAccount>).openingBalanceAsOf;
    const missing = reconcileResourceBalance(reconciliation({ accounts: [missingTime] }));
    expect(missing.outcome).toBe("UNRESOLVED");
    expect(missing.diagnostics).toContainEqual(expect.objectContaining({
      code: "RECONCILIATION-OPENING-SNAPSHOT-TIME-MISSING"
    }));

    const misaligned = reconcileResourceBalance(reconciliation({
      accounts: [{ ...accounts()[0]!, openingBalanceAsOf: "2026-01-02T00:00:00Z" }]
    }));
    expect(misaligned.outcome).toBe("UNRESOLVED");
    expect(misaligned.diagnostics).toContainEqual(expect.objectContaining({
      code: "RECONCILIATION-OPENING-SNAPSHOT-SCOPE"
    }));
  });

  it("[RES19-RECON-014] rejects missing, boundary-equal and future ledger event times", () => {
    const cases = [
      { validTime: "" },
      { validTime: "2026-01-01T00:00:00Z" },
      { validTime: "2026-06-01T00:00:00Z" },
      { validTime: "2026-06-02T00:00:00Z" }
    ];
    for (const override of cases) {
      const result = reconcileResourceBalance(reconciliation({
        events: [ledgerEvent(override)]
      }));
      expect(result.outcome).toBe("UNRESOLVED");
    }
    expect(reconcileResourceBalance(reconciliation({
      events: [ledgerEvent({ validTime: "" })]
    })).diagnostics).toContainEqual(expect.objectContaining({
      code: "RECONCILIATION-EVENT-VALID-TIME-MISSING"
    }));
  });

  it("[RES19-RECON-015] refuses to sort or infer same-time ledger event ordering", () => {
    const later = ledgerEvent({
      eventId: "event-later",
      idempotencyKey: "event-later",
      validTime: "2026-05-02T00:00:00Z"
    });
    const earlier = ledgerEvent({
      eventId: "event-earlier",
      idempotencyKey: "event-earlier",
      validTime: "2026-05-01T00:00:00Z"
    });
    const outOfOrder = reconcileResourceBalance(reconciliation({ events: [later, earlier] }));
    expect(outOfOrder.outcome).toBe("UNRESOLVED");
    expect(outOfOrder.diagnostics).toContainEqual(expect.objectContaining({
      code: "RECONCILIATION-EVENT-ORDER-AMBIGUOUS"
    }));

    const sameTime = reconcileResourceBalance(reconciliation({
      events: [
        earlier,
        { ...later, validTime: earlier.validTime }
      ]
    }));
    expect(sameTime.outcome).toBe("UNRESOLVED");
    expect(sameTime.diagnostics).toContainEqual(expect.objectContaining({
      code: "RECONCILIATION-EVENT-ORDER-AMBIGUOUS"
    }));
  });

  it("[RES19-RECON-016] leaves observation timestamps on interval boundaries unresolved", () => {
    for (const observedAt of [
      "2026-01-01T00:00:00Z",
      "2027-01-01T00:00:00Z"
    ]) {
      const result = reconcileResourceBalance(reconciliation({
        observation: measurementObservation({ observedAt }),
        events: []
      }));
      expect(result.outcome).toBe("UNRESOLVED");
      expect(result.diagnostics).toContainEqual(expect.objectContaining({
        code: "RECONCILIATION-OBSERVATION-BOUNDARY-AMBIGUOUS"
      }));
    }
  });


  it("[RES19-RECON-017] requires an explicit event-batch completeness assertion", () => {
    const missing = reconcileResourceBalance(reconciliation({
      eventBatchEvidence: undefined as unknown as ResourceReconciliationBatchEvidence
    }));
    expect(missing.outcome).toBe("INVALID-RECONCILIATION");
    expect(missing.diagnostics).toContainEqual(expect.objectContaining({
      code: "RECONCILIATION-RECORD-INVALID"
    }));

    const missingReference = reconcileResourceBalance(reconciliation({
      eventBatchEvidence: batchEvidence({ completenessEvidenceRef: "" })
    }));
    expect(missingReference.outcome).toBe("INVALID-RECONCILIATION");
  });

  it("[RES19-RECON-018] keeps incomplete or unresolved event batches from reconciling", () => {
    const incomplete = reconcileResourceBalance(reconciliation({
      eventBatchEvidence: batchEvidence({ completenessEvidence: "FAIL" })
    }));
    expect(incomplete.outcome).toBe("UNRESOLVED");
    expect(incomplete.diagnostics).toContainEqual(expect.objectContaining({
      code: "RECONCILIATION-EVENT-BATCH-INCOMPLETE"
    }));

    for (const evidence of ["UNKNOWN", "UNAVAILABLE"] as const) {
      const result = reconcileResourceBalance(reconciliation({
        eventBatchEvidence: batchEvidence({ completenessEvidence: evidence })
      }));
      expect(result.outcome).toBe("UNRESOLVED");
      expect(result.diagnostics).toContainEqual(expect.objectContaining({
        code: "RECONCILIATION-EVENT-BATCH-COMPLETENESS-UNRESOLVED"
      }));
    }
  });

  it("[RES19-RECON-019] binds completeness evidence to the exact contract and observation window", () => {
    const cases: Partial<ResourceReconciliationBatchEvidence>[] = [
      { contractId: "other-contract" },
      { systemBoundary: "other-boundary" },
      { openingSnapshotAsOf: "2026-01-02T00:00:00Z" },
      { observationTime: "2026-05-31T00:00:00Z" }
    ];
    for (const overrides of cases) {
      const result = reconcileResourceBalance(reconciliation({
        eventBatchEvidence: batchEvidence(overrides)
      }));
      expect(result.outcome).toBe("INVALID-RECONCILIATION");
      expect(result.diagnostics).toContainEqual(expect.objectContaining({
        code: "RECONCILIATION-EVENT-BATCH-SCOPE-MISMATCH"
      }));
    }
  });

  it("[RES19-RECON-020] requires exact, duplicate-free coverage of every projected account", () => {
    const peerAccount = { ...accounts()[0]!, accountId: "account-b" };
    const exactCoverage = reconcileResourceBalance(reconciliation({
      accounts: [accounts()[0]!, peerAccount],
      events: [],
      eventBatchEvidence: batchEvidence({ accountIds: ["account-b", "account-a"] }),
      observation: measurementObservation({ balanceTicks: 100 })
    }));
    expect(exactCoverage.outcome).toBe("ACCOUNT-BALANCE-RECONCILED");

    for (const accountIds of [
      ["account-a"],
      ["account-a", "account-b", "account-b"],
      ["account-a", "account-b", "account-extra"]
    ]) {
      const result = reconcileResourceBalance(reconciliation({
        accounts: [accounts()[0]!, peerAccount],
        events: [],
        eventBatchEvidence: batchEvidence({ accountIds })
      }));
      expect(result.outcome).toBe("INVALID-RECONCILIATION");
      expect(result.diagnostics).toContainEqual(expect.objectContaining({
        code: "RECONCILIATION-EVENT-BATCH-ACCOUNT-COVERAGE-MISMATCH"
      }));
    }
  });

  it("[RES19-RECON-021] accepts an empty event batch only with passing completeness evidence", () => {
    const completeEmptyBatch = reconcileResourceBalance(reconciliation({
      events: [],
      observation: measurementObservation({ balanceTicks: 100 })
    }));
    expect(completeEmptyBatch).toMatchObject({
      outcome: "ACCOUNT-BALANCE-RECONCILED",
      expectedBalanceTicks: 100,
      eventBatchCompletenessEvidence: "PASS",
      eventBatchEvidenceRef: "event-batch:evidence"
    });

    const unresolvedEmptyBatch = reconcileResourceBalance(reconciliation({
      events: [],
      eventBatchEvidence: batchEvidence({ completenessEvidence: "UNKNOWN" }),
      observation: measurementObservation({ balanceTicks: 100 })
    }));
    expect(unresolvedEmptyBatch.outcome).toBe("UNRESOLVED");
  });

  it("[RES19-RECON-022] reconciles both accounts in one complete transfer batch", () => {
    const result = reconcileResourceAccountSet(accountSetReconciliation());
    expect(result).toMatchObject({
      outcome: "ACCOUNT-SET-RECONCILED",
      scope: "ACCOUNT-SET-BALANCES",
      accountResults: [
        { outcome: "ACCOUNT-BALANCE-RECONCILED", accountId: "account-a", expectedBalanceTicks: 80, observedBalanceTicks: 80 },
        { outcome: "ACCOUNT-BALANCE-RECONCILED", accountId: "account-b", expectedBalanceTicks: 30, observedBalanceTicks: 30 }
      ]
    });
  });

  it("[RES19-RECON-023] requires exactly one observation for every account", () => {
    const base = accountSetReconciliation();
    const first = base.observations[0]!;
    const second = base.observations[1]!;
    const cases: ResourceAccountSetReconciliationInput[] = [
      { ...base, observations: [first] },
      { ...base, observations: [first, { ...first }] },
      { ...base, observations: [first, { ...second, accountId: "account-c" }] }
    ];
    for (const candidate of cases) {
      expect(reconcileResourceAccountSet(candidate)).toMatchObject({
        outcome: "INVALID-RECONCILIATION",
        diagnostics: [expect.objectContaining({ code: "RECONCILIATION-OBSERVATION-ACCOUNT-COVERAGE" })]
      });
    }
  });

  it("[RES19-RECON-024] preserves a discrepancy for one account without correcting either balance", () => {
    const input = accountSetReconciliation();
    input.observations[1] = { ...input.observations[1]!, balanceTicks: 28 };
    const result = reconcileResourceAccountSet(input);
    expect(result.outcome).toBe("ACCOUNT-SET-DISCREPANCY");
    expect(result.accountResults.map((item) => item.outcome)).toEqual([
      "ACCOUNT-BALANCE-RECONCILED", "ACCOUNT-BALANCE-DISCREPANCY"
    ]);
    expect(result.accountResults[1]).toMatchObject({
      expectedBalanceTicks: 30, observedBalanceTicks: 28, discrepancyTicks: -2
    });
    expect(input.accounts.map((item) => item.openingBalanceTicks)).toEqual([100, 10]);
  });

  it("[RES19-RECON-025] blocks a transfer when its source debit cannot be applied", () => {
    const input = accountSetReconciliation({
      events: [ledgerEvent({
        eventId: "transfer-missing-source", eventKind: "TRANSFER", fromAccount: undefined,
        toAccount: "account-b", amountTicks: 20, idempotencyKey: "transfer-missing-source"
      })]
    });
    const projection = projectResourceLedger(input.accounts, input.events);
    const result = reconcileResourceAccountSet(input);
    expect(projection.outcome).toBe("LEDGER-MALFORMED");
    expect(projection.balances).toEqual({ "account-a": 100, "account-b": 10 });
    expect(projection.events[0]).toMatchObject({
      applied: false,
      duplicate: false,
      issue: { eventId: "transfer-missing-source", code: "EVENT-MALFORMED" }
    });
    expect(result.outcome).toBe("UNRESOLVED");
    expect(result.accountResults).toHaveLength(2);
    expect(result.accountResults.every((item) => item.outcome === "UNRESOLVED")).toBe(true);
  });

  it("[RES19-RECON-026] rejects empty and mixed-contract account sets", () => {
    const base = accountSetReconciliation();
    expect(reconcileResourceAccountSet({
      ...base, accounts: [], observations: [], eventBatchEvidence: batchEvidence({ accountIds: [] })
    })).toMatchObject({
      outcome: "INVALID-RECONCILIATION",
      diagnostics: [expect.objectContaining({ code: "RECONCILIATION-ACCOUNT-SET-INVALID" })]
    });
    expect(reconcileResourceAccountSet({
      ...base,
      accounts: [
        base.accounts[0]!,
        { ...base.accounts[1]!, resourceKind: "energy", unit: "joule", unitContractId: "energy-joule-v1" }
      ]
    })).toMatchObject({
      outcome: "INVALID-RECONCILIATION",
      diagnostics: [expect.objectContaining({ code: "RECONCILIATION-ACCOUNT-SET-CONTRACT-MISMATCH" })]
    });
  });

  it("[RES19-RECON-027] leaves mismatched or missing preflight/report contract versions unresolved", () => {
    const matching = reconcileResourceBalance(reconciliation());
    expect(matching).toMatchObject({ outcome: "ACCOUNT-BALANCE-RECONCILED", preflightContractVersionRef: "resource-contract:v1", reportContractVersionRef: "resource-contract:v1" });
    const missingPreflight = reconcileResourceBalance(reconciliation({ contract: { ...contract(), preflightContractVersionRef: " " } }));
    expect(missingPreflight.outcome).toBe("UNRESOLVED");
    expect(missingPreflight.diagnostics).toContainEqual(expect.objectContaining({ code: "RECONCILIATION-CONTRACT-VERSION-MISSING" }));
    const missingBatch = reconcileResourceBalance(reconciliation({ eventBatchEvidence: batchEvidence({ contractVersionRef: " " }) }));
    expect(missingBatch.outcome).toBe("UNRESOLVED");
    expect(missingBatch.diagnostics).toContainEqual(expect.objectContaining({ code: "RECONCILIATION-CONTRACT-VERSION-MISSING" }));
    const batchMismatch = reconcileResourceBalance(reconciliation({ eventBatchEvidence: batchEvidence({ contractVersionRef: "resource-contract:v2" }) }));
    expect(batchMismatch.outcome).toBe("UNRESOLVED");
    expect(batchMismatch.diagnostics).toContainEqual(expect.objectContaining({ code: "RECONCILIATION-CONTRACT-VERSION-MISMATCH" }));
    const eventMismatch = reconcileResourceBalance(reconciliation({ events: [ledgerEvent({ contractVersionRef: "resource-contract:v2" })] }));
    expect(eventMismatch.outcome).toBe("UNRESOLVED");
    expect(eventMismatch.diagnostics).toContainEqual(expect.objectContaining({ code: "RECONCILIATION-EVENT-CONTRACT-VERSION-MISMATCH" }));
    const missingVersion = ledgerEvent() as ResourceReconciliationEvent;
    delete (missingVersion as Partial<ResourceReconciliationEvent>).contractVersionRef;
    const missing = reconcileResourceBalance(reconciliation({ events: [missingVersion] }));
    expect(missing.outcome).toBe("UNRESOLVED");
    expect(missing.diagnostics).toContainEqual(expect.objectContaining({ code: "RECONCILIATION-EVENT-CONTRACT-VERSION-MISSING" }));
    const accountSetMismatch = reconcileResourceAccountSet(accountSetReconciliation({ eventBatchEvidence: batchEvidence({ accountIds: ["account-a", "account-b"], contractVersionRef: "resource-contract:v2" }) }));
    expect(accountSetMismatch.outcome).toBe("UNRESOLVED");
    expect(accountSetMismatch.accountResults).toHaveLength(2);
    expect(accountSetMismatch.accountResults.every((item) => item.outcome === "UNRESOLVED")).toBe(true);
  });

});
