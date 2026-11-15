import { describe, expect, it } from "vitest";
import { constructionSpatialGrammarEvidence, reviewConstructionSpatialCategory, reviewConstructionSpatialInterface, reviewConstructionSpatialInventoryEntry } from "./constructionSpatialGrammarEvidence";

describe("Phase 8BP spatial grammar evidence catalogue", () => {
  it("[CON-SPATIAL-GRAM-001] records one frame marker without inventing a frame signature", () => {
    expect(reviewConstructionSpatialInventoryEntry("FE")).toMatchObject({ category: "FRAME", recordedLabel: "Frame", signatureStatus: "NOT-RECOVERED" });
  });
  it("[CON-SPATIAL-GRAM-002] retains all six signed-axis forms as one lexical category", () => {
    expect(reviewConstructionSpatialCategory("SIGNED-AXIS")?.map(entry => entry.form)).toEqual(["PA", "BA", "TA", "DA", "KA", "GA"]);
  });
  it("[CON-SPATIAL-GRAM-003] retains relation forms without assigning individual relation meanings", () => {
    expect(reviewConstructionSpatialCategory("RELATION")?.map(entry => entry.form)).toEqual(["JO", "JUR", "JA", "JE", "JI"]);
    expect(reviewConstructionSpatialCategory("RELATION")?.every(entry => entry.signatureStatus === "NOT-RECOVERED")).toBe(true);
  });
  it("[CON-SPATIAL-GRAM-004] retains geometry forms without inventing operand signatures", () => {
    expect(reviewConstructionSpatialCategory("GEOMETRY")?.map(entry => entry.form)).toEqual(["PI", "LEN", "PLA", "SUR", "VOM", "PAR"]);
  });
  it("[CON-SPATIAL-GRAM-005] keeps eight spatial interfaces explicitly unresolved", () => {
    expect(constructionSpatialGrammarEvidence.openInterfaces).toHaveLength(8);
    expect(constructionSpatialGrammarEvidence.openInterfaces.every(item => item.status === "UNRECOVERED")).toBe(true);
    expect(reviewConstructionSpatialInterface("FRAME-SELECTION")?.status).toBe("UNRECOVERED");
  });
  it("[CON-SPATIAL-GRAM-006] does not generalise the historical fixture or infer cross-version identity", () => {
    expect(constructionSpatialGrammarEvidence.historicalFixture.generalisable).toBe(false);
    expect(constructionSpatialGrammarEvidence.limits.crossVersionIdentityInferred).toBe(false);
    expect(reviewConstructionSpatialInventoryEntry("da")).toBeNull();
  });
  it("[CON-SPATIAL-GRAM-007] fails closed for unknown inventory/category/interface queries", () => {
    expect(reviewConstructionSpatialInventoryEntry("UNKNOWN")).toBeNull();
    expect(reviewConstructionSpatialCategory("UNKNOWN")).toBeNull();
    expect(reviewConstructionSpatialInterface("UNKNOWN")).toBeNull();
  });
  it("[CON-SPATIAL-GRAM-008] remains non-executable and canon-neutral", () => {
    expect(constructionSpatialGrammarEvidence.limits.executable).toBe(false);
    expect(constructionSpatialGrammarEvidence.limits.canonEffect).toBe("NONE");
  });
});
