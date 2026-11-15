import { describe, expect, it } from "vitest";
import { traceConstructionReferenceEvents } from "./constructionReferenceTrace";

describe("Construction reference event trace", () => {
  it("[REF-8CN-001] binds a formal MI reference with default-volume scope", () => {
    const result = traceConstructionReferenceEvents([{ type: "REFERENCE", token: "MI", referenceId: "target-A" }]);
    expect(result.finalStatus).toBe("BOUND");
    expect(result.finalBinding?.scope).toBe("DEFAULT-VOLUME");
  });
  it("[REF-8CN-002] binds NI and RI using the same recovered default-volume scope", () => {
    for (const token of ["NI", "RI"] as const) {
      const result = traceConstructionReferenceEvents([{ type: "REFERENCE", token, referenceId: "target-A" }]);
      expect(result.finalBinding?.token).toBe(token);
      expect(result.finalBinding?.scope).toBe("DEFAULT-VOLUME");
    }
  });
  it("[REF-8CN-003] binds me to SELF-SURFACE rather than default volume", () => {
    const result = traceConstructionReferenceEvents([{ type: "REFERENCE", token: "me", referenceId: "self" }]);
    expect(result.finalBinding?.scope).toBe("SELF-SURFACE");
  });
  it("[REF-8CN-004] preserves a binding when no replacement occurs within the recovered context", () => {
    const result = traceConstructionReferenceEvents([
      { type: "REFERENCE", token: "MI", referenceId: "A" },
      { type: "NO-REPLACEMENT" }
    ]);
    expect(result.finalStatus).toBe("BOUND");
    expect(result.finalBinding?.referenceId).toBe("A");
    expect(result.steps[1].transition).toBe("PRESERVED-NO-REPLACEMENT");
  });
  it("[REF-8CN-005] replaces the complete prior binding when a new reference is explicit", () => {
    const result = traceConstructionReferenceEvents([
      { type: "REFERENCE", token: "MI", referenceId: "A" },
      { type: "REFERENCE", token: "me", referenceId: "B" }
    ]);
    expect(result.finalBinding?.referenceId).toBe("B");
    expect(result.finalBinding?.scope).toBe("SELF-SURFACE");
  });
  it("[REF-8CN-006] does not invent a binding when no reference has been supplied", () => {
    const result = traceConstructionReferenceEvents([{ type: "NO-REPLACEMENT" }]);
    expect(result.finalStatus).toBe("UNBOUND");
    expect(result.finalBinding).toBeNull();
  });
  it("[REF-8CN-007] does not infer a scope reset at the phrase separator", () => {
    const result = traceConstructionReferenceEvents([
      { type: "REFERENCE", token: "MI", referenceId: "A" },
      { type: "PHRASE-BOUNDARY", marker: "·" }
    ]);
    expect(result.steps[1].transition).toBe("BOUNDARY-EFFECT-UNRESOLVED");
    expect(result.steps[1].binding?.referenceId).toBe("A");
    expect(result.finalStatus).toBe("UNRESOLVED");
  });
  it("[REF-8CN-008] blocks assumed persistence after a phrase boundary", () => {
    const result = traceConstructionReferenceEvents([
      { type: "REFERENCE", token: "MI", referenceId: "A" },
      { type: "PHRASE-BOUNDARY", marker: "·" },
      { type: "NO-REPLACEMENT" }
    ]);
    expect(result.finalStatus).toBe("BLOCKED-ON-BOUNDARY-GRAMMAR");
    expect(result.steps[2].transition).toBe("BLOCKED-CONTINUITY-INFERENCE");
  });
  it("[REF-8CN-009] allows a new explicit reference to establish a binding after a boundary", () => {
    const result = traceConstructionReferenceEvents([
      { type: "REFERENCE", token: "MI", referenceId: "A" },
      { type: "CLAUSE-BOUNDARY", marker: "?" },
      { type: "REFERENCE", token: "me", referenceId: "B" }
    ]);
    expect(result.finalStatus).toBe("BOUND");
    expect(result.finalBinding?.referenceId).toBe("B");
    expect(result.steps[2].transition).toBe("EXPLICIT-REPLACEMENT-AFTER-BOUNDARY");
  });
  it("[REF-8CN-010] does not treat a clause boundary as a replacement", () => {
    const result = traceConstructionReferenceEvents([
      { type: "REFERENCE", token: "RI", referenceId: "A" },
      { type: "CLAUSE-BOUNDARY", marker: ";" }
    ]);
    expect(result.steps[1].transition).toBe("BOUNDARY-EFFECT-UNRESOLVED");
    expect(result.steps[1].binding?.referenceId).toBe("A");
  });
  it("[REF-8CN-011] exposes trace history and does not claim grammar completeness", () => {
    const result = traceConstructionReferenceEvents([
      { type: "REFERENCE", token: "MI", referenceId: "A" },
      { type: "NO-REPLACEMENT" }
    ]);
    expect(result.steps).toHaveLength(2);
    expect(result.grammarComplete).toBe(false);
    expect(result.executable).toBe(false);
  });
  it("[REF-8CN-012] marks an empty explicit identifier unresolved", () => {
    const result = traceConstructionReferenceEvents([
      { type: "REFERENCE", token: "MI", referenceId: " " }
    ]);
    expect(result.finalStatus).toBe("UNRESOLVED");
    expect(result.finalBinding).toBeNull();
  });
});
