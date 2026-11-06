import { describe, expect, it } from "vitest";
import { parseModernVernacular, parseModernVernacularV20 } from "./modernVernacular";

describe("Modern Vernacular v2.0 completion and ongoing aspect", () => {
  it.each([
    ["teshi don mol gisho", "completed", "mol", "positive"],
    ["teshi kok mol gisho", "ongoing", "mol", "positive"],
    ["teshi don zir rawu", "completed", "zir", "positive"],
    ["teshi kok ful tava gezi", "ongoing", "ful", "positive"],
    ["teshi don bul li fape ka fezo", "completed", "bul", "positive"],
    ["teshi nava don mol gisho", "completed", "mol", "negative"],
    ["teshi nava kok mol gisho", "ongoing", "mol", "negative"],
    ["fezo don zem", "completed", "zem", "positive"],
    ["teshi don wish fezo", "completed", "wish", "positive"],
    ["teshi don nak rawu", "completed", "nak", "positive"]
  ] as const)("parses %s", (input, aspect, action, polarity) => {
    const result = parseModernVernacularV20(input);
    expect(result.ok).toBe(true);
    expect(result.ast?.aspect).toBe(aspect);
    expect(result.ast?.action).toBe(action);
    expect(result.ast?.polarity).toBe(polarity);
  });

  it("dispatches aspect clauses through the unified parser", () => {
    const result = parseModernVernacular("teshi kok mol gisho");
    expect(result.ok).toBe(true);
    expect(result.grammar).toBe("modern-vernacular-v2.0-locked");
  });

  it.each([
    ["teshi don kok mol gisho", "stacked aspect"],
    ["teshi kok don mol gisho", "stacked aspect"],
    ["teshi don nava mol gisho", "negation after aspect"],
    ["teshi kok wish fezo", "progressive stative/perception reading not licensed"],
    ["teshi kok nak rawu", "progressive hearing not licensed"],
    ["teshi don shus rawu", "stative verb"],
    ["teshi don fam ful tava gezi", "modal plus aspect"],
    ["dema kok ful tava gezi", "directive plus aspect"],
    ["teshi nava don mol gisho pun", "negative polar aspect question"],
    ["teshi don", "missing action verb"],
    ["teshi don mol", "incomplete underlying verb frame"],
    ["teshi don mol gisho kok", "multiple aspect markers"]
  ])("rejects %s (%s)", input => {
    expect(parseModernVernacularV20(input).ok).toBe(false);
  });
});
