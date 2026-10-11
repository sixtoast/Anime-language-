import { describe, expect, it } from "vitest";
import {
  addDimensions,
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
  it("registers the canonical base-unit symbols from Arcane v3.0-L", () => {
    expect(getUnit("ma").symbol).toBe("MA");
    expect(getUnit("SE").symbol).toBe("SE");
    expect(getUnit("KE").symbol).toBe("KE");
    expect(getUnit("KU").symbol).toBe("KU");
    expect(getUnit("RA").symbol).toBe("RA");
  });

  it("adds compatible quantities and preserves the left unit", () => {
    expect(addQuantities({ value: 2, unit: "MA" }, { value: 3, unit: "MA" }))
      .toEqual({ value: 5, unit: "MA" });
  });

  it("rejects addition across incompatible dimensions", () => {
    expect(() => addQuantities({ value: 2, unit: "MA" }, { value: 3, unit: "SE" }))
      .toThrowError(QuantityError);
    try {
      addQuantities({ value: 2, unit: "MA" }, { value: 3, unit: "SE" });
    } catch (error) {
      expect(error).toMatchObject({ code: "DIMENSION_MISMATCH" });
    }
  });

  it("subtracts compatible quantities without reordering operands", () => {
    expect(subtractQuantities({ value: 2, unit: "MA" }, { value: 5, unit: "MA" }))
      .toEqual({ value: -3, unit: "MA" });
  });

  it("multiplies dimensions algebraically without inventing a derived unit", () => {
    const result = multiplyQuantities({ value: 3, unit: "MA" }, { value: 4, unit: "MA" });
    expect(result.value).toBe(12);
    expect(result.dimension).toEqual({
      length: 2, time: 0, mass: 0, temperature: 0, angle: 0
    });
  });

  it("derives velocity dimensions from length divided by time", () => {
    const result = divideQuantities({ value: 12, unit: "MA" }, { value: 3, unit: "SE" });
    expect(result.value).toBe(4);
    expect(result.dimension).toEqual({
      length: 1, time: -1, mass: 0, temperature: 0, angle: 0
    });
  });

  it("rejects division by zero", () => {
    expect(() => divideQuantities({ value: 1, unit: "MA" }, { value: 0, unit: "SE" }))
      .toThrowError(expect.objectContaining({ code: "DIVISION_BY_ZERO" }));
  });

  it("does not treat an unknown unit as a known quantity", () => {
    expect(() => getUnit("FURLONG")).toThrowError(
      expect.objectContaining({ code: "UNKNOWN_UNIT" })
    );
  });

  it("keeps radian dimensionless for dimensional algebra", () => {
    expect(sameDimension(getUnit("RA").dimension, DIMENSIONLESS)).toBe(true);
  });

  it("supports pure dimension exponent operations", () => {
    const length = getUnit("MA").dimension;
    const time = getUnit("SE").dimension;
    expect(addDimensions(length, time)).toEqual({
      length: 1, time: 1, mass: 0, temperature: 0, angle: 0
    });
  });
});
