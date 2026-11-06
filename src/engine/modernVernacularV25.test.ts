import { describe, expect, it } from "vitest";
import { parseModernVernacular, parseModernVernacularV25 } from "./modernVernacular";

describe("Modern Vernacular v2.5 compound numerals and fractional seconds", () => {
  it.each([
    ["teshi don zir rawu ki se", 1],
    ["teshi don zir rawu ki to se", 12],
    ["teshi don zir rawu to za se", 20],
    ["teshi don zir rawu mu fi se", 36],
    ["teshi don zir rawu pe pe pe pe se", 9999],
    ["teshi don zir rawu to shi sa se", 2.5],
    ["teshi don zir rawu ki shi za se", 1],
    ["teshi don seno za shi sa se", 0.5],
    ["teshi don zir rawu mu za shi za za za se", 30.001]
  ])("parses %s", (input, seconds) => {
    const result = parseModernVernacularV25(input);
    expect(result.ok).toBe(true);
    expect(result.ast?.durationSeconds).toBeCloseTo(seconds, 9);
  });

  it.each([
    ["teshi don zir rawu nela ki to se", 12],
    ["teshi don zir rawu nela to shi sa se", 2.5],
    ["teshi don seno nela za shi sa se", 0.5]
  ])("parses approximate duration %s", (input, seconds) => {
    const result = parseModernVernacularV25(input);
    expect(result.ok).toBe(true);
    expect(result.ast?.durationSeconds).toBeCloseTo(seconds, 9);
    expect(result.ast?.approximate).toBe(true);
  });

  it("dispatches v2.5 durations through the unified parser", () => {
    const result = parseModernVernacular("teshi don zir rawu to shi sa se");
    expect(result.ok).toBe(true);
    expect(result.grammar).toBe("modern-vernacular-v2.5-locked");
  });

  it("supports a positive polar question after the duration phrase", () => {
    const result = parseModernVernacularV25("teshi don zir rawu nela ki to se pun");
    expect(result.ok).toBe(true);
    expect(result.ast?.polarQuestion).toBe(true);
  });

  it.each([
    ["teshi don zir rawu za ki se", "leading zero"],
    ["teshi don zir rawu pe pe pe pe pe se", "five integer digits"],
    ["teshi don zir rawu to shi se", "missing fractional digits"],
    ["teshi don zir rawu to shi sa fi re se", "four fractional digits"],
    ["teshi don zir rawu za shi za se", "zero duration"],
    ["teshi don zir rawu shi sa se", "missing integer part"],
    ["teshi don zir rawu to shi sa shi fi se", "repeated decimal separator"],
    ["teshi don zir rawu nela to se melo", "qualitative stacking"],
    ["teshi kok zir rawu to se", "ongoing event"],
    ["teshi don zir rawu nela za shi za se", "approximate zero"],
    ["teshi don zir rawu nela nela to se", "repeated approximation"]
  ])("rejects %s (%s)", input => {
    expect(parseModernVernacularV25(input).ok).toBe(false);
  });
});
