/**
 * Semantic type vocabulary for the future Arcane semantic layer.
 *
 * This module defines distinctions that the canon requires the implementation
 * to preserve. It intentionally does not evaluate operators or connect to the
 * Phase 2 audit parser: many signatures, conversions and binding rules remain
 * provisional or unresolved.
 */
import type { DimensionVector } from "./dimensions";

export type SemanticValueType =
  | { kind: "quantity"; dimension: DimensionVector }
  | { kind: "scalar" }
  | { kind: "boolean" }
  | { kind: "vector"; component: SemanticValueType }
  | { kind: "observation"; observed: SemanticValueType | "unspecified" }
  | { kind: "information" }
  | { kind: "mana-state" }
  | { kind: "energy" }
  | { kind: "force" }
  | { kind: "coupling" }
  | { kind: "effect" }
  | { kind: "reference"; target: SemanticValueType | "unspecified" }
  | { kind: "binding"; value: SemanticValueType | "unspecified" }
  | { kind: "temporal-value" }
  | { kind: "constraint" }
  | { kind: "control-expression" }
  | { kind: "unknown"; reason: string };

export type TypeCompatibility =
  | { compatible: true; reason: "same-semantic-type" | "same-quantity-dimension" }
  | { compatible: false; reason: "different-semantic-kind" | "different-quantity-dimension" | "unresolved-type" };

/**
 * Conservative implicit-compatibility policy.
 *
 * This answers only whether two values may be treated as the same type without
 * an explicit conversion. It does NOT define whether an operator accepts them.
 * Equal quantity dimensions are compatible for this limited purpose; canonical
 * unit conversion and operator-specific constraints remain separate concerns.
 */
export function checkImplicitCompatibility(
  left: SemanticValueType,
  right: SemanticValueType
): TypeCompatibility {
  if (left.kind === "unknown" || right.kind === "unknown") {
    return { compatible: false, reason: "unresolved-type" };
  }

  if (left.kind !== right.kind) {
    return { compatible: false, reason: "different-semantic-kind" };
  }

  if (left.kind === "quantity" && right.kind === "quantity") {
    const a = left.dimension;
    const b = right.dimension;
    const same = a.length === b.length &&
      a.time === b.time &&
      a.mass === b.mass &&
      a.temperature === b.temperature &&
      a.angle === b.angle;
    return same
      ? { compatible: true, reason: "same-quantity-dimension" }
      : { compatible: false, reason: "different-quantity-dimension" };
  }

  // Same outer kind does not establish compatibility for structured types:
  // references, bindings and vectors may carry different target/component types.
  if (left.kind === "vector" && right.kind === "vector") {
    return checkImplicitCompatibility(left.component, right.component);
  }
  if (left.kind === "reference" && right.kind === "reference") {
    if (left.target === "unspecified" || right.target === "unspecified") {
      return { compatible: false, reason: "unresolved-type" };
    }
    return checkImplicitCompatibility(left.target, right.target);
  }
  if (left.kind === "binding" && right.kind === "binding") {
    if (left.value === "unspecified" || right.value === "unspecified") {
      return { compatible: false, reason: "unresolved-type" };
    }
    return checkImplicitCompatibility(left.value, right.value);
  }
  if (left.kind === "observation" && right.kind === "observation") {
    if (left.observed === "unspecified" || right.observed === "unspecified") {
      return { compatible: false, reason: "unresolved-type" };
    }
    return checkImplicitCompatibility(left.observed, right.observed);
  }

  return { compatible: true, reason: "same-semantic-type" };
}

export interface SemanticTypePrinciple {
  id: string;
  title: string;
  status: "canon-required" | "implementation-boundary" | "specification-open";
  statement: string;
}

export const semanticTypePrinciples: readonly SemanticTypePrinciple[] = [
  {
    id: "TYPE-001",
    title: "Information is not mana",
    status: "canon-required",
    statement: "Information and mana-state values have distinct semantic kinds; neither is implicitly converted to the other."
  },
  {
    id: "TYPE-002",
    title: "Energy, force, coupling and effect remain distinct",
    status: "canon-required",
    statement: "Energy, force, coupling and effect are represented as separate semantic kinds, not aliases for a generic magical value."
  },
  {
    id: "TYPE-003",
    title: "Measurement produces an observation",
    status: "canon-required",
    statement: "SIMA is canonically described as producing an observation; a complete executable signature and measurement-pathway model remain unfinished."
  },
  {
    id: "TYPE-004",
    title: "Assignment is not physical causation",
    status: "canon-required",
    statement: "A symbolic assignment must not be interpreted as causing the represented physical state to occur."
  },
  {
    id: "TYPE-005",
    title: "Quantity dimensions constrain compatibility",
    status: "implementation-boundary",
    statement: "The standalone dimension algebra can compare quantity dimensions, but operator-specific acceptance and conversion rules are not connected."
  },
  {
    id: "TYPE-006",
    title: "Bindings require explicit evaluation rules",
    status: "specification-open",
    statement: "Binding/reference/live-evaluation categories are distinct, but identifier syntax, scope, lifetime, mutability and timing remain unresolved."
  },
  {
    id: "TYPE-007",
    title: "Operator signatures are not inferred",
    status: "specification-open",
    statement: "This module does not invent signatures for operators whose complete input/output contracts are not established."
  }
] as const;
