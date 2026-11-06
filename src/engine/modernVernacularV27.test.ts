import { describe, expect, it } from "vitest";
import { parseModernVernacular, parseModernVernacularV27 } from "./modernVernacular";

describe("Modern Vernacular v2.7 quantity comparison", () => {
  it.each([
    ["dori to ma mu ma", "less-than", true],
    ["gari mu se to se", "greater-than", true],
    ["nari to ma to ma", "equal", true],
    ["nari to ma mu ma", "equal", false],
    ["dori mu ma to ma", "less-than", false],
    ["gari to se mu se", "greater-than", false],
    ["nari to shi za ma to ma", "equal", true],
    ["dori to shi sa ma mu ma", "less-than", true],
    ["nari to shi za ma to ma", "equal", true],
    ["nari to shi za ke to shi za ke", "equal", true]
  ] as const)("parses %s and evaluates its relation", (input, relation, truth) => {
    const result = parseModernVernacularV27(input);
    expect(result.ok).toBe(true);
    expect(result.ast?.relation).toBe(relation);
    expect(result.ast?.truth).toBe(truth);
  });

  it("dispatches comparisons through the unified language entry point", () => {
    const result = parseModernVernacular("dori to ma mu ma");
    expect(result.ok).toBe(true);
    expect(result.grammar).toBe("modern-vernacular-v2.7-locked");
  });

  it.each([
    ["nari nela to ma to ma", "approximate operand"],
    ["dori to ma mu se", "different dimensions"],
    ["nari to ma to ke", "different units"],
    ["nari to ma", "missing operand"],
    ["dori to ma mu ma ki ma", "third operand"],
    ["nari nari to ma to ma", "duplicate relation"],
    ["nari za ma za ma", "zero quantities"],
    ["nari za shi za ma ki ma", "zero decimal quantity"],
    ["nari to shi ma to ma", "missing fractional digit"],
    ["nari za ki ma ki ma", "leading zero"]
  ])("rejects %s (%s)", (input) => {
    expect(parseModernVernacularV27(input).ok).toBe(false);
  });

  it("normalises decimal values to thousandths before comparison", () => {
    const result = parseModernVernacularV27("nari to shi za ma to ma");
    expect(result.ast?.left.value).toBe(2);
    expect(result.ast?.right.value).toBe(2);
    expect(result.ast?.truth).toBe(true);
  });
});
