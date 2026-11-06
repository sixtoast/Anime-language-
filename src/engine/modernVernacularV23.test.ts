import { describe, expect, it } from "vitest";
import { parseModernVernacular, parseModernVernacularV22, parseModernVernacularV23 } from "./modernVernacular";

describe("Modern Vernacular v2.3 waiting and until", () => {
  it.each([
    ["teshi kok seno", "ongoing", "positive"],
    ["teshi don seno", "completed", "positive"],
    ["teshi nava kok seno", "ongoing", "negative"],
  ])("parses waiting clause %s", input => {
    const result = parseModernVernacularV23(input);
    expect(result.ok).toBe(true);
    if (result.ast?.kind === "waiting-clause") {
      expect(result.ast.clause.action).toBe("seno");
    }
  });

  it("extends v2.2 qualitative duration to completed waiting episodes", () => {
    const result = parseModernVernacularV22("teshi don seno melo");
    expect(result.ok).toBe(true);
    expect(result.ast?.duration).toBe("brief");
    expect(result.ast?.clause.action).toBe("seno");
  });

  it("supports present-time anchoring through the v2.1 parser", () => {
    const result = parseModernVernacular("nemi teshi kok seno");
    expect(result.ok).toBe(true);
    expect(result.grammar).toBe("modern-vernacular-v2.1-locked");
  });

  it.each([
    ["teshi kok seno kavi fezo don zem", false],
    ["teshi kok seno kavi fezo don zem pun", true]
  ])("parses bounded endpoint construction %s", (input, polarQuestion) => {
    const result = parseModernVernacularV23(input);
    expect(result.ok).toBe(true);
    expect(result.ast?.kind).toBe("waiting-until");
    if (result.ast?.kind === "waiting-until") {
      expect(result.ast.polarQuestion).toBe(polarQuestion);
      expect(result.ast.endpointRequiresRecoverableDeicticCentre).toBe(true);
      expect(result.ast.waiting.action).toBe("seno");
      expect(result.ast.endpoint.action).toBe("zem");
    }
  });

  it.each([
    ["teshi kok seno kavi fezo kok zem", "ongoing endpoint"],
    ["teshi kok seno kavi fezo don mol gisho", "unlicensed endpoint verb"],
    ["fezo don zem kavi teshi kok seno", "reversed order"],
    ["teshi kok seno kavi", "missing endpoint"],
    ["teshi kok seno kavi fezo", "incomplete endpoint"],
    ["teshi don seno kavi fezo don zem", "completed waiting clause"],
    ["teshi nava kok seno kavi fezo don zem", "negative waiting clause"],
    ["teshi kok seno kavi fezo don zem kavi teshi don zem", "nested endpoint"],
    ["teshi kok seno pavo fezo don zem", "event-order marker"],
    ["teshi fam kok seno kavi fezo don zem", "modal construction"],
    ["teshi seno", "missing aspect"],
    ["teshi kok seno fezo", "arbitrary direct object"]
  ])("rejects %s (%s)", input => {
    expect(parseModernVernacularV23(input).ok).toBe(false);
  });
});
