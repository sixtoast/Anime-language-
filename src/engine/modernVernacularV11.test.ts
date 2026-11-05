import { describe, expect, it } from "vitest";
import { parseModernVernacularV11 } from "./modernVernacular";

describe("Modern Vernacular v1.1 locked verb expansion", () => {
  it.each([
    ["teshi nak rawu", "nak", "rawu", "hearer-auditory-theme"],
    ["teshi zir rawu", "zir", "rawu", "speaker-utterance"],
    ["teshi shus rawu", "shus", "rawu", "knower-known-item"],
    ["fezo mos rawu", "mos", "rawu", "learner-acquired-content"],
    ["teshi mol gisho", "mol", "gisho", "eater-food"],
    ["fezo tut losa", "tut", "losa", "drinker-liquid"]
  ] as const)("parses the locked frame %s", (input, predicate, object, frame) => {
    expect(parseModernVernacularV11(input)).toMatchObject({
      ok: true,
      ast: { grammarVersion: "1.1", predicate, object, frame, polarity: "positive" }
    });
  });

  it("extends simple preverbal negation to the closed verb list", () => {
    expect(parseModernVernacularV11("teshi nava nak rawu")).toMatchObject({
      ok: true, ast: { construction: "negative", polarity: "negative", predicate: "nak" }
    });
  });

  it("extends polar questions to the closed verb list", () => {
    expect(parseModernVernacularV11("teshi mol gisho pun")).toMatchObject({
      ok: true, ast: { construction: "polar-question", question: "polar" }
    });
  });

  it("supports in-situ slot-A questions", () => {
    expect(parseModernVernacularV11("shuk zir rawu")).toMatchObject({
      ok: true, ast: { construction: "information-question", subject: "shuk" }
    });
  });

  it("supports in-situ slot-B questions", () => {
    expect(parseModernVernacularV11("teshi mol zosh")).toMatchObject({
      ok: true, ast: { construction: "information-question", object: "zosh" }
    });
  });

  it("rejects reversed roles rather than treating them as equivalent", () => {
    expect(parseModernVernacularV11("rawu nak teshi").ok).toBe(false);
  });

  it("rejects a mismatched complement for a narrow verb frame", () => {
    expect(parseModernVernacularV11("teshi mos fezo").diagnostics[0]?.code).toBe("MV1_INVALID_ARGUMENT_SLOT");
  });

  it("rejects a missing complement", () => {
    expect(parseModernVernacularV11("teshi shus").ok).toBe(false);
  });

  it("blocks negative polar questions", () => {
    expect(parseModernVernacularV11("teshi nava mol gisho pun").diagnostics[0]?.code).toBe("MV1_BLOCKED_NEGATIVE_POLAR");
  });

  it("blocks information questions combined with pun", () => {
    expect(parseModernVernacularV11("teshi mol zosh pun").diagnostics[0]?.code).toBe("MV1_BLOCKED_INFORMATION_POLAR");
  });

  it("does not license an addressee frame for zir", () => {
    expect(parseModernVernacularV11("teshi zir fezo").ok).toBe(false);
  });

  it("rejects unknown vocabulary", () => {
    expect(parseModernVernacularV11("teshi love rawu").diagnostics[0]?.code).toBe("MV1_UNKNOWN_FORM");
  });
});
\n\ndescribe("Modern Vernacular v1.1 question scope", () => {\n  it("blocks slot-A information questions combined with pun", () => {\n    expect(parseModernVernacularV11("shuk nak rawu pun").diagnostics[0]?.code).toBe("MV1_BLOCKED_INFORMATION_POLAR");\n  });\n});\n