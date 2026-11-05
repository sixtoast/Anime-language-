import { describe, expect, it } from "vitest";
import { parseModernVernacular } from "./modernVernacular";

describe("Unified Modern Vernacular parser", () => {
  it.each([
    ["teshi wish fezo", "modern-vernacular-v1.0-locked"],
    ["teshi nak rawu", "modern-vernacular-v1.1-locked"],
    ["teshi bul li fape ka fezo", "modern-vernacular-v1.2-locked"],
    ["teshi ful tava gezi", "modern-vernacular-v1.3-locked"],
    ["teshi fam wish fezo", "modern-vernacular-v1.4-locked"],
    ["teshi nava wish fezo", "modern-vernacular-v1.0-locked"],
    ["teshi nava nak rawu", "modern-vernacular-v1.1-locked"]
  ] as const)("dispatches %s to %s", (input, grammar) => {
    expect(parseModernVernacular(input).grammar).toBe(grammar);
    expect(parseModernVernacular(input).ok).toBe(true);
  });

  it("keeps standalone responses in the v1.0 parser", () => {
    expect(parseModernVernacular("wang").grammar).toBe("modern-vernacular-v1.0-locked");
    expect(parseModernVernacular("kor").ok).toBe(true);
  });

  it("does not dispatch an unknown predicate into a later grammar", () => {
    const result = parseModernVernacular("teshi unknown fezo");
    expect(result.grammar).toBe("modern-vernacular-v1.0-locked");
    expect(result.ok).toBe(false);
  });

  it("does not mistake a modal-looking word outside the modal slot for a modal", () => {
    const result = parseModernVernacular("teshi wish fam");
    expect(result.grammar).toBe("modern-vernacular-v1.0-locked");
    expect(result.ok).toBe(false);
  });
});
