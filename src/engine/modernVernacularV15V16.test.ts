import { describe, expect, it } from "vitest";
import { parseModernVernacularV15, parseModernVernacularV16, parseModernVernacular } from "./modernVernacular";

describe("Modern Vernacular v1.5 permission", () => {
  it.each([
    "teshi yemi ful tava gezi",
    "teshi yemi wish fezo",
    "teshi yemi mol gisho",
    "teshi yemi bul li fape ka fezo",
    "teshi yemi ful tava gezi pun",
    "shuk yemi ful tava gezi"
  ])("accepts canon permission frame: %s", input => {
    expect(parseModernVernacularV15(input).ok).toBe(true);
  });
  it.each([
    "teshi nava yemi ful tava gezi",
    "teshi yemi nava ful tava gezi",
    "teshi yemi fam ful tava gezi",
    "teshi yemi fape"
  ])("rejects v1.5 blocked construction: %s", input => {
    expect(parseModernVernacularV15(input).ok).toBe(false);
  });
});

describe("Modern Vernacular v1.6 modal scope and prohibition", () => {
  it.each([
    ["teshi nava fam ful tava gezi", "modal", "negative"],
    ["teshi fam nava ful tava gezi", "action", "positive"],
    ["teshi nava kong wish fezo", "modal", "negative"],
    ["teshi kong nava wish fezo", "action", "positive"],
    ["teshi nava tek mol gisho", "modal", "negative"],
    ["teshi tek nava mol gisho", "action", "positive"],
    ["teshi nava yemi ful tava gezi", "modal", "negative"],
    ["teshi yemi nava ful tava gezi", "action", "positive"]
  ] as const)("preserves scope for %s", (input, scope, polarity) => {
    const result = parseModernVernacularV16(input);
    expect(result.ok).toBe(true);
    expect(result.ast).toMatchObject({ scope, polarity });
  });
  it.each([
    "teshi zami ful tava gezi",
    "teshi zami mol gisho",
    "teshi zami wish fezo",
    "teshi zami ful tava gezi pun",
    "shuk zami ful tava gezi"
  ])("accepts explicit prohibition: %s", input => {
    expect(parseModernVernacularV16(input).ok).toBe(true);
  });
  it.each([
    "teshi nava zami ful tava gezi",
    "teshi nava fam yemi ful tava gezi",
    "teshi zami yemi ful tava gezi",
    "teshi zami fape"
  ])("rejects blocked scope or stacking: %s", input => {
    expect(parseModernVernacularV16(input).ok).toBe(false);
  });
  it("keeps question particle outside and scope intact", () => {
    expect(parseModernVernacularV16("teshi nava fam ful tava gezi pun").ast?.question).toBe("polar");
  });
});

describe("Unified parser dispatches v1.5 and v1.6", () => {
  it("selects permission grammar", () => {
    expect(parseModernVernacular("teshi yemi ful tava gezi").grammar).toBe("modern-vernacular-v1.5-locked");
  });
  it("selects modal-scope grammar", () => {
    expect(parseModernVernacular("teshi fam nava ful tava gezi").grammar).toBe("modern-vernacular-v1.6-locked");
    expect(parseModernVernacular("teshi zami ful tava gezi").grammar).toBe("modern-vernacular-v1.6-locked");
  });
});
