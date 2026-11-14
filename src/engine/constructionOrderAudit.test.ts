import { describe, expect, it } from "vitest";
import { auditConstructionOrder, constructionStageOrder } from "./constructionOrderAudit";

describe("evidence-bounded Construction order audit", () => {
  it("[CON-ORDER-001] preserves the recovered seven-stage order", () => {
    expect(constructionStageOrder).toEqual([
      "reference", "spatial-role-vector", "construction-feet",
      "couplings", "quantity", "control", "release"
    ]);
  });

  it("[CON-ORDER-002] recognises an order-consistent supplied sequence", () => {
    const result = auditConstructionOrder([
      "reference", "spatial-role-vector", "construction-feet",
      "couplings", "quantity", "control", "release"
    ]);
    expect(result.status).toBe("ORDER_CONSISTENT");
    expect(result.ordered).toBe(true);
    expect(result.issues).toEqual([]);
  });

  it("[CON-ORDER-003] permits repeated stages without inventing cardinality rules", () => {
    const result = auditConstructionOrder([
      "reference", "spatial-role-vector", "construction-feet",
      "construction-feet", "couplings", "quantity", "control", "release"
    ]);
    expect(result.status).toBe("ORDER_CONSISTENT");
  });

  it("[CON-ORDER-004] detects a stage that appears before an earlier required position", () => {
    const result = auditConstructionOrder([
      "reference", "construction-feet", "spatial-role-vector", "release", "control"
    ]);
    expect(result.status).toBe("ORDER_INCONSISTENT");
    expect(result.issues.map(issue => issue.stage)).toEqual([
      "spatial-role-vector", "control"
    ]);
  });

  it("[CON-ORDER-005] does not infer required stages from an empty or partial sequence", () => {
    const empty = auditConstructionOrder([]);
    const partial = auditConstructionOrder(["reference", "construction-feet"]);
    expect(empty.status).toBe("INSUFFICIENT_SEQUENCE");
    expect(empty.ordered).toBeNull();
    expect(partial.status).toBe("ORDER_CONSISTENT");
    expect(partial.unresolved).toContain("Whether any stage may be omitted.");
  });

  it("[CON-ORDER-006] keeps order review separate from construction and feasibility", () => {
    const result = auditConstructionOrder(["reference", "release"]);
    expect(result.limitation).toContain("not a complete construction");
    expect(result.unresolved).toContain("The exact v2.0 Foot, coupling, landmark and KAN/KEN/KAS rules.");
  });

  it("[CON-ORDER-007] rejects unknown runtime stage values instead of silently skipping them", () => {
    const result = auditConstructionOrder(["reference", "invented-stage", "release"]);
    expect(result.status).toBe("INVALID_SEQUENCE");
    expect(result.ordered).toBeNull();
    expect(result.issues).toMatchObject([{ code: "UNKNOWN_STAGE", index: 1 }]);
  });

  it("[CON-ORDER-008] rejects non-array runtime input", () => {
    const result = auditConstructionOrder("reference");
    expect(result.status).toBe("INVALID_SEQUENCE");
    expect(result.issues[0]).toMatchObject({ code: "SEQUENCE_NOT_ARRAY", index: -1 });
  });

  it("[CON-ORDER-009] preserves ordering diagnostics alongside unknown-stage diagnostics", () => {
    const result = auditConstructionOrder([
      "reference", "construction-feet", "spatial-role-vector", "not-a-stage"
    ]);
    expect(result.status).toBe("INVALID_SEQUENCE");
    expect(result.issues.map(issue => issue.code)).toEqual([
      "STAGE_OUT_OF_ORDER", "UNKNOWN_STAGE"
    ]);
  });
});
