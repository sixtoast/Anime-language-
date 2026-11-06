import { describe, expect, it } from "vitest";
import { parseModernVernacular, parseModernVernacularV22 } from "./modernVernacular";

describe("Modern Vernacular v2.2 qualitative event duration", () => {
  it.each([
    ["teshi don zir rawu melo", "brief", false],
    ["teshi don mos rawu runi", "long", false],
    ["teshi don mol gisho melo", "brief", false],
    ["teshi don ful tava gezi runi", "long", false],
    ["teshi don zir rawu melo pun", "brief", true]
  ] as const)("parses %s", (input, duration, polarQuestion) => {
    const result = parseModernVernacularV22(input);
    expect(result.ok).toBe(true);
    expect(result.ast?.duration).toBe(duration);
    expect(result.ast?.polarQuestion).toBe(polarQuestion);
  });

  it("dispatches duration clauses through the unified analyser", () => {
    const result = parseModernVernacular("teshi don zir rawu melo");
    expect(result.ok).toBe(true);
    expect(result.grammar).toBe("modern-vernacular-v2.2-locked");
  });

  it.each([
    ["teshi kok mol gisho melo", "ongoing event"],
    ["teshi nava don mol gisho melo", "negative completion"],
    ["teshi don melo mol gisho", "marker before verb"],
    ["teshi don mol melo gisho", "marker splits complement"],
    ["teshi don mol gisho melo runi", "two markers"],
    ["teshi fam ful tava gezi runi", "modal clause"],
    ["teshi don shus rawu melo", "stative verb"],
    ["teshi don zir rawu", "missing duration marker"],
    ["teshi don zir rawu runi melo", "multiple duration markers"],
    ["teshi don zir rawu melo nava pun", "negative polar question"],
    ["teshi don zir rawu melo runi pun", "two markers before question"]
  ])("rejects %s (%s)", input => {
    expect(parseModernVernacularV22(input).ok).toBe(false);
  });
});
