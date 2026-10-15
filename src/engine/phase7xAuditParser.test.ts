import { describe, expect, it } from "vitest";
import { parseAuditExpression } from "./auditParser";

describe("Phase 7X parser diagnostic consistency (provisional Phase 2 notation)", () => {
  it("returns a stable empty-input diagnostic", () => {
    const result = parseAuditExpression(" \n  ");
    expect(result.ok).toBe(false);
    expect(result.diagnostics[0]).toMatchObject({
      code: "EMPTY_INPUT",
      offset: 0
    });
    expect(result.notation).toBe("phase-2-provisional");
  });

  it("does not return a partial AST when a nested call has invalid arity", () => {
    const result = parseAuditExpression("FRAPA⟨KI, DRAL⟨TO, MU⟩⟩");
    expect(result.ok).toBe(false);
    expect(result.ast).toBeUndefined();
    expect(result.diagnostics.some((item) => item.code === "ARITY_MISMATCH")).toBe(true);
  });

  it("reports the source offset for unsupported punctuation", () => {
    const input = "FRAPA⟨KI; TO⟩";
    const result = parseAuditExpression(input);
    expect(result.ok).toBe(false);
    expect(result.diagnostics).toContainEqual(expect.objectContaining({
      code: "EXPECTED_ARGUMENT",
      offset: input.indexOf(";")
    }));
  });

  it("rejects an empty operator call instead of accepting zero arguments", () => {
    const result = parseAuditExpression("FRAPA⟨⟩");
    expect(result.ok).toBe(false);
    expect(result.diagnostics.some((item) => item.code === "EXPECTED_ARGUMENT")).toBe(true);
  });

  it("rejects an unclosed nested call without exposing a successful AST", () => {
    const result = parseAuditExpression("FRAPA⟨KI, FRATA⟨TO, MU⟩");
    expect(result.ok).toBe(false);
    expect(result.ast).toBeUndefined();
    expect(result.diagnostics.length).toBeGreaterThan(0);
  });

  it("keeps unknown operator signatures explicit instead of guessing arity", () => {
    const result = parseAuditExpression("UNKNOWN⟨KI, TO⟩");
    expect(result.ok).toBe(false);
    expect(result.diagnostics.some((item) => item.code === "UNKNOWN_ARITY")).toBe(true);
  });

  it("rejects trailing input after a complete call", () => {
    const result = parseAuditExpression("FRAPA⟨KI, TO⟩ EXTRA");
    expect(result.ok).toBe(false);
    expect(result.diagnostics.some((item) => item.code === "TRAILING_INPUT")).toBe(true);
  });
});
