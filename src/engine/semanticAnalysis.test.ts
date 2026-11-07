import { describe, expect, it } from "vitest";
import { analyseSurfaceAst, analyseSurfaceParse } from "./semanticAnalysis";
import { parseSurfaceExpression, type SurfaceNode } from "./surfaceParser";

describe("Phase 6H-A conservative semantic analysis", () => {
  it("[SEM-A-001] annotates registered units with their registered dimensions", () => {
    const result = analyseSurfaceParse(parseSurfaceExpression("ki ma"));
    expect(result.status).toBe("valid");
    expect(result.typedAst?.type).toMatchObject({
      kind: "quantity",
      dimension: { length: 1, time: 0, mass: 0, temperature: 0, angle: 0 }
    });
    expect(result.diagnostics).toEqual([]);
  });

  it("[SEM-A-002] treats SHO as a provisional scalar convention", () => {
    const result = analyseSurfaceParse(parseSurfaceExpression("ki sho"));
    expect(result.status).toBe("valid");
    expect(result.typedAst?.type).toEqual({ kind: "scalar" });
    expect(result.limitations.some((item) => item.includes("SHO"))).toBe(true);
  });

  it("[SEM-A-003] keeps RA as the registered dimensionless quantity, not a SHO scalar", () => {
    // The Phase 6G parser intentionally rejects the RE/RA homophone collision;
    // exercise the semantic unit mapping directly without bypassing that gate.
    const result = analyseSurfaceAst({ kind: "quantity", value: "1", unit: "RA", rawNumber: "1" });
    expect(result.status).toBe("valid");
    expect(result.typedAst?.type).toMatchObject({
      kind: "quantity",
      dimension: { length: 0, time: 0, mass: 0, temperature: 0, angle: 0 }
    });
  });

  it("[SEM-A-004] leaves an unknown unit unresolved without guessing its dimension", () => {
    const ast: SurfaceNode = { kind: "quantity", value: "2", unit: "VO", rawNumber: "2" };
    const result = analyseSurfaceAst(ast);
    expect(result.status).toBe("unresolved");
    expect(result.typedAst?.type.kind).toBe("unknown");
    expect(result.diagnostics[0]?.code).toBe("SEMANTIC_UNKNOWN_UNIT");
  });

  it("[SEM-A-005] does not infer atom types from lexical class", () => {
    const result = analyseSurfaceAst({ kind: "atom", form: "FIRE", lexicalClass: "NOUN" });
    expect(result.status).toBe("unresolved");
    expect(result.diagnostics[0]?.code).toBe("SEMANTIC_ATOM_TYPE_UNRESOLVED");
  });

  it("[SEM-A-006] leaves identifiers unresolved without a binding environment", () => {
    const result = analyseSurfaceAst({ kind: "identifier", digits: "12" });
    expect(result.status).toBe("unresolved");
    expect(result.diagnostics[0]?.code).toBe("SEMANTIC_IDENTIFIER_UNRESOLVED");
  });

  it("[SEM-A-007] does not infer an operator signature from provisional parser arity", () => {
    const parsed = parseSurfaceExpression("frapa ki sho to sho");
    const result = analyseSurfaceParse(parsed);
    expect(result.status).toBe("unresolved");
    expect(result.diagnostics.some((item) => item.code === "SEMANTIC_SIGNATURE_UNRESOLVED")).toBe(true);
    expect(result.typedAst?.source).toEqual(parsed.ast);
  });

  it("[SEM-A-008] preserves exact operator identity and does not silently canonicalise aliases", () => {
    const ast: SurfaceNode = {
      kind: "call",
      operator: "FRAJA",
      args: [
        { kind: "quantity", value: "1", unit: "SHO", rawNumber: "1" },
        { kind: "quantity", value: "2", unit: "SHO", rawNumber: "2" }
      ]
    };
    const result = analyseSurfaceAst(ast);
    expect(result.status).toBe("unresolved");
    expect(result.diagnostics.some((item) =>
      item.code === "SEMANTIC_OPERATOR_UNKNOWN" && item.subject === "FRAJA"
    )).toBe(true);
    expect(result.typedAst?.source).toEqual(ast);
  });

  it("[SEM-A-009] requires successful parsing before semantic analysis", () => {
    const result = analyseSurfaceParse(parseSurfaceExpression("unknownword"));
    expect(result.status).toBe("invalid");
    expect(result.typedAst).toBeUndefined();
    expect(result.diagnostics[0]?.code).toBe("SEMANTIC_PARSE_REQUIRED");
  });

  it("[SEM-A-010] preserves nested AST shape and deterministic diagnostic order", () => {
    const ast: SurfaceNode = {
      kind: "call",
      operator: "FRAPA",
      args: [
        { kind: "atom", form: "A", lexicalClass: "NOUN" },
        { kind: "identifier", digits: "3" }
      ]
    };
    const first = analyseSurfaceAst(ast);
    const second = analyseSurfaceAst(ast);
    expect(first).toEqual(second);
    expect(first.typedAst?.children?.map((child) => child.source.kind)).toEqual(["atom", "identifier"]);
    expect(first.diagnostics.map((item) => item.code)).toEqual([
      "SEMANTIC_ATOM_TYPE_UNRESOLVED",
      "SEMANTIC_IDENTIFIER_UNRESOLVED",
      "SEMANTIC_SIGNATURE_UNRESOLVED"
    ]);
  });

  it("[SEM-A-011] marks a non-finite quantity as invalid", () => {
    const result = analyseSurfaceAst({ kind: "quantity", value: "Infinity", unit: "MA", rawNumber: "Infinity" });
    expect(result.status).toBe("invalid");
    expect(result.diagnostics[0]?.code).toBe("SEMANTIC_NON_FINITE_QUANTITY");
  });

  it("[SEM-A-012] keeps block results unresolved while annotating contained expressions", () => {
    const result = analyseSurfaceAst({
      kind: "block",
      expressions: [{ kind: "quantity", value: "4", unit: "SHO", rawNumber: "4" }]
    });
    expect(result.status).toBe("unresolved");
    expect(result.typedAst?.children?.[0]?.type).toEqual({ kind: "scalar" });
    expect(result.diagnostics[0]?.code).toBe("SEMANTIC_BLOCK_RESULT_UNRESOLVED");
  });
});


describe("versioned operator identity in semantic analysis", () => {
  it("[SEM-A-013] resolves a renamed operator identity without losing its entered spelling", () => {
    const parsed = parseSurfaceExpression("frata ki sho to sho", {
      operatorProfile: "phase4-renamed",
      allowLegacyAliases: true
    });
    const result = analyseSurfaceParse(parsed);
    expect(result.status).toBe("unresolved");
    expect(result.diagnostics.some((item) =>
      item.code === "SEMANTIC_SIGNATURE_UNRESOLVED" && item.subject === "FRATA"
    )).toBe(true);
    expect(result.diagnostics.some((item) => item.code === "SEMANTIC_OPERATOR_UNKNOWN")).toBe(false);
    expect(result.typedAst?.source).toMatchObject({
      operator: "FRAJA", surfaceForm: "FRATA", operatorId: "subtract"
    });
  });
});
