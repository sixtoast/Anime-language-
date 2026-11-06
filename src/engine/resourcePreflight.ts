/**
 * Conservative v1.9 resource preflight evaluator.
 *
 * This evaluates caller-supplied, already-verified evidence and compatible
 * scalar quantities. It does not verify sources, convert units, reserve stock,
 * mutate ledgers, or establish physical feasibility.
 */
export type ResourceCheckOutcome =
  | "RESOURCE-READY"
  | "RESOURCE-SPEC-UNDERSPECIFIED"
  | "UNIT-CONTRACT-MISSING"
  | "SOURCE-UNVERIFIED"
  | "RESOURCE-EVIDENCE-STALE"
  | "RESOURCE-UNAVAILABLE"
  | "RESOURCE-INSUFFICIENT"
  | "BUDGET-EXCEEDED"
  | "RESERVATION-CONFLICT"
  | "RESOURCE-OUTCOME-UNKNOWN";

export type EvidenceState = "PASS" | "FAIL" | "UNKNOWN" | "UNAVAILABLE";

export interface ResourcePreflightInput {
  resourceKind: string;
  accountId: string;
  unit: string;
  unitContractId?: string;
  openingBalance: number | null;
  openingBalanceEvidence: EvidenceState;
  sourceEvidence: EvidenceState;
  evidenceFreshness: EvidenceState;
  requiredAmount: number;
  heldReservations: number;
  reservationEvidence: EvidenceState;
  budgetLimit?: number;
  conservativeConsumptionUpperBound?: number;
  budgetEvidence: EvidenceState;
  sourceAvailableAmount?: number;
}

export interface ResourcePreflightDiagnostic {
  code: string;
  message: string;
}

export interface ResourcePreflightResult {
  outcome: ResourceCheckOutcome;
  stage: "SPECIFICATION-CHECKED" | "SOURCE-VERIFIED" | "BUDGET-CHECKED" | "RESERVATIONS-CHECKED" | "RESOURCE-READY" | "RESOURCE-OUTCOME-UNKNOWN";
  availableAmount?: number;
  requiredAmount: number;
  diagnostics: ResourcePreflightDiagnostic[];
  limitations: string[];
}

const LIMITATIONS = [
  "Evidence states and quantities are supplied by callers; this evaluator does not authenticate or measure them.",
  "Only exact unit-string matches are accepted. No implicit or inferred unit conversion is performed.",
  "The evaluator does not create or hold reservations, mutate accounts, debit resources, or execute an operation.",
  "RESOURCE-READY is a preflight result only; it is not evidence of execution, consumption, conservation or a successful effect."
];

function result(
  outcome: ResourceCheckOutcome,
  stage: ResourcePreflightResult["stage"],
  requiredAmount: number,
  diagnostics: ResourcePreflightDiagnostic[],
  availableAmount?: number
): ResourcePreflightResult {
  return {
    outcome, stage, requiredAmount,
    ...(availableAmount === undefined ? {} : { availableAmount }),
    diagnostics, limitations: [...LIMITATIONS]
  };
}

function validNonNegative(value: number): boolean {
  return Number.isFinite(value) && value >= 0;
}

export function evaluateResourcePreflight(input: ResourcePreflightInput): ResourcePreflightResult {
  const diagnostics: ResourcePreflightDiagnostic[] = [];
  const add = (code: string, message: string) => diagnostics.push({ code, message });

  if (!input.resourceKind.trim() || !input.accountId.trim() || !input.unit.trim() ||
      !input.unitContractId?.trim() || !validNonNegative(input.requiredAmount) ||
      !validNonNegative(input.heldReservations)) {
    add("RESOURCE-SPEC-UNDERSPECIFIED", "Resource identity, account, unit contract, and finite non-negative quantities are required.");
    return result("RESOURCE-SPEC-UNDERSPECIFIED", "RESOURCE-OUTCOME-UNKNOWN", input.requiredAmount, diagnostics);
  }
  if (input.openingBalance === null || !validNonNegative(input.openingBalance)) {
    add("VALUE-UNKNOWN", "Opening balance is missing or is not a finite non-negative quantity.");
    return result("RESOURCE-OUTCOME-UNKNOWN", "RESOURCE-OUTCOME-UNKNOWN", input.requiredAmount, diagnostics);
  }
  if (input.openingBalanceEvidence !== "PASS") {
    add("OPENING-BALANCE-" + input.openingBalanceEvidence, "Opening balance evidence has not passed verification.");
    return result(input.openingBalanceEvidence === "FAIL" ? "SOURCE-UNVERIFIED" : "RESOURCE-OUTCOME-UNKNOWN", "RESOURCE-OUTCOME-UNKNOWN", input.requiredAmount, diagnostics);
  }
  if (input.sourceEvidence !== "PASS") {
    add("SOURCE-" + input.sourceEvidence, "Source provenance and availability evidence have not passed.");
    return result(input.sourceEvidence === "FAIL" ? "SOURCE-UNVERIFIED" : "RESOURCE-OUTCOME-UNKNOWN", "RESOURCE-OUTCOME-UNKNOWN", input.requiredAmount, diagnostics);
  }
  if (input.evidenceFreshness !== "PASS") {
    add("EVIDENCE-" + input.evidenceFreshness, "Availability evidence is stale or its freshness cannot be established.");
    return result(input.evidenceFreshness === "FAIL" ? "RESOURCE-EVIDENCE-STALE" : "RESOURCE-OUTCOME-UNKNOWN", "RESOURCE-OUTCOME-UNKNOWN", input.requiredAmount, diagnostics);
  }

  const sourceAmount = input.sourceAvailableAmount ?? input.openingBalance;
  if (!validNonNegative(sourceAmount)) {
    add("SOURCE-AMOUNT-INVALID", "Verified source amount must be finite and non-negative.");
    return result("RESOURCE-SPEC-UNDERSPECIFIED", "SOURCE-VERIFIED", input.requiredAmount, diagnostics);
  }
  const grossAvailable = Math.min(input.openingBalance, sourceAmount);
  if (input.reservationEvidence !== "PASS") {
    add("RESERVATION-EVIDENCE-" + input.reservationEvidence, "Held reservations cannot be safely deducted without valid reservation evidence.");
    return result(input.reservationEvidence === "FAIL" ? "RESERVATION-CONFLICT" : "RESOURCE-OUTCOME-UNKNOWN", "RESOURCE-OUTCOME-UNKNOWN", input.requiredAmount, diagnostics, grossAvailable);
  }
  const availableAmount = grossAvailable - input.heldReservations;
  if (availableAmount < 0) {
    add("RESERVATION-CONFLICT", "Held reservations exceed the verified gross account balance.");
    return result("RESERVATION-CONFLICT", "RESERVATIONS-CHECKED", input.requiredAmount, diagnostics, availableAmount);
  }
  if (input.budgetLimit !== undefined || input.conservativeConsumptionUpperBound !== undefined) {
    if (input.budgetEvidence !== "PASS" || input.budgetLimit === undefined ||
        input.conservativeConsumptionUpperBound === undefined ||
        !validNonNegative(input.budgetLimit) ||
        !validNonNegative(input.conservativeConsumptionUpperBound)) {
      add("BUDGET-EVIDENCE-UNRESOLVED", "A budget requires a verified limit and conservative upper bound under a defined policy.");
      return result("RESOURCE-OUTCOME-UNKNOWN", "RESOURCE-OUTCOME-UNKNOWN", input.requiredAmount, diagnostics, availableAmount);
    }
    if (input.conservativeConsumptionUpperBound > input.budgetLimit) {
      add("BUDGET-EXCEEDED", "The conservative consumption upper bound exceeds the strict budget limit.");
      return result("BUDGET-EXCEEDED", "BUDGET-CHECKED", input.requiredAmount, diagnostics, availableAmount);
    }
  }
  if (input.requiredAmount > availableAmount) {
    add("RESOURCE-INSUFFICIENT", "Required quantity exceeds verified unreserved account availability.");
    return result("RESOURCE-INSUFFICIENT", "RESERVATIONS-CHECKED", input.requiredAmount, diagnostics, availableAmount);
  }

  return result("RESOURCE-READY", "RESOURCE-READY", input.requiredAmount, diagnostics, availableAmount);
}
