import { describe, expect, it } from "vitest";
import { getOperatorContract, operatorContracts, operatorContractPrinciples } from "./operatorContracts";
import { parseAuditExpression } from "./auditParser";

describe("Source-traceable operator contract registry", () => {
  it("[OPC-001] records only the nine provisional Phase 2 arities", () => {
    const known = ["FRAPA", "FRATA", "FRAKA", "FRALA", "FRASHA", "DRAN", "DREM", "DRIM", "DRAL"];
    expect(known.every((name) => getOperatorContract(name)?.arityStatus === "provisional-audit-signature")).toBe(true);
    expect(known.map((name) => getOperatorContract(name)?.arity)).toEqual([2, 2, 2, 2, 1, 1, 2, 2, 3]);
  });

  it("[OPC-002] does not invent executable input or output types", () => {
    for (const contract of operatorContracts.filter((item) => item.arityStatus === "provisional-audit-signature")) {
      expect(contract.inputTypes).toBeNull();
      expect(contract.outputType).toBeNull();
    }
  });

  it("[OPC-003] marks SIMA's observation result while keeping its signature incomplete", () => {
    const sima = getOperatorContract("sima");
    expect(sima?.outputType).toBe("observation (canon-described)");
    expect(sima?.arity).toBeNull();
    expect(sima?.arityStatus).toBe("canon-described-incomplete");
  });

  it("[OPC-004] leaves conceptual operators unresolved when arity is not established", () => {
    for (const name of ["NES", "GAMA", "DAVE", "KWAM", "KWAT", "KWAK", "GRAN", "GRAT", "GRAK", "BEK", "ZET"]) {
      expect(getOperatorContract(name)?.arity).toBeNull();
      expect(getOperatorContract(name)?.arityStatus).toBe("unresolved");
    }
  });

  it("[OPC-005] records source anchors and open questions for every contract", () => {
    expect(operatorContracts.length).toBeGreaterThanOrEqual(20);
    for (const contract of operatorContracts) {
      expect(contract.source.length).toBeGreaterThan(0);
      expect(contract.openQuestions.length).toBeGreaterThan(0);
    }
  });

  it("[OPC-006] lookup normalizes case and surrounding whitespace", () => {
    expect(getOperatorContract(" frapa ")?.operator).toBe("FRAPA");
    expect(getOperatorContract("not-an-operator")).toBeUndefined();
  });

  it("[OPC-007] exposes safeguards against inferred signatures and conflated concepts", () => {
    expect(operatorContractPrinciples.map((principle) => principle.id)).toEqual(["OPCON-001", "OPCON-002", "OPCON-003", "OPCON-004"]);
  });

  it("[OPC-009] exposes FRASHA semantic and numeral-sign uncertainty without enabling execution", () => {
    const frasha = getOperatorContract("FRASHA");
    expect(frasha?.arityStatus).toBe("provisional-audit-signature");
    expect(frasha?.evaluationRule).toContain("historical negate-versus-absolute-value mismatch");
    expect(frasha?.openQuestions.some((question) => question.includes("negative numeral sign"))).toBe(true);
    expect(frasha?.openQuestions.some((question) => question.includes("Boolean NOT"))).toBe(true);
  });

  it("[OPC-010] confirms FRASHA audit parsing produces structure, not a computed value", () => {
    const result = parseAuditExpression("FRASHA⟨KI⟩");
    expect(result.ok).toBe(true);
    expect(result.notation).toBe("phase-2-provisional");
    expect(result.ast).toEqual({ kind: "call", operator: "FRASHA", args: [{ kind: "symbol", value: "KI" }] });
    expect(result).not.toHaveProperty("value");
  });

  it("[OPC-008] keeps dimensional and evaluation rules explicitly non-executable", () => {
    for (const contract of operatorContracts) {
      expect(contract.dimensionalRule.length).toBeGreaterThan(0);
      expect(contract.evaluationRule.length).toBeGreaterThan(0);
    }
  });
});
