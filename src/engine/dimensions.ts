/**
 * Dimension algebra primitives for the future semantic layer.
 *
 * This module is deliberately NOT connected to Arcane operator evaluation:
 * Phase 2 does not yet define complete unit-conversion, numeric literal, or
 * quantity semantics. It provides reusable, explicit dimensional operations
 * without asserting that every operation is already canonical Arcane.
 */

export type DimensionName = "length" | "time" | "mass" | "temperature" | "angle";

export type DimensionVector = Readonly<{
  length: number;
  time: number;
  mass: number;
  temperature: number;
  angle: number;
}>;

export interface UnitDefinition {
  symbol: string;
  dimension: DimensionVector;
  /** Scale to the chosen base unit for this dimension. */
  scaleToBase: number;
  status: "canonical-unit" | "derived-unit";
  note?: string;
}

export interface Quantity {
  value: number;
  unit: string;
}

export type QuantityErrorCode =
  | "UNKNOWN_UNIT"
  | "NON_FINITE_VALUE"
  | "DIMENSION_MISMATCH"
  | "DIVISION_BY_ZERO"
  | "NON_FINITE_RESULT";

export class QuantityError extends Error {
  constructor(public readonly code: QuantityErrorCode, message: string) {
    super(message);
    this.name = "QuantityError";
  }
}

const ZERO = 0;
const ONE = 1;

export const DIMENSIONLESS: DimensionVector = Object.freeze({
  length: ZERO, time: ZERO, mass: ZERO, temperature: ZERO, angle: ZERO
});

export const UNITS: Readonly<Record<string, UnitDefinition>> = Object.freeze({
  MA: {
    symbol: "MA",
    dimension: { length: ONE, time: ZERO, mass: ZERO, temperature: ZERO, angle: ZERO },
    scaleToBase: ONE,
    status: "canonical-unit",
    note: "Arcane v3.0-L identifies MA as metre."
  },
  SE: {
    symbol: "SE",
    dimension: { length: ZERO, time: ONE, mass: ZERO, temperature: ZERO, angle: ZERO },
    scaleToBase: ONE,
    status: "canonical-unit",
    note: "Arcane v3.0-L identifies SE as second."
  },
  KE: {
    symbol: "KE",
    dimension: { length: ZERO, time: ZERO, mass: ONE, temperature: ZERO, angle: ZERO },
    scaleToBase: ONE,
    status: "canonical-unit",
    note: "Arcane v3.0-L identifies KE as kilogram."
  },
  KU: {
    symbol: "KU",
    dimension: { length: ZERO, time: ZERO, mass: ZERO, temperature: ONE, angle: ZERO },
    scaleToBase: ONE,
    status: "canonical-unit",
    note: "Arcane v3.0-L identifies KU as kelvin."
  },
  RA: {
    symbol: "RA",
    dimension: DIMENSIONLESS,
    scaleToBase: ONE,
    status: "canonical-unit",
    note: "Arcane v3.0-L identifies RA as radian; represented dimensionlessly here for SI-style dimensional algebra."
  }
});

export function getUnit(symbol: string): UnitDefinition {
  const unit = UNITS[symbol.toUpperCase()];
  if (!unit) throw new QuantityError("UNKNOWN_UNIT", `Unknown registered unit: ${symbol}`);
  return unit;
}

export function sameDimension(a: DimensionVector, b: DimensionVector): boolean {
  return a.length === b.length &&
    a.time === b.time &&
    a.mass === b.mass &&
    a.temperature === b.temperature &&
    a.angle === b.angle;
}

export function addDimensions(a: DimensionVector, b: DimensionVector): DimensionVector {
  return {
    length: a.length + b.length,
    time: a.time + b.time,
    mass: a.mass + b.mass,
    temperature: a.temperature + b.temperature,
    angle: a.angle + b.angle
  };
}

export function subtractDimensions(a: DimensionVector, b: DimensionVector): DimensionVector {
  return {
    length: a.length - b.length,
    time: a.time - b.time,
    mass: a.mass - b.mass,
    temperature: a.temperature - b.temperature,
    angle: a.angle - b.angle
  };
}

function assertFinite(value: number, label: string): void {
  if (!Number.isFinite(value)) {
    throw new QuantityError("NON_FINITE_VALUE", `${label} must be a finite number.`);
  }
}

function assertSameDimension(a: Quantity, b: Quantity): UnitDefinition {
  const unitA = getUnit(a.unit);
  const unitB = getUnit(b.unit);
  if (!sameDimension(unitA.dimension, unitB.dimension)) {
    throw new QuantityError(
      "DIMENSION_MISMATCH",
      `Cannot combine ${a.unit} and ${b.unit}: their dimensions differ.`
    );
  }
  return unitA;
}

/** Adds quantities after converting the right operand to the left unit. */
export function addQuantities(a: Quantity, b: Quantity): Quantity {
  assertFinite(a.value, "Left quantity");
  assertFinite(b.value, "Right quantity");
  const unitA = assertSameDimension(a, b);
  const unitB = getUnit(b.unit);
  const baseA = a.value * unitA.scaleToBase;
  const baseB = b.value * unitB.scaleToBase;
  const value = (baseA + baseB) / unitA.scaleToBase;
  if (!Number.isFinite(value)) throw new QuantityError("NON_FINITE_RESULT", "Addition produced a non-finite result.");
  return { value, unit: unitA.symbol };
}

/** Subtracts quantities after converting the right operand to the left unit. */
export function subtractQuantities(a: Quantity, b: Quantity): Quantity {
  assertFinite(a.value, "Left quantity");
  assertFinite(b.value, "Right quantity");
  const unitA = assertSameDimension(a, b);
  const unitB = getUnit(b.unit);
  const value = (a.value * unitA.scaleToBase - b.value * unitB.scaleToBase) / unitA.scaleToBase;
  if (!Number.isFinite(value)) throw new QuantityError("NON_FINITE_RESULT", "Subtraction produced a non-finite result.");
  return { value, unit: unitA.symbol };
}

/**
 * Multiplies values and returns the algebraic dimension vector. A concrete
 * output unit is intentionally not selected because derived-unit vocabulary
 * and canonical spellings have not been finalised.
 */
export function multiplyQuantities(a: Quantity, b: Quantity): { value: number; dimension: DimensionVector } {
  assertFinite(a.value, "Left quantity");
  assertFinite(b.value, "Right quantity");
  const unitA = getUnit(a.unit);
  const unitB = getUnit(b.unit);
  const value = a.value * unitA.scaleToBase * b.value * unitB.scaleToBase;
  if (!Number.isFinite(value)) throw new QuantityError("NON_FINITE_RESULT", "Multiplication produced a non-finite result.");
  return { value, dimension: addDimensions(unitA.dimension, unitB.dimension) };
}

/**
 * Divides values and returns algebraic dimensions. A concrete output unit is
 * intentionally not selected pending the canonical derived-unit inventory.
 */
export function divideQuantities(a: Quantity, b: Quantity): { value: number; dimension: DimensionVector } {
  assertFinite(a.value, "Left quantity");
  assertFinite(b.value, "Right quantity");
  if (b.value === ZERO) throw new QuantityError("DIVISION_BY_ZERO", "A quantity cannot be divided by zero.");
  const unitA = getUnit(a.unit);
  const unitB = getUnit(b.unit);
  const value = (a.value * unitA.scaleToBase) / (b.value * unitB.scaleToBase);
  if (!Number.isFinite(value)) throw new QuantityError("NON_FINITE_RESULT", "Division produced a non-finite result.");
  return { value, dimension: subtractDimensions(unitA.dimension, unitB.dimension) };
}
