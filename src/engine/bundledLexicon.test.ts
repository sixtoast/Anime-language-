import { describe, expect, it } from "vitest";
import { bundledLexiconLoad, BUNDLED_LEXICON_SOURCE } from "./bundledLexicon";
import { parseSurfaceExpression } from "./surfaceParser";

describe("bundled source lexicon snapshot", () => {
  it("records the exact repository source identity without asserting canonical promotion", () => {
    expect(BUNDLED_LEXICON_SOURCE.canonEffect).toBe("none");
    expect(BUNDLED_LEXICON_SOURCE.version).toBe("v5-draft");
    expect(bundledLexiconLoad.rowCount).toBeGreaterThan(0);
    expect(bundledLexiconLoad.aliasRowCount).toBeGreaterThan(0);
  });

  it("preserves the documented RE and RA collisions in the loaded source", () => {
    expect(bundledLexiconLoad.registry.collisions.has("re")).toBe(true);
    expect(bundledLexiconLoad.registry.collisions.has("ra")).toBe(true);
  });

  it("does not silently admit malformed CSV records into the registry", () => {
    expect(bundledLexiconLoad.sourceDiagnostics.some((item) => item.includes("record excluded"))).toBe(true);
  });

  it("can parse a source-backed lexical atom when a registry is explicitly supplied", () => {
    const result = parseSurfaceExpression("pa", { lexiconRegistry: bundledLexiconLoad.registry });
    expect(result.ok).toBe(true);
    expect(result.ast).toMatchObject({ kind: "atom", form: "PA", lexicalClass: "AXIS" });
  });

  it("keeps ambiguous source-backed homophones fail-closed", () => {
    expect(parseSurfaceExpression("ra", { lexiconRegistry: bundledLexiconLoad.registry }).diagnostics[0]?.code)
      .toBe("AMBIGUOUS_HOMOPHONE");
  });

  it("only resolves a source-backed legacy alias when explicitly enabled", () => {
    const sourceAlias = bundledLexiconLoad.registry.aliases.get("frata");
    expect(sourceAlias?.preferredForm).toBe("fraja");
    expect(parseSurfaceExpression("frata ki sho to sho", { lexiconRegistry: bundledLexiconLoad.registry }).diagnostics[0]?.code)
      .toBe("UNRESOLVED_OPERATOR");
    const enabled = parseSurfaceExpression("frata ki sho to sho", {
      lexiconRegistry: bundledLexiconLoad.registry,
      allowLegacyAliases: true
    });
    expect(enabled.ok).toBe(true);
    expect(enabled.ast).toMatchObject({ kind: "call", operator: "FRAJA" });
  });
});
