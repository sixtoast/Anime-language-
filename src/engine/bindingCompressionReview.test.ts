import { describe, expect, it } from "vitest";
import { reviewBindingCompression, type BindingReuseCandidate } from "./bindingCompressionReview";

const candidate = (overrides: Partial<BindingReuseCandidate> = {}): BindingReuseCandidate => ({
  occurrenceId: "use-a",
  expressionFingerprint: "sha256:source-expression-a",
  valueType: "Observation",
  evaluationMode: "SNAPSHOT",
  bindingScope: "declared-scope-1",
  bindingLifetime: "declared-lifetime-1",
  referentIdentity: "sensor-17",
  effectState: "PURE",
  expressionIdentityEvidence: "ESTABLISHED",
  typeEvidence: "ESTABLISHED",
  scopeEvidence: "ESTABLISHED",
  lifetimeEvidence: "ESTABLISHED",
  referentEvidence: "ESTABLISHED",
  effectEvidence: "ESTABLISHED",
  ...overrides
});
const pair = (a: Partial<BindingReuseCandidate> = {}, b: Partial<BindingReuseCandidate> = {}) =>
  reviewBindingCompression({ first: candidate(a), second: candidate({ occurrenceId: "use-b", ...b }) });

describe("Arcane binding compression review", () => {
  it("[BIND-COMP-001] permits only owner review for fully evidenced identical snapshots", () => {
    const result = pair();
    expect(result.disposition).toBe("ELIGIBLE-FOR-OWNER-REVIEW");
    expect(result.suggestedOperator).toBe("KWAT");
    expect(result.findings.some(f => f.code === "OWNER-REVIEW-REQUIRED")).toBe(true);
  });
  it("[BIND-COMP-002] blocks unresolved scope evidence", () => {
    const result = pair({ scopeEvidence: "UNRESOLVED" });
    expect(result.disposition).toBe("BLOCKED");
    expect(result.findings.some(f => f.code === "EVIDENCE-UNRESOLVED")).toBe(true);
  });
  it("[BIND-COMP-003] blocks unresolved lifetime evidence", () => {
    expect(pair({ lifetimeEvidence: "UNRESOLVED" }).disposition).toBe("BLOCKED");
  });
  it("[BIND-COMP-004] blocks different expression fingerprints", () => {
    expect(pair({}, { expressionFingerprint: "sha256:other" }).findings.some(f => f.code === "EXPRESSION-IDENTITY-MISMATCH")).toBe(true);
  });
  it("[BIND-COMP-005] blocks different value types", () => {
    expect(pair({}, { valueType: "Quantity" }).findings.some(f => f.code === "VALUE-TYPE-MISMATCH")).toBe(true);
  });
  it("[BIND-COMP-006] blocks different binding scopes", () => {
    expect(pair({}, { bindingScope: "another-scope" }).findings.some(f => f.code === "SCOPE-MISMATCH")).toBe(true);
  });
  it("[BIND-COMP-007] blocks different lifetimes", () => {
    expect(pair({}, { bindingLifetime: "shorter-lifetime" }).findings.some(f => f.code === "LIFETIME-MISMATCH")).toBe(true);
  });
  it("[BIND-COMP-008] blocks different referent identities", () => {
    expect(pair({}, { referentIdentity: "sensor-18" }).findings.some(f => f.code === "REFERENT-MISMATCH")).toBe(true);
  });
  it("[BIND-COMP-009] blocks side-effectful expressions", () => {
    expect(pair({ effectState: "SIDE-EFFECTFUL" }).findings.some(f => f.code === "EFFECT-SEMANTICS-UNRESOLVED")).toBe(true);
  });
  it("[BIND-COMP-010] preserves live evaluation as KWAK rather than caching", () => {
    const result = pair({ evaluationMode: "LIVE" }, { evaluationMode: "LIVE" });
    expect(result.disposition).toBe("PRESERVE-LIVE-EVALUATION");
    expect(result.suggestedOperator).toBe("KWAK");
  });
  it("[BIND-COMP-011] blocks snapshot/live substitution", () => {
    const result = pair({}, { evaluationMode: "LIVE" });
    expect(result.disposition).toBe("PRESERVE-LIVE-EVALUATION");
    expect(result.findings.some(f => f.code === "EVALUATION-MODE-MISMATCH")).toBe(true);
  });
  it("[BIND-COMP-012] never computes semantic equivalence or creates a binding", () => {
    const result = pair();
    expect(result.semanticEquivalence).toBe("NOT-COMPUTED");
    expect(result.bindingCreated).toBe(false);
    expect(result.evaluationPerformed).toBe(false);
    expect(result.executable).toBe(false);
    expect(result.canonEffect).toBe("NONE");
  });
});
