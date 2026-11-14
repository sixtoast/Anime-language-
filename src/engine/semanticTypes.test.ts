import { describe, expect, it } from "vitest";
import { getUnit } from "./dimensions";
import { checkImplicitCompatibility, semanticTypePrinciples, type SemanticValueType } from "./semanticTypes";

const length: SemanticValueType = { kind: "quantity", dimension: getUnit("MA").dimension };
const time: SemanticValueType = { kind: "quantity", dimension: getUnit("SE").dimension };

describe("conservative semantic type foundations", () => {
  it("[SEM-001] rejects implicit conversion between information and mana state", () => {
    expect(checkImplicitCompatibility({ kind: "information" }, { kind: "mana-state" }))
      .toEqual({ compatible: false, reason: "different-semantic-kind" });
  });

  it("[SEM-002] keeps energy, force, coupling and effect as distinct kinds", () => {
    const kinds = [
      { kind: "energy" }, { kind: "force" }, { kind: "coupling" }, { kind: "effect" }
    ] as const;
    for (let i = 0; i < kinds.length; i++) {
      for (let j = i + 1; j < kinds.length; j++) {
        expect(checkImplicitCompatibility(kinds[i], kinds[j]).compatible).toBe(false);
      }
    }
  });

  it("[SEM-003] accepts quantities with the same dimension vector for limited compatibility", () => {
    expect(checkImplicitCompatibility(length, { kind: "quantity", dimension: getUnit("MA").dimension }))
      .toEqual({ compatible: true, reason: "same-quantity-dimension" });
  });

  it("[SEM-004] rejects quantities with different dimension vectors", () => {
    expect(checkImplicitCompatibility(length, time))
      .toEqual({ compatible: false, reason: "different-quantity-dimension" });
  });

  it("[SEM-005] rejects unresolved types instead of assuming compatibility", () => {
    expect(checkImplicitCompatibility({ kind: "unknown", reason: "symbol not resolved" }, length))
      .toEqual({ compatible: false, reason: "unresolved-type" });
  });

  it("[SEM-006] checks component types for vector compatibility", () => {
    expect(checkImplicitCompatibility(
      { kind: "vector", component: length },
      { kind: "vector", component: time }
    )).toEqual({ compatible: false, reason: "different-quantity-dimension" });
  });

  it("[SEM-007] keeps unresolved binding payload types blocked", () => {
    expect(checkImplicitCompatibility(
      { kind: "binding", value: "unspecified" },
      { kind: "binding", value: "unspecified" }
    )).toEqual({ compatible: false, reason: "unresolved-type" });
  });

  it("[SEM-008] records measurement and assignment boundaries as principles", () => {
    expect(semanticTypePrinciples.find((item) => item.id === "TYPE-003")?.statement)
      .toContain("observation");
    expect(semanticTypePrinciples.find((item) => item.id === "TYPE-004")?.statement)
      .toContain("causing");
  });
});
