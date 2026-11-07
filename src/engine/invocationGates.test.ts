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
  safety: "PASS", requiredIndependentGateIds: ["consent", "privacy", "safety"],
  independentGateResults: [{ gateId: "consent", state: "PASS" }, { gateId: "privacy", state: "PASS" }, { gateId: "safety", state: "PASS" }]
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
  it("[INV-GATE-008] blocks missing results for declared independent gates", () => {
    expect(evaluateInvocationGates({ ...valid(), requiredIndependentGateIds: ["ownership"] }).outcome).toBe("INDETERMINATE");
    expect(evaluateInvocationGates({ ...valid(), requiredIndependentGateIds: ["ownership"], independentGateResults: [{ gateId: "ownership", state: "PASS" }] }).outcome).toBe("ELIGIBLE-TO-PROCEED");
  });
  it("[INV-GATE-009] preserves execution and outcome boundary", () => {
    const result = evaluateInvocationGates(valid());
    expect(result.executionStarted).toBe(false);
    expect(result.limitations.join(" ")).toContain("No spell is cast");
  });
  it("[INV-GATE-010] rejects unknown runtime gate states instead of passing them through", () => {
    const malformed = { ...valid(), semanticValidation: "PASSED" } as unknown as InvocationGateInput;
    expect(evaluateInvocationGates(malformed)).toMatchObject({
      outcome: "BLOCKED", eligibleToProceed: false, executionStarted: false,
      trace: [{ gate: "INPUT-CONTRACT", state: "BLOCK" }]
    });
  });
  it("[INV-GATE-011] rejects truthy non-boolean authority flags", () => {
    const malformed = { ...valid(), authority: { ...authority(), gateSatisfied: "false" } } as unknown as InvocationGateInput;
    expect(evaluateInvocationGates(malformed).outcome).toBe("BLOCKED");
  });
  it("[INV-GATE-012] rejects contradictory authority outcomes and gate flags", () => {
    const malformed = { ...valid(), authority: authority(true, "DENY") };
    expect(evaluateInvocationGates(malformed).outcome).toBe("BLOCKED");
  });
  it("[INV-GATE-013] rejects unknown policy outcomes and inconsistent blocking flags", () => {
    const unknown = { ...valid(), policyComposition: { ...policy(), outcome: "PERMIT" } } as unknown as InvocationGateInput;
    const inconsistent = { ...valid(), policyComposition: { ...policy(), blocking: true } };
    expect(evaluateInvocationGates(unknown).outcome).toBe("BLOCKED");
    expect(evaluateInvocationGates(inconsistent).outcome).toBe("BLOCKED");
  });
  it("[INV-GATE-014] rejects null collections and malformed independent gate entries", () => {
    const nullResults = { ...valid(), independentGateResults: null } as unknown as InvocationGateInput;
    const malformedEntry = { ...valid(), independentGateResults: [{ gateId: "consent", state: "MAYBE" }] } as unknown as InvocationGateInput;
    expect(evaluateInvocationGates(nullResults).outcome).toBe("BLOCKED");
    expect(evaluateInvocationGates(malformedEntry).outcome).toBe("BLOCKED");
  });
  it("[INV-GATE-015] rejects whitespace-padded identifiers", () => {
    const malformed = { ...valid(), requiredIndependentGateIds: [" consent "] };
    expect(evaluateInvocationGates(malformed).outcome).toBe("BLOCKED");
  });
});
