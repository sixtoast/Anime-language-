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
  boundaryEvidence: ConservationEvidence;
  uncertaintyPolicyEvidence: ConservationEvidence;
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
  "Evidence states and references are caller-supplied; this evaluator does not authenticate sources, boundaries, measurements or contracts.",
  "A satisfied balance is an accounting result under the named contract, not proof of a physical law, mechanism, authorisation, execution or successful effect.",
  "No ledger entries or account balances are changed; discrepancies remain visible for separate review."
];

const safeTicks = (value: number): boolean => Number.isSafeInteger(value) && value >= 0;
const isIsoTime = (value: string): boolean =>
  typeof value === "string" && Number.isFinite(Date.parse(value));

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
    if (!term || term.resourceKind !== contract.resourceKind ||
        term.unit !== contract.unit || term.unitContractId !== contract.unitContractId ||
        !safeTicks(term.amountTicks) || !term.evidenceRef?.trim()) {
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
  if (!contract.contractId?.trim() || !contract.resourceKind?.trim() ||
      !contract.unit?.trim() || !contract.unitContractId?.trim() ||
      !contract.systemBoundary?.trim() || !contract.validInterval ||
      !isIsoTime(contract.validInterval.start) || !isIsoTime(contract.validInterval.end) ||
      !isIsoTime(contract.evaluationTime) ||
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

export interface ResourceReconciliationInput {
  reconciliationId: string;
  contractId: string;
  accountId: string;
  resourceKind: string;
  unit: string;
  unitContractId: string;
  expectedBalanceTicks: number;
  observedBalanceTicks: number | null;
  toleranceTicks: number;
  observedAt: string;
  evidence: ConservationEvidence;
  evidenceRef: string;
}

export type ResourceReconciliationOutcome =
  | "RECONCILED"
  | "DISCREPANCY"
  | "UNRESOLVED"
  | "INVALID-RECONCILIATION";

export interface ResourceReconciliationResult {
  outcome: ResourceReconciliationOutcome;
  reconciliationId: string;
  expectedBalanceTicks?: number;
  observedBalanceTicks?: number;
  discrepancyTicks?: number;
  toleranceTicks?: number;
  diagnostics: ConservationDiagnostic[];
  limitations: string[];
}

export function reconcileResourceBalance(
  input: ResourceReconciliationInput
): ResourceReconciliationResult {
  const diagnostics: ConservationDiagnostic[] = [];
  const invalid = (code: string, message: string): ResourceReconciliationResult => {
    diagnostics.push({ code, message });
    return {
      outcome: "INVALID-RECONCILIATION",
      reconciliationId: input?.reconciliationId ?? "",
      diagnostics,
      limitations: [...CONSERVATION_LIMITATIONS]
    };
  };
  if (!input || typeof input !== "object" ||
      !input.reconciliationId?.trim() || !input.contractId?.trim() ||
      !input.accountId?.trim() || !input.resourceKind?.trim() ||
      !input.unit?.trim() || !input.unitContractId?.trim() ||
      !safeTicks(input.expectedBalanceTicks) ||
      !safeTicks(input.toleranceTicks) || !isIsoTime(input.observedAt) ||
      !input.evidenceRef?.trim()) {
    return invalid("RECONCILIATION-RECORD-INVALID", "Reconciliation identity, contract, account, resource, unit contract, valid observation time, evidence reference and safe integer quantities are required.");
  }
  if (input.observedBalanceTicks === null ||
      !safeTicks(input.observedBalanceTicks) || input.evidence !== "PASS") {
    diagnostics.push({
      code: "RECONCILIATION-EVIDENCE-UNRESOLVED",
      message: "Observed balance is absent, invalid, or its evidence has not passed; no balance is inferred or changed."
    });
    return {
      outcome: "UNRESOLVED",
      reconciliationId: input.reconciliationId,
      expectedBalanceTicks: input.expectedBalanceTicks,
      toleranceTicks: input.toleranceTicks,
      diagnostics,
      limitations: [...CONSERVATION_LIMITATIONS]
    };
  }
  const discrepancyTicks = input.observedBalanceTicks - input.expectedBalanceTicks;
  const outcome = Math.abs(discrepancyTicks) <= input.toleranceTicks ? "RECONCILED" : "DISCREPANCY";
  if (outcome === "DISCREPANCY") {
    diagnostics.push({
      code: "RESOURCE-RECONCILIATION-FAILED",
      message: "Observed and expected balances differ by " + discrepancyTicks + " ticks; the discrepancy is preserved and no correction is applied."
    });
  }
  return {
    outcome,
    reconciliationId: input.reconciliationId,
    expectedBalanceTicks: input.expectedBalanceTicks,
    observedBalanceTicks: input.observedBalanceTicks,
    discrepancyTicks,
    toleranceTicks: input.toleranceTicks,
    diagnostics,
    limitations: [...CONSERVATION_LIMITATIONS]
  };
}
