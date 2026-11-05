import { describe, expect, it } from "vitest";
import { evaluatePolicyComposition, type PolicyProfileEvaluation } from "./policyComposition";

const profile = (overrides: Partial<PolicyProfileEvaluation> = {}): PolicyProfileEvaluation => ({
  profileId: "profile-a",
  version: "1.0.0",
  required: true,
  optionalOmissionExplicit: false,
  applicability: "TRUE",
  trust: "TRUSTED",
  freshness: "CURRENT",
  decision: "PERMIT",
  ...overrides
});

const evaluate = (
  profiles: PolicyProfileEvaluation[],
  strategy: "SINGLE-APPLICABLE" | "ALL-MUST-PERMIT" | "DENY-OVERRIDES" = "ALL-MUST-PERMIT"
) => evaluatePolicyComposition({
  strategy,
  planTrust: "TRUSTED",
  planValid: true,
  profiles
});

describe("bounded v2.1 policy composition", () => {
  it("[POLICY-COMP-001] permits one trusted, current, applicable profile under SINGLE-APPLICABLE", () => {
    expect(evaluate([profile()], "SINGLE-APPLICABLE").outcome).toBe("COMPOSED-PERMIT");
  });

  it("[POLICY-COMP-002] refuses to choose the first profile when SINGLE-APPLICABLE has multiple matches", () => {
    expect(evaluate([profile(), profile({ profileId: "profile-b" })], "SINGLE-APPLICABLE").outcome)
      .toBe("PROFILE-CONFLICT");
  });

  it("[POLICY-COMP-003] blocks unknown applicability instead of treating it as false", () => {
    expect(evaluate([profile({ applicability: "UNKNOWN" })]).outcome).toBe("INDETERMINATE");
  });

  it("[POLICY-COMP-004] requires every applicable profile to permit under ALL-MUST-PERMIT", () => {
    const result = evaluate([profile(), profile({ profileId: "profile-b", decision: "INDETERMINATE" })]);
    expect(result.outcome).toBe("INDETERMINATE");
    expect(result.blocking).toBe(true);
  });

  it("[POLICY-COMP-005] lets a trusted applicable explicit denial override permits", () => {
    const result = evaluate([
      profile(),
      profile({ profileId: "profile-b", decision: "DENY" })
    ], "DENY-OVERRIDES");
    expect(result.outcome).toBe("COMPOSED-DENY");
  });

  it("[POLICY-COMP-006] does not allow an untrusted profile to manufacture a denial", () => {
    const result = evaluate([
      profile(),
      profile({ profileId: "profile-b", trust: "UNTRUSTED", decision: "DENY" })
    ], "DENY-OVERRIDES");
    expect(result.outcome).toBe("PROFILE-UNTRUSTED");
  });

  it("[POLICY-COMP-007] blocks stale, expired and unavailable profile evidence distinctly", () => {
    expect(evaluate([profile({ freshness: "STALE" })]).outcome).toBe("PROFILE-STALE");
    expect(evaluate([profile({ freshness: "EXPIRED" })]).outcome).toBe("PROFILE-EXPIRED");
    expect(evaluate([profile({ freshness: "UNAVAILABLE" })]).outcome).toBe("PROFILE-UNAVAILABLE");
  });

  it("[POLICY-COMP-008] requires conditional-permit conditions to be proven true", () => {
    expect(evaluate([profile({ decision: "CONDITIONAL-PERMIT" })]).outcome).toBe("INDETERMINATE");
    expect(evaluate([profile({ decision: "CONDITIONAL-PERMIT", conditionsSatisfied: true })]).outcome)
      .toBe("COMPOSED-PERMIT");
  });

  it("[POLICY-COMP-009] never treats a constraint or composition result as execution", () => {
    const result = evaluate([profile()]);
    expect(result.limitations.join(" ")).toContain("does not");
    expect(result.limitations.join(" ")).toContain("execute");
  });

  it("[POLICY-COMP-010] blocks an untrusted plan before evaluating profile outcomes", () => {
    const result = evaluatePolicyComposition({
      strategy: "ALL-MUST-PERMIT",
      planTrust: "UNTRUSTED",
      planValid: true,
      profiles: [profile()]
    });
    expect(result.outcome).toBe("PROFILE-UNTRUSTED");
    expect(result.trace).toHaveLength(0);
  });
});
