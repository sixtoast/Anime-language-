import { describe, expect, it } from "vitest";
import { parseSurfaceExpression } from "./surfaceParser";
import { buildLexiconRegistry, type LexiconRow } from "./lexiconRegistry";

describe("parseSurfaceExpression — provisional Phase 6G subset", () => {
  it("[SURF-001] parses an integer numeral closed by a unit", () => {
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

  it("[SURF-002] parses a decimal numeral with an explicit unit", () => {
    const result = parseSurfaceExpression("frapa za shi to ma ki sho");
    expect(result.ok).toBe(true);
    expect(result.ast).toMatchObject({
      kind: "call",
      operator: "FRAPA",
      args: [
        { kind: "quantity", value: "0.2", unit: "MA" },
        { kind: "quantity", value: "1", unit: "SHO" }
      ]
    });
  });

  it("[SURF-003] rejects an unterminated numeral", () => {
    expect(parseSurfaceExpression("frapa ki to").diagnostics[0]?.code).toBe("UNTERMINATED_NUMERAL");
  });

  it("[SURF-004] rejects a decimal marker without fractional digits", () => {
    expect(parseSurfaceExpression("za shi ma").diagnostics[0]?.code).toBe("MALFORMED_DECIMAL");
  });

  it("[SURF-005] parses a binding declaration with a SHO-closed identifier", () => {
    const result = parseSurfaceExpression("kwam ki sho frapa ki sho to sho");
    expect(result.ok).toBe(true);
    expect(result.ast).toMatchObject({
      kind: "call",
      operator: "KWAM",
      args: [{ kind: "identifier", digits: "1" }, { kind: "call", operator: "FRAPA" }]
    });
  });

  it("[SURF-006] rejects a binding identifier without SHO", () => {
    expect(parseSurfaceExpression("kwam ki frapa ki sho to sho").diagnostics[0]?.code).toBe("IDENTIFIER_NOT_CLOSED");
  });

  it("[SURF-007] parses a reference to a SHO-closed identifier", () => {
    expect(parseSurfaceExpression("kwat to mu sho")).toMatchObject({
      ok: true,
      ast: { kind: "call", operator: "KWAT", args: [{ kind: "identifier", digits: "23" }] }
    });
  });

  it("[SURF-008] parses nested fixed-arity arithmetic", () => {
    expect(parseSurfaceExpression("frapa frama ki sho to sho fraja mu sho za sho")).toMatchObject({
      ok: true,
      ast: { kind: "call", operator: "FRAPA", args: [{ kind: "call", operator: "FRAMA" }, { kind: "call", operator: "FRAJA" }] }
    });
  });

  it("[SURF-009] parses an explicit control block while preserving the block node", () => {
    expect(parseSurfaceExpression("bek dras ki sho to sho gt meto frapa ki sho to sho dogu")).toMatchObject({
      ok: true,
      ast: {
        kind: "call",
        operator: "BEK",
        args: [{ kind: "call", operator: "DRAS" }, { kind: "block", expressions: [{ kind: "call", operator: "FRAPA" }] }]
      }
    });
  });

  it("[SURF-010] rejects a control form without METO", () => {
    expect(parseSurfaceExpression("bek dras ki sho to sho gt frapa ki sho to sho dogu").diagnostics[0]?.code).toBe("MISSING_BLOCK_OPEN");
  });

  it("[SURF-011] rejects a control form without DOGU", () => {
    expect(parseSurfaceExpression("bek dras ki sho to sho gt meto frapa ki sho to sho").diagnostics[0]?.code).toBe("MISSING_BLOCK_CLOSE");
  });

  it("[SURF-012] rejects more than one top-level expression", () => {
    expect(parseSurfaceExpression("ki sho to sho").diagnostics[0]?.code).toBe("TRAILING_EXPRESSIONS");
  });

  it("[SURF-013] rejects unknown lexical forms unless explicitly supplied as known atoms", () => {
    expect(parseSurfaceExpression("unknownword").diagnostics[0]?.code).toBe("UNKNOWN_LEXICAL_FORM");
    expect(parseSurfaceExpression("knownword", { knownAtoms: ["knownword"] })).toMatchObject({
      ok: true,
      ast: { kind: "atom", form: "KNOWNWORD" }
    });
  });

  it("[SURF-014] rejects unresolved operator-like forms rather than guessing their arity", () => {
    expect(parseSurfaceExpression("nes ki sho").diagnostics[0]?.code).toBe("UNRESOLVED_OPERATOR");
    expect(parseSurfaceExpression("nes", { knownAtoms: ["nes"] }).diagnostics[0]?.code).toBe("UNRESOLVED_OPERATOR");
  });

  it("[SURF-015] fails closed on the known RE/RA homophone ambiguity", () => {
    expect(parseSurfaceExpression("re").diagnostics[0]?.code).toBe("AMBIGUOUS_HOMOPHONE");
    expect(parseSurfaceExpression("ra").diagnostics[0]?.code).toBe("AMBIGUOUS_HOMOPHONE");
    expect(parseSurfaceExpression("re ma").diagnostics[0]?.code).toBe("AMBIGUOUS_HOMOPHONE");
    expect(parseSurfaceExpression("ki ra").diagnostics[0]?.code).toBe("AMBIGUOUS_HOMOPHONE");
  });

  it("[SURF-016] does not rewrite canonical-looking operator forms by default", () => {
    expect(parseSurfaceExpression("frata ki sho to sho").diagnostics[0]?.code).toBe("UNRESOLVED_OPERATOR");
    expect(parseSurfaceExpression("fraka ki sho to sho").diagnostics[0]?.code).toBe("UNRESOLVED_OPERATOR");
    expect(parseSurfaceExpression("drim ki sho to sho").diagnostics[0]?.code).toBe("UNRESOLVED_OPERATOR");
    expect(parseSurfaceExpression("dral ki sho to sho mu sho").diagnostics[0]?.code).toBe("UNRESOLVED_OPERATOR");
  });

  it("[SURF-017] normalises legacy aliases only when explicitly enabled", () => {
    expect(parseSurfaceExpression("frata ki sho to sho", { allowLegacyAliases: true })).toMatchObject({
      ok: true,
      ast: { kind: "call", operator: "FRAJA" }
    });
  });

  it("[SURF-020] resolves all seven historical aliases only through explicit opt-in paths", () => {
    const rows: LexiconRow[] = [
      { form: "fraja", gloss: "subtract", cls: "ARITH", note: "was frata" },
      { form: "frama", gloss: "multiply", cls: "ARITH", note: "was fraka" },
      { form: "drum", gloss: "cross product", cls: "VEC", note: "was drim" },
      { form: "dras", gloss: "compare", cls: "COMP", note: "was dral" },
      { form: "grash", gloss: "Boolean NOT", cls: "LOGIC", note: "was grak" },
      { form: "kwash", gloss: "live evaluation", cls: "BIND", note: "was kwak" },
      { form: "ben", gloss: "region", cls: "GEOM", note: "was ren" }
    ];
    const explicitAliases = [
      { legacyForm: "frata", preferredForm: "fraja", evidence: "Phase 5.5 audit fixture" },
      { legacyForm: "fraka", preferredForm: "frama", evidence: "Phase 5.5 audit fixture" },
      { legacyForm: "drim", preferredForm: "drum", evidence: "Phase 5.5 audit fixture" },
      { legacyForm: "dral", preferredForm: "dras", evidence: "Phase 5.5 audit fixture" },
      { legacyForm: "grak", preferredForm: "grash", evidence: "Phase 5.5 audit fixture" },
      { legacyForm: "kwak", preferredForm: "kwash", evidence: "Phase 5.5 audit fixture" },
      { legacyForm: "ren", preferredForm: "ben", evidence: "Phase 5.5 audit fixture" }
    ];
    const lexiconRegistry = buildLexiconRegistry(rows, { sourceLabel: "alias conformance fixture", sourceVersion: "test-v1", explicitAliases });

    expect(parseSurfaceExpression("frata ki sho to sho", { allowLegacyAliases: true }).ast).toMatchObject({ operator: "FRAJA" });
    expect(parseSurfaceExpression("frata ki sho to sho", { lexiconRegistry }).diagnostics[0]?.code).toBe("UNRESOLVED_OPERATOR");
    expect(parseSurfaceExpression("frata ki sho to sho", { lexiconRegistry, allowLegacyAliases: true }).ast).toMatchObject({ operator: "FRAJA" });
    expect(parseSurfaceExpression("fraka ki sho to sho", { lexiconRegistry, allowLegacyAliases: true }).ast).toMatchObject({ operator: "FRAMA" });
    expect(parseSurfaceExpression("drim ki sho to sho", { lexiconRegistry, allowLegacyAliases: true }).ast).toMatchObject({ operator: "DRUM" });
    expect(parseSurfaceExpression("dral ki sho to sho gt", { lexiconRegistry, allowLegacyAliases: true }).ast).toMatchObject({ operator: "DRAS" });
    expect(parseSurfaceExpression("grak ki sho", { lexiconRegistry, allowLegacyAliases: true }).ast).toMatchObject({ operator: "GRASH" });
    expect(parseSurfaceExpression("kwak ki sho", { lexiconRegistry, allowLegacyAliases: true }).ast).toMatchObject({ operator: "KWASH" });
    expect(parseSurfaceExpression("ren", { lexiconRegistry, allowLegacyAliases: true }).ast).toMatchObject({ kind: "atom", form: "BEN", lexicalClass: "GEOM" });
  });

  it("[SURF-021] preserves original source spelling in alias-related diagnostics", () => {
    const registry = buildLexiconRegistry(
      [{ form: "fraja", gloss: "subtract", cls: "ARITH", note: "was frata" }],
      { sourceLabel: "diagnostic provenance fixture", sourceVersion: "test-v1" }
    );
    const result = parseSurfaceExpression("FRATA ki sho to sho", { lexiconRegistry: registry });
    expect(result.ok).toBe(false);
    expect(result.diagnostics[0]).toMatchObject({
      code: "UNRESOLVED_OPERATOR",
      sourceToken: "FRATA"
    });
  });

  it("[SURF-018] rejects block delimiters outside a control form", () => {
    expect(parseSurfaceExpression("meto ki sho dogu").diagnostics[0]?.code).toBe("BLOCK_DELIMITER_OUTSIDE_CONTROL");
  });

  it("[SURF-019] labels output as provisional surface notation, not audit notation", () => {
    expect(parseSurfaceExpression("ki ma").notation).toBe("phase-6g-provisional");
  });
});
