import { describe, expect, it } from "vitest";
import validationSpec from "../../docs/canon/arcane-incantations-v1.2-preconditions-constraints-and-failure.md?raw";
import invocationSpec from "../../docs/canon/arcane-incantations-v1.5-invocation-profiles-and-execution-contracts.md?raw";
import { invocationLifecycleSequence, invocationOrderNote, parseInvocationLifecycle, parseValidationGateSequence, validationGateSequence } from "./incantationGateSequence";

describe("source-linked incantation gate sequence explorer", () => {
  it("[GATE-TEST-001] reads the nine v1.2 gate stages in canonical order", () => {
    expect(validationGateSequence.map((stage) => stage.label)).toEqual([
      "Structure", "References", "Types", "Preconditions", "Limits and resources",
      "Feasibility", "External authorisation", "Execution", "Postconditions"
    ]);
    expect(validationGateSequence.map((stage) => stage.id)).toEqual(Array.from({ length: 9 }, (_, index) => "CON12-" + String(index + 1).padStart(2, "0")));
  });

  it("[GATE-TEST-002] preserves the source descriptions instead of inventing a new v1.2 sequence", () => {
    expect(validationGateSequence[0]?.sourceDescription).toBe("parse the operation and condition records.");
    expect(validationGateSequence[6]?.sourceDescription).toBe("confirm the execution environment independently permits the operation.");
    expect(validationSpec).toContain("The first blocking failure stops progression for the affected operation.");
  });

  it("[GATE-TEST-003] reads the seven v1.5 lifecycle labels in source order", () => {
    expect(invocationLifecycleSequence.map((stage) => stage.label)).toEqual([
      "well-formed", "semantically validated", "externally authorised",
      "execution contract accepted", "attempted", "observed", "outcome verified"
    ]);
    expect(invocationLifecycleSequence.map((stage) => stage.id)).toEqual(Array.from({ length: 7 }, (_, index) => "INV15-" + String(index + 1).padStart(2, "0")));
  });

  it("[GATE-TEST-004] keeps the v1.5 summary and worked-example order note visible as separate evidence", () => {
    const summary = invocationSpec.indexOf("**well-formed → semantically validated → externally authorised → execution contract accepted → attempted → observed → outcome verified**");
    const workedExample = invocationSpec.indexOf("## 9. Worked abstract example");
    const contractCheck = invocationSpec.indexOf("The contract is checked against the profile and request.", workedExample);
    const authorityDecision = invocationSpec.indexOf("An external authority decision is obtained", workedExample);
    expect(summary).toBeGreaterThanOrEqual(0);
    expect(workedExample).toBeGreaterThan(summary);
    expect(contractCheck).toBeGreaterThan(workedExample);
    expect(authorityDecision).toBeGreaterThan(contractCheck);
    expect(invocationOrderNote.title).toContain("do not reconcile by assumption");
    expect(invocationOrderNote.rule).toContain("does not invent a merged total order");
  });

  it("[GATE-TEST-005] preserves non-substitution boundaries for authorisation and outcome verification", () => {
    expect(validationGateSequence.find((stage) => stage.label === "External authorisation")?.boundaryNote).toContain("does not replace consent");
    expect(invocationLifecycleSequence.find((stage) => stage.label === "execution contract accepted")?.boundaryNote).toContain("does not mean the request was authorised or executed");
    expect(invocationLifecycleSequence.find((stage) => stage.label === "outcome verified")?.boundaryNote).toContain("bounded by the declared postconditions");
  });

  it("[GATE-TEST-006] rejects missing v1.2 section or v1.5 lifecycle chain", () => {
    expect(() => parseValidationGateSequence("# no gate section")).toThrow("v1.2 gate-sequence section not found");
    expect(() => parseInvocationLifecycle("# no lifecycle")).toThrow("v1.5 invocation lifecycle summary not found");
  });

  it("[GATE-TEST-007] rejects altered v1.5 lifecycle shape instead of guessing the missing stages", () => {
    expect(() => parseInvocationLifecycle(invocationSpec.replace(
      "**well-formed → semantically validated → externally authorised → execution contract accepted → attempted → observed → outcome verified**",
      "**well-formed → semantically validated → unknown-stage → execution contract accepted → attempted → observed → outcome verified**"
    ))).toThrow("Unexpected v1.5 invocation lifecycle stages");
  });
});
