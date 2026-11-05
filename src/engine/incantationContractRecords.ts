/**
 * Structural validation and conservative outcome translation for the locked
 * Arcane Incantations v1.9–v2.1 specification records.
 *
 * This module validates record shape only. It does not establish issuer trust,
 * scope containment, freshness, consent, resource sufficiency, feasibility,
 * policy correctness, execution, or a verified effect.
 */

export type ContractRecordKind =
  | "RESOURCE-DEFINITION"
  | "RESOURCE-ACCOUNT"
  | "LEDGER-EVENT"
  | "RESOURCE-SOURCE"
  | "RESOURCE-TRANSFER"
  | "RESOURCE-TRANSFORMATION"
  | "RESOURCE-BUDGET"
  | "RESERVATION"
  | "CONSERVATION-CONTRACT"
  | "AUTHORISATION-REQUEST"
  | "AUTHORITY-DECISION"
  | "POLICY-PROFILE"
  | "POLICY-BUNDLE"
  | "COMPOSITION-PLAN"
  | "COMPOSITION-RECORD";

export interface ContractRecordIssue {
  code: "RECORD_NOT_OBJECT" | "REQUIRED_FIELD_MISSING" | "REQUIRED_FIELD_EMPTY";
  recordKind: ContractRecordKind;
  field?: string;
  message: string;
}

export interface ContractRecordValidation {
  valid: boolean;
  recordKind: ContractRecordKind;
  issues: ContractRecordIssue[];
  limitation: string;
}

const REQUIRED_FIELDS: Readonly<Record<ContractRecordKind, readonly string[]>> = {
  "RESOURCE-DEFINITION": [
    "RESOURCE-KIND", "DIMENSION", "UNIT-CONTRACT", "ACCOUNTING-MODE",
    "PRECISION-POLICY", "UNCERTAINTY-POLICY", "SOURCE-REQUIREMENTS",
    "CONSERVATION-CONTRACT-REF"
  ],
  "RESOURCE-ACCOUNT": [
    "ACCOUNT-ID", "RESOURCE-KIND", "SCOPE", "OPENING-BALANCE",
    "VALID-TIME", "PROVENANCE", "ACCOUNT-CONTRACT"
  ],
  "LEDGER-EVENT": [
    "EVENT-ID", "INVOCATION-ID", "RESOURCE-KIND", "EVENT-KIND",
    "FROM-ACCOUNT", "TO-ACCOUNT", "AMOUNT", "UNIT", "VALID-TIME",
    "STATUS", "SOURCE-OR-CONVERSION-REF", "UNCERTAINTY", "EVIDENCE",
    "IDEMPOTENCY-KEY"
  ],
  "RESOURCE-SOURCE": [
    "SOURCE-ID", "RESOURCE-KIND", "SOURCE-ACCOUNT", "AVAILABLE-QUANTITY",
    "AVAILABILITY-WINDOW", "AUTHORITY-REF", "EVIDENCE-REF", "UNCERTAINTY",
    "SOURCE-CONTRACT"
  ],
  "RESOURCE-TRANSFER": [
    "TRANSFER-ID", "RESOURCE-KIND", "FROM-ACCOUNT", "TO-ACCOUNT",
    "AMOUNT", "VALID-TIME", "TRANSFER-CONTRACT", "OBSERVATION-REQUIREMENTS"
  ],
  "RESOURCE-TRANSFORMATION": [
    "TRANSFORMATION-ID", "INPUTS", "OUTPUTS", "SYSTEM-BOUNDARY",
    "VALID-TIME", "CONVERSION-RULE", "EFFICIENCY-OR-LOSS-MODEL",
    "CONSERVATION-OBLIGATIONS", "UNCERTAINTY", "EVIDENCE-REF"
  ],
  "RESOURCE-BUDGET": [
    "BUDGET-ID", "RESOURCE-KIND", "SCOPE", "LIMIT", "UNIT", "TIME-WINDOW",
    "AGGREGATION-RULE", "UNCERTAINTY-MARGIN", "OVERAGE-POLICY",
    "EVIDENCE-REQUIREMENTS"
  ],
  "RESERVATION": [
    "RESERVATION-ID", "INVOCATION-ID", "ACCOUNT", "RESOURCE-KIND",
    "AMOUNT", "EXPIRY", "PRIORITY-POLICY", "RELEASE-POLICY", "STATUS"
  ],
  "CONSERVATION-CONTRACT": [
    "CONTRACT-ID", "RESOURCE-KINDS", "SYSTEM-BOUNDARY", "VALID-INTERVAL",
    "OPENING-STATE", "CLOSING-STATE", "PERMITTED-EXCHANGES",
    "TRANSFORMATION-RULES", "INVARIANT", "TOLERANCE", "UNCERTAINTY-RULE",
    "EVIDENCE-REQUIREMENTS"
  ],
  "AUTHORISATION-REQUEST": [
    "REQUEST-ID", "SUBJECT", "ACTION", "TARGET", "SCOPE",
    "REQUESTED-INTERVAL", "CONTEXT", "POLICY-REFERENCE",
    "REQUEST-PROVENANCE"
  ],
  "AUTHORITY-DECISION": [
    "DECISION-ID", "REQUEST-ID", "AUTHORITY-ID", "ISSUER-PROVENANCE",
    "SUBJECT", "ACTION", "TARGET", "SCOPE", "DECISION",
    "VALID-FROM", "VALID-UNTIL", "CONDITIONS", "EVIDENCE-REFERENCES",
    "POLICY-REFERENCE", "POLICY-VERSION", "DELEGATION-CHAIN",
    "REVOCATION-STATUS", "ISSUED-AT", "FRESHNESS", "INTEGRITY-STATUS",
    "REASON-CODES"
  ],
  "POLICY-PROFILE": [
    "PROFILE-ID", "PROFILE-VERSION", "DOMAIN", "ISSUER", "TRUST-REFERENCE",
    "VALIDITY", "APPLICABILITY", "RULE-SET-REFERENCE", "INPUT-SCHEMA",
    "OUTPUT-SCHEMA", "DEPENDENCIES", "CHANGE-STATUS",
    "INTEGRITY-REFERENCE", "PROVENANCE"
  ],
  "POLICY-BUNDLE": [
    "BUNDLE-ID", "BUNDLE-VERSION", "DOMAIN", "PROFILE-REFERENCES",
    "COMPOSITION-PLAN-REFERENCE", "VALIDITY", "TRUST-REFERENCE", "PROVENANCE"
  ],
  "COMPOSITION-PLAN": [
    "PLAN-ID", "PLAN-VERSION", "DOMAIN", "PROFILE-SELECTION",
    "COMPOSITION-STRATEGY", "PRECEDENCE-RELATION",
    "OVERRIDE-PERMITTED-OUTCOMES", "CONSTRAINT-MERGE-RULES",
    "MISSING-PROFILE-POLICY", "CONFLICT-POLICY", "VALIDITY",
    "TEST-SET-REFERENCE", "PROVENANCE"
  ],
  "COMPOSITION-RECORD": [
    "REQUEST-ID", "BUNDLE-ID", "BUNDLE-VERSION", "PLAN-ID", "PLAN-VERSION",
    "CANDIDATE-PROFILES", "APPLICABILITY-RESULTS", "TRUST-AND-FRESHNESS",
    "SELECTED-PROFILES", "PROFILE-DECISIONS", "COMPOSITION-STRATEGY",
    "CONFLICT-AND-OVERRIDE-TRACE", "COMPOSED-OUTCOME", "REASON-CODES",
    "EVALUATION-TIME", "EVIDENCE-REFERENCES"
  ]
};

const LIMITATION =
  "Structural validation only: a complete record does not prove that its values, evidence, trust, policy, scope, or real-world effects are valid, and does not establish execution or a verified outcome.";

export function getRequiredContractFields(kind: ContractRecordKind): readonly string[] {
  return REQUIRED_FIELDS[kind];
}

export function validateContractRecord(
  kind: ContractRecordKind,
  value: unknown
): ContractRecordValidation {
  const issues: ContractRecordIssue[] = [];

  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    issues.push({
      code: "RECORD_NOT_OBJECT",
      recordKind: kind,
      message: kind + " must be represented as an object."
    });
    return { valid: false, recordKind: kind, issues, limitation: LIMITATION };
  }

  const record = value as Record<string, unknown>;
  for (const field of REQUIRED_FIELDS[kind]) {
    if (!Object.prototype.hasOwnProperty.call(record, field)) {
      issues.push({
        code: "REQUIRED_FIELD_MISSING",
        recordKind: kind,
        field,
        message: "Required field " + field + " is missing from " + kind + "."
      });
      continue;
    }

    const fieldValue = record[field];
    if (fieldValue === null || fieldValue === undefined ||
        (typeof fieldValue === "string" && fieldValue.trim().length === 0)) {
      issues.push({
        code: "REQUIRED_FIELD_EMPTY",
        recordKind: kind,
        field,
        message: "Required field " + field + " must not be null, undefined, or an empty string."
      });
    }
  }

  return { valid: issues.length === 0, recordKind: kind, issues, limitation: LIMITATION };
}

export type AuthorityDecisionOutcome =
  | "PERMIT"
  | "DENY"
  | "CONDITIONAL-PERMIT"
  | "INDETERMINATE"
  | "UNAVAILABLE"
  | "EXPIRED"
  | "REVOKED"
  | "SCOPE-MISMATCH"
  | "ISSUER-UNTRUSTED"
  | "MALFORMED-DECISION";

export type CompositionOutcome =
  | "COMPOSED-PERMIT"
  | "COMPOSED-DENY"
  | "INDETERMINATE"
  | "PROFILE-CONFLICT"
  | "NO-APPLICABLE-PROFILE"
  | "PROFILE-UNAVAILABLE"
  | "PROFILE-UNTRUSTED"
  | "PROFILE-STALE"
  | "PROFILE-EXPIRED"
  | "COMPOSITION-ERROR";

const AUTHORITY_OUTCOMES: readonly AuthorityDecisionOutcome[] = [
  "PERMIT", "DENY", "CONDITIONAL-PERMIT", "INDETERMINATE", "UNAVAILABLE",
  "EXPIRED", "REVOKED", "SCOPE-MISMATCH", "ISSUER-UNTRUSTED",
  "MALFORMED-DECISION"
];

export function isAuthorityDecisionOutcome(value: unknown): value is AuthorityDecisionOutcome {
  return typeof value === "string" &&
    AUTHORITY_OUTCOMES.includes(value as AuthorityDecisionOutcome);
}

/**
 * This answers only whether the outcome label is eligible to satisfy the
 * authorisation gate. It does not validate the decision record or any
 * independent trust, scope, expiry, revocation, consent, resource or safety gate.
 */
export function isDecisionOutcomePermitEligible(
  outcome: AuthorityDecisionOutcome,
  conditionsSatisfied = false
): boolean {
  if (outcome === "PERMIT") return true;
  return outcome === "CONDITIONAL-PERMIT" && conditionsSatisfied;
}

/**
 * Translate only the composition outcomes whose blocking meaning is explicit
 * in v2.1. The resulting v2.0 decision still requires independent validation.
 */
export function mapCompositionOutcomeToAuthority(
  outcome: CompositionOutcome
): AuthorityDecisionOutcome {
  switch (outcome) {
    case "COMPOSED-PERMIT": return "PERMIT";
    case "COMPOSED-DENY": return "DENY";
    case "PROFILE-UNAVAILABLE": return "UNAVAILABLE";
    case "PROFILE-UNTRUSTED": return "ISSUER-UNTRUSTED";
    case "INDETERMINATE":
    case "PROFILE-CONFLICT":
    case "NO-APPLICABLE-PROFILE":
    case "PROFILE-STALE":
    case "PROFILE-EXPIRED":
    case "COMPOSITION-ERROR":
      return "INDETERMINATE";
  }
}
