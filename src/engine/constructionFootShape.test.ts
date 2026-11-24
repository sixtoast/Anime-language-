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
  it("[CON-FOOT-004] does not claim coda validity from an unfamiliar coda", () => {
    const result = reviewConstructionFootShape("paz");
    expect(result.status).toBe("UNRESOLVED"); expect(result.relationCoda).toBe("z");
    expect(result.notes.join(" ")).toContain("five source-backed relation codas");
  });
  it("[CON-FOOT-005] rejects a recovered parameter vowel in the relation-coda position", () => { expect(reviewConstructionFootShape("paa").status).toBe("SHAPE-INVALID"); });
  it("[CON-FOOT-006] rejects non-frame initial consonants", () => {
    expect(reviewConstructionFootShape("va").status).toBe("SHAPE-INVALID"); expect(reviewConstructionFootShape("za").status).toBe("SHAPE-INVALID");
  });
  it("[CON-FOOT-007] rejects unsupported short and overlong shapes", () => {
    expect(reviewConstructionFootShape("p").status).toBe("SHAPE-INVALID");
    expect(reviewConstructionFootShape("paaa").status).toBe("SHAPE-INVALID");
  });
  it("[CON-FOOT-008] records provisional vowel and unresolved semantic boundary", () => {
    expect(reviewConstructionFootShape("pu").notes.join(" ")).toContain("provisional");
    expect(reviewConstructionFootShape("pu").limitation).toContain("does not attest a lexical Foot");
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
  it("[CON-FOOT-011] keeps unknown-coda combinations unresolved", () => {
    const result = reviewConstructionFootShape("puz");
    expect(result.status).toBe("UNRESOLVED");
    expect(result.notes.join(" ")).toContain("combination is not among");
    expect(result.notes.join(" ")).toContain("not in the five source-backed relation codas");
  });
  it("[CON-FOOT-012] does not validate an unfamiliar coda merely because it occupies the final slot", () => {
    const result = reviewConstructionFootShape("paz");
    expect(result.relationCoda).toBe("z");
    expect(result.status).toBe("UNRESOLVED");
    expect(result.notes.join(" ")).toContain("Letter shape alone does not establish");
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
    expect(result.notes.join(" ")).toContain("does not establish that an unfamiliar final letter");
  });
  it("[CON-FOOT-017] rejects whitespace-only or empty input as unsupported shape", () => {
    expect(reviewConstructionFootShape("").status).toBe("SHAPE-INVALID");
    expect(reviewConstructionFootShape("  ").status).toBe("SHAPE-INVALID");
  });
  it("[CON-FOOT-018] recognises ng as one documented coda grapheme", () => {
    const result = reviewConstructionFootShape("pang");
    expect(result.status).toBe("CVC-SHAPE-RECOGNISED");
    expect(result.relationCoda).toBe("ng");
    expect(result.notes.join(" ")).toContain("productive frame × vowel × coda combination");
  });
  it("[CON-FOOT-019] recognises sh as one documented coda grapheme", () => {
    const result = reviewConstructionFootShape("pash");
    expect(result.status).toBe("CVC-SHAPE-RECOGNISED");
    expect(result.relationCoda).toBe("sh");
  });
  it("[CON-FOOT-020] recognises the three other documented single-letter codas", () => {
    for (const coda of ["m", "n", "s"]) {
      const result = reviewConstructionFootShape("pa" + coda);
      expect(result.status).toBe("CVC-SHAPE-RECOGNISED");
      expect(result.relationCoda).toBe(coda);
    }
  });
  it("[CON-FOOT-021] recognises digraph codas after schwa without counting letters as segments", () => {
    expect(reviewConstructionFootShape("pəng").relationCoda).toBe("ng");
    expect(reviewConstructionFootShape("pəsh").relationCoda).toBe("sh");
  });
  it("[CON-FOOT-022] does not silently accept IPA notation as surface orthography", () => {
    const result = reviewConstructionFootShape("paŋ");
    expect(result.status).toBe("UNRESOLVED");
    expect(result.relationCoda).toBe("ŋ");
  });
  it("[CON-FOOT-023] rejects an unrecovered multi-letter coda sequence", () => {
    expect(reviewConstructionFootShape("pagh").status).toBe("SHAPE-INVALID");
  });
  it("[CON-FOOT-024] keeps structural recognition separate from lexical attestation", () => {
    const result = reviewConstructionFootShape("pang");
    expect(result.status).toBe("CVC-SHAPE-RECOGNISED");
    expect(result.limitation).toContain("does not attest a lexical Foot");
    expect(result.limitation).toContain("permit execution");
  });
});
