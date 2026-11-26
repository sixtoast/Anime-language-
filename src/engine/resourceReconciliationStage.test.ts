import { describe, expect, it } from "vitest";
import {
  evaluateResourceReconciliationStage,
  type ResourceReconciliationStageInput
} from "./resourceReconciliationStage";
import type {
  ConservationContractInput,
  ConservationQuantity,
  ResourceAccountBalanceObservation,
  ResourceReconciliationAccount,
  ResourceReconciliationBatchEvidence,
  ResourceReconciliationEvent
} from "./resourceConservation";
import type { ResourcePreflightResult } from "./resourcePreflight";

const quantity = (amountTicks: number, evidenceRef: string): ConservationQuantity => ({
  resourceKind: "mana-token",
  amountTicks,
  unit: "tick",
  unitContractId: "mana-tick-v1",
  evidence: "PASS",
  evidenceRef
});

function reconciliationInput(): ResourceReconciliationStageInput {
  const validInterval = {
    start: "2026-01-01T00:00:00Z",
    end: "2027-01-01T00:00:00Z"
  };
  const contract: ConservationContractInput & { preflightContractVersionRef: string } = {
    contractId: "conservation-stage-v1",
    preflightContractVersionRef: "resource-contract:v1",
    resourceKind: "mana-token",
    unit: "tick",
    unitContractId: "mana-tick-v1",
    systemBoundary: "bounded-transfer-system",
    validInterval,
    evaluationTime: "2026-06-01T00:00:00Z",
    invariant: "SCALAR-ADDITIVE-BALANCE",
    toleranceTicks: 0,
    contractEvidence: "PASS",
    contractEvidenceRef: "contract:evidence",
    boundaryEvidence: "PASS",
    boundaryEvidenceRef: "boundary:evidence",
    uncertaintyRuleRef: "uncertainty:rule",
    uncertaintyPolicyEvidence: "PASS",
    uncertaintyPolicyEvidenceRef: "uncertainty:policy",
    openingState: [quantity(110, "opening:state")],
    sources: [],
    permittedInputs: [],
    closingState: [quantity(110, "closing:state")],
    sinks: [],
    permittedOutputs: [],
    declaredLosses: []
  };

  const accounts: ResourceReconciliationAccount[] = [
    {
      accountId: "account-source",
      resourceKind: "mana-token",
      unit: "tick",
      unitContractId: "mana-tick-v1",
      openingBalanceTicks: 100,
      openingBalanceAsOf: validInterval.start
    },
    {
      accountId: "account-destination",
      resourceKind: "mana-token",
      unit: "tick",
      unitContractId: "mana-tick-v1",
      openingBalanceTicks: 10,
      openingBalanceAsOf: validInterval.start
    }
  ];

  const events: ResourceReconciliationEvent[] = [{
    eventId: "transfer-1",
    invocationId: "invocation-1",
    resourceKind: "mana-token",
    eventKind: "TRANSFER",
    fromAccount: "account-source",
    toAccount: "account-destination",
    amountTicks: 20,
    unit: "tick",
    unitContractId: "mana-tick-v1",
    status: "CONFIRMED",
    evidence: "PASS",
    idempotencyKey: "transfer-1",
    validTime: "2026-05-01T00:00:00Z",
    contractVersionRef: "resource-contract:v1"
  }];

  const observations: ResourceAccountBalanceObservation[] = [
    {
      accountId: "account-source",
      category: "MEASUREMENT",
      balanceTicks: 80,
      observedAt: contract.evaluationTime,
      methodRef: "measurement:method",
      uncertaintyRef: "measurement:uncertainty",
      provenanceRef: "measurement:provenance",
      evidence: "PASS",
      evidenceRef: "measurement:source",
      policyAcceptanceEvidence: "PASS",
      policyAcceptanceEvidenceRef: "measurement:policy"
    },
    {
      accountId: "account-destination",
      category: "MEASUREMENT",
      balanceTicks: 30,
      observedAt: contract.evaluationTime,
      methodRef: "measurement:method",
      uncertaintyRef: "measurement:uncertainty",
      provenanceRef: "measurement:provenance",
      evidence: "PASS",
      evidenceRef: "measurement:destination",
      policyAcceptanceEvidence: "PASS",
      policyAcceptanceEvidenceRef: "measurement:policy"
    }
  ];

  const eventBatchEvidence: ResourceReconciliationBatchEvidence = {
    contractVersionRef: "resource-contract:v1",
    contractId: contract.contractId,
    systemBoundary: contract.systemBoundary,
    accountIds: accounts.map(account => account.accountId),
    openingSnapshotAsOf: validInterval.start,
    observationTime: contract.evaluationTime,
    completenessEvidence: "PASS",
    completenessEvidenceRef: "event-batch:completeness"
  };

  const preflight: ResourcePreflightResult = {
    outcome: "RESOURCE-READY",
    stage: "RESOURCE-READY",
    availableAmount: 100,
    requiredAmount: 20,
    contractVersionRef: "resource-contract:v1",
    diagnostics: [],
    limitations: []
  };

  return {
    reconciliationId: "reconciliation-stage-1",
    preflight,
    attemptEvidence: { state: "PASS", evidenceRef: "attempt:evidence" },
    reportEvidence: {
      state: "PASS",
      evidenceRef: "report:evidence",
      contractVersionRef: "resource-contract:v1"
    },
    contract,
    accounts,
    events,
    eventBatchEvidence,
    observations
  };
}

describe("bounded v1.9 resource reconciliation stage", () => {
  it("[RES19-STAGE-001] requires passing preflight, attempt, report, conservation and account-set evidence", () => {
    const result = evaluateResourceReconciliationStage(reconciliationInput());
    expect(result).toMatchObject({
      outcome: "RESOURCE-RECONCILED",
      scope: "ONE-RESOURCE-SCALAR-ACCOUNT-SET",
      preflightOutcome: "RESOURCE-READY",
      attemptEvidenceState: "PASS",
      reportEvidenceState: "PASS",
      contractVersionRef: "resource-contract:v1",
      conservation: { outcome: "CONSERVATION-SATISFIED" },
      accountSetReconciliation: { outcome: "ACCOUNT-SET-RECONCILED" },
      diagnostics: []
    });
  });

  it("[RES19-STAGE-002] reports evidenced conservation and account discrepancies without correction", () => {
    const conservationMismatch = reconciliationInput();
    conservationMismatch.contract.closingState = [quantity(109, "closing:mismatch")];
    const conservationResult = evaluateResourceReconciliationStage(conservationMismatch);
    expect(conservationResult.outcome).toBe("RESOURCE-RECONCILIATION-FAILED");
    expect(conservationResult.conservation?.differenceTicks).toBe(1);
    expect(conservationResult.accountSetReconciliation?.outcome).toBe("ACCOUNT-SET-RECONCILED");

    const accountDiscrepancy = reconciliationInput();
    accountDiscrepancy.observations[1] = {
      ...accountDiscrepancy.observations[1]!,
      balanceTicks: 28
    };
    const accountResult = evaluateResourceReconciliationStage(accountDiscrepancy);
    expect(accountResult.outcome).toBe("RESOURCE-RECONCILIATION-FAILED");
    expect(accountResult.accountSetReconciliation?.accountResults[1]).toMatchObject({
      outcome: "ACCOUNT-BALANCE-DISCREPANCY",
      expectedBalanceTicks: 30,
      observedBalanceTicks: 28,
      discrepancyTicks: -2
    });
  });

  it("[RES19-STAGE-003] keeps non-ready or unresolved stage evidence unknown", () => {
    const nonReady = reconciliationInput();
    nonReady.preflight = {
      ...nonReady.preflight,
      outcome: "RESOURCE-INSUFFICIENT",
      stage: "SOURCE-VERIFIED"
    };
    expect(evaluateResourceReconciliationStage(nonReady)).toMatchObject({
      outcome: "RESOURCE-OUTCOME-UNKNOWN",
      diagnostics: [expect.objectContaining({ code: "RECONCILIATION-PREFLIGHT-NOT-READY" })]
    });

    const unknownAttempt = reconciliationInput();
    unknownAttempt.attemptEvidence = { state: "UNKNOWN", evidenceRef: "attempt:unknown" };
    expect(evaluateResourceReconciliationStage(unknownAttempt).outcome).toBe("RESOURCE-OUTCOME-UNKNOWN");

    const unavailableReport = reconciliationInput();
    unavailableReport.reportEvidence = {
      state: "UNAVAILABLE",
      evidenceRef: "report:unavailable",
      contractVersionRef: "resource-contract:v1"
    };
    expect(evaluateResourceReconciliationStage(unavailableReport).outcome).toBe("RESOURCE-OUTCOME-UNKNOWN");
  });

  it("[RES19-STAGE-004] requires exact preflight, report and event-batch contract-version identity", () => {
    const reportMismatch = reconciliationInput();
    reportMismatch.reportEvidence = {
      ...reportMismatch.reportEvidence,
      contractVersionRef: "resource-contract:v2"
    };
    const reportResult = evaluateResourceReconciliationStage(reportMismatch);
    expect(reportResult.outcome).toBe("RESOURCE-OUTCOME-UNKNOWN");
    expect(reportResult.diagnostics).toContainEqual(expect.objectContaining({
      code: "RECONCILIATION-REPORT-CONTRACT-VERSION-MISMATCH"
    }));

    const eventMismatch = reconciliationInput();
    eventMismatch.events[0] = {
      ...eventMismatch.events[0]!,
      contractVersionRef: "resource-contract:v2"
    };
    const eventResult = evaluateResourceReconciliationStage(eventMismatch);
    expect(eventResult.outcome).toBe("RESOURCE-OUTCOME-UNKNOWN");
    expect(eventResult.accountSetReconciliation?.accountResults.every(item => item.outcome === "UNRESOLVED")).toBe(true);
  });

  it("[RES19-STAGE-005] requires the conservation and report observation times to identify the same instant", () => {
    const input = reconciliationInput();
    input.eventBatchEvidence = {
      ...input.eventBatchEvidence,
      observationTime: "2026-06-02T00:00:00Z"
    };
    input.observations = input.observations.map(observation => ({
      ...observation,
      observedAt: "2026-06-02T00:00:00Z"
    }));
    const result = evaluateResourceReconciliationStage(input);
    expect(result.outcome).toBe("RESOURCE-OUTCOME-UNKNOWN");
    expect(result.accountSetReconciliation?.outcome).toBe("ACCOUNT-SET-RECONCILED");
    expect(result.diagnostics).toContainEqual(expect.objectContaining({
      code: "RECONCILIATION-STAGE-OBSERVATION-TIME-MISMATCH"
    }));
  });

  it("[RES19-STAGE-006] rejects malformed account sets instead of promoting them", () => {
    const input = reconciliationInput();
    input.accounts[1] = { ...input.accounts[1]!, accountId: "account-source" };
    const result = evaluateResourceReconciliationStage(input);
    expect(result.outcome).toBe("INVALID-RECONCILIATION");
    expect(result.accountSetReconciliation?.diagnostics).toContainEqual(expect.objectContaining({
      code: "RECONCILIATION-ACCOUNT-SET-IDENTITY"
    }));
  });

  it("[RES19-STAGE-007] is deterministic and leaves supplied evidence and ledger inputs unchanged", () => {
    const input = reconciliationInput();
    const before = JSON.stringify(input);
    const first = evaluateResourceReconciliationStage(input);
    const second = evaluateResourceReconciliationStage(input);
    expect(first).toEqual(second);
    expect(JSON.stringify(input)).toBe(before);
  });
  it("[RES19-STAGE-008] preserves invalid stage outcome for missing or non-record event-batch evidence", () => {
    for (const eventBatchEvidence of [undefined, null, []]) {
      const input = reconciliationInput();
      input.eventBatchEvidence = eventBatchEvidence as unknown as ResourceReconciliationBatchEvidence;
      const result = evaluateResourceReconciliationStage(input);
      expect(result).toMatchObject({
        outcome: "INVALID-RECONCILIATION",
        accountSetReconciliation: {
          outcome: "INVALID-RECONCILIATION",
          diagnostics: [expect.objectContaining({ code: "RECONCILIATION-ACCOUNT-SET-INVALID" })]
        }
      });
    }
  });

});
