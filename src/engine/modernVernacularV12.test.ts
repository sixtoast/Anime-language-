import { describe, expect, it } from "vitest";
import { parseModernVernacularV12 } from "./modernVernacular";

describe("Modern Vernacular v1.2 locked transfer frames", () => {
  it("parses giver-centred transfer with ka recipient", () => {
    expect(parseModernVernacularV12("teshi bul li fape ka fezo")).toMatchObject({
      ok: true, ast: { construction: "give", predicate: "bul", item: "fape", roleMarker: "ka", roleParticipant: "fezo" }
    });
  });

  it("parses recipient-centred bul with du source as receive", () => {
    expect(parseModernVernacularV12("fezo bul li fape du teshi")).toMatchObject({
      ok: true, ast: { construction: "receive", predicate: "bul", roleMarker: "du", roleParticipant: "teshi" }
    });
  });

  it("parses take with an explicit du source", () => {
    expect(parseModernVernacularV12("teshi lil li fape du fezo")).toMatchObject({
      ok: true, ast: { construction: "take", predicate: "lil", roleMarker: "du" }
    });
  });

  it("extends simple negation to a transfer frame", () => {
    expect(parseModernVernacularV12("teshi nava bul li fape ka fezo")).toMatchObject({
      ok: true, ast: { polarity: "negative", construction: "give" }
    });
  });

  it("extends polar questions to a transfer frame", () => {
    expect(parseModernVernacularV12("teshi bul li fape ka fezo pun")).toMatchObject({
      ok: true, ast: { question: "polar", construction: "give" }
    });
  });

  it("supports first-slot information questions", () => {
    expect(parseModernVernacularV12("shuk bul li fape ka fezo")).toMatchObject({
      ok: true, ast: { question: "information", subject: "shuk" }
    });
  });

  it("supports transferred-item information questions", () => {
    expect(parseModernVernacularV12("teshi bul li zosh ka fezo")).toMatchObject({
      ok: true, ast: { question: "information", item: "zosh" }
    });
  });

  it("rejects an unmarked item and recipient", () => {
    expect(parseModernVernacularV12("teshi bul fape fezo").ok).toBe(false);
  });

  it("rejects ka in the take frame", () => {
    expect(parseModernVernacularV12("teshi lil li fape ka fezo").ok).toBe(false);
  });

  it("rejects an unlicensed recipient/source question", () => {
    expect(parseModernVernacularV12("teshi bul li fape ka shuk").ok).toBe(false);
  });

  it("blocks negative polar questions", () => {
    expect(parseModernVernacularV12("teshi nava bul li fape ka fezo pun").diagnostics[0]?.code).toBe("MV12_BLOCKED_NEGATIVE_POLAR");
  });

  it("blocks information questions combined with pun", () => {
    expect(parseModernVernacularV12("teshi bul li zosh ka fezo pun").diagnostics[0]?.code).toBe("MV12_BLOCKED_ROLE_QUESTION");
  });

  it("rejects unknown vocabulary", () => {
    expect(parseModernVernacularV12("teshi bul li book ka fezo").ok).toBe(false);
  });

  it("does not interpret ka or du as free-standing universal case markers", () => {
    expect(parseModernVernacularV12("teshi ka fezo").ok).toBe(false);
    expect(parseModernVernacularV12("teshi du fezo").ok).toBe(false);
  });
});
