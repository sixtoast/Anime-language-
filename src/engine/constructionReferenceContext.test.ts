import { describe, expect, it } from "vitest";
import {
  advanceConstructionReferenceContext,
  bindConstructionReference
} from "./constructionReferenceContext";

describe("recovered Construction reference context", () => {
  it("[CON-REF-001] assigns the documented default-volume scope to MI", () => {
    expect(bindConstructionReference("MI", "ref-1").current?.scope).toBe("DEFAULT-VOLUME");
  });

  it("[CON-REF-002] assigns the documented default-volume scope to NI and RI", () => {
    expect(bindConstructionReference("NI", "ref-2").current?.scope).toBe("DEFAULT-VOLUME");
    expect(bindConstructionReference("RI", "ref-3").current?.scope).toBe("DEFAULT-VOLUME");
  });

  it("[CON-REF-003] preserves the documented SELF-surface description for me", () => {
    expect(bindConstructionReference("me", "self").current?.scope).toBe("SELF-SURFACE");
  });

  it("[CON-REF-004] retains a reference when no replacement is supplied", () => {
    const original = bindConstructionReference("MI", "ref-1").current;
    expect(advanceConstructionReferenceContext(original, null).current).toEqual(original);
  });

  it("[CON-REF-005] replaces the previous reference when a new binding is supplied", () => {
    const original = bindConstructionReference("MI", "ref-1").current;
    const replacement = bindConstructionReference("me", "self").current;
    expect(advanceConstructionReferenceContext(original, replacement).current).toEqual(replacement);
  });

  it("[CON-REF-006] refuses to guess scope for an undocumented token", () => {
    const result = bindConstructionReference("MEL", "hand");
    expect(result.status).toBe("UNRESOLVED");
    expect(result.issue).toBe("TOKEN_SCOPE_UNRESOLVED");
  });

  it("[CON-REF-007] rejects an empty reference identity", () => {
    const result = bindConstructionReference("MI", "  ");
    expect(result.status).toBe("UNRESOLVED");
    expect(result.issue).toBe("REFERENCE_ID_EMPTY");
  });

  it("[CON-REF-008] rejects a non-string reference identity without throwing", () => {
    const result = bindConstructionReference("MI", 42);
    expect(result.status).toBe("UNRESOLVED");
    expect(result.issue).toBe("REFERENCE_ID_EMPTY");
  });

  it("[CON-REF-009] rejects a replacement whose declared scope conflicts with its token", () => {
    const result = advanceConstructionReferenceContext(null, {
      token: "MI", referenceId: "ref-1", scope: "SELF-SURFACE", persistence: "UNTIL-REPLACED"
    });
    expect(result.status).toBe("UNRESOLVED");
    expect(result.current).toBeNull();
    expect(result.issue).toBe("REPLACEMENT_BINDING_INVALID");
  });

  it("[CON-REF-010] rejects malformed replacement records rather than retaining the previous binding", () => {
    const original = bindConstructionReference("MI", "ref-1").current;
    const result = advanceConstructionReferenceContext(original, {
      token: "MI", referenceId: " ", scope: "DEFAULT-VOLUME", persistence: "UNTIL-REPLACED"
    });
    expect(result.status).toBe("UNRESOLVED");
    expect(result.current).toBeNull();
    expect(result.issue).toBe("REPLACEMENT_BINDING_INVALID");
  });

  it("[CON-REF-011] rejects a corrupted persisted binding when no replacement is supplied", () => {
    const result = advanceConstructionReferenceContext({
      token: "NI", referenceId: "field-1", scope: "SELF-SURFACE", persistence: "UNTIL-REPLACED"
    }, null);
    expect(result.status).toBe("UNRESOLVED");
    expect(result.current).toBeNull();
    expect(result.issue).toBe("REFERENCE_BINDING_INVALID");
  });

  it("[CON-REF-012] rejects an unknown persistence policy", () => {
    const result = advanceConstructionReferenceContext(null, {
      token: "RI", referenceId: "target-1", scope: "DEFAULT-VOLUME", persistence: "FOREVER"
    });
    expect(result.status).toBe("UNRESOLVED");
    expect(result.issue).toBe("REPLACEMENT_BINDING_INVALID");
  });

  it("[CON-REF-013] trims reference identifiers at the binding boundary", () => {
    const result = bindConstructionReference("RI", "  target-1  ");
    expect(result.current?.referenceId).toBe("target-1");
  });

  it("[CON-REF-014] treats a null initial context as unbound", () => {
    const result = advanceConstructionReferenceContext(null, null);
    expect(result.status).toBe("UNBOUND");
    expect(result.current).toBeNull();
    expect(result.issue).toBe("NONE");
  });
});
