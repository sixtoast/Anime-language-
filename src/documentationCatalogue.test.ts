import { describe, expect, it } from "vitest";
import { docs, filterDocuments } from "./documentationCatalogue";

describe("Documentation catalogue website regression checks", () => {
  it("[WEB-DOC-REG-001] keeps a non-empty catalogue with unique titles", () => {
    expect(docs.length).toBeGreaterThanOrEqual(28);
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
    expect(filterDocuments("")).toHaveLength(docs.length);
    expect(filterDocuments("   ")).toHaveLength(docs.length);
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

  it("[WEB-DOC-REG-009] filters sources by status and provenance type together", () => {
    expect(filterDocuments("", "Canonical").map((doc) => doc.title)).toEqual(["Magic system v3.0", "Arcane language v3.0-L", "Arcane Incantations v1.9 — Resource Accounting and Conservation Contracts", "Arcane Incantations v2.0 — Authority and Authorisation Decision Contracts"]);
    expect(filterDocuments("", "Provisional", "Original historical source file").map((doc) => doc.title)).toEqual(["Phase 4 — ambiguity audit", "Phase 5 — semantic audit"]);
    expect(filterDocuments("phase 6g", "Provisional", "Provisional research audit").map((doc) => doc.title)).toEqual(["Phase 6G — source lexicon audit"]);
    expect(filterDocuments("", "Deprecated")).toEqual([]);
  });

  it("[WEB-DOC-REG-007] rejects absolute and parent-traversal source paths", () => {
    for (const doc of docs) {
      const normalized = doc.sourcePath.replaceAll("\\", "/");
      expect(normalized.startsWith("/"), doc.title + " must use a repository-relative path").toBe(false);
      expect(normalized.split("/"), doc.title + " must not traverse outside the repository").not.toContain("..");
    }
  });
  it("[WEB-DOC-REG-011] lists the locked v2.0 authority design without claiming an authority service", () => {
    const spec = docs.find((doc) => doc.title === "Arcane Incantations v2.0 — Authority and Authorisation Decision Contracts");
    expect(spec).toMatchObject({
      status: "Canonical",
      sourcePath: "docs/canon/arcane-incantations-v2.0-authority-and-authorization-decision-contracts.md",
      sourceKind: "Locked modern design specification"
    });
    expect(spec?.sourceNote).toContain("not a universal authority hierarchy");
    expect(spec?.sourceNote).toContain("executable authorisation service");
  });

  it("[WEB-DOC-REG-010] lists the locked v1.9 resource-accounting design without claiming runtime support", () => {
    const spec = docs.find((doc) => doc.title === "Arcane Incantations v1.9 — Resource Accounting and Conservation Contracts");
    expect(spec).toMatchObject({
      status: "Canonical",
      sourcePath: "docs/canon/arcane-incantations-v1.9-resource-accounting-and-conservation-contracts.md",
      sourceKind: "Locked modern design specification"
    });
    expect(spec?.sourceNote).toContain("not an executable runtime");
  });

  it("[WEB-DOC-REG-008] keeps every catalogue source path resolvable in the repository", () => {
    const sourceFiles = import.meta.glob([
      "../docs/**/*",
      "../sources/**/*",
      "./engine/**/*.md"
    ], { eager: false });
    const availablePaths = new Set(Object.keys(sourceFiles).map((path) => {
      if (path.startsWith("../")) return path.slice(3);
      if (path.startsWith("./")) return "src/" + path.slice(2);
      return path;
    }));
    for (const doc of docs) {
      expect(availablePaths.has(doc.sourcePath), doc.title + " source path: " + doc.sourcePath).toBe(true);
    }
  });

});
