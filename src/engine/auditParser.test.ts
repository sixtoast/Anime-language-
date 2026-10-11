import { describe, expect, it } from "vitest";
import { parseAuditExpression } from "./auditParser";

describe("Phase 2 provisional audit notation parser", () => {
  it("[PARSE-001] parses a binary operator with two arguments", () => {
    const result = parseAuditExpression("FRAPA⟨KI, TO⟩");
    expect(result.ok).toBe(true);
    expect(result.ast).toEqual({
      kind: "call",
      operator: "FRAPA",
      args: [{ kind: "symbol", value: "KI" }, { kind: "symbol", value: "TO" }]
    });
    expect(result.notation).toBe("phase-2-provisional");
  });

  it("[PARSE-002] preserves the nesting of a nested expression", () => {
    const result = parseAuditExpression("FRAPA⟨KI, FRAPA⟨TO, MU⟩⟩");
    expect(result.ok).toBe(true);
    expect(result.ast).toEqual({
      kind: "call",
      operator: "FRAPA",
      args: [
        { kind: "symbol", value: "KI" },
        { kind: "call", operator: "FRAPA", args: [
          { kind: "symbol", value: "TO" },
          { kind: "symbol", value: "MU" }
        ] }
      ]
    });
  });

  it("[PARSE-003] rejects missing arguments", () => {
    const result = parseAuditExpression("FRAPA⟨KI⟩");
    expect(result.ok).toBe(false);
    expect(result.diagnostics[0]?.code).toBe("ARITY_MISMATCH");
  });

  it("[PARSE-004] rejects extra arguments", () => {
    const result = parseAuditExpression("FRAPA⟨KI, TO, MU⟩");
    expect(result.ok).toBe(false);
    expect(result.diagnostics[0]?.code).toBe("ARITY_MISMATCH");
  });

  it("[PARSE-005] preserves order-sensitive operand order", () => {
    const left = parseAuditExpression("FRATA⟨KI, TO⟩");
    const right = parseAuditExpression("FRATA⟨TO, KI⟩");
    expect(left.ok && left.ast?.kind === "call" && left.ast.args[0]).toEqual({ kind: "symbol", value: "KI" });
    expect(right.ok && right.ast?.kind === "call" && right.ast.args[0]).toEqual({ kind: "symbol", value: "TO" });
  });

  it("[PARSE-006] rejects malformed separators instead of guessing", () => {
    const result = parseAuditExpression("FRAPA⟨KI TO⟩");
    expect(result.ok).toBe(false);
    expect(result.diagnostics.length).toBeGreaterThan(0);
  });

  it("[PARSE-007] rejects unknown operator arity rather than guessing", () => {
    const result = parseAuditExpression("BEK⟨KI, TO⟩");
    expect(result.ok).toBe(false);
    expect(result.diagnostics.some((d) => d.code === "UNKNOWN_ARITY")).toBe(true);
  });

  it("[PARSE-008] rejects trailing input", () => {
    const result = parseAuditExpression("FRAPA⟨KI, TO⟩ MU");
    expect(result.ok).toBe(false);
    expect(result.diagnostics.some((d) => d.code === "TRAILING_INPUT")).toBe(true);
  });

  it("[PARSE-009] reports empty input", () => {
    const result = parseAuditExpression("   ");
    expect(result.ok).toBe(false);
    expect(result.diagnostics[0]?.code).toBe("EMPTY_INPUT");
  });

  it("[PARSE-010] accepts unary and ternary operators at their provisional arities", () => {
    expect(parseAuditExpression("FRASHA⟨KI⟩").ok).toBe(true);
    expect(parseAuditExpression("DRAL⟨KI, TO, MU⟩").ok).toBe(true);
    expect(parseAuditExpression("DRAL⟨KI, TO⟩").diagnostics.some((d) => d.code === "ARITY_MISMATCH")).toBe(true);
  });

  it("[PARSE-011] normalizes operator and symbol case consistently", () => {
    const result = parseAuditExpression("frapa⟨ki, to⟩");
    expect(result.ok).toBe(true);
    expect(result.ast).toEqual({
      kind: "call",
      operator: "FRAPA",
      args: [{ kind: "symbol", value: "KI" }, { kind: "symbol", value: "TO" }]
    });
  });

  it("[PARSE-012] rejects a trailing comma instead of accepting an incomplete call", () => {
    const result = parseAuditExpression("FRAPA⟨KI,⟩");
    expect(result.ok).toBe(false);
    expect(result.diagnostics.length).toBeGreaterThan(0);
  });

  it("[PARSE-013] rejects an unclosed call", () => {
    const result = parseAuditExpression("FRAPA⟨KI, TO");
    expect(result.ok).toBe(false);
    expect(result.diagnostics.length).toBeGreaterThan(0);
  });

  it("[PARSE-014] rejects unsupported punctuation rather than silently discarding it", () => {
    const result = parseAuditExpression("FRAPA⟨KI; TO⟩");
    expect(result.ok).toBe(false);
    expect(result.diagnostics.some((d) => d.code === "EXPECTED_ARGUMENT")).toBe(true);
  });

  it("[PARSE-015] rejects an invalid nested expression without returning a partial AST", () => {
    const result = parseAuditExpression("FRAPA⟨KI, DRAL⟨TO, MU⟩⟩");
    expect(result.ok).toBe(false);
    expect(result.ast).toBeUndefined();
    expect(result.diagnostics.some((d) => d.code === "ARITY_MISMATCH")).toBe(true);
  });
});
