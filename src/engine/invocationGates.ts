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

function stateForAuthority(result: AuthorityGateResult): GateState {
  if (result.gateSatisfied) return "PASS";
  if (result.outcome === "UNAVAILABLE") return "UNAVAILABLE";
  if (result.outcome === "INDETERMINATE" || result.outcome === "INSUFFICIENT-CONTEXT") return "UNRESOLVED";
  return "BLOCK";
}

export function evaluateInvocationGates(input: InvocationGateInput): InvocationGateResult {
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
  if (ids.some((id) => !id.trim()) || new Set(ids).size !== ids.length) {
    add("INDEPENDENT-GATE-CONFIGURATION", "BLOCK", "Required independent gate IDs must be non-empty and unique.");
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
