import { describe, expect, it } from "vitest";
import { reviewConstructionRecord, type ConstructionRecord } from "./constructionRecordReview";

const completeSequence: ConstructionRecord = {
  id: "sample-1",
  elements: [
    "reference", "spatial-role-vector", "construction-feet", "couplings", "quantity", "control", "release"
  ].map(stage => ({ stage: stage as ConstructionRecord["elements"][number]["stage"], status: "ATTESTED" }))
};

describe("evidence-bounded Construction record review", () => {
  it("[CON-RECORD-001] preserves every stage in the supplied record", () => {
    const result = reviewConstructionRecord(completeSequence);
    expect(result.presentStages).toHaveLength(7);
    expect(result.order.status).toBe("ORDER_CONSISTENT");
  });

  it("[CON-RECORD-002] never equates attested fields with proven construction completeness", () => {
    const result = reviewConstructionRecord(completeSequence);
    expect(result.status).toBe("EVIDENCE-QUALIFIED");
    expect(result.canClaimConstructionComplete).toBe(false);
  });

  it("[CON-RECORD-003] distinguishes provisional evidence", () => {
    const record = { ...completeSequence, elements: completeSequence.elements.map((e, i) =>
      i === 2 ? { ...e, status: "PROVISIONAL" as const } : e) };
    const result = reviewConstructionRecord(record);
    expect(result.status).toBe("EVIDENCE-INCOMPLETE");
    expect(result.provisionalStages).toContain("construction-feet");
  });

  it("[CON-RECORD-004] distinguishes unresolved from missing evidence", () => {
    const record = { ...completeSequence, elements: [
      { stage: "reference" as const, status: "UNRESOLVED" as const },
      { stage: "spatial-role-vector" as const, status: "NOT-SUPPLIED" as const }
    ] };
    const result = reviewConstructionRecord(record);
    expect(result.unresolvedStages).toEqual(["reference"]);
    expect(result.missingStages).toEqual(["spatial-role-vector"]);
  });

  it("[CON-RECORD-005] detects order conflict without reinterpreting element content", () => {
    const result = reviewConstructionRecord({ id: "bad-order", elements: [
      { stage: "quantity", status: "ATTESTED" },
      { stage: "reference", status: "ATTESTED" }
    ] });
    expect(result.order.status).toBe("ORDER_INCONSISTENT");
    expect(result.status).toBe("EVIDENCE-INCOMPLETE");
  });

  it("[CON-RECORD-006] reports empty records as empty, not as valid", () => {
    const result = reviewConstructionRecord({ id: "empty", elements: [] });
    expect(result.status).toBe("EMPTY-RECORD");
    expect(result.canClaimConstructionComplete).toBe(false);
  });

  it("[CON-RECORD-007] counts repeated elements without inventing cardinality rules", () => {
    const result = reviewConstructionRecord({ id: "repeated", elements: [
      { stage: "reference", status: "ATTESTED" },
      { stage: "construction-feet", status: "ATTESTED" },
      { stage: "construction-feet", status: "PROVISIONAL" }
    ] });
    expect(result.evidenceCounts.ATTESTED).toBe(2);
    expect(result.evidenceCounts.PROVISIONAL).toBe(1);
  });
});
