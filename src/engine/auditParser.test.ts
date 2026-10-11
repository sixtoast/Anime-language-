import { describe, expect, it } from "vitest";
import { parseAuditExpression } from "./auditParser";

describe("Phase 2 provisional audit notation parser", () => {
  it("parses a binary operator with two arguments", () => {
    const result = parseAuditExpression("FRAPA⟨KI, TO⟩");
    expect(result.ok).toBe(true);
    expect(result.ast).toEqual({
      kind: "call",
      operator: "FRAPA",
      args: [{ kind: "symbol", value: "KI" }, { kind: "symbol", value: "TO" }]
    });
    expect(result.notation).toBe("phase-2-provisional");
  });

  it("preserves the nesting of a nested expression", () => {
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

  it("rejects missing arguments", () => {
    const result = parseAuditExpression("FRAPA⟨KI⟩");
    expect(result.ok).toBe(false);
    expect(result.diagnostics[0]?.code).toBe("ARITY_MISMATCH");
  });

  it("rejects extra arguments", () => {
    const result = parseAuditExpression("FRAPA⟨KI, TO, MU⟩");
    expect(result.ok).toBe(false);
    expect(result.diagnostics[0]?.code).toBe("ARITY_MISMATCH");
  });

  it("preserves order-sensitive operand order", () => {
    const left = parseAuditExpression("FRATA⟨KI, TO⟩");
    const right = parseAuditExpression("FRATA⟨TO, KI⟩");
    expect(left.ok && left.ast?.kind === "call" && left.ast.args[0]).toEqual({ kind: "symbol", value: "KI" });
    expect(right.ok && right.ast?.kind === "call" && right.ast.args[0]).toEqual({ kind: "symbol", value: "TO" });
  });

  it("rejects malformed separators instead of guessing", () => {
    const result = parseAuditExpression("FRAPA⟨KI TO⟩");
    expect(result.ok).toBe(false);
    expect(result.diagnostics.length).toBeGreaterThan(0);
  });

  it("rejects unknown operator arity rather than guessing", () => {
    const result = parseAuditExpression("BEK⟨KI, TO⟩");
    expect(result.ok).toBe(false);
    expect(result.diagnostics.some((d) => d.code === "UNKNOWN_ARITY")).toBe(true);
  });

  it("rejects trailing input", () => {
    const result = parseAuditExpression("FRAPA⟨KI, TO⟩ MU");
    expect(result.ok).toBe(false);
    expect(result.diagnostics.some((d) => d.code === "TRAILING_INPUT")).toBe(true);
  });

  it("reports empty input", () => {
    const result = parseAuditExpression("   ");
    expect(result.ok).toBe(false);
    expect(result.diagnostics[0]?.code).toBe("EMPTY_INPUT");
  });
});
