import { describe, expect, it } from "vitest";
import { reviewConstructionFootShape } from "./constructionFootShape";

describe("recovered Construction Foot shape", () => {
  it("[CON-FOOT-001] recognises canonical pa CV frame form", () => { expect(reviewConstructionFootShape("pa").status).toBe("FRAME-FORM-RECOGNISED"); });
  it("[CON-FOOT-002] recognises all six documented frame initials in their canonical forms", () => {
    for (const token of ["pa", "ba", "ta", "da", "ka", "ga"]) expect(reviewConstructionFootShape(token).status).toBe("FRAME-FORM-RECOGNISED");
  });
  it("[CON-FOOT-003] does not promote unrecorded frame-vowel combinations to canonical forms", () => {
    for (const vowel of ["u", "o", "e", "i", "ə"]) {
      const result = reviewConstructionFootShape("p" + vowel);
      expect(result.status).toBe("UNRESOLVED");
      expect(result.notes.join(" ")).toContain("not among the six recovered canonical CV forms");
    }
  });
  it("[CON-FOOT-004] does not claim coda validity from an incomplete inventory", () => {
    const result = reviewConstructionFootShape("paz");
    expect(result.status).toBe("UNRESOLVED"); expect(result.relationCoda).toBe("z");
    expect(result.notes.join(" ")).toContain("coda inventory");
  });
  it("[CON-FOOT-005] rejects a recovered parameter vowel in the relation-coda position", () => { expect(reviewConstructionFootShape("paa").status).toBe("SHAPE-INVALID"); });
  it("[CON-FOOT-006] rejects non-frame initial consonants", () => {
    expect(reviewConstructionFootShape("va").status).toBe("SHAPE-INVALID"); expect(reviewConstructionFootShape("za").status).toBe("SHAPE-INVALID");
  });
  it("[CON-FOOT-007] rejects unsupported lengths", () => {
    expect(reviewConstructionFootShape("p").status).toBe("SHAPE-INVALID"); expect(reviewConstructionFootShape("paaa").status).toBe("SHAPE-INVALID");
  });
  it("[CON-FOOT-008] records provisional vowel and unresolved semantic boundary", () => {
    expect(reviewConstructionFootShape("pu").notes.join(" ")).toContain("provisional");
    expect(reviewConstructionFootShape("pu").limitation).toContain("does not establish Foot meaning");
  });
  it("[CON-FOOT-009] does not treat a CV frame form as a complete CVC Foot", () => {
    const result = reviewConstructionFootShape("pa");
    expect(result.status).toBe("FRAME-FORM-RECOGNISED"); expect(result.notes.join(" ")).toContain("not evidence that a complete CVC Foot is present");
  });
  it("[CON-FOOT-010] recognises the six canonical forms as the entire recovered CV set", () => {
    const canonical = ["pa", "ba", "ta", "da", "ka", "ga"];
    for (const initial of ["p", "b", "t", "d", "k", "g"]) for (const vowel of ["a", "u", "o", "e", "i", "ə"]) {
      const result = reviewConstructionFootShape(initial + vowel);
      expect(result.status === "FRAME-FORM-RECOGNISED").toBe(canonical.includes(initial + vowel));
    }
  });
  it("[CON-FOOT-011] keeps unrecorded CVC combinations unresolved", () => {
    const result = reviewConstructionFootShape("puz");
    expect(result.status).toBe("UNRESOLVED");
    expect(result.notes.join(" ")).toContain("combination is not among");
    expect(result.notes.join(" ")).toContain("coda inventory");
  });
  it("[CON-FOOT-012] does not validate a coda merely because it occupies the final slot", () => {
    const result = reviewConstructionFootShape("paz");
    expect(result.relationCoda).toBe("z");
    expect(result.status).toBe("UNRESOLVED");
    expect(result.notes.join(" ")).toContain("letter shape alone does not establish");
  });
  it("[CON-FOOT-013] rejects punctuation in every structural slot", () => {
    for (const value of ["p-a", "pa!", "p.a", "p a"]) expect(reviewConstructionFootShape(value).status).toBe("SHAPE-INVALID");
  });
  it("[CON-FOOT-014] rejects non-string runtime input without throwing", () => {
    expect(reviewConstructionFootShape(null).status).toBe("SHAPE-INVALID");
    expect(reviewConstructionFootShape(42).status).toBe("SHAPE-INVALID");
    expect(reviewConstructionFootShape({}).status).toBe("SHAPE-INVALID");
  });
  it("[CON-FOOT-015] uses Unicode code points for structural length", () => {
    expect(reviewConstructionFootShape("pə").status).toBe("UNRESOLVED");
    expect(reviewConstructionFootShape("pəz").status).toBe("UNRESOLVED");
  });
  it("[CON-FOOT-016] does not infer consonant status from an unfamiliar letter", () => {
    const result = reviewConstructionFootShape("pay");
    expect(result.status).toBe("UNRESOLVED");
    expect(result.notes.join(" ")).toContain("does not establish that it is a consonant");
  });
  it("[CON-FOOT-017] rejects whitespace-only or empty input as unsupported shape", () => {
    expect(reviewConstructionFootShape("").status).toBe("SHAPE-INVALID");
    expect(reviewConstructionFootShape("  ").status).toBe("SHAPE-INVALID");
  });
});
