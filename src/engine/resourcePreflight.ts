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

export interface ResourceAvailabilityWindow {
  validFrom: string;
  validUntil: string;
  evaluationTime: string;
  evidenceRef: string;
  provenanceRef: string;
}

export interface ResourcePreflightInput {
  resourceKind: string;
  accountId: string;
  unit: string;
  requiredUnit: string;
  unitContractId?: string;
  budgetUnit?: string;
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
  availabilityWindow?: ResourceAvailabilityWindow;
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
  "Evidence states, quantities, availability windows and provenance references are supplied by callers; this evaluator does not authenticate or measure them.",
  "Availability-window timestamps are accepted only strictly inside the declared interval; endpoint inclusivity is unresolved by v1.9.",
  "Only exact unit-string matches are accepted. No implicit or inferred unit conversion is performed.",
  "This evaluator does not execute an operation, create or hold reservations, mutate accounts, or debit resources.",
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

function nonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isIsoTime(value: unknown): value is string {
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
}

export function evaluateResourcePreflight(input: ResourcePreflightInput): ResourcePreflightResult {
  const diagnostics: ResourcePreflightDiagnostic[] = [];
  const add = (code: string, message: string) => diagnostics.push({ code, message });

  if (!input.resourceKind.trim() || !input.accountId.trim() || !input.unit.trim() || !input.requiredUnit.trim() ||
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
  const window = input.availabilityWindow;
  if (!window || !isIsoTime(window.validFrom) || !isIsoTime(window.validUntil) ||
      !isIsoTime(window.evaluationTime) || !nonEmptyString(window.evidenceRef) ||
      !nonEmptyString(window.provenanceRef) ||
      Date.parse(window.validFrom) >= Date.parse(window.validUntil)) {
    add("AVAILABILITY-WINDOW-UNRESOLVED", "A valid source availability window, evaluation time, evidence reference and provenance reference are required.");
    return result("RESOURCE-OUTCOME-UNKNOWN", "RESOURCE-OUTCOME-UNKNOWN", input.requiredAmount, diagnostics);
  }
  const validFrom = Date.parse(window.validFrom);
  const validUntil = Date.parse(window.validUntil);
  const evaluationTime = Date.parse(window.evaluationTime);
  if (evaluationTime < validFrom || evaluationTime > validUntil) {
    add("RESOURCE-EVIDENCE-STALE", "The source availability evidence is outside its declared valid-time window.");
    return result("RESOURCE-EVIDENCE-STALE", "RESOURCE-OUTCOME-UNKNOWN", input.requiredAmount, diagnostics);
  }
  if (evaluationTime === validFrom || evaluationTime === validUntil) {
    add("AVAILABILITY-WINDOW-BOUNDARY-AMBIGUOUS", "The v1.9 source contract does not define whether availability-window endpoints are inclusive; boundary-time evidence remains unresolved.");
    return result("RESOURCE-OUTCOME-UNKNOWN", "RESOURCE-OUTCOME-UNKNOWN", input.requiredAmount, diagnostics);
  }
  if (input.evidenceFreshness !== "PASS") {
    add("EVIDENCE-" + input.evidenceFreshness, "Availability evidence is stale or its freshness cannot be established.");
    return result(input.evidenceFreshness === "FAIL" ? "RESOURCE-EVIDENCE-STALE" : "RESOURCE-OUTCOME-UNKNOWN", "RESOURCE-OUTCOME-UNKNOWN", input.requiredAmount, diagnostics);
  }

  if (input.requiredUnit !== input.unit) {
    add("UNIT-CONTRACT-MISSING", "Required quantity unit does not exactly match the account unit; no conversion is inferred.");
    return result("UNIT-CONTRACT-MISSING", "SPECIFICATION-CHECKED", input.requiredAmount, diagnostics);
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
    if (input.budgetEvidence !== "PASS" || input.budgetUnit !== input.unit || input.budgetLimit === undefined ||
        input.conservativeConsumptionUpperBound === undefined ||
        !validNonNegative(input.budgetLimit) ||
        !validNonNegative(input.conservativeConsumptionUpperBound)) {
      add("BUDGET-EVIDENCE-UNRESOLVED", "A budget requires a verified limit, matching unit, and conservative upper bound under a defined policy.");
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

/** Map a preflight result into the coordinator's four-state gate vocabulary. */
export function resourcePreflightGateState(
  preflight: ResourcePreflightResult
): "PASS" | "BLOCK" | "UNRESOLVED" | "UNAVAILABLE" {
  if (preflight.outcome === "RESOURCE-READY") return "PASS";
  if (preflight.outcome === "RESOURCE-OUTCOME-UNKNOWN") return "UNRESOLVED";
  if (preflight.outcome === "SOURCE-UNVERIFIED" || preflight.outcome === "RESOURCE-EVIDENCE-STALE") return "UNAVAILABLE";
  return "BLOCK";
}
