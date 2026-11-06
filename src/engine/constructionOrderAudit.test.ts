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
    expect(result.issues.map((issue) => issue.stage)).toEqual([
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
});
