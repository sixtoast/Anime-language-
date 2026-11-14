import { describe, expect, it } from "vitest";
import { parseModernVernacular, parseModernVernacularV24 } from "./modernVernacular";

describe("Modern Vernacular v2.4 numeric and approximate duration", () => {
  it.each([
    ["teshi don zir rawu ki se", 1, false],
    ["teshi don mol gisho to se", 2, false],
    ["teshi don mos rawu mu se", 3, false],
    ["teshi don zir rawu nela to se", 2, true],
    ["teshi don ful tava gezi nela pe se", 9, true],
    ["teshi don seno sa se", 5, false]
  ])("parses %s", (input, durationSeconds, approximate) => {
    const result = parseModernVernacularV24(input);
    expect(result.ok).toBe(true);
    expect(result.ast?.durationSeconds).toBe(durationSeconds);
    expect(result.ast?.approximate).toBe(approximate);
    expect(result.ast?.unit).toBe("se");
  });

  it("dispatches numeric-duration clauses through the unified analyser", () => {
    const result = parseModernVernacular("teshi don zir rawu ki se");
    expect(result.ok).toBe(true);
    expect(result.grammar).toBe("modern-vernacular-v2.4-locked");
  });

  it("allows positive polar questions after the complete duration phrase", () => {
    const result = parseModernVernacularV24("teshi don zir rawu nela to se pun");
    expect(result.ok).toBe(true);
    expect(result.ast?.polarQuestion).toBe(true);
  });

  it.each([
    ["teshi kok mol gisho to se", "ongoing event"],
    ["teshi nava don mol gisho to se", "negative completion"],
    ["teshi don zir rawu za se", "zero duration"],
    ["teshi don zir rawu ki to se", "compound number"],
    ["teshi don zir rawu to nela se", "misplaced approximation"],
    ["teshi don zir rawu to se melo", "qualitative and numeric stacking"],
    ["teshi don zir rawu nela", "incomplete approximation"],
    ["teshi fam zir rawu to se", "modal clause"],
    ["teshi don zir rawu nela nela to se", "repeated approximation"],
    ["teshi don zir rawu ki se to se", "repeated numeric duration"],
    ["teshi don zir rawu nela to se runi", "qualitative stacking"],
    ["teshi don zir rawu nela to", "missing unit"],
    ["teshi don zir rawu re ke", "wrong unit"],
    ["teshi don zir rawu se", "missing number"],
    ["teshi don zir rawu nela za se", "approximate zero"]
  ])("rejects %s (%s)", input => {
    expect(parseModernVernacularV24(input).ok).toBe(false);
  });
});
