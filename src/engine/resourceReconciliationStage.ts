import {
  evaluateConservationContract,
  reconcileResourceAccountSet,
  type ConservationContractInput,
  type ConservationDiagnostic,
  type ConservationEvidence,
  type ConservationResult,
  type ResourceAccountBalanceObservation,
  type ResourceAccountSetReconciliationResult,
  type ResourceReconciliationAccount,
  type ResourceReconciliationBatchEvidence,
  type ResourceReconciliationEvent
} from "./resourceConservation";
import type { ResourcePreflightResult } from "./resourcePreflight";
import { compareIsoTimes, isIsoTime } from "./resourceTime";

export interface ResourceStageEvidence {
  state: ConservationEvidence;
  evidenceRef: string;
}

export interface ResourceReportEvidence extends ResourceStageEvidence {
  contractVersionRef: string;
}

export type ResourceReconciliationStageOutcome =
  | "RESOURCE-RECONCILED"
  | "RESOURCE-RECONCILIATION-FAILED"
  | "RESOURCE-OUTCOME-UNKNOWN"
  | "INVALID-RECONCILIATION";

export interface ResourceReconciliationStageInput {
  reconciliationId: string;
  preflight: ResourcePreflightResult;
  attemptEvidence: ResourceStageEvidence;
  reportEvidence: ResourceReportEvidence;
  contract: ConservationContractInput & { preflightContractVersionRef: string };
  accounts: ResourceReconciliationAccount[];
  events: ResourceReconciliationEvent[];
  eventBatchEvidence: ResourceReconciliationBatchEvidence;
  observations: ResourceAccountBalanceObservation[];
}

export interface ResourceReconciliationStageResult {
  outcome: ResourceReconciliationStageOutcome;
  scope: "ONE-RESOURCE-SCALAR-ACCOUNT-SET";
  reconciliationId: string;
  preflightOutcome?: ResourcePreflightResult["outcome"];
  attemptEvidenceState?: ConservationEvidence;
  reportEvidenceState?: ConservationEvidence;
  contractVersionRef?: string;
  conservation?: ConservationResult;
  accountSetReconciliation?: ResourceAccountSetReconciliationResult;
  diagnostics: ConservationDiagnostic[];
  limitations: string[];
}

const STAGE_LIMITATIONS = [
  "This coordinator is bounded to one resource kind, one exact unit contract, the explicitly supported scalar-additive invariant and one supplied account set.",
  "Preflight, attempt, report, contract, batch-completeness and measurement evidence are caller-supplied; references are not authenticated or independently resolved.",
  "Attempt and report evidence are required stage assertions; this coordinator does not start, inspect or control an executor and does not ingest a trusted report.",
  "Each account is compared independently using gross balance; no cross-account vector or other invariant is inferred.",
  "Transformations, cross-resource conversions, boundary discovery, uncertainty calculation, distributed consistency, reservation concurrency and recovery semantics remain outside this implementation.",
  "RESOURCE-RECONCILED is only a bounded accounting-stage result; it does not establish physical feasibility, authority, consent, execution correctness or target postconditions.",
  "The evaluation is deterministic and read-only; it does not mutate ledger entries, account balances, reservations or external state."
];

const nonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

function isFiniteNonNegative(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isEvidenceState(value: unknown): value is ConservationEvidence {
  return value === "PASS" || value === "FAIL" || value === "UNKNOWN" || value === "UNAVAILABLE";
}

function invalidResult(
  reconciliationId: string,
  message: string
): ResourceReconciliationStageResult {
  return {
    outcome: "INVALID-RECONCILIATION",
    scope: "ONE-RESOURCE-SCALAR-ACCOUNT-SET",
    reconciliationId,
    diagnostics: [{
      code: "RECONCILIATION-STAGE-INPUT-INVALID",
      message
    }],
    limitations: [...STAGE_LIMITATIONS]
  };
}

/**
 * Composes the existing v1.9 preflight, attempt/report evidence, scalar
 * conservation evaluator and account-set reconciler. A passing result is
 * deliberately limited to the exact supplied resource/unit contract.
 */
export function evaluateResourceReconciliationStage(
  input: ResourceReconciliationStageInput
): ResourceReconciliationStageResult {
  if (!input || typeof input !== "object" ||
      !nonEmptyString(input.reconciliationId) ||
      !input.contract || typeof input.contract !== "object") {
    return invalidResult(
      nonEmptyString(input?.reconciliationId) ? input.reconciliationId : "",
      "A reconciliation identity and explicit conservation contract are required."
    );
  }

  const conservation = evaluateConservationContract(input.contract);
  const accountSetReconciliation = reconcileResourceAccountSet({
    reconciliationId: input.reconciliationId,
    contract: input.contract,
    accounts: input.accounts,
    events: input.events,
    eventBatchEvidence: input.eventBatchEvidence,
    observations: input.observations
  });

  const stageDiagnostics: ConservationDiagnostic[] = [];
  const add = (code: string, message: string) => stageDiagnostics.push({ code, message });
  const preflightVersion = nonEmptyString(input.preflight?.contractVersionRef)
    ? input.preflight.contractVersionRef
    : undefined;

  let invalidPreflight = false;
  if (!input.preflight ||
      input.preflight.outcome !== "RESOURCE-READY" ||
      input.preflight.stage !== "RESOURCE-READY") {
    add(
      "RECONCILIATION-PREFLIGHT-NOT-READY",
      "A passing RESOURCE-READY preflight result is required; this coordinator does not infer readiness from a partial or failed preflight."
    );
  } else {
    const availableAmount = input.preflight.availableAmount;
    const requiredAmount = input.preflight.requiredAmount;
    if (!isFiniteNonNegative(availableAmount) ||
        !isFiniteNonNegative(requiredAmount) ||
        availableAmount < requiredAmount) {
      invalidPreflight = true;
      add(
        "RECONCILIATION-PREFLIGHT-RESULT-INVALID",
        "A RESOURCE-READY preflight must include finite, non-negative available and required amounts, with availability at least the requirement; fractional quantities are retained without rounding."
      );
    }
  }

  if (!preflightVersion ||
      !nonEmptyString(input.contract.preflightContractVersionRef) ||
      preflightVersion !== input.contract.preflightContractVersionRef) {
    add(
      "RECONCILIATION-PREFLIGHT-CONTRACT-VERSION-MISMATCH",
      "The preflight result and conservation contract must carry the same non-empty opaque contract-version reference."
    );
  }

  if (!input.attemptEvidence ||
      !isEvidenceState(input.attemptEvidence.state) ||
      input.attemptEvidence.state !== "PASS" ||
      !nonEmptyString(input.attemptEvidence.evidenceRef)) {
    add(
      "RECONCILIATION-ATTEMPT-EVIDENCE-UNRESOLVED",
      "A passing attempt-stage evidence state and non-empty evidence reference are required."
    );
  }

  if (!input.reportEvidence ||
      !isEvidenceState(input.reportEvidence.state) ||
      input.reportEvidence.state !== "PASS" ||
      !nonEmptyString(input.reportEvidence.evidenceRef)) {
    add(
      "RECONCILIATION-REPORT-EVIDENCE-UNRESOLVED",
      "A passing resource-report evidence state and non-empty evidence reference are required."
    );
  }

  if (!preflightVersion ||
      !nonEmptyString(input.reportEvidence?.contractVersionRef) ||
      input.reportEvidence.contractVersionRef !== preflightVersion) {
    add(
      "RECONCILIATION-REPORT-CONTRACT-VERSION-MISMATCH",
      "The report evidence must identify the exact opaque contract version returned by preflight."
    );
  }

  if (!preflightVersion ||
      !nonEmptyString(input.eventBatchEvidence?.contractVersionRef) ||
      input.eventBatchEvidence.contractVersionRef !== preflightVersion) {
    add(
      "RECONCILIATION-EVENT-BATCH-CONTRACT-VERSION-MISMATCH",
      "The event batch must identify the exact opaque contract version returned by preflight."
    );
  }

  const evaluationTime = input.contract.evaluationTime;
  const observationTime = input.eventBatchEvidence?.observationTime;
  if (!isIsoTime(evaluationTime) || !isIsoTime(observationTime)) {
    add(
      "RECONCILIATION-STAGE-OBSERVATION-TIME-MISSING",
      "The conservation evaluation and event-batch observation require valid explicit timestamps."
    );
  } else if (compareIsoTimes(evaluationTime, observationTime) !== 0) {
    add(
      "RECONCILIATION-STAGE-OBSERVATION-TIME-MISMATCH",
      "The conservation evaluation and complete account-set report must refer to the same instant."
    );
  }

  const diagnostics: ConservationDiagnostic[] = [
    ...stageDiagnostics,
    ...conservation.diagnostics.map(item => ({
      code: item.code,
      message: "Conservation evaluation: " + item.message
    })),
    ...accountSetReconciliation.diagnostics.map(item => ({
      code: item.code,
      message: "Account-set reconciliation: " + item.message
    }))
  ];

  const invalidComponent =
    invalidPreflight ||
    conservation.outcome === "CONSERVATION-INVALID-CONTRACT" ||
    accountSetReconciliation.outcome === "INVALID-RECONCILIATION";
  const conservationEstablished =
    conservation.outcome === "CONSERVATION-SATISFIED" ||
    conservation.outcome === "CONSERVATION-MISMATCH";
  const accountSetEstablished =
    accountSetReconciliation.outcome === "ACCOUNT-SET-RECONCILED" ||
    accountSetReconciliation.outcome === "ACCOUNT-SET-DISCREPANCY";

  let outcome: ResourceReconciliationStageOutcome;
  if (invalidComponent) {
    outcome = "INVALID-RECONCILIATION";
  } else if (stageDiagnostics.length > 0 || !conservationEstablished || !accountSetEstablished) {
    outcome = "RESOURCE-OUTCOME-UNKNOWN";
  } else if (
    conservation.outcome === "CONSERVATION-MISMATCH" ||
    accountSetReconciliation.outcome === "ACCOUNT-SET-DISCREPANCY"
  ) {
    outcome = "RESOURCE-RECONCILIATION-FAILED";
    diagnostics.push({
      code: "RESOURCE-RECONCILIATION-FAILED",
      message: "All required stage evidence is present, but at least one named conservation or gross account-balance comparison is outside its declared contract tolerance."
    });
  } else {
    outcome = "RESOURCE-RECONCILED";
  }

  return {
    outcome,
    scope: "ONE-RESOURCE-SCALAR-ACCOUNT-SET",
    reconciliationId: input.reconciliationId,
    ...(input.preflight ? { preflightOutcome: input.preflight.outcome } : {}),
    ...(isEvidenceState(input.attemptEvidence?.state) ? { attemptEvidenceState: input.attemptEvidence.state } : {}),
    ...(isEvidenceState(input.reportEvidence?.state) ? { reportEvidenceState: input.reportEvidence.state } : {}),
    ...(preflightVersion ? { contractVersionRef: preflightVersion } : {}),
    conservation,
    accountSetReconciliation,
    diagnostics,
    limitations: [...STAGE_LIMITATIONS]
  };
}
