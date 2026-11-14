import { describe, expect, it } from "vitest";
import { parseModernVernacular, parseModernVernacularV21 } from "./modernVernacular";

describe("Modern Vernacular v2.1 temporal anchor and event order", () => {
  it.each([
    ["nemi teshi don mol gisho", "completed", "positive"],
    ["nemi teshi kok mol gisho", "ongoing", "positive"],
    ["nemi teshi nava don mol gisho", "completed", "negative"],
    ["nemi teshi nava kok mol gisho", "ongoing", "negative"]
  ] as const)("anchors %s to now", (input, aspect, polarity) => {
    const result = parseModernVernacularV21(input);
    expect(result.ok).toBe(true);
    expect(result.ast?.kind).toBe("temporal-anchor");
    if (result.ast?.kind === "temporal-anchor") {
      expect(result.ast.clause.aspect).toBe(aspect);
      expect(result.ast.clause.polarity).toBe(polarity);
    }
  });

  it.each([
    ["teshi don mol gisho pavo teshi don tut losa", "before"],
    ["teshi don tut losa sula teshi don mol gisho", "after"],
    ["teshi don zir rawu pavo fezo don nak rawu", "before"]
  ] as const)("parses binary event ordering: %s", (input, relation) => {
    const result = parseModernVernacularV21(input);
    expect(result.ok).toBe(true);
    expect(result.ast?.kind).toBe("event-order");
    if (result.ast?.kind === "event-order") expect(result.ast.relation).toBe(relation);
  });

  it("dispatches v2.1 constructions from the unified analyser", () => {
    expect(parseModernVernacular("nemi teshi kok mol gisho").grammar).toBe("modern-vernacular-v2.1-locked");
    expect(parseModernVernacular("teshi don mol gisho pavo teshi don tut losa").grammar).toBe("modern-vernacular-v2.1-locked");
  });

  it.each([
    ["nemi teshi mol gisho", "missing aspect"],
    ["teshi nemi don mol gisho", "misplaced anchor"],
    ["nemi nemi teshi don mol gisho", "repeated anchor"],
    ["nemi teshi kok mol gisho pavo fezo don nak rawu", "anchor mixed with relation"],
    ["teshi don mol gisho pavo", "missing second clause"],
    ["pavo teshi don mol gisho", "missing first clause"],
    ["teshi kok mol gisho pavo fezo don nak rawu", "ongoing event in ordering"],
    ["teshi don mol gisho pavo fezo kok nak rawu", "ongoing second event"],
    ["teshi nava don mol gisho pavo fezo don nak rawu", "negative event ordering"],
    ["teshi don mol gisho pavo fezo don nak rawu sula teshi don zir rawu", "multiple relations"],
    ["teshi don mol gisho pavo teshi don tut losa pavo fezo don nak rawu", "three-clause chain"],
    ["teshi don mol gisho pavo teshi fam ful tava gezi", "modal second clause"]
  ])("rejects %s (%s)", input => {
    expect(parseModernVernacularV21(input).ok).toBe(false);
  });
});
