import { describe, expect, it } from "vitest";
import { docs, filterDocuments } from "./documentationCatalogue";

describe("Documentation catalogue website regression checks", () => {
  it("[WEB-DOC-REG-001] keeps all 19 catalogue entries and unique titles", () => {
    expect(docs).toHaveLength(19);
    expect(new Set(docs.map((doc) => doc.title)).size).toBe(docs.length);
  });

  it("[WEB-DOC-REG-002] provides a source path, type, and provenance note for every entry", () => {
    for (const doc of docs) {
      expect(doc.sourcePath.trim(), doc.title + " source path").not.toBe("");
      expect(doc.sourceKind.trim(), doc.title + " source type").not.toBe("");
      expect(doc.sourceNote.trim(), doc.title + " provenance note").not.toBe("");
    }
  });

  it("[WEB-DOC-REG-003] returns the full catalogue for a blank query", () => {
    expect(filterDocuments("")).toHaveLength(19);
    expect(filterDocuments("   ")).toHaveLength(19);
  });

  it("[WEB-DOC-REG-004] searches case-insensitively across titles and descriptions", () => {
    expect(filterDocuments("MAGIC SYSTEM").map((doc) => doc.title)).toContain("Magic system v3.0");
    expect(filterDocuments("dimensional bookkeeping").map((doc) => doc.title)).toContain("Dimension algebra primitives");
  });

  it("[WEB-DOC-REG-005] includes source type and provenance in search", () => {
    expect(filterDocuments("historical source file").map((doc) => doc.title)).toEqual([
      "Phase 4 — ambiguity audit",
      "Phase 5 — semantic audit"
    ]);
    expect(filterDocuments("not a completed formal grammar").map((doc) => doc.title)).toContain("Grammar & syntax");
  });

  it("[WEB-DOC-REG-006] can filter by status and reports no matches as an empty list", () => {
    expect(filterDocuments("Open question").map((doc) => doc.title)).toEqual([
      "Grammar & syntax",
      "FRAPA contract"
    ]);
    expect(filterDocuments("this term should not exist")).toEqual([]);
  });
});
