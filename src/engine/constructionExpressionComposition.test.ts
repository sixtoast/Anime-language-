import { describe, expect, it } from "vitest";
import { createEmptyConstructionExpressionComposition, reviewConstructionExpressionComposition, type ConstructionExpressionComposition } from "./constructionExpressionComposition";

describe("evidence-aware Construction expression composition", () => {
  it("[CON-COMP-001] creates seven explicit empty stage slots without asserting presence rules", () => {
    const review = reviewConstructionExpressionComposition(createEmptyConstructionExpressionComposition("blank-review"));
    expect(review.stageSummaries).toHaveLength(7);
    expect(review.status).toBe("NO-EVIDENCE");
    expect(review.stagesWithoutRecords).toHaveLength(7);
  });
  it("[CON-COMP-002] preserves per-stage source and version provenance", () => {
    const composition = createEmptyConstructionExpressionComposition("provenance");
    composition.stageEvidence.reference = [{ id: "ref-1", stage: "reference", status: "PARTIAL", version: "PHASE-5.16", source: "C-04", claims: ["Formal MI/NI/RI default-volume scope"], unresolved: ["Full performed paradigm"] }];
    const review = reviewConstructionExpressionComposition(composition);
    expect(review.stageSummaries[0].partialCount).toBe(1);
    expect(review.stagesWithEvidence).toEqual(["reference"]);
    expect(review.status).toBe("EVIDENCE-PARTIAL");
  });
  it("[CON-COMP-003] preserves multiple records without asserting stage cardinality", () => {
    const composition = createEmptyConstructionExpressionComposition("multiple-records");
    composition.stageEvidence["construction-feet"] = [
      { id: "foot-a", stage: "construction-feet", status: "PARTIAL", version: "P5.15", source: "matrix", claims: ["CVC structure"], unresolved: ["Coda inventory"] },
      { id: "foot-b", stage: "construction-feet", status: "UNRECOVERED", version: "P5.16", source: "C-02", claims: [], unresolved: ["Optional-coda discrepancy"] }
    ];
    const review = reviewConstructionExpressionComposition(composition);
    expect(review.stageSummaries.find(item => item.stage === "construction-feet")?.recordCount).toBe(2);
    expect(review.stageCardinality).toBe("NOT-ESTABLISHED");
  });
  it("[CON-COMP-004] does not infer dependencies from recovered stage precedence", () => {
    const review = reviewConstructionExpressionComposition(createEmptyConstructionExpressionComposition("edges"));
    expect(review.stageDependency).toBe("NOT-ESTABLISHED");
    expect(review.grammarValidity).toBe("NOT-ASSESSED");
  });
  it("[CON-COMP-005] retains a versioned fixture surface without generalising it", () => {
    const composition: ConstructionExpressionComposition = {
      ...createEmptyConstructionExpressionComposition("fixture"),
      surface: { text: "mel · po da za shi to za ma · kan ken · he ha · sa shi za se · kas", version: "PHASE-5.22-FIXTURE", source: "Historical hand-flame fixture" }
    };
    expect(composition.surface?.version).toBe("PHASE-5.22-FIXTURE");
    expect(reviewConstructionExpressionComposition(composition).grammarValidity).toBe("NOT-ASSESSED");
  });
  it("[CON-COMP-006] never enables execution or canon changes", () => {
    const composition = createEmptyConstructionExpressionComposition("safe-boundary");
    const review = reviewConstructionExpressionComposition(composition);
    expect(composition.executable).toBe(false);
    expect(composition.canonEffect).toBe("NONE");
    expect(review.executable).toBe(false);
    expect(review.canonEffect).toBe("NONE");
  });
});
