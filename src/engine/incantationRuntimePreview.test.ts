import { describe, expect, it } from "vitest";
import { evaluateIncantationRuntimePreview } from "./incantationRuntimePreview";

describe("read-only incantation runtime preview", () => {
  it("[RUNTIME-PREVIEW-001] composes passing sample gates without starting execution", () => {
    const result = evaluateIncantationRuntimePreview("READY-SAMPLE");
    expect(result.resource.outcome).toBe("RESOURCE-READY");
    expect(result.policy.outcome).toBe("COMPOSED-PERMIT");
    expect(result.authority.gateSatisfied).toBe(true);
    expect(result.invocation).toMatchObject({ outcome: "ELIGIBLE-TO-PROCEED", eligibleToProceed: true, executionStarted: false });
  });

  it("[RUNTIME-PREVIEW-002] blocks when the resource requirement exceeds availability", () => {
    const result = evaluateIncantationRuntimePreview("RESOURCE-BLOCKED");
    expect(result.resource.outcome).toBe("RESOURCE-INSUFFICIENT");
    expect(result.invocation.outcome).toBe("BLOCKED");
  });

  it("[RUNTIME-PREVIEW-003] preserves an unavailable authority decision", () => {
    const result = evaluateIncantationRuntimePreview("AUTHORITY-UNAVAILABLE");
    expect(result.authority.outcome).toBe("UNAVAILABLE");
    expect(result.invocation.outcome).toBe("UNAVAILABLE");
  });

  it("[RUNTIME-PREVIEW-004] does not turn unknown policy trust into a permit", () => {
    const result = evaluateIncantationRuntimePreview("POLICY-UNRESOLVED");
    expect(result.policy.outcome).toBe("INDETERMINATE");
    expect(result.invocation.outcome).toBe("INDETERMINATE");
  });

  it("[RUNTIME-PREVIEW-005] keeps consent and feasibility as independent blockers", () => {
    expect(evaluateIncantationRuntimePreview("CONSENT-UNRESOLVED").invocation.outcome).toBe("INDETERMINATE");
    expect(evaluateIncantationRuntimePreview("FEASIBILITY-BLOCKED").invocation.outcome).toBe("BLOCKED");
  });
  it("[RUNTIME-PREVIEW-006] rejects unknown scenario identifiers instead of substituting READY-SAMPLE data", () => {
    const result = evaluateIncantationRuntimePreview("UNKNOWN-SCENARIO" as never);
    expect(result.scenario).toBe("INVALID");
    expect(result.invocation.outcome).toBe("BLOCKED");
    expect(result.assumptions.join(" ")).toContain("no READY-SAMPLE defaults were substituted");
  });
});
