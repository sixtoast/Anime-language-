import { describe, expect, it } from "vitest";
import { parseModernVernacularV13 } from "./modernVernacular";

describe("Modern Vernacular v1.3 locked motion frames", () => {
  it("parses a goal phrase", () => {
    expect(parseModernVernacularV13("teshi ful tava gezi")).toMatchObject({
      ok: true, ast: { predicate: "ful", spatialRoles: [{ role: "goal", marker: "tava", place: "gezi" }] }
    });
  });

  it("parses source and route phrases in their locked order", () => {
    expect(parseModernVernacularV13("teshi ful tava gezi dava gezi yara gezi")).toMatchObject({
      ok: true, ast: { spatialRoles: [{ role: "goal" }, { role: "source" }, { role: "route" }] }
    });
  });

  it("allows a bare motion clause without inferring a destination", () => {
    expect(parseModernVernacularV13("fezo ful")).toMatchObject({
      ok: true, ast: { predicate: "ful", spatialRoles: [] }
    });
  });

  it("distinguishes zem as deictic come", () => {
    expect(parseModernVernacularV13("teshi zem")).toMatchObject({
      ok: true, ast: { predicate: "zem" }
    });
  });

  it("parses simple negation", () => {
    expect(parseModernVernacularV13("teshi nava ful tava gezi")).toMatchObject({
      ok: true, ast: { polarity: "negative", construction: "negative" }
    });
  });

  it("parses positive polar questions", () => {
    expect(parseModernVernacularV13("teshi ful tava gezi pun")).toMatchObject({
      ok: true, ast: { question: "polar", construction: "polar-question" }
    });
  });

  it("supports mover-only information questions", () => {
    expect(parseModernVernacularV13("shuk ful tava gezi")).toMatchObject({
      ok: true, ast: { question: "information", mover: "shuk" }
    });
  });

  it("rejects an unmarked location rather than inferring a goal", () => {
    expect(parseModernVernacularV13("teshi ful gezi").ok).toBe(false);
  });

  it("rejects a non-place expression in a spatial role", () => {
    expect(parseModernVernacularV13("teshi ful tava fape").ok).toBe(false);
  });

  it("rejects duplicate goals", () => {
    expect(parseModernVernacularV13("teshi ful tava gezi tava gezi").diagnostics[0]?.code).toBe("MV13_DUPLICATE_SPATIAL_ROLE");
  });

  it("rejects spatial-role order outside the locked sequence", () => {
    expect(parseModernVernacularV13("teshi ful dava gezi tava gezi").ok).toBe(false);
  });

  it("blocks negative polar questions", () => {
    expect(parseModernVernacularV13("teshi nava ful pun").diagnostics[0]?.code).toBe("MV13_BLOCKED_NEGATIVE_POLAR");
  });

  it("blocks questions about spatial roles", () => {
    expect(parseModernVernacularV13("teshi ful tava zosh").ok).toBe(false);
  });

  it("rejects unknown vocabulary", () => {
    expect(parseModernVernacularV13("teshi walk tava gezi").ok).toBe(false);
  });
});
