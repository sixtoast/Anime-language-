import { describe, expect, it } from "vitest";
import { evaluateAuthorityGate, type AuthorityGateInput } from "./authorityGate";

const validInput = (): AuthorityGateInput => ({
  requestWellFormed: true,
  decisionWellFormed: true,
  decisionPresent: true,
  decision: "PERMIT",
  issuerTrust: "PASS",
  delegation: "NOT-REQUIRED",
  integrity: "PASS",
  freshness: "PASS",
  expiry: "CURRENT",
  revocation: "PASS",
  subjectMatch: "MATCH",
  actionMatch: "MATCH",
  targetMatch: "MATCH",
  scopeContainment: "MATCH",
  conditions: "ALL-SATISFIED",
  requiredIndependentGates: "PASS"
});

describe("Arcane Incantations v2.0 conservative authority gate", () => {
  it("[AUTH-GATE-001] permits only a complete explicit current permit", () => {
    expect(evaluateAuthorityGate(validInput())).toMatchObject({ outcome: "PERMIT", gateSatisfied: true });
  });
  it("[AUTH-GATE-002] blocks malformed requests and decisions", () => {
    expect(evaluateAuthorityGate({ ...validInput(), requestWellFormed: false }).outcome).toBe("MALFORMED-REQUEST");
    expect(evaluateAuthorityGate({ ...validInput(), decisionWellFormed: false }).outcome).toBe("MALFORMED-DECISION");
  });
  it("[AUTH-GATE-003] keeps missing decisions unavailable, not denied or permitted", () => {
    expect(evaluateAuthorityGate({ ...validInput(), decisionPresent: false }).outcome).toBe("UNAVAILABLE");
  });
  it("[AUTH-GATE-004] preserves explicit denial", () => {
    expect(evaluateAuthorityGate({ ...validInput(), decision: "DENY" }).outcome).toBe("DENY");
  });
  it("[AUTH-GATE-005] blocks untrusted issuers and invalid delegation", () => {
    expect(evaluateAuthorityGate({ ...validInput(), issuerTrust: "FAIL" }).outcome).toBe("ISSUER-UNTRUSTED");
    expect(evaluateAuthorityGate({ ...validInput(), delegation: "FAIL" }).outcome).toBe("ISSUER-UNTRUSTED");
  });
  it("[AUTH-GATE-006] does not equate unavailable evidence with a pass", () => {
    expect(evaluateAuthorityGate({ ...validInput(), revocation: "UNAVAILABLE" }).outcome).toBe("UNAVAILABLE");
    expect(evaluateAuthorityGate({ ...validInput(), freshness: "UNKNOWN" }).outcome).toBe("INDETERMINATE");
  });
  it("[AUTH-GATE-007] distinguishes expiry from uncertain time", () => {
    expect(evaluateAuthorityGate({ ...validInput(), expiry: "EXPIRED" }).outcome).toBe("EXPIRED");
    expect(evaluateAuthorityGate({ ...validInput(), expiry: "BOUNDARY-UNCERTAIN" }).outcome).toBe("INDETERMINATE");
  });
  it("[AUTH-GATE-008] requires explicit subject, action, target and scope matches", () => {
    expect(evaluateAuthorityGate({ ...validInput(), subjectMatch: "MISMATCH" }).outcome).toBe("SCOPE-MISMATCH");
    expect(evaluateAuthorityGate({ ...validInput(), scopeContainment: "UNKNOWN" }).outcome).toBe("INDETERMINATE");
  });
  it("[AUTH-GATE-009] conditional permits require all conditions satisfied", () => {
    expect(evaluateAuthorityGate({ ...validInput(), decision: "CONDITIONAL-PERMIT" }).gateSatisfied).toBe(true);
    expect(evaluateAuthorityGate({ ...validInput(), decision: "CONDITIONAL-PERMIT", conditions: "UNKNOWN" }).gateSatisfied).toBe(false);
    expect(evaluateAuthorityGate({ ...validInput(), decision: "CONDITIONAL-PERMIT", conditions: "MONITORING-UNAVAILABLE" }).gateSatisfied).toBe(false);
  });
  it("[AUTH-GATE-010] independent gates cannot be bypassed by authority permission", () => {
    expect(evaluateAuthorityGate({ ...validInput(), requiredIndependentGates: "UNAVAILABLE" }).outcome).toBe("UNAVAILABLE");
    expect(evaluateAuthorityGate({ ...validInput(), requiredIndependentGates: "FAIL" }).gateSatisfied).toBe(false);
  });
  it("[AUTH-GATE-011] a successful gate is not represented as execution", () => {
    const result = evaluateAuthorityGate(validInput());
    expect(result.limitations.join(" ")).toContain("does not establish execution");
    expect(result).not.toHaveProperty("executed");
  });
});
