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
});
