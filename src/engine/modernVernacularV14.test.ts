import { describe, expect, it } from "vitest";
import { parseModernVernacularV14 } from "./modernVernacular";

describe("Modern Vernacular v1.4 modality and intention", () => {
  it.each([
    ["teshi fam wish fezo", "fam", "1.0"],
    ["teshi kong wish fezo", "kong", "1.0"],
    ["teshi tek wish fezo", "tek", "1.0"],
    ["teshi fam nak rawu", "fam", "1.1"],
    ["teshi kong mol gisho", "kong", "1.1"],
    ["fezo tek tut losa", "tek", "1.1"],
    ["teshi fam bul li fape ka fezo", "fam", "1.2"],
    ["teshi kong ful tava gezi", "kong", "1.3"],
    ["teshi tek zem tava gezi", "tek", "1.3"]
  ] as const)("accepts licensed action modal: %s", (input, modal, version) => {
    const result = parseModernVernacularV14(input);
    expect(result.ok).toBe(true);
    expect(result.ast?.modal).toBe(modal);
    expect(result.ast?.complementKind).toBe("action");
    if (result.ast?.complementKind === "action") expect(result.ast.action?.version).toBe(version);
  });

  it.each([
    ["teshi kong fape", "kong", "fape"],
    ["teshi tek losa", "tek", "losa"],
    ["teshi kong fezo", "kong", "fezo"]
  ] as const)("accepts licensed entity modal: %s", (input, modal, entity) => {
    const result = parseModernVernacularV14(input);
    expect(result.ok).toBe(true);
    expect(result.ast).toMatchObject({ modal, complementKind: "entity", entity, question: "none" });
  });

  it("supports polar questions over action and entity modal constructions", () => {
    expect(parseModernVernacularV14("teshi fam ful tava gezi pun").ast?.question).toBe("polar");
    expect(parseModernVernacularV14("teshi kong fape pun").ast?.question).toBe("polar");
  });

  it("supports an in-situ subject question over a modal action", () => {
    const result = parseModernVernacularV14("shuk fam wish fezo");
    expect(result.ok).toBe(true);
    expect(result.ast).toMatchObject({ subject: "shuk", question: "information", complementKind: "action" });
  });

  it("supports an in-situ object question inside a modal action", () => {
    const result = parseModernVernacularV14("teshi kong wish zosh");
    expect(result.ok).toBe(true);
    expect(result.ast?.question).toBe("information");
  });

  it.each([
    "teshi fam fape",
    "teshi kong nava wish fezo",
    "teshi nava fam ful tava gezi",
    "teshi fam nava ful tava gezi",
    "teshi tek nava mol gisho",
    "teshi fam ful gezi",
    "teshi fam bul li fape du fezo ka teshi",
    "teshi kong pup rawu",
    "shuk kong fape"
  ])("rejects unsupported or blocked construction: %s", input => {
    expect(parseModernVernacularV14(input).ok).toBe(false);
  });

  it("does not allow modality to repair an invalid underlying frame", () => {
    const result = parseModernVernacularV14("teshi fam bul li fape du fezo ka teshi");
    expect(result.ok).toBe(false);
  });

  it("does not claim permission, completion or arrival", () => {
    const result = parseModernVernacularV14("teshi fam ful tava gezi");
    expect(result.ast).toMatchObject({ polarity: "positive", question: "none", complementKind: "action" });
  });
});
