import { projectResourceLedger, type LedgerAccount, type LedgerEvent, type LedgerProjection } from "./resourceLedger";

/**
 * Bounded v1.9 conservation evaluation and resource reconciliation.
 *
 * This evaluator handles only an explicitly declared scalar-additive balance
 * for one resource kind and one exact unit contract. It does not infer physical
 * laws, convert units, authenticate evidence, or modify a ledger.
 */
export type ConservationEvidence = "PASS" | "FAIL" | "UNKNOWN" | "UNAVAILABLE";

export interface ConservationQuantity {
  resourceKind: string;
  amountTicks: number;
  unit: string;
  unitContractId: string;
  evidence: ConservationEvidence;
  evidenceRef: string;
}

export interface ConservationLossQuantity extends ConservationQuantity {
  /** Reference to the resource-specific permitted loss pathway; not external authorisation. */
  permittedPathwayRef: string;
  permittedPathwayEvidence: ConservationEvidence;
  permittedPathwayEvidenceRef: string;
}

export interface ConservationContractInput {
  contractId: string;
  resourceKind: string;
  unit: string;
  unitContractId: string;
  systemBoundary: string;
  validInterval: { start: string; end: string };
  evaluationTime: string;
  invariant: string;
  toleranceTicks: number;
  contractEvidence: ConservationEvidence;
  contractEvidenceRef: string;
  boundaryEvidence: ConservationEvidence;
  boundaryEvidenceRef: string;
  uncertaintyRuleRef: string;
  uncertaintyPolicyEvidence: ConservationEvidence;
  uncertaintyPolicyEvidenceRef: string;
  openingState: ConservationQuantity[];
  sources: ConservationQuantity[];
  permittedInputs: ConservationQuantity[];
  closingState: ConservationQuantity[];
  sinks: ConservationQuantity[];
  permittedOutputs: ConservationQuantity[];
  declaredLosses: ConservationLossQuantity[];
}

export type ConservationOutcome =
  | "CONSERVATION-SATISFIED"
  | "CONSERVATION-MISMATCH"
  | "CONSERVATION-UNRESOLVED"
  | "CONSERVATION-INVALID-CONTRACT";

export interface ConservationDiagnostic {
  code: string;
  message: string;
}

export interface ConservationResult {
  outcome: ConservationOutcome;
  contractId: string;
  leftTotalTicks?: number;
  rightTotalTicks?: number;
  differenceTicks?: number;
  toleranceTicks?: number;
  diagnostics: ConservationDiagnostic[];
  limitations: string[];
}

const CONSERVATION_LIMITATIONS = [
  "The evaluator supports only an explicitly declared scalar-additive balance for one resource kind and one exact unit contract.",
  "The valid-interval endpoint inclusion semantics are not declared; evaluation at either exact endpoint remains unresolved.",
  "Evidence states and references are caller-supplied; this evaluator checks required references but does not authenticate sources, boundaries, measurements, contracts or uncertainty rules.",
  "Declared losses require caller-supplied permitted-pathway references and passing evidence; those references are not authenticated or resolved against external contract content.",
  "A satisfied balance is an accounting result under the named contract, not proof of a physical law, mechanism, authorisation, execution or successful effect.",
  "No ledger entries or account balances are changed; discrepancies remain visible for separate review."
];

const nonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const safeTicks = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 0;

const isConservationEvidence = (value: unknown): value is ConservationEvidence =>
  value === "PASS" || value === "FAIL" || value === "UNKNOWN" || value === "UNAVAILABLE";

const ISO_TIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,9}))?(Z|([+-])(\d{2}):(\d{2}))$/;

interface ParsedIsoTime {
  /** UTC instant at the start of the represented second, in integer milliseconds. */
  epochSecondMilliseconds: number;
  /** Fractional second retained independently, at the accepted nanosecond precision. */
  fractionNanoseconds: number;
}

function parseIsoTime(value: unknown): ParsedIsoTime | undefined {
  if (typeof value !== "string") return undefined;
  const match = value.match(ISO_TIME_PATTERN);
  if (!match) return undefined;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = Number(match[6]);
  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const monthDays = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > monthDays[month - 1] ||
      hour > 23 || minute > 59 || second > 59) return undefined;
  if (match[8] !== "Z") {
    const offsetHour = Number(match[10]);
    const offsetMinute = Number(match[11]);
    if (offsetHour > 23 || offsetMinute > 59) return undefined;
  }

  // Date.parse resolves the calendar date and explicit UTC offset, but discards
  // fractional precision below milliseconds. Parse only the whole second and
  // retain the original fractional second separately for exact comparisons.
  const wholeSecondTimestamp = value.replace(/\.\d{1,9}(?=Z|[+-]\d{2}:\d{2}$)/, "");
  const epochSecondMilliseconds = Date.parse(wholeSecondTimestamp);
  if (!Number.isSafeInteger(epochSecondMilliseconds)) return undefined;

  return {
    epochSecondMilliseconds,
    fractionNanoseconds: Number((match[7] ?? "").padEnd(9, "0"))
  };
}

const isIsoTime = (value: unknown): value is string => parseIsoTime(value) !== undefined;

function compareIsoTimes(left: string, right: string): number {
  const leftInstant = parseIsoTime(left);
  const rightInstant = parseIsoTime(right);
  if (!leftInstant || !rightInstant) {
    throw new Error("ISO timestamps must be validated before comparison.");
  }
  if (leftInstant.epochSecondMilliseconds !== rightInstant.epochSecondMilliseconds) {
    return leftInstant.epochSecondMilliseconds < rightInstant.epochSecondMilliseconds ? -1 : 1;
  }
  if (leftInstant.fractionNanoseconds === rightInstant.fractionNanoseconds) return 0;
  return leftInstant.fractionNanoseconds < rightInstant.fractionNanoseconds ? -1 : 1;
}

function evidencePass(
  state: ConservationEvidence,
  code: string,
  diagnostics: ConservationDiagnostic[]
): boolean {
  if (state === "PASS") return true;
  diagnostics.push({
    code,
    message: "Required evidence is " + state + "; the evaluator cannot treat it as established."
  });
  return false;
}

function sumTerms(
  terms: ConservationQuantity[],
  contract: ConservationContractInput,
  label: string,
  diagnostics: ConservationDiagnostic[]
): number | undefined {
  if (!Array.isArray(terms)) {
    diagnostics.push({ code: "CONSERVATION-TERMS-MALFORMED", message: label + " must be a list of declared quantities." });
    return undefined;
  }
  let total = 0;
  for (const term of terms) {
    if (!term || !nonEmptyString(term.resourceKind) || term.resourceKind !== contract.resourceKind ||
        !nonEmptyString(term.unit) || term.unit !== contract.unit ||
        !nonEmptyString(term.unitContractId) || term.unitContractId !== contract.unitContractId ||
        !safeTicks(term.amountTicks) || !nonEmptyString(term.evidenceRef)) {
      diagnostics.push({
        code: "CONSERVATION-TERM-INVALID",
        message: label + " contains a malformed quantity, mismatched resource/unit contract, or missing evidence reference."
      });
      return undefined;
    }
    if (term.evidence !== "PASS") {
      diagnostics.push({
        code: "CONSERVATION-TERM-EVIDENCE-" + term.evidence,
        message: label + " includes a quantity whose evidence has not passed."
      });
      return undefined;
    }
    total += term.amountTicks;
    if (!Number.isSafeInteger(total)) {
      diagnostics.push({ code: "CONSERVATION-ARITHMETIC-OVERFLOW", message: label + " exceeds the safe integer tick range." });
      return undefined;
    }
  }
  return total;
}

function sumLossTerms(
  terms: ConservationLossQuantity[],
  contract: ConservationContractInput,
  diagnostics: ConservationDiagnostic[]
): number | undefined {
  if (!Array.isArray(terms)) {
    diagnostics.push({ code: "CONSERVATION-TERMS-MALFORMED", message: "Declared losses must be a list of declared loss quantities." });
    return undefined;
  }
  for (const loss of terms) {
    if (!loss || !nonEmptyString(loss.permittedPathwayRef) ||
        !nonEmptyString(loss.permittedPathwayEvidenceRef)) {
      diagnostics.push({
        code: "CONSERVATION-LOSS-PATHWAY-MISSING",
        message: "Each declared loss requires a permitted pathway reference and supporting evidence reference."
      });
      return undefined;
    }
    if (loss.permittedPathwayEvidence !== "PASS") {
      diagnostics.push({
        code: "CONSERVATION-LOSS-PATHWAY-EVIDENCE-UNRESOLVED",
        message: "The declared loss pathway evidence has not passed; the loss cannot be counted in the balance."
      });
      return undefined;
    }
  }
  return sumTerms(terms, contract, "Declared losses", diagnostics);
}

export function evaluateConservationContract(
  contract: ConservationContractInput
): ConservationResult {
  const diagnostics: ConservationDiagnostic[] = [];
  const invalid = (code: string, message: string): ConservationResult => {
    diagnostics.push({ code, message });
    return {
      outcome: "CONSERVATION-INVALID-CONTRACT",
      contractId: contract?.contractId ?? "",
      diagnostics,
      limitations: [...CONSERVATION_LIMITATIONS]
    };
  };
  if (!contract || typeof contract !== "object") {
    return invalid("CONSERVATION-CONTRACT-MALFORMED", "A conservation contract object is required.");
  }
  if (!nonEmptyString(contract.contractId) || !nonEmptyString(contract.resourceKind) ||
      !nonEmptyString(contract.unit) || !nonEmptyString(contract.unitContractId) ||
      !nonEmptyString(contract.systemBoundary) || !nonEmptyString(contract.invariant) || !contract.validInterval ||
      !isIsoTime(contract.validInterval.start) || !isIsoTime(contract.validInterval.end) ||
      !isIsoTime(contract.evaluationTime) ||
      !nonEmptyString(contract.contractEvidenceRef) || !nonEmptyString(contract.boundaryEvidenceRef) ||
      !nonEmptyString(contract.uncertaintyRuleRef) || !nonEmptyString(contract.uncertaintyPolicyEvidenceRef) ||
      compareIsoTimes(contract.validInterval.start, contract.validInterval.end) >= 0 ||
      compareIsoTimes(contract.evaluationTime, contract.validInterval.start) < 0 ||
      compareIsoTimes(contract.evaluationTime, contract.validInterval.end) > 0 ||
      !safeTicks(contract.toleranceTicks)) {
    return invalid("CONSERVATION-CONTRACT-INVALID", "Contract identity, resource, unit contract, boundary, valid interval, evaluation time and explicit non-negative tolerance are required.");
  }
  if (compareIsoTimes(contract.evaluationTime, contract.validInterval.start) === 0 ||
      compareIsoTimes(contract.evaluationTime, contract.validInterval.end) === 0) {
    diagnostics.push({
      code: "CONSERVATION-EVALUATION-TIME-BOUNDARY-AMBIGUOUS",
      message: "The evaluation time is exactly on a contract interval boundary; the evaluator does not infer endpoint inclusion."
    });
    return {
      outcome: "CONSERVATION-UNRESOLVED",
      contractId: contract.contractId,
      toleranceTicks: contract.toleranceTicks,
      diagnostics,
      limitations: [...CONSERVATION_LIMITATIONS]
    };
  }

  if (contract.invariant !== "SCALAR-ADDITIVE-BALANCE") {
    diagnostics.push({
      code: "CONSERVATION-INVARIANT-UNSUPPORTED",
      message: "The declared invariant is not the supported scalar-additive balance; a domain-specific invariant is required."
    });
    return {
      outcome: "CONSERVATION-UNRESOLVED",
      contractId: contract.contractId,
      diagnostics,
      limitations: [...CONSERVATION_LIMITATIONS]
    };
  }

  const evidenceReady =
    evidencePass(contract.contractEvidence, "CONSERVATION-CONTRACT-EVIDENCE", diagnostics) &&
    evidencePass(contract.boundaryEvidence, "CONSERVATION-BOUNDARY-EVIDENCE", diagnostics) &&
    evidencePass(contract.uncertaintyPolicyEvidence, "CONSERVATION-UNCERTAINTY-POLICY", diagnostics);
  if (!evidenceReady) {
    return {
      outcome: "CONSERVATION-UNRESOLVED",
      contractId: contract.contractId,
      toleranceTicks: contract.toleranceTicks,
      diagnostics,
      limitations: [...CONSERVATION_LIMITATIONS]
    };
  }

  const opening = sumTerms(contract.openingState, contract, "Opening state", diagnostics);
  const sources = sumTerms(contract.sources, contract, "Sources", diagnostics);
  const inputs = sumTerms(contract.permittedInputs, contract, "Permitted inputs", diagnostics);
  const closing = sumTerms(contract.closingState, contract, "Closing state", diagnostics);
  const sinks = sumTerms(contract.sinks, contract, "Sinks", diagnostics);
  const outputs = sumTerms(contract.permittedOutputs, contract, "Permitted outputs", diagnostics);
  const losses = sumLossTerms(contract.declaredLosses, contract, diagnostics);
  if ([opening, sources, inputs, closing, sinks, outputs, losses].some(value => value === undefined)) {
    return {
      outcome: "CONSERVATION-UNRESOLVED",
      contractId: contract.contractId,
      toleranceTicks: contract.toleranceTicks,
      diagnostics,
      limitations: [...CONSERVATION_LIMITATIONS]
    };
  }

  const leftTotalTicks = opening! + sources! + inputs!;
  const rightTotalTicks = closing! + sinks! + outputs! + losses!;
  if (!Number.isSafeInteger(leftTotalTicks) || !Number.isSafeInteger(rightTotalTicks)) {
    return invalid("CONSERVATION-ARITHMETIC-OVERFLOW", "Balance totals exceed the safe integer tick range.");
  }
  const differenceTicks = leftTotalTicks - rightTotalTicks;
  const outcome = Math.abs(differenceTicks) <= contract.toleranceTicks
    ? "CONSERVATION-SATISFIED"
    : "CONSERVATION-MISMATCH";
  if (outcome === "CONSERVATION-MISMATCH") {
    diagnostics.push({
      code: "CONSERVATION-MISMATCH",
      message: "The declared balance differs by " + differenceTicks + " ticks, outside the explicit tolerance."
    });
  }
  return {
    outcome,
    contractId: contract.contractId,
    leftTotalTicks,
    rightTotalTicks,
    differenceTicks,
    toleranceTicks: contract.toleranceTicks,
    diagnostics,
    limitations: [...CONSERVATION_LIMITATIONS]
  };
}

export type ResourceReconciliationContract = Pick<
  ConservationContractInput,
  | "contractId"
  | "resourceKind"
  | "unit"
  | "unitContractId"
  | "systemBoundary"
  | "validInterval"
  | "toleranceTicks"
  | "contractEvidence"
  | "contractEvidenceRef"
  | "boundaryEvidence"
  | "boundaryEvidenceRef"
  | "uncertaintyRuleRef"
  | "uncertaintyPolicyEvidence"
  | "uncertaintyPolicyEvidenceRef"
> & {
  /** Exact opaque version identity forwarded from the resource preflight result. */
  preflightContractVersionRef: string;
};

export type ResourceObservationKind = "ESTIMATE" | "MEASUREMENT";

export interface ResourceBalanceObservation {
  category: ResourceObservationKind;
  balanceTicks: number | null;
  observedAt: string;
  methodRef: string;
  uncertaintyRef: string;
  provenanceRef: string;
  evidence: ConservationEvidence;
  evidenceRef: string;
  policyAcceptanceEvidence: ConservationEvidence;
  policyAcceptanceEvidenceRef: string;
}

export type ResourceReconciliationAccount = LedgerAccount & {
  /** Opening-balance snapshot time, required to anchor the projection to the contract interval. */
  openingBalanceAsOf: string;
};

export type ResourceReconciliationEvent = LedgerEvent & {
  /** Event valid time, required for a time-scoped account projection. */
  validTime: string;
  /** Report-side contract version; must exactly match the preflight version. */
  contractVersionRef: string;
};

/**
 * Caller-supplied assertion that the event batch covers the exact account and
 * time scope being reconciled. This is a traceable input, not authenticated proof.
 */
export interface ResourceReconciliationBatchEvidence {
  /** Report-side contract version covered by this exact event batch. */
  contractVersionRef: string;
  contractId: string;
  systemBoundary: string;
  accountIds: string[];
  openingSnapshotAsOf: string;
  observationTime: string;
  completenessEvidence: ConservationEvidence;
  completenessEvidenceRef: string;
}

export interface ResourceReconciliationInput {
  reconciliationId: string;
  contract: ResourceReconciliationContract;
  accountId: string;
  accounts: ResourceReconciliationAccount[];
  events: ResourceReconciliationEvent[];
  eventBatchEvidence: ResourceReconciliationBatchEvidence;
  observation: ResourceBalanceObservation;
}

export type ResourceReconciliationOutcome =
  | "ACCOUNT-BALANCE-RECONCILED"
  | "ACCOUNT-BALANCE-DISCREPANCY"
  | "UNRESOLVED"
  | "INVALID-RECONCILIATION";

export interface ResourceReconciliationResult {
  outcome: ResourceReconciliationOutcome;
  scope: "ACCOUNT-BALANCE-ONLY";
  reconciliationId: string;
  contractId?: string;
  preflightContractVersionRef?: string;
  reportContractVersionRef?: string;
  accountId?: string;
  ledgerOutcome?: LedgerProjection["outcome"];
  expectedBalanceTicks?: number;
  observedBalanceTicks?: number;
  discrepancyTicks?: number;
  toleranceTicks?: number;
  eventBatchCompletenessEvidence?: ConservationEvidence;
  eventBatchEvidenceRef?: string;
  diagnostics: ConservationDiagnostic[];
  limitations: string[];
}

const RECONCILIATION_LIMITATIONS = [
  "Expected balance is derived by projecting the supplied accounts and events; the projection and evidence are caller-supplied and are not authenticated.",
  "Only one account with an exact resource, unit and unit-contract match is compared; no conversion or multi-account invariant is inferred.",
  "The comparison uses only the tolerance declared by the conservation contract; a separate caller-supplied reconciliation tolerance is not accepted.",
  "The named contract must have passing contract, boundary and uncertainty-policy evidence, but this evaluator does not authenticate or interpret those sources.",
  "Measurement method, time, uncertainty and provenance are caller-supplied; the evaluator checks required references and timestamp format but does not authenticate them.",
  "Per-observation acceptance under the uncertainty policy is caller-supplied evidence; the evaluator requires PASS but does not interpret or authenticate the policy decision.",
  "The comparison uses gross account balance. A held reservation remains in that balance and is not treated as physical consumption.",
  "Every projected account must identify an opening-balance snapshot as of the conservation interval start; snapshot times are caller-supplied and unauthenticated.",
  "The supplied event batch must carry valid times in strictly increasing order, strictly after the opening snapshot and strictly before the observation; the reconciler does not sort or silently filter events.",
  "Boundary-equal observations/events, missing event times, out-of-window events and ambiguous event ordering remain unresolved because endpoint and same-time ordering semantics are not universal.",
  "A caller-supplied event-batch completeness assertion is required and scoped to the exact contract, boundary, account set, opening snapshot and observation time; the assertion and timestamps are not authenticated or independently verified.",
  "The preflight and report contract-version references are opaque caller-supplied identifiers; exact equality is required, but references are not authenticated and no cross-version compatibility or migration is inferred.",
  "This is an account-balance comparison only; it does not by itself satisfy the whole-resource RESOURCE-RECONCILED stage.",
  "Discrepancies are reported without changing ledger entries or balances. Reconciliation is not proof of conservation, authority, mechanism validity, execution or a successful effect."
];

export function reconcileResourceBalance(
  input: ResourceReconciliationInput
): ResourceReconciliationResult {
  const diagnostics: ConservationDiagnostic[] = [];
  const invalid = (code: string, message: string): ResourceReconciliationResult => {
    diagnostics.push({ code, message });
    return {
      outcome: "INVALID-RECONCILIATION",
      scope: "ACCOUNT-BALANCE-ONLY",
      reconciliationId: nonEmptyString(input?.reconciliationId) ? input.reconciliationId : "",
      ...(nonEmptyString(input?.contract?.contractId) ? { contractId: input.contract.contractId } : {}),
      ...(nonEmptyString(input?.contract?.preflightContractVersionRef) ? { preflightContractVersionRef: input.contract.preflightContractVersionRef } : {}),
      ...(nonEmptyString(input?.eventBatchEvidence?.contractVersionRef) ? { reportContractVersionRef: input.eventBatchEvidence.contractVersionRef } : {}),
      ...(nonEmptyString(input?.accountId) ? { accountId: input.accountId } : {}),
      ...(isConservationEvidence(input?.eventBatchEvidence?.completenessEvidence)
        ? { eventBatchCompletenessEvidence: input.eventBatchEvidence.completenessEvidence } : {}),
      ...(nonEmptyString(input?.eventBatchEvidence?.completenessEvidenceRef)
        ? { eventBatchEvidenceRef: input.eventBatchEvidence.completenessEvidenceRef } : {}),
      diagnostics,
      limitations: [...RECONCILIATION_LIMITATIONS]
    };
  };
  const unresolved = (
    code: string,
    message: string,
    ledgerOutcome?: LedgerProjection["outcome"],
    expectedBalanceTicks?: number
  ): ResourceReconciliationResult => {
    diagnostics.push({ code, message });
    return {
      outcome: "UNRESOLVED",
      scope: "ACCOUNT-BALANCE-ONLY",
      reconciliationId: nonEmptyString(input?.reconciliationId) ? input.reconciliationId : "",
      ...(nonEmptyString(input?.contract?.contractId) ? { contractId: input.contract.contractId } : {}),
      ...(nonEmptyString(input?.contract?.preflightContractVersionRef) ? { preflightContractVersionRef: input.contract.preflightContractVersionRef } : {}),
      ...(nonEmptyString(input?.eventBatchEvidence?.contractVersionRef) ? { reportContractVersionRef: input.eventBatchEvidence.contractVersionRef } : {}),
      ...(nonEmptyString(input?.accountId) ? { accountId: input.accountId } : {}),
      ...(isConservationEvidence(input?.eventBatchEvidence?.completenessEvidence)
        ? { eventBatchCompletenessEvidence: input.eventBatchEvidence.completenessEvidence } : {}),
      ...(nonEmptyString(input?.eventBatchEvidence?.completenessEvidenceRef)
        ? { eventBatchEvidenceRef: input.eventBatchEvidence.completenessEvidenceRef } : {}),
      ...(ledgerOutcome ? { ledgerOutcome } : {}),
      ...(expectedBalanceTicks === undefined ? {} : { expectedBalanceTicks }),
      diagnostics,
      limitations: [...RECONCILIATION_LIMITATIONS]
    };
  };

  if (!input || typeof input !== "object" ||
      !nonEmptyString(input.reconciliationId) || !nonEmptyString(input.accountId) ||
      !input.contract || !nonEmptyString(input.contract.contractId) ||
      !nonEmptyString(input.contract.resourceKind) || !nonEmptyString(input.contract.unit) ||
      !nonEmptyString(input.contract.unitContractId) || !nonEmptyString(input.contract.systemBoundary) ||
      !input.contract.validInterval ||
      !isIsoTime(input.contract.validInterval.start) || !isIsoTime(input.contract.validInterval.end) ||
      compareIsoTimes(input.contract.validInterval.start, input.contract.validInterval.end) >= 0 ||
      !nonEmptyString(input.contract.contractEvidenceRef) ||
      !nonEmptyString(input.contract.boundaryEvidenceRef) ||
      !nonEmptyString(input.contract.uncertaintyRuleRef) ||
      !nonEmptyString(input.contract.uncertaintyPolicyEvidenceRef) ||
      !safeTicks(input.contract.toleranceTicks) ||
      !Array.isArray(input.accounts) || !Array.isArray(input.events) ||
      !input.observation || typeof input.observation !== "object" ||
      (input.observation.category !== "ESTIMATE" && input.observation.category !== "MEASUREMENT") ||
      !isIsoTime(input.observation.observedAt) ||
      !nonEmptyString(input.observation.evidenceRef) ||
      !input.eventBatchEvidence || typeof input.eventBatchEvidence !== "object" ||
      !nonEmptyString(input.eventBatchEvidence.contractId) ||
      !nonEmptyString(input.eventBatchEvidence.systemBoundary) ||
      !Array.isArray(input.eventBatchEvidence.accountIds) ||
      !isIsoTime(input.eventBatchEvidence.openingSnapshotAsOf) ||
      !isIsoTime(input.eventBatchEvidence.observationTime) ||
      !isConservationEvidence(input.eventBatchEvidence.completenessEvidence) ||
      !nonEmptyString(input.eventBatchEvidence.completenessEvidenceRef)) {
    return invalid("RECONCILIATION-RECORD-INVALID", "Reconciliation identity, contract boundary, interval and safe non-negative contract tolerance, evidence references, account/event records, valid observation time and evidence reference are required.");
  }

  if (!nonEmptyString(input.contract.preflightContractVersionRef) ||
      !nonEmptyString(input.eventBatchEvidence.contractVersionRef)) {
    return unresolved("RECONCILIATION-CONTRACT-VERSION-MISSING", "A preflight contract version and report-batch contract version are required before resource reports can be reconciled.");
  }

  if (input.contract.contractEvidence !== "PASS" ||
      input.contract.boundaryEvidence !== "PASS" ||
      input.contract.uncertaintyPolicyEvidence !== "PASS") {
    return unresolved("RECONCILIATION-CONTRACT-EVIDENCE-UNRESOLVED", "The named contract, boundary or uncertainty-policy evidence has not passed.");
  }

  const observation = input.observation;
  if (observation.category === "ESTIMATE") {
    return unresolved(
      "RECONCILIATION-EVIDENCE-CATEGORY-SUBSTITUTION",
      "An estimate is a prediction, not a measurement, and cannot be presented as an observed account balance."
    );
  }
  if (!nonEmptyString(observation.methodRef) ||
      !nonEmptyString(observation.uncertaintyRef) ||
      !nonEmptyString(observation.provenanceRef) ||
      !nonEmptyString(observation.policyAcceptanceEvidenceRef)) {
    return unresolved(
      "RECONCILIATION-MEASUREMENT-METADATA-MISSING",
      "A measurement requires method, time, uncertainty, provenance and explicit uncertainty-policy acceptance evidence references."
    );
  }
  if (observation.policyAcceptanceEvidence !== "PASS") {
    return unresolved(
      "RECONCILIATION-MEASUREMENT-POLICY-UNRESOLVED",
      "The measurement has not been accepted under the named uncertainty policy; no reconciliation is claimed."
    );
  }

  const intervalStart = input.contract.validInterval.start;
  const intervalEnd = input.contract.validInterval.end;
  const observedTime = observation.observedAt;
  if (compareIsoTimes(observedTime, intervalStart) < 0 || compareIsoTimes(observedTime, intervalEnd) > 0) {
    return invalid("RECONCILIATION-OUTSIDE-VALID-INTERVAL", "The observation time is outside the named contract's valid interval.");
  }
  if (compareIsoTimes(observedTime, intervalStart) === 0 || compareIsoTimes(observedTime, intervalEnd) === 0) {
    return unresolved("RECONCILIATION-OBSERVATION-BOUNDARY-AMBIGUOUS", "The observation is exactly on a contract interval boundary; this bounded reconciler does not infer endpoint inclusion.");
  }

  const batchEvidence = input.eventBatchEvidence;
  if (batchEvidence.contractVersionRef !== input.contract.preflightContractVersionRef) {
    return unresolved("RECONCILIATION-CONTRACT-VERSION-MISMATCH", "The report batch uses a different contract version from preflight; no compatibility or migration is inferred.");
  }
  if (batchEvidence.contractId !== input.contract.contractId ||
      batchEvidence.systemBoundary !== input.contract.systemBoundary ||
      compareIsoTimes(batchEvidence.openingSnapshotAsOf, intervalStart) !== 0 ||
      compareIsoTimes(batchEvidence.observationTime, observedTime) !== 0) {
    return invalid("RECONCILIATION-EVENT-BATCH-SCOPE-MISMATCH", "Event-batch completeness evidence must match the exact conservation contract, system boundary, opening snapshot and observation time.");
  }

  const declaredAccountIds = batchEvidence.accountIds;
  const projectedAccountIds = input.accounts.map((candidate) => candidate?.accountId);
  const declaredAccountIdSet = new Set(declaredAccountIds);
  const projectedAccountIdSet = new Set(projectedAccountIds);
  if (declaredAccountIds.some((id) => !nonEmptyString(id)) ||
      declaredAccountIdSet.size !== declaredAccountIds.length ||
      projectedAccountIds.some((id) => !nonEmptyString(id)) ||
      projectedAccountIdSet.size !== projectedAccountIds.length ||
      declaredAccountIdSet.size !== projectedAccountIdSet.size ||
      [...declaredAccountIdSet].some((id) => !projectedAccountIdSet.has(id))) {
    return invalid("RECONCILIATION-EVENT-BATCH-ACCOUNT-COVERAGE-MISMATCH", "The event-batch assertion must identify every projected account exactly once, with no missing, extra or duplicate account identifiers.");
  }

  if (batchEvidence.completenessEvidence === "FAIL") {
    return unresolved("RECONCILIATION-EVENT-BATCH-INCOMPLETE", "The supplied event-batch completeness evidence reports an incomplete batch; no account balance is reconciled.");
  }
  if (batchEvidence.completenessEvidence !== "PASS") {
    return unresolved("RECONCILIATION-EVENT-BATCH-COMPLETENESS-UNRESOLVED", "The supplied event-batch completeness evidence is not passing; no account balance is reconciled.");
  }

  for (const candidate of input.accounts) {
    if (!candidate || !isIsoTime(candidate.openingBalanceAsOf)) {
      return unresolved("RECONCILIATION-OPENING-SNAPSHOT-TIME-MISSING", "Every account used by the ledger projection requires a valid opening-balance snapshot time.");
    }
    if (compareIsoTimes(candidate.openingBalanceAsOf, intervalStart) !== 0) {
      return unresolved("RECONCILIATION-OPENING-SNAPSHOT-SCOPE", "Every opening balance must be timestamped at the conservation contract interval start; no rebasing is inferred.");
    }
  }

  let previousEventTime = intervalStart;
  for (const event of input.events) {
    if (!event || !nonEmptyString(event.contractVersionRef)) {
      return unresolved("RECONCILIATION-EVENT-CONTRACT-VERSION-MISSING", "Every report event requires an explicit contract-version identity before it can contribute to a reconciled balance.");
    }
    if (event.contractVersionRef !== batchEvidence.contractVersionRef) {
      return unresolved("RECONCILIATION-EVENT-CONTRACT-VERSION-MISMATCH", "A report event uses a different contract version from its batch; no cross-version equivalence is inferred.");
    }
    if (!isIsoTime(event.validTime)) {
      return unresolved("RECONCILIATION-EVENT-VALID-TIME-MISSING", "Every supplied ledger event requires a valid timestamp before it can contribute to a time-scoped balance.");
    }
    const eventTime = event.validTime;
    if (compareIsoTimes(eventTime, intervalStart) <= 0 || compareIsoTimes(eventTime, observedTime) >= 0) {
      return unresolved("RECONCILIATION-EVENT-OUTSIDE-AS-OF-WINDOW", "A ledger event is on or outside the open interval between the opening snapshot and observation; boundary ordering is not inferred and future events are not projected.");
    }
    if (compareIsoTimes(eventTime, previousEventTime) <= 0) {
      return unresolved("RECONCILIATION-EVENT-ORDER-AMBIGUOUS", "Ledger events must be supplied in strictly increasing valid-time order; the reconciler does not sort events or infer ordering for equal timestamps.");
    }
    previousEventTime = eventTime;
  }

  const matchingAccounts = input.accounts.filter((account) =>
    account && account.accountId === input.accountId
  );
  if (matchingAccounts.length !== 1) {
    return invalid("RECONCILIATION-ACCOUNT-IDENTITY", "Exactly one account record with the requested account identity is required.");
  }
  const account = matchingAccounts[0];
  if (!account || !nonEmptyString(account.accountId) ||
      !nonEmptyString(account.resourceKind) || !nonEmptyString(account.unit) ||
      !nonEmptyString(account.unitContractId) || !safeTicks(account.openingBalanceTicks)) {
    return invalid("RECONCILIATION-ACCOUNT-MALFORMED", "The account record must contain a valid identity, resource, unit contract and safe non-negative opening balance.");
  }
  if (account.resourceKind !== input.contract.resourceKind ||
      account.unit !== input.contract.unit ||
      account.unitContractId !== input.contract.unitContractId) {
    return invalid("RECONCILIATION-ACCOUNT-CONTRACT-MISMATCH", "The selected account does not match the resource and exact unit contract declared by the reconciliation contract.");
  }

  let projection: LedgerProjection;
  try {
    projection = projectResourceLedger(input.accounts, input.events);
  } catch {
    return unresolved("RECONCILIATION-LEDGER-INPUT-INVALID", "The supplied ledger records could not be projected safely.");
  }
  if (projection.outcome !== "LEDGER-PROJECTED" ||
      !Array.isArray(projection.issues) || projection.issues.length !== 0) {
    return unresolved("RECONCILIATION-LEDGER-UNRESOLVED", "The ledger projection is partial, malformed or unresolved; it cannot provide an established expected balance.", projection.outcome);
  }

  const hasBalance = Object.prototype.hasOwnProperty.call(projection.balances, input.accountId);
  const hasReserved = Object.prototype.hasOwnProperty.call(projection.reserved, input.accountId);
  const hasAvailable = Object.prototype.hasOwnProperty.call(projection.available, input.accountId);
  if (!hasBalance || !hasReserved || !hasAvailable) {
    return unresolved("RECONCILIATION-ACCOUNT-NOT-PROJECTED", "The selected account is not present in all projected balance views.", projection.outcome);
  }

  const expectedBalanceTicks = projection.balances[input.accountId];
  const reservedTicks = projection.reserved[input.accountId];
  const availableTicks = projection.available[input.accountId];
  if (!safeTicks(expectedBalanceTicks) || !safeTicks(reservedTicks) ||
      !safeTicks(availableTicks) || reservedTicks > expectedBalanceTicks ||
      expectedBalanceTicks - reservedTicks !== availableTicks) {
    return unresolved("RECONCILIATION-PROJECTION-INCONSISTENT", "The projected gross, reserved and available account balances are missing, unsafe or arithmetically inconsistent.", projection.outcome);
  }

  if (observation.balanceTicks === null || !safeTicks(observation.balanceTicks) ||
      observation.evidence !== "PASS") {
    return unresolved("RECONCILIATION-EVIDENCE-UNRESOLVED", "The measured balance is absent, invalid or not supported by passing observation evidence; no value is inferred.", projection.outcome, expectedBalanceTicks);
  }

  const discrepancyTicks = observation.balanceTicks - expectedBalanceTicks;
  const outcome = Math.abs(discrepancyTicks) <= input.contract.toleranceTicks
    ? "ACCOUNT-BALANCE-RECONCILED"
    : "ACCOUNT-BALANCE-DISCREPANCY";
  if (outcome === "ACCOUNT-BALANCE-DISCREPANCY") {
    diagnostics.push({
      code: "RESOURCE-RECONCILIATION-FAILED",
      message: "Observed and projected gross account balances differ by " + discrepancyTicks + " ticks; the discrepancy is preserved and no correction is applied."
    });
  }

  return {
    outcome,
    scope: "ACCOUNT-BALANCE-ONLY",
    reconciliationId: input.reconciliationId,
    contractId: input.contract.contractId,
    preflightContractVersionRef: input.contract.preflightContractVersionRef,
    reportContractVersionRef: batchEvidence.contractVersionRef,
    accountId: input.accountId,
    ledgerOutcome: projection.outcome,
    expectedBalanceTicks,
    observedBalanceTicks: observation.balanceTicks!,
    discrepancyTicks,
    toleranceTicks: input.contract.toleranceTicks,
    eventBatchCompletenessEvidence: batchEvidence.completenessEvidence,
    eventBatchEvidenceRef: batchEvidence.completenessEvidenceRef,
    diagnostics,
    limitations: [...RECONCILIATION_LIMITATIONS]
  };
}


/** A measured gross-balance observation attributed to one account in a shared batch. */
export interface ResourceAccountBalanceObservation extends ResourceBalanceObservation {
  accountId: string;
}

export interface ResourceAccountSetReconciliationInput {
  reconciliationId: string;
  contract: ResourceReconciliationContract;
  accounts: ResourceReconciliationAccount[];
  events: ResourceReconciliationEvent[];
  eventBatchEvidence: ResourceReconciliationBatchEvidence;
  observations: ResourceAccountBalanceObservation[];
}

export type ResourceAccountSetReconciliationOutcome =
  | "ACCOUNT-SET-RECONCILED"
  | "ACCOUNT-SET-DISCREPANCY"
  | "UNRESOLVED"
  | "INVALID-RECONCILIATION";

export interface ResourceAccountSetReconciliationResult {
  outcome: ResourceAccountSetReconciliationOutcome;
  scope: "ACCOUNT-SET-BALANCES";
  reconciliationId: string;
  contractId?: string;
  preflightContractVersionRef?: string;
  reportContractVersionRef?: string;
  accountResults: ResourceReconciliationResult[];
  diagnostics: ConservationDiagnostic[];
  limitations: string[];
}

const ACCOUNT_SET_RECONCILIATION_LIMITATIONS = [
  "Every account is compared independently against the same supplied ledger batch; the result is not a vector or cross-account conservation invariant.",
  "Exactly one measurement observation is required for every declared account; observations are not authenticated or independently verified.",
  "The event-batch completeness assertion and all ledger, account and measurement evidence remain caller-supplied and unauthenticated.",
  "Preflight and report version references must match exactly; no cross-version compatibility or migration is inferred.",
  "The result does not establish the full v1.9 RESOURCE-RECONCILED stage, physical conservation, execution, authority or target outcome."
];

/**
 * Reconciles every account in one exact event batch. The account and observation
 * sets must match exactly; each account retains its own gross-balance result.
 * This is a batch of account comparisons, not a cross-account invariant.
 */
export function reconcileResourceAccountSet(
  input: ResourceAccountSetReconciliationInput
): ResourceAccountSetReconciliationResult {
  const invalid = (code: string, message: string): ResourceAccountSetReconciliationResult => ({
    outcome: "INVALID-RECONCILIATION",
    scope: "ACCOUNT-SET-BALANCES",
    reconciliationId: nonEmptyString(input?.reconciliationId) ? input.reconciliationId : "",
    ...(nonEmptyString(input?.contract?.contractId) ? { contractId: input.contract.contractId } : {}),
    ...(nonEmptyString(input?.contract?.preflightContractVersionRef) ? { preflightContractVersionRef: input.contract.preflightContractVersionRef } : {}),
    ...(nonEmptyString(input?.eventBatchEvidence?.contractVersionRef) ? { reportContractVersionRef: input.eventBatchEvidence.contractVersionRef } : {}),
    accountResults: [],
    diagnostics: [{ code, message }],
    limitations: [...ACCOUNT_SET_RECONCILIATION_LIMITATIONS]
  });

  if (!input || typeof input !== "object" ||
      !nonEmptyString(input.reconciliationId) ||
      !input.contract || typeof input.contract !== "object" ||
      !nonEmptyString(input.contract.contractId) ||
      !nonEmptyString(input.contract.resourceKind) ||
      !nonEmptyString(input.contract.unit) ||
      !nonEmptyString(input.contract.unitContractId) ||
      !Array.isArray(input.accounts) || input.accounts.length === 0 ||
      !Array.isArray(input.events) ||
      !Array.isArray(input.observations)) {
    return invalid(
      "RECONCILIATION-ACCOUNT-SET-INVALID",
      "A reconciliation identity, one exact resource/unit contract, a non-empty account set, an event list and an observation list are required."
    );
  }

  const accountIds = input.accounts.map((account) => account?.accountId);
  if (accountIds.some((id) => !nonEmptyString(id)) ||
      new Set(accountIds).size !== accountIds.length) {
    return invalid(
      "RECONCILIATION-ACCOUNT-SET-IDENTITY",
      "Every account in the set must have one non-empty, unique account identity."
    );
  }

  const observationIds = input.observations.map((observation) => observation?.accountId);
  const accountIdSet = new Set(accountIds);
  const observationIdSet = new Set(observationIds);
  if (observationIds.some((id) => !nonEmptyString(id)) ||
      input.observations.length !== input.accounts.length ||
      observationIdSet.size !== observationIds.length ||
      accountIdSet.size !== observationIdSet.size ||
      [...accountIdSet].some((id) => !observationIdSet.has(id))) {
    return invalid(
      "RECONCILIATION-OBSERVATION-ACCOUNT-COVERAGE",
      "The observation set must contain exactly one observation for every account, with no missing, extra or duplicate account identities."
    );
  }

  if (input.accounts.some((account) =>
    !account ||
    !nonEmptyString(account.resourceKind) ||
    account.resourceKind !== input.contract.resourceKind ||
    !nonEmptyString(account.unit) ||
    account.unit !== input.contract.unit ||
    !nonEmptyString(account.unitContractId) ||
    account.unitContractId !== input.contract.unitContractId ||
    !safeTicks(account.openingBalanceTicks)
  )) {
    return invalid(
      "RECONCILIATION-ACCOUNT-SET-CONTRACT-MISMATCH",
      "Every account must match the same exact resource kind, unit and unit-contract identity and carry a safe non-negative opening balance; no conversion is inferred."
    );
  }

  const observationsByAccount = new Map(
    input.observations.map((observation) => [observation.accountId, observation] as const)
  );
  const accountResults = input.accounts.map((account) =>
    reconcileResourceBalance({
      reconciliationId: input.reconciliationId,
      contract: input.contract,
      accountId: account.accountId,
      accounts: input.accounts,
      events: input.events,
      eventBatchEvidence: input.eventBatchEvidence,
      observation: observationsByAccount.get(account.accountId)!
    })
  );

  const diagnostics = accountResults.flatMap((result) =>
    result.diagnostics.map((diagnostic) => ({
      code: diagnostic.code,
      message: (result.accountId ?? "Unidentified account") + ": " + diagnostic.message
    }))
  );

  const outcome: ResourceAccountSetReconciliationOutcome =
    accountResults.some((result) => result.outcome === "INVALID-RECONCILIATION")
      ? "INVALID-RECONCILIATION"
      : accountResults.some((result) => result.outcome === "UNRESOLVED")
        ? "UNRESOLVED"
        : accountResults.some((result) => result.outcome === "ACCOUNT-BALANCE-DISCREPANCY")
          ? "ACCOUNT-SET-DISCREPANCY"
          : "ACCOUNT-SET-RECONCILED";

  return {
    outcome,
    scope: "ACCOUNT-SET-BALANCES",
    reconciliationId: input.reconciliationId,
    contractId: input.contract.contractId,
    preflightContractVersionRef: input.contract.preflightContractVersionRef,
    reportContractVersionRef: input.eventBatchEvidence.contractVersionRef,
    accountResults,
    diagnostics,
    limitations: [...ACCOUNT_SET_RECONCILIATION_LIMITATIONS]
  };
}
