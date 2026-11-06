import { describe, expect, it } from "vitest";
import { reviewConstructionFootShape } from "./constructionFootShape";

describe("recovered Construction Foot shape", () => {
  it("[CON-FOOT-001] recognises canonical pa CV frame shape", () => {
    expect(reviewConstructionFootShape("pa").status).toBe("SHAPE-RECOGNISED");
  });
  it("[CON-FOOT-002] recognises all six documented frame initials", () => {
    for (const token of ["pa", "ba", "ta", "da", "ka", "ga"]) {
      expect(reviewConstructionFootShape(token).status).toBe("SHAPE-RECOGNISED");
    }
  });
  it("[CON-FOOT-003] recognises the documented parameter-vowel positions structurally", () => {
    for (const vowel of ["a", "u", "o", "e", "i", "ə"]) {
      expect(reviewConstructionFootShape("p" + vowel).status).toBe("SHAPE-RECOGNISED");
    }
  });
  it("[CON-FOOT-004] does not claim coda validity from an incomplete inventory", () => {
    const result = reviewConstructionFootShape("paz");
    expect(result.status).toBe("UNRESOLVED");
    expect(result.relationCoda).toBe("z");
  });
  it("[CON-FOOT-005] rejects a vowel in the relation-coda position", () => {
    expect(reviewConstructionFootShape("paa").status).toBe("SHAPE-INVALID");
  });
  it("[CON-FOOT-006] rejects non-frame initial consonants", () => {
    expect(reviewConstructionFootShape("va").status).toBe("SHAPE-INVALID");
    expect(reviewConstructionFootShape("za").status).toBe("SHAPE-INVALID");
  });
  it("[CON-FOOT-007] rejects unsupported lengths", () => {
    expect(reviewConstructionFootShape("p").status).toBe("SHAPE-INVALID");
    expect(reviewConstructionFootShape("paaa").status).toBe("SHAPE-INVALID");
  });
  it("[CON-FOOT-008] records the provisional vowel and unresolved semantic boundary", () => {
    expect(reviewConstructionFootShape("pu").notes.join(" ")).toContain("provisional");
    expect(reviewConstructionFootShape("pu").limitation).toContain("does not establish Foot meaning");
  });
});
