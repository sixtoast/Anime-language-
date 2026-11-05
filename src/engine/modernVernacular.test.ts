import { describe, expect, it } from "vitest";
import { parseModernVernacularV1 } from "./modernVernacular";

describe("Modern Vernacular v1.0 locked-core parser", () => {
  it("[MV1-P-001] parses a simple affirmative clause", () => {
    const result = parseModernVernacularV1("teshi wish fezo");
    expect(result.ok).toBe(true);
    expect(result.ast).toMatchObject({ kind: "clause", construction: "affirmative", polarity: "positive", question: "none" });
  });

  it("[MV1-P-002] preserves participant-role reversal", () => {
    const result = parseModernVernacularV1("fezo wish teshi");
    expect(result.ast).toMatchObject({
      kind: "clause",
      participantA: { kind: "participant", form: "fezo" },
      participantB: { kind: "participant", form: "teshi" }
    });
  });

  it("[MV1-P-003] parses the slot-A who question", () => {
    expect(parseModernVernacularV1("shuk wish fezo").ast).toMatchObject({
      kind: "clause", construction: "information-question",
      participantA: { kind: "question-slot", form: "shuk", slot: "A" }
    });
  });

  it("[MV1-P-004] parses the slot-B what question", () => {
    expect(parseModernVernacularV1("teshi wish zosh").ast).toMatchObject({
      kind: "clause", construction: "information-question",
      participantB: { kind: "question-slot", form: "zosh", slot: "B" }
    });
  });

  it("[MV1-P-005] parses a simple polar question", () => {
    expect(parseModernVernacularV1("teshi wish fezo pun").ast).toMatchObject({
      kind: "clause", construction: "polar-question", question: "polar"
    });
  });

  it("[MV1-P-006] parses simple preverbal clause negation", () => {
    expect(parseModernVernacularV1("teshi nava wish fezo").ast).toMatchObject({
      kind: "clause", construction: "negative", polarity: "negative"
    });
  });

  it("[MV1-P-007] keeps the reversed negative clause grammatical", () => {
    expect(parseModernVernacularV1("fezo nava wish teshi").ok).toBe(true);
  });

  it("[MV1-P-008] recognises standalone response words", () => {
    expect(parseModernVernacularV1("wang").ast).toMatchObject({ kind: "response", meaning: "yes" });
    expect(parseModernVernacularV1("kor").ast).toMatchObject({ kind: "response", meaning: "no" });
    expect(parseModernVernacularV1("gep").ast).toMatchObject({ kind: "response", meaning: "maybe" });
  });

  it("[MV1-P-009] blocks negative polar questions", () => {
    expect(parseModernVernacularV1("teshi nava wish fezo pun").diagnostics[0]?.code).toBe("MV1_BLOCKED_NEGATIVE_POLAR");
  });

  it("[MV1-P-010] blocks information questions combined with pun", () => {
    expect(parseModernVernacularV1("shuk wish fezo pun").diagnostics[0]?.code).toBe("MV1_BLOCKED_INFORMATION_POLAR");
  });

  it("[MV1-P-011] does not treat kor as a clause negator", () => {
    expect(parseModernVernacularV1("kor wish fezo").diagnostics[0]?.code).toBe("MV1_RESPONSE_NOT_CLAUSE_NEGATOR");
  });

  it("[MV1-P-012] rejects unknown vocabulary rather than guessing", () => {
    expect(parseModernVernacularV1("teshi love fezo").diagnostics[0]?.code).toBe("MV1_UNKNOWN_FORM");
  });

  it("[MV1-P-013] rejects unsupported verb frames", () => {
    expect(parseModernVernacularV1("teshi wish fezo wish teshi").diagnostics[0]?.code).toBe("MV1_UNSUPPORTED_CONSTRUCTION");
  });

  it("[MV1-P-014] rejects empty input", () => {
    expect(parseModernVernacularV1("   ").diagnostics[0]?.code).toBe("MV1_EMPTY_INPUT");
  });

  it("[MV1-P-015] parses case-insensitively without changing AST spellings", () => {
    expect(parseModernVernacularV1("TESHI WISH FEZO").ast).toMatchObject({
      kind: "clause",
      participantA: { form: "teshi" },
      predicate: "wish"
    });
  });
});
