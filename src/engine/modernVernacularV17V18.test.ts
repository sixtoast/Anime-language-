import { describe, expect, it } from "vitest";
import { parseModernVernacularV17, parseModernVernacularV18, parseModernVernacular } from "./modernVernacular";

describe("Modern Vernacular v1.7 directives", () => {
  it.each([
    ["dema ful tava gezi", "dema"],
    ["sori nak rawu", "sori"],
    ["mira mol gisho", "mira"],
    ["toku bul li fape ka fezo", "toku"],
    ["dema wish fezo", "dema"]
  ] as const)("parses directive %s", (input, directive) => {
    const result=parseModernVernacularV17(input);
    expect(result.ok).toBe(true);
    expect(result.ast?.directive).toBe(directive);
    expect(result.ast?.actor).toBe("addressee");
    if (result.ast?.action.version === "1.0") expect(result.ast.action.ast.participantA).toMatchObject({kind:"participant",form:"addressee"});
    if (result.ast?.action.version === "1.1" || result.ast?.action.version === "1.2") expect(result.ast.action.ast.subject).toBe("addressee");
    if (result.ast?.action.version === "1.3") expect(result.ast.action.ast.mover).toBe("addressee");
  });
  it.each([
    "dema nava ful tava gezi",
    "sori fam ful tava gezi",
    "mira tek ful tava gezi",
    "dema zami ful tava gezi",
    "sori ful tava gezi pun",
    "dema ful gezi"
  ])("rejects blocked directive %s", input => {
    expect(parseModernVernacularV17(input).ok).toBe(false);
  });
});

describe("Modern Vernacular v1.8 clause linking", () => {
  it.each([
    ["teshi wish fezo lena fezo nak rawu", "coordination", "lena"],
    ["teshi wish fezo savi fezo nak rawu", "reason", "savi"],
    ["fezo nak rawu doru teshi wish fezo", "consequence", "doru"],
    ["teshi nava wish fezo lena fezo nak rawu", "coordination", "lena"],
    ["teshi yemi ful tava gezi savi teshi fam ful tava gezi", "reason", "savi"]
  ] as const)("links complete clauses: %s", (input, relation, linker) => {
    const result=parseModernVernacularV18(input);
    expect(result.ok).toBe(true);
    expect(result.ast).toMatchObject({relation,linker});
  });
  it("keeps a polar question local when pun appears before the linker", () => {
    const result = parseModernVernacularV18("teshi wish fezo pun lena fezo nak rawu");
    expect(result.ok).toBe(true);
    expect(result.ast?.left.grammar).toBe("modern-vernacular-v1.0-locked");
    if (result.ast?.left.grammar === "modern-vernacular-v1.0-locked" && result.ast.left.ok && result.ast.left.ast?.kind === "clause") {
      expect(result.ast.left.ast.question).toBe("polar");
    }
  });
  it.each([
    "teshi wish lena fezo",
    "teshi lena wish fezo",
    "teshi wish fezo lena",
    "dema ful tava gezi lena sori wish fezo",
    "teshi wish fezo lena fezo nak rawu pun",
    "shuk wish fezo lena fezo nak rawu",
    "teshi wish fezo lena fezo nak rawu savi teshi mol gisho"
  ])("rejects incomplete, ambiguous or nested link: %s", input => {
    expect(parseModernVernacularV18(input).ok).toBe(false);
  });
});

describe("Unified parser dispatches v1.7 and v1.8", () => {
  it("automatically selects directive grammar", () => {
    expect(parseModernVernacular("sori nak rawu").grammar).toBe("modern-vernacular-v1.7-locked");
  });
  it("automatically selects clause-linking grammar", () => {
    expect(parseModernVernacular("teshi wish fezo lena fezo nak rawu").grammar).toBe("modern-vernacular-v1.8-locked");
  });
});
