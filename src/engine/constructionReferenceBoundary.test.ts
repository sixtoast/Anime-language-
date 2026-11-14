import { describe, expect, it } from "vitest";
import { bindConstructionReference } from "./constructionReferenceContext";
import { reviewConstructionReferenceBoundary } from "./constructionReferenceBoundary";

describe("Construction reference and phrase-boundary interaction", () => {
  it("[CON-REF-BOUND-001] preserves an existing binding when no replacement is supplied", () => {
    const initial = bindConstructionReference("MI", "hand-volume").current;
    const result = reviewConstructionReferenceBoundary(initial, { type: "NO-REPLACEMENT" });
    expect(result.boundaryEffect).toBe("PRESERVE-UNTIL-REPLACED");
    expect(result.context.current).toEqual(initial);
  });
  it("[CON-REF-BOUND-002] applies an explicit valid replacement", () => {
    const initial = bindConstructionReference("MI", "hand-volume").current;
    const replacement = bindConstructionReference("me", "self-surface").current!;
    const result = reviewConstructionReferenceBoundary(initial, { type: "VALID-REPLACEMENT", binding: replacement });
    expect(result.boundaryEffect).toBe("REPLACEMENT-APPLIED");
    expect(result.context.current).toEqual(replacement);
  });
  it("[CON-REF-BOUND-003] does not treat the recovered middle dot as a replacement", () => {
    const initial = bindConstructionReference("MI", "hand-volume").current;
    const result = reviewConstructionReferenceBoundary(initial, { type: "PHRASE-BOUNDARY", marker: "·" });
    expect(result.boundaryEffect).toBe("UNRESOLVED");
    expect(result.context.current).toEqual(initial);
  });
  it("[CON-REF-BOUND-004] does not invent clause-boundary reset behaviour", () => {
    const initial = bindConstructionReference("RI", "target-path").current;
    const result = reviewConstructionReferenceBoundary(initial, { type: "CLAUSE-BOUNDARY", marker: ";" });
    expect(result.boundaryEffect).toBe("UNRESOLVED");
    expect(result.context.current).toEqual(initial);
    expect(result.mayInferScopeReset).toBe(false);
  });
  it("[CON-REF-BOUND-005] keeps invalid current bindings unresolved at boundaries", () => {
    const result = reviewConstructionReferenceBoundary({ token: "MI", referenceId: "", scope: "DEFAULT-VOLUME", persistence: "UNTIL-REPLACED" }, { type: "PHRASE-BOUNDARY", marker: "·" });
    expect(result.context.status).toBe("UNRESOLVED");
    expect(result.context.current).toBeNull();
  });
});
