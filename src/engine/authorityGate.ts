/**
 * Conservative v2.0 authorisation gate over independently evaluated evidence.
 *
 * This module does not validate signatures, discover trust roots, resolve
 * identities, compare geometric/typed scopes, evaluate predicates, query
 * revocation services, or monitor execution. Callers must supply those
 * evaluations explicitly. Missing or unknown evidence never becomes approval.
 */
import type { AuthorityDecisionOutcome } from "./incantationContractRecords";

export type EvidenceCheck = "PASS" | "FAIL" | "UNKNOWN" | "UNAVAILABLE" | "NOT-REQUIRED";
export type ScopeCheck = "MATCH" | "MISMATCH" | "UNKNOWN";
export type ConditionCheck = "ALL-SATISFIED" | "FALSE" | "UNKNOWN" | "STALE" | "ERROR" | "MONITORING-UNAVAILABLE";

export interface AuthorityGateInput {
  requestWellFormed: boolean | "UNKNOWN";
  decisionWellFormed: boolean | "UNKNOWN";
  decisionPresent: boolean;
  decision: AuthorityDecisionOutcome | "UNKNOWN";
  issuerTrust: EvidenceCheck;
  delegation: EvidenceCheck;
  integrity: EvidenceCheck;
  freshness: EvidenceCheck;
  expiry: "CURRENT" | "EXPIRED" | "BOUNDARY-UNCERTAIN" | "UNKNOWN";
  revocation: EvidenceCheck;
  subjectMatch: ScopeCheck;
  actionMatch: ScopeCheck;
  targetMatch: ScopeCheck;
  scopeContainment: ScopeCheck;
  conditions: ConditionCheck;
  requiredIndependentGates: EvidenceCheck;
}

export interface AuthorityGateDiagnostic {
  stage: "REQUEST" | "DECISION" | "ISSUER" | "DELEGATION" | "INTEGRITY" | "FRESHNESS" | "EXPIRY" | "REVOCATION" | "SCOPE" | "CONDITIONS" | "INDEPENDENT-GATES";
  code: string;
  message: string;
}

export interface AuthorityGateResult {
  outcome: AuthorityDecisionOutcome;
  gateSatisfied: boolean;
  diagnostics: AuthorityGateDiagnostic[];
  limitations: string[];
}

const LIMITATIONS = [
  "This is a decision procedure over caller-supplied evidence results, not an evidence verifier.",
  "Scope containment must be established by typed comparison rules; textual similarity is insufficient.",
  "Consent, privacy, safety and resource readiness remain independent gates and must be explicitly required by the invocation profile where applicable.",
  "A satisfied authorisation gate does not establish execution, interruption capability, physical feasibility or a verified effect."
];

function block(
  outcome: AuthorityDecisionOutcome,
  diagnostics: AuthorityGateDiagnostic[]
): AuthorityGateResult {
  return { outcome, gateSatisfied: false, diagnostics, limitations: [...LIMITATIONS] };
}

export function evaluateAuthorityGate(input: AuthorityGateInput): AuthorityGateResult {
  const diagnostics: AuthorityGateDiagnostic[] = [];
  const add = (stage: AuthorityGateDiagnostic["stage"], code: string, message: string) =>
    diagnostics.push({ stage, code, message });

  if (input.requestWellFormed === false) {
    add("REQUEST", "MALFORMED-REQUEST", "The authorisation request is not well formed.");
    return block("MALFORMED-DECISION", diagnostics);
  }
  if (input.requestWellFormed === "UNKNOWN" || input.decisionWellFormed === "UNKNOWN") {
    add("REQUEST", "VALIDATION-UNKNOWN", "Request or decision validation is unresolved.");
    return block("INDETERMINATE", diagnostics);
  }
  if (input.decisionWellFormed === false) {
    add("DECISION", "MALFORMED-DECISION", "The decision record is not well formed.");
    return block("MALFORMED-DECISION", diagnostics);
  }
  if (!input.decisionPresent || input.decision === "UNKNOWN") {
    add("DECISION", "DECISION-UNAVAILABLE", "No usable authority decision was supplied.");
    return block("UNAVAILABLE", diagnostics);
  }
  if (input.decision === "DENY") {
    add("DECISION", "EXPLICIT-DENIAL", "The authority explicitly denied this request.");
    return block("DENY", diagnostics);
  }
  if (input.decision !== "PERMIT" && input.decision !== "CONDITIONAL-PERMIT") {
    add("DECISION", input.decision, "The supplied decision outcome is not permit-eligible.");
    return block(input.decision, diagnostics);
  }

  const evidence = (
    stage: AuthorityGateDiagnostic["stage"],
    name: string,
    value: EvidenceCheck
  ): AuthorityDecisionOutcome | undefined => {
    if (value === "PASS" || value === "NOT-REQUIRED") return undefined;
    const outcome = value === "FAIL"
      ? (stage === "ISSUER" || stage === "DELEGATION" ? "ISSUER-UNTRUSTED" : "INDETERMINATE")
      : value === "UNAVAILABLE" ? "UNAVAILABLE" : "INDETERMINATE";
    add(stage, name + "-" + value, name + " evidence is " + value + "; it cannot be treated as a pass.");
    return outcome;
  };

  for (const [stage, name, value] of [
    ["ISSUER", "ISSUER-TRUST", input.issuerTrust],
    ["DELEGATION", "DELEGATION", input.delegation],
    ["INTEGRITY", "DECISION-INTEGRITY", input.integrity],
    ["FRESHNESS", "FRESHNESS", input.freshness],
    ["REVOCATION", "REVOCATION", input.revocation]
  ] as const) {
    const outcome = evidence(stage, name, value);
    if (outcome) return block(outcome, diagnostics);
  }

  if (input.expiry === "EXPIRED") {
    add("EXPIRY", "DECISION-EXPIRED", "The decision validity interval has ended.");
    return block("EXPIRED", diagnostics);
  }
  if (input.expiry !== "CURRENT") {
    add("EXPIRY", "EXPIRY-UNRESOLVED", "Trusted time evidence cannot establish current validity.");
    return block("INDETERMINATE", diagnostics);
  }

  for (const [name, value] of [
    ["SUBJECT", input.subjectMatch],
    ["ACTION", input.actionMatch],
    ["TARGET", input.targetMatch],
    ["SCOPE", input.scopeContainment]
  ] as const) {
    if (value !== "MATCH") {
      add("SCOPE", name + "-" + value, name + " match or containment is not established.");
      return block(value === "MISMATCH" ? "SCOPE-MISMATCH" : "INDETERMINATE", diagnostics);
    }
  }

  if (input.decision === "CONDITIONAL-PERMIT" && input.conditions !== "ALL-SATISFIED") {
    add("CONDITIONS", "CONDITIONS-" + input.conditions, "Every mandatory condition must be proven satisfied at its required check time.");
    return block(input.conditions === "MONITORING-UNAVAILABLE" ? "INDETERMINATE" : "INDETERMINATE", diagnostics);
  }

  if (input.requiredIndependentGates !== "PASS") {
    add("INDEPENDENT-GATES", "INDEPENDENT-GATE-" + input.requiredIndependentGates, "Every applicable independent invocation gate must be explicitly satisfied.");
    return block(input.requiredIndependentGates === "UNAVAILABLE" ? "UNAVAILABLE" : "INDETERMINATE", diagnostics);
  }

  return {
    outcome: input.decision,
    gateSatisfied: true,
    diagnostics,
    limitations: [...LIMITATIONS]
  };
}
