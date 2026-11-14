import { describe, expect, it } from "vitest";
import { parseModernVernacular, parseModernVernacularV26 } from "./modernVernacular";

describe("Modern Vernacular v2.6 typed measurement quantities", () => {
  it.each([
    ["ki ma", 1, "ma", "LENGTH", false],
    ["mu shi sa ma", 3.5, "ma", "LENGTH", false],
    ["nela to ma", 2, "ma", "LENGTH", true],
    ["ki to se", 12, "se", "TIME", false],
    ["to shi sa ke", 2.5, "ke", "MASS", false],
    ["mu ra", 3, "ra", "PLANE_ANGLE", false],
    ["ki shi za ku", 1, "ku", "THERMODYNAMIC_TEMPERATURE", false],
    ["nela pe shi pe se", 9.9, "se", "TIME", true],
    ["to za ma", 20, "ma", "LENGTH", false],
    ["mu fi ke", 36, "ke", "MASS", false],
    ["pe pe pe pe ma", 9999, "ma", "LENGTH", false],
    ["to shi za ma", 2, "ma", "LENGTH", false]
  ] as const)("parses %s as a typed quantity", (input, value, unit, dimension, approximate) => {
    const result = parseModernVernacularV26(input);
    expect(result.ok).toBe(true);
    expect(result.ast?.value).toBe(value);
    expect(result.ast?.unit).toBe(unit);
    expect(result.ast?.dimension).toBe(dimension);
    expect(result.ast?.approximate).toBe(approximate);
  });

  it.each([
    ["za ma", "zero value"],
    ["za ki ma", "leading zero"],
    ["pe pe pe pe pe ma", "more than four integer digits"],
    ["to shi ma", "empty fractional part"],
    ["to shi sa fi re du ma", "more than three fractional digits"],
    ["nela", "approximation without a quantity"],
    ["to ma se", "chained units"],
    ["to shi sa", "missing unit"],
    ["to shi za", "missing unit after decimal"],
    ["nela nela to ma", "repeated approximation marker"],
    ["to shi za shi sa ma", "repeated decimal separator"],
    ["vobi to ma", "unlicensed Formal comparison form"]
  ])("[MV26-004] rejects %s (%s)", input => {
    expect(parseModernVernacularV26(input).ok).toBe(false);
  });

  it("[MV26-005] dispatches standalone quantities through the unified language entry point", () => {
    const result = parseModernVernacular("nela to shi sa ke");
    expect(result.ok).toBe(true);
    expect(result.grammar).toBe("modern-vernacular-v2.6-locked");
  });

  it("[MV26-002] preserves bounded integer and fractional quantity values", () => {
    expect(parseModernVernacularV26("pe pe pe pe ma").ast?.scaledValue).toBe(9999000);
    expect(parseModernVernacularV26("to shi sa ke").ast?.scaledValue).toBe(2500);
  });

  it("[MV26-003] keeps the five canonical unit dimensions distinct", () => {
    expect(parseModernVernacularV26("ki ma").ast?.dimension).toBe("LENGTH");
    expect(parseModernVernacularV26("ki se").ast?.dimension).toBe("TIME");
    expect(parseModernVernacularV26("ki ke").ast?.dimension).toBe("MASS");
    expect(parseModernVernacularV26("ki ra").ast?.dimension).toBe("PLANE_ANGLE");
    expect(parseModernVernacularV26("ki ku").ast?.dimension).toBe("THERMODYNAMIC_TEMPERATURE");
  });

  it("[MV26-006] preserves exact thousandth precision", () => {
    const result = parseModernVernacularV26("ki shi za za ku");
    expect(result.ast?.scaledValue).toBe(1000);
    expect(result.ast?.value).toBe(1);
  });
});
