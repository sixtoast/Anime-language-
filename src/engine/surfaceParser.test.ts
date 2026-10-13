import { describe, expect, it } from "vitest";
import { parseSurfaceExpression } from "./surfaceParser";

describe("parseSurfaceExpression — provisional Phase 6G subset", () => {
  it("parses an integer numeral closed by a unit", () => {
    const result = parseSurfaceExpression("frapa ki sho to sho");
    expect(result.ok).toBe(true);
    expect(result.ast).toMatchObject({
      kind: "call",
      operator: "FRAPA",
      args: [
        { kind: "quantity", value: "1", unit: "SHO" },
        { kind: "quantity", value: "2", unit: "SHO" }
      ]
    });
  });

  it("parses a decimal numeral with an explicit unit", () => {
    const result = parseSurfaceExpression("frapa za shi to ma ki sho");
    expect(result.ok).toBe(true);
    expect(result.ast).toMatchObject({
      kind: "call",
      args: [{ kind: "quantity", value: "0.2", unit: "MA" }]
    });
  });

  it("rejects an unterminated numeral", () => {
    expect(parseSurfaceExpression("frapa ki to").diagnostics[0]?.code).toBe("UNTERMINATED_NUMERAL");
  });

  it("rejects a decimal marker without fractional digits", () => {
    expect(parseSurfaceExpression("za shi ma").diagnostics[0]?.code).toBe("MALFORMED_DECIMAL");
  });

  it("parses a binding declaration with a SHO-closed identifier", () => {
    const result = parseSurfaceExpression("kwam ki sho frapa ki sho to sho");
    expect(result.ok).toBe(true);
    expect(result.ast).toMatchObject({
      kind: "call",
      operator: "KWAM",
      args: [{ kind: "identifier", digits: "1" }, { kind: "call", operator: "FRAPA" }]
    });
  });

  it("rejects a binding identifier without SHO", () => {
    expect(parseSurfaceExpression("kwam ki frapa ki sho to sho").diagnostics[0]?.code).toBe("IDENTIFIER_NOT_CLOSED");
  });

  it("parses a reference to a SHO-closed identifier", () => {
    expect(parseSurfaceExpression("kwat to mu sho")).toMatchObject({
      ok: true,
      ast: { kind: "call", operator: "KWAT", args: [{ kind: "identifier", digits: "23" }] }
    });
  });

  it("parses nested fixed-arity arithmetic", () => {
    expect(parseSurfaceExpression("frapa frama ki sho to sho fraja mu sho za sho")).toMatchObject({
      ok: true,
      ast: { kind: "call", operator: "FRAPA", args: [{ kind: "call", operator: "FRAMA" }, { kind: "call", operator: "FRAJA" }] }
    });
  });

  it("parses an explicit control block while preserving the block node", () => {
    expect(parseSurfaceExpression("bek dras ki sho to sho gt meto frapa ki sho to sho dogu")).toMatchObject({
      ok: true,
      ast: {
        kind: "call",
        operator: "BEK",
        args: [{ kind: "call", operator: "DRAS" }, { kind: "block", expressions: [{ kind: "call", operator: "FRAPA" }] }]
      }
    });
  });

  it("rejects a control form without METO", () => {
    expect(parseSurfaceExpression("bek dras ki sho to sho gt frapa ki sho to sho dogu").diagnostics[0]?.code).toBe("MISSING_BLOCK_OPEN");
  });

  it("rejects a control form without DOGU", () => {
    expect(parseSurfaceExpression("bek dras ki sho to sho gt meto frapa ki sho to sho").diagnostics[0]?.code).toBe("MISSING_BLOCK_CLOSE");
  });

  it("rejects more than one top-level expression", () => {
    expect(parseSurfaceExpression("ki sho to sho").diagnostics[0]?.code).toBe("TRAILING_EXPRESSIONS");
  });

  it("rejects unknown lexical forms unless explicitly supplied as known atoms", () => {
    expect(parseSurfaceExpression("unknownword").diagnostics[0]?.code).toBe("UNKNOWN_LEXICAL_FORM");
    expect(parseSurfaceExpression("knownword", { knownAtoms: ["knownword"] })).toMatchObject({
      ok: true,
      ast: { kind: "atom", form: "KNOWNWORD" }
    });
  });

  it("rejects unresolved operator-like forms rather than guessing their arity", () => {
    expect(parseSurfaceExpression("nes ki sho").diagnostics[0]?.code).toBe("UNRESOLVED_OPERATOR");
  });

  it("fails closed on the known RE/RA homophone ambiguity", () => {
    expect(parseSurfaceExpression("re").diagnostics[0]?.code).toBe("AMBIGUOUS_HOMOPHONE");
    expect(parseSurfaceExpression("ra").diagnostics[0]?.code).toBe("AMBIGUOUS_HOMOPHONE");
  });

  it("normalises documented legacy aliases by default", () => {
    expect(parseSurfaceExpression("frata ki sho to sho")).toMatchObject({
      ok: true,
      ast: { kind: "call", operator: "FRAJA" }
    });
  });

  it("can disable legacy alias normalisation", () => {
    expect(parseSurfaceExpression("frata ki sho to sho", { allowLegacyAliases: false }).diagnostics[0]?.code).toBe("UNKNOWN_LEXICAL_FORM");
  });

  it("rejects block delimiters outside a control form", () => {
    expect(parseSurfaceExpression("meto ki sho dogu").diagnostics[0]?.code).toBe("BLOCK_DELIMITER_OUTSIDE_CONTROL");
  });

  it("labels output as provisional surface notation, not audit notation", () => {
    expect(parseSurfaceExpression("ki ma").notation).toBe("phase-6g-provisional");
  });
});
