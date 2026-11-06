import { describe, expect, it } from "vitest";
import { parseModernVernacular, parseModernVernacularV19 } from "./modernVernacular";

describe("Modern Vernacular v1.9 conditionals and hypotheses", () => {
  it.each([
    "navi teshi fam ful tava gezi saku teshi yemi ful tava gezi",
    "navi teshi wish fezo saku fezo nak rawu",
    "navi teshi nava fam ful tava gezi saku teshi yemi ful tava gezi",
    "navi teshi fam ful tava gezi saku teshi nava yemi ful tava gezi"
  ])("parses complete conditionals: %s", input => {
    const result = parseModernVernacularV19(input);
    expect(result.ok).toBe(true);
    expect(result.ast?.condition.ok).toBe(true);
    expect(result.ast?.consequence.ok).toBe(true);
  });

  it("parses ravi only with the paired conditional and written semicolon", () => {
    const result = parseModernVernacularV19("ravi teshi ful tava gezi; navi teshi ful tava gezi saku teshi yemi ful tava gezi");
    expect(result.ok).toBe(true);
    expect(result.ast?.hypothetical?.ok).toBe(true);
  });

  it("dispatches v1.9 from the unified parser", () => {
    expect(parseModernVernacular("navi teshi wish fezo saku fezo nak rawu").grammar).toBe("modern-vernacular-v1.9-locked");
  });

  it.each([
    "navi teshi fam ful tava gezi",
    "saku teshi yemi ful tava gezi",
    "ravi teshi ful tava gezi",
    "navi navi teshi fam ful tava gezi saku teshi yemi ful tava gezi",
    "navi teshi fam ful tava gezi saku teshi yemi ful tava gezi saku fezo nak rawu",
    "navi dema ful tava gezi saku teshi yemi ful tava gezi",
    "navi teshi wish fezo pun saku fezo nak rawu",
    "navi teshi wish fezo saku fezo nak rawu pun",
    "navi teshi wish saku fezo nak rawu",
    "navi teshi fam ful tava gezi saku",
    "ravi teshi ful tava gezi navi teshi ful tava gezi saku teshi yemi ful tava gezi",
    "ravi teshi ful tava gezi; ravi fezo nak rawu; navi teshi ful tava gezi saku teshi yemi ful tava gezi"
  ])("rejects unresolved conditional scope: %s", input => {
    expect(parseModernVernacularV19(input).ok).toBe(false);
  });

  it("does not confuse causal linkers with conditionals", () => {
    expect(parseModernVernacularV19("teshi fam ful tava gezi doru teshi yemi ful tava gezi").ok).toBe(false);
  });
});
