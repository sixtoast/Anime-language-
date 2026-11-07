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
  declaredLosses: ConservationQuantity[];
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
  "Evidence states and references are caller-supplied; this evaluator checks required references but does not authenticate sources, boundaries, measurements, contracts or uncertainty rules.",
  "A satisfied balance is an accounting result under the named contract, not proof of a physical law, mechanism, authorisation, execution or successful effect.",
  "No ledger entries or account balances are changed; discrepancies remain visible for separate review."
];

const nonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const safeTicks = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 0;

const isIsoTime = (value: unknown): value is string => {
  if (typeof value !== "string") return false;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,9})?(Z|([+-])(\d{2}):(\d{2}))$/);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = Number(match[6]);
  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const monthDays = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > monthDays[month - 1] ||
      hour > 23 || minute > 59 || second > 59) return false;
  if (match[8] !== "Z") {
    const offsetHour = Number(match[10]);
    const offsetMinute = Number(match[11]);
    if (offsetHour > 23 || offsetMinute > 59) return false;
  }
  return Number.isFinite(Date.parse(value));
};

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
      !nonEmptyString(contract.systemBoundary) || !contract.validInterval ||
      !isIsoTime(contract.validInterval.start) || !isIsoTime(contract.validInterval.end) ||
      !isIsoTime(contract.evaluationTime) ||
      !nonEmptyString(contract.contractEvidenceRef) || !nonEmptyString(contract.boundaryEvidenceRef) ||
      !nonEmptyString(contract.uncertaintyRuleRef) || !nonEmptyString(contract.uncertaintyPolicyEvidenceRef) ||
      Date.parse(contract.validInterval.start) >= Date.parse(contract.validInterval.end) ||
      Date.parse(contract.evaluationTime) < Date.parse(contract.validInterval.start) ||
      Date.parse(contract.evaluationTime) > Date.parse(contract.validInterval.end) ||
      !safeTicks(contract.toleranceTicks)) {
    return invalid("CONSERVATION-CONTRACT-INVALID", "Contract identity, resource, unit contract, boundary, valid interval, evaluation time and explicit non-negative tolerance are required.");
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
  const losses = sumTerms(contract.declaredLosses, contract, "Declared losses", diagnostics);
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
  | "contractEvidence"
  | "contractEvidenceRef"
  | "boundaryEvidence"
  | "boundaryEvidenceRef"
  | "uncertaintyRuleRef"
  | "uncertaintyPolicyEvidence"
  | "uncertaintyPolicyEvidenceRef"
>;

export interface ResourceReconciliationInput {
  reconciliationId: string;
  contract: ResourceReconciliationContract;
  accountId: string;
  accounts: LedgerAccount[];
  events: LedgerEvent[];
  observedBalanceTicks: number | null;
  toleranceTicks: number;
  observedAt: string;
  evidence: ConservationEvidence;
  evidenceRef: string;
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
  accountId?: string;
  ledgerOutcome?: LedgerProjection["outcome"];
  expectedBalanceTicks?: number;
  observedBalanceTicks?: number;
  discrepancyTicks?: number;
  toleranceTicks?: number;
  diagnostics: ConservationDiagnostic[];
  limitations: string[];
}

const RECONCILIATION_LIMITATIONS = [
  "Expected balance is derived by projecting the supplied accounts and events; the projection and evidence are caller-supplied and are not authenticated.",
  "Only one account with an exact resource, unit and unit-contract match is compared; no conversion or multi-account invariant is inferred.",
  "The named contract must have passing contract, boundary and uncertainty-policy evidence, but this evaluator does not authenticate or interpret those sources.",
  "The comparison uses gross account balance. A held reservation remains in that balance and is not treated as physical consumption.",
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
      ...(nonEmptyString(input?.accountId) ? { accountId: input.accountId } : {}),
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
      ...(nonEmptyString(input?.accountId) ? { accountId: input.accountId } : {}),
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
      Date.parse(input.contract.validInterval.start) >= Date.parse(input.contract.validInterval.end) ||
      !nonEmptyString(input.contract.contractEvidenceRef) ||
      !nonEmptyString(input.contract.boundaryEvidenceRef) ||
      !nonEmptyString(input.contract.uncertaintyRuleRef) ||
      !nonEmptyString(input.contract.uncertaintyPolicyEvidenceRef) ||
      !Array.isArray(input.accounts) || !Array.isArray(input.events) ||
      !safeTicks(input.toleranceTicks) || !isIsoTime(input.observedAt) ||
      !nonEmptyString(input.evidenceRef)) {
    return invalid("RECONCILIATION-RECORD-INVALID", "Reconciliation identity, contract boundary and interval, evidence references, account/event records, safe non-negative tolerance, valid observation time and evidence reference are required.");
  }

  if (input.contract.contractEvidence !== "PASS" ||
      input.contract.boundaryEvidence !== "PASS" ||
      input.contract.uncertaintyPolicyEvidence !== "PASS") {
    return unresolved("RECONCILIATION-CONTRACT-EVIDENCE-UNRESOLVED", "The named contract, boundary or uncertainty-policy evidence has not passed.");
  }

  const observedTime = Date.parse(input.observedAt);
  if (observedTime < Date.parse(input.contract.validInterval.start) ||
      observedTime > Date.parse(input.contract.validInterval.end)) {
    return invalid("RECONCILIATION-OUTSIDE-VALID-INTERVAL", "The observation time is outside the named contract's valid interval.");
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

  if (input.observedBalanceTicks === null || !safeTicks(input.observedBalanceTicks) ||
      input.evidence !== "PASS") {
    return unresolved("RECONCILIATION-EVIDENCE-UNRESOLVED", "The observed balance is absent, invalid or not supported by passing evidence; no value is inferred.", projection.outcome, expectedBalanceTicks);
  }

  const discrepancyTicks = input.observedBalanceTicks - expectedBalanceTicks;
  const outcome = Math.abs(discrepancyTicks) <= input.toleranceTicks
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
    accountId: input.accountId,
    ledgerOutcome: projection.outcome,
    expectedBalanceTicks,
    observedBalanceTicks: input.observedBalanceTicks,
    discrepancyTicks,
    toleranceTicks: input.toleranceTicks,
    diagnostics,
    limitations: [...RECONCILIATION_LIMITATIONS]
  };
}
