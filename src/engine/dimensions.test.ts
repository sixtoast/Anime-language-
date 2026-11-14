import { describe, expect, it } from "vitest";
import {
  addDimensions,
  subtractDimensions,
  addQuantities,
  divideQuantities,
  DIMENSIONLESS,
  getUnit,
  multiplyQuantities,
  QuantityError,
  sameDimension,
  subtractQuantities
} from "./dimensions";

describe("dimension algebra primitives", () => {
  it("[DIM-001] registers the canonical base-unit symbols from Arcane v3.0-L", () => {
    expect(getUnit("ma").symbol).toBe("MA");
    expect(getUnit("SE").symbol).toBe("SE");
    expect(getUnit("KE").symbol).toBe("KE");
    expect(getUnit("KU").symbol).toBe("KU");
    expect(getUnit("RA").symbol).toBe("RA");
  });

  it("[DIM-002] adds compatible quantities and preserves the left unit", () => {
    expect(addQuantities({ value: 2, unit: "MA" }, { value: 3, unit: "MA" }))
      .toEqual({ value: 5, unit: "MA" });
  });

  it("[DIM-003] rejects addition across incompatible dimensions", () => {
    expect(() => addQuantities({ value: 2, unit: "MA" }, { value: 3, unit: "SE" }))
      .toThrowError(QuantityError);
    try {
      addQuantities({ value: 2, unit: "MA" }, { value: 3, unit: "SE" });
    } catch (error) {
      expect(error).toMatchObject({ code: "DIMENSION_MISMATCH" });
    }
  });

  it("[DIM-004] subtracts compatible quantities without reordering operands", () => {
    expect(subtractQuantities({ value: 2, unit: "MA" }, { value: 5, unit: "MA" }))
      .toEqual({ value: -3, unit: "MA" });
  });

  it("[DIM-005] multiplies dimensions algebraically without inventing a derived unit", () => {
    const result = multiplyQuantities({ value: 3, unit: "MA" }, { value: 4, unit: "MA" });
    expect(result.value).toBe(12);
    expect(result.dimension).toEqual({
      length: 2, time: 0, mass: 0, temperature: 0, angle: 0
    });
  });

  it("[DIM-006] derives velocity dimensions from length divided by time", () => {
    const result = divideQuantities({ value: 12, unit: "MA" }, { value: 3, unit: "SE" });
    expect(result.value).toBe(4);
    expect(result.dimension).toEqual({
      length: 1, time: -1, mass: 0, temperature: 0, angle: 0
    });
  });

  it("[DIM-007] rejects division by zero", () => {
    expect(() => divideQuantities({ value: 1, unit: "MA" }, { value: 0, unit: "SE" }))
      .toThrowError(expect.objectContaining({ code: "DIVISION_BY_ZERO" }));
  });

  it("[DIM-008] does not treat an unknown unit as a known quantity", () => {
    expect(() => getUnit("FURLONG")).toThrowError(
      expect.objectContaining({ code: "UNKNOWN_UNIT" })
    );
  });

  it("[DIM-009] keeps radian dimensionless for dimensional algebra", () => {
    expect(sameDimension(getUnit("RA").dimension, DIMENSIONLESS)).toBe(true);
  });

  it("[DIM-010] supports pure dimension exponent operations", () => {
    const length = getUnit("MA").dimension;
    const time = getUnit("SE").dimension;
    expect(addDimensions(length, time)).toEqual({
      length: 1, time: 1, mass: 0, temperature: 0, angle: 0
    });
  });

  it("[DIM-011] rejects non-finite input quantities", () => {
    expect(() => addQuantities({ value: Number.NaN, unit: "MA" }, { value: 1, unit: "MA" }))
      .toThrowError(expect.objectContaining({ code: "NON_FINITE_VALUE" }));
    expect(() => subtractQuantities({ value: 1, unit: "MA" }, { value: Number.POSITIVE_INFINITY, unit: "MA" }))
      .toThrowError(expect.objectContaining({ code: "NON_FINITE_VALUE" }));
  });

  it("[DIM-012] rejects arithmetic that overflows to a non-finite result", () => {
    expect(() => addQuantities({ value: Number.MAX_VALUE, unit: "MA" }, { value: Number.MAX_VALUE, unit: "MA" }))
      .toThrowError(expect.objectContaining({ code: "NON_FINITE_RESULT" }));
  });

  it("[DIM-013] normalizes unit-symbol case without changing dimensions", () => {
    expect(getUnit("ma")).toMatchObject({ symbol: "MA", dimension: getUnit("MA").dimension });
    expect(addQuantities({ value: 2, unit: "ma" }, { value: 3, unit: "MA" }))
      .toEqual({ value: 5, unit: "MA" });
  });

  it("[DIM-014] subtracts dimension exponents component-wise", () => {
    expect(subtractDimensions(getUnit("MA").dimension, getUnit("SE").dimension)).toEqual({
      length: 1, time: -1, mass: 0, temperature: 0, angle: 0
    });
  });

  it("[DIM-015] reports non-finite multiplication results", () => {
    expect(() => multiplyQuantities({ value: Number.MAX_VALUE, unit: "MA" }, { value: 2, unit: "MA" }))
      .toThrowError(expect.objectContaining({ code: "NON_FINITE_RESULT" }));
  });
});
