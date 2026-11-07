/**
 * Coordinates independently evaluated invocation gates without merging their
 * evidence or implying execution. Each input is an upstream result, not a
 * claim that this module has performed that evaluation.
 */
import type { AuthorityGateResult } from "./authorityGate";
import type { PolicyCompositionResult } from "./policyComposition";

export type GateState = "PASS" | "BLOCK" | "UNRESOLVED" | "UNAVAILABLE";

export interface InvocationGateInput {
  semanticValidation: GateState;
  feasibilityAssessment: GateState;
  resourceReadiness: GateState;
  policyComposition: PolicyCompositionResult;
  authority: AuthorityGateResult;
  consent: GateState;
  privacy: GateState;
  safety: GateState;
  requiredIndependentGateIds: string[];
  independentGateResults: { gateId: string; state: GateState }[];
}

export interface InvocationGateTrace {
  gate: string;
  state: GateState;
  reason: string;
}

export interface InvocationGateResult {
  outcome: "ELIGIBLE-TO-PROCEED" | "BLOCKED" | "INDETERMINATE" | "UNAVAILABLE";
  eligibleToProceed: boolean;
  executionStarted: false;
  trace: InvocationGateTrace[];
  limitations: string[];
}

const LIMITATIONS = [
  "The coordinator consumes upstream gate results; it does not independently verify their evidence.",
  "Resource readiness is not resource consumption, and feasibility assessment is not proof of a real-world outcome.",
  "Policy composition and authority permission are separate checks; neither overrides semantic, feasibility, resource, consent, privacy or safety blockers.",
  "ELIGIBLE-TO-PROCEED is not execution. No spell is cast, no external action is initiated, and no effect is verified."
];

const GATE_STATES: readonly GateState[] = ["PASS", "BLOCK", "UNRESOLVED", "UNAVAILABLE"];
const POLICY_OUTCOMES = [
  "COMPOSED-PERMIT", "COMPOSED-DENY", "INDETERMINATE", "PROFILE-CONFLICT",
  "NO-APPLICABLE-PROFILE", "PROFILE-UNAVAILABLE", "PROFILE-UNTRUSTED",
  "PROFILE-STALE", "PROFILE-EXPIRED", "COMPOSITION-ERROR"
] as const;
const AUTHORITY_OUTCOMES = [
  "PERMIT", "DENY", "CONDITIONAL-PERMIT", "INDETERMINATE", "UNAVAILABLE",
  "EXPIRED", "REVOKED", "SCOPE-MISMATCH", "ISSUER-UNTRUSTED",
  "MALFORMED-DECISION", "MALFORMED-REQUEST", "INSUFFICIENT-CONTEXT"
] as const;
const COMPOSITION_STRATEGIES = ["SINGLE-APPLICABLE", "ALL-MUST-PERMIT", "DENY-OVERRIDES"] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isGateState(value: unknown): value is GateState {
  return typeof value === "string" && GATE_STATES.includes(value as GateState);
}

function isNonEmptyTrimmedString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && value.trim() === value;
}

function malformedInput(reason: string): InvocationGateResult {
  return {
    outcome: "BLOCKED",
    eligibleToProceed: false,
    executionStarted: false,
    trace: [{
      gate: "INPUT-CONTRACT",
      state: "BLOCK",
      reason
    }],
    limitations: [...LIMITATIONS]
  };
}

function validateInputShape(input: unknown): input is InvocationGateInput {
  if (!isRecord(input)) return false;
  if (!isGateState(input.semanticValidation) ||
      !isGateState(input.feasibilityAssessment) ||
      !isGateState(input.resourceReadiness) ||
      !isGateState(input.consent) ||
      !isGateState(input.privacy) ||
      !isGateState(input.safety)) return false;

  if (!isRecord(input.policyComposition) ||
      !POLICY_OUTCOMES.includes(input.policyComposition.outcome as typeof POLICY_OUTCOMES[number]) ||
      typeof input.policyComposition.blocking !== "boolean" ||
      input.policyComposition.blocking !== (input.policyComposition.outcome !== "COMPOSED-PERMIT") ||
      !COMPOSITION_STRATEGIES.includes(input.policyComposition.strategy as typeof COMPOSITION_STRATEGIES[number]) ||
      !Array.isArray(input.policyComposition.selectedProfileIds) ||
      !Array.isArray(input.policyComposition.trace) ||
      !Array.isArray(input.policyComposition.limitations)) return false;

  if (!isRecord(input.authority) ||
      !AUTHORITY_OUTCOMES.includes(input.authority.outcome as typeof AUTHORITY_OUTCOMES[number]) ||
      typeof input.authority.gateSatisfied !== "boolean" ||
      !Array.isArray(input.authority.diagnostics) ||
      !Array.isArray(input.authority.limitations)) return false;

  const authorityOutcomePermits = input.authority.outcome === "PERMIT" ||
    input.authority.outcome === "CONDITIONAL-PERMIT";
  if (input.authority.gateSatisfied !== authorityOutcomePermits) return false;

  if (!Array.isArray(input.requiredIndependentGateIds) ||
      !input.requiredIndependentGateIds.every(isNonEmptyTrimmedString) ||
      !Array.isArray(input.independentGateResults) ||
      !input.independentGateResults.every((entry: unknown) =>
        isRecord(entry) && isNonEmptyTrimmedString(entry.gateId) && isGateState(entry.state))) return false;

  return true;
}

function stateForAuthority(result: AuthorityGateResult): GateState {
  if (result.gateSatisfied === true) return "PASS";
  if (result.outcome === "UNAVAILABLE") return "UNAVAILABLE";
  if (result.outcome === "INDETERMINATE" || result.outcome === "INSUFFICIENT-CONTEXT") return "UNRESOLVED";
  return "BLOCK";
}

export function evaluateInvocationGates(input: InvocationGateInput): InvocationGateResult {
  if (!validateInputShape(input)) {
    return malformedInput("Invocation gate input contains a malformed object, invalid state, inconsistent upstream outcome, or missing collection.");
  }
  const trace: InvocationGateTrace[] = [];
  const add = (gate: string, state: GateState, reason: string) => trace.push({ gate, state, reason });

  add("SEMANTIC-VALIDATION", input.semanticValidation, "Consumes the semantic analyser's result.");
  add("FEASIBILITY", input.feasibilityAssessment, "Consumes a separate feasibility assessment.");
  add("RESOURCE-READINESS", input.resourceReadiness, "Consumes resource-accounting readiness; no resource is consumed here.");

  const policyState: GateState = input.policyComposition.outcome === "COMPOSED-PERMIT"
    ? "PASS"
    : input.policyComposition.outcome === "PROFILE-UNAVAILABLE" ? "UNAVAILABLE"
    : input.policyComposition.outcome === "INDETERMINATE" ? "UNRESOLVED" : "BLOCK";
  add("POLICY-COMPOSITION", policyState, "Policy composition must produce COMPOSED-PERMIT; other outcomes remain distinct in its source trace.");

  const authorityState = stateForAuthority(input.authority);
  add("AUTHORITY", authorityState, "Consumes the independent v2.0 authority-gate result.");

  add("CONSENT", input.consent, "Consent is an independent gate.");
  add("PRIVACY", input.privacy, "Privacy is an independent gate.");
  add("SAFETY", input.safety, "Safety is an independent gate.");

  const ids = input.requiredIndependentGateIds;
  const resultIds = input.independentGateResults.map((entry) => entry.gateId);
  if (new Set(ids).size !== ids.length || new Set(resultIds).size !== resultIds.length) {
    add("INDEPENDENT-GATE-CONFIGURATION", "BLOCK", "Required and reported independent gate IDs must be non-empty and unique.");
  } else {
    for (const id of ids) {
      const result = input.independentGateResults.find((entry) => entry.gateId === id);
      if (!result) {
        add("INDEPENDENT-GATE:" + id, "UNRESOLVED", "A required independent gate has no reported result.");
      } else {
        add("INDEPENDENT-GATE:" + id, result.state, "Consumes the explicitly reported result for this required gate.");
      }
    }
  }

  const states = trace.map((entry) => entry.state);
  const outcome = states.includes("BLOCK") ? "BLOCKED"
    : states.includes("UNAVAILABLE") ? "UNAVAILABLE"
    : states.includes("UNRESOLVED") ? "INDETERMINATE"
    : "ELIGIBLE-TO-PROCEED";

  return {
    outcome,
    eligibleToProceed: outcome === "ELIGIBLE-TO-PROCEED",
    executionStarted: false,
    trace,
    limitations: [...LIMITATIONS]
  };
}
