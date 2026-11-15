import { describe, expect, it } from "vitest";
import { constructionStageRelationshipEvidence, reviewConstructionStageRelationship } from "./constructionStageRelationshipEvidence";

describe("Construction stage relationship evidence", () => {
  it("[CON-REL-001] preserves all seven stages in recovered order", () => {
    expect(constructionStageRelationshipEvidence.stages.map(stage => stage.id)).toEqual(["reference", "spatial-role-vector", "construction-feet", "couplings", "quantity", "control", "release"]);
  });
  it("[CON-REL-002] records exactly six adjacent precedence relationships", () => {
    expect(constructionStageRelationshipEvidence.precedence.map(edge => [edge.from, edge.to])).toEqual([["reference", "spatial-role-vector"], ["spatial-role-vector", "construction-feet"], ["construction-feet", "couplings"], ["couplings", "quantity"], ["quantity", "control"], ["control", "release"]]);
  });
  it("[CON-REL-003] labels every edge as precedence only", () => {
    expect(constructionStageRelationshipEvidence.precedence.every(edge => edge.relation === "PRECEDES")).toBe(true);
  });
  it("[CON-REL-004] does not infer stage-to-stage data dependencies", () => {
    expect(constructionStageRelationshipEvidence.precedence.every(edge => edge.dataDependency === "NOT-ESTABLISHED")).toBe(true);
  });
  it("[CON-REL-005] keeps every stage interface unresolved", () => {
    expect(constructionStageRelationshipEvidence.precedence.every(edge => edge.interfaceStatus === "UNRECOVERED")).toBe(true);
  });
  it("[CON-REL-006] keeps the relationship map non-executable", () => {
    expect(constructionStageRelationshipEvidence.executable).toBe(false);
    expect(constructionStageRelationshipEvidence.canonEffect).toBe("NONE");
  });
  it("[CON-REL-007] does not invent mandatory-stage or cardinality rules", () => {
    expect(constructionStageRelationshipEvidence.unresolved).toContain("Whether any stage may be omitted or must occur exactly once.");
    expect(constructionStageRelationshipEvidence.unresolved).toContain("Whether a stage consumes a value or physical result produced by another stage.");
  });
  it("[CON-REL-008] looks up only documented adjacent relationships", () => {
    expect(reviewConstructionStageRelationship("construction-feet", "couplings")?.relation).toBe("PRECEDES");
    expect(reviewConstructionStageRelationship("reference", "construction-feet")).toBeNull();
    expect(reviewConstructionStageRelationship("unknown", "release")).toBeNull();
  });
});
