import { describe, expect, it } from "vitest";
import { evaluateInvocationGates, type InvocationGateInput } from "./invocationGates";
import type { AuthorityGateResult } from "./authorityGate";
import type { PolicyCompositionResult } from "./policyComposition";

const authority = (gateSatisfied = true, outcome: AuthorityGateResult["outcome"] = "PERMIT"): AuthorityGateResult => ({
  outcome, gateSatisfied, diagnostics: [], limitations: []
});
const policy = (outcome: PolicyCompositionResult["outcome"] = "COMPOSED-PERMIT"): PolicyCompositionResult => ({
  outcome, blocking: outcome !== "COMPOSED-PERMIT", strategy: "ALL-MUST-PERMIT",
  selectedProfileIds: ["profile-a"], trace: [], limitations: []
});
const valid = (): InvocationGateInput => ({
  semanticValidation: "PASS", feasibilityAssessment: "PASS", resourceReadiness: "PASS",
  policyComposition: policy(), authority: authority(), consent: "PASS", privacy: "PASS",
  safety: "PASS", requiredIndependentGateIds: ["consent", "privacy", "safety"]
});

describe("Invocation gate coordination", () => {
  it("[INV-GATE-001] marks all independently passing gates eligible without executing", () => {
    expect(evaluateInvocationGates(valid())).toMatchObject({
      outcome: "ELIGIBLE-TO-PROCEED", eligibleToProceed: true, executionStarted: false
    });
  });
  it("[INV-GATE-002] a semantic or feasibility blocker cannot be overridden", () => {
    expect(evaluateInvocationGates({ ...valid(), semanticValidation: "BLOCK" }).outcome).toBe("BLOCKED");
    expect(evaluateInvocationGates({ ...valid(), feasibilityAssessment: "BLOCK" }).outcome).toBe("BLOCKED");
  });
  it("[INV-GATE-003] resource readiness remains independent", () => {
    expect(evaluateInvocationGates({ ...valid(), resourceReadiness: "UNRESOLVED" }).outcome).toBe("INDETERMINATE");
  });
  it("[INV-GATE-004] policy composition must produce a composed permit", () => {
    expect(evaluateInvocationGates({ ...valid(), policyComposition: policy("PROFILE-CONFLICT") }).outcome).toBe("BLOCKED");
    expect(evaluateInvocationGates({ ...valid(), policyComposition: policy("PROFILE-UNAVAILABLE") }).outcome).toBe("UNAVAILABLE");
  });
  it("[INV-GATE-005] authority permission is not inferred from policy composition", () => {
    expect(evaluateInvocationGates({ ...valid(), authority: authority(false, "DENY") }).outcome).toBe("BLOCKED");
  });
  it("[INV-GATE-006] consent, privacy and safety cannot be skipped", () => {
    expect(evaluateInvocationGates({ ...valid(), consent: "UNRESOLVED" }).outcome).toBe("INDETERMINATE");
    expect(evaluateInvocationGates({ ...valid(), privacy: "BLOCK" }).outcome).toBe("BLOCKED");
    expect(evaluateInvocationGates({ ...valid(), safety: "UNAVAILABLE" }).outcome).toBe("UNAVAILABLE");
  });
  it("[INV-GATE-007] required gate identifiers must be unique and non-empty", () => {
    expect(evaluateInvocationGates({ ...valid(), requiredIndependentGateIds: ["consent", "consent"] }).outcome).toBe("BLOCKED");
    expect(evaluateInvocationGates({ ...valid(), requiredIndependentGateIds: [" "] }).outcome).toBe("BLOCKED");
  });
  it("[INV-GATE-008] preserves execution and outcome boundary", () => {
    const result = evaluateInvocationGates(valid());
    expect(result.executionStarted).toBe(false);
    expect(result.limitations.join(" ")).toContain("No spell is cast");
  });
});
