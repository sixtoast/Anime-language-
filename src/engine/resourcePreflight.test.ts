import { describe, expect, it } from "vitest";
import { evaluateResourcePreflight, type ResourcePreflightInput } from "./resourcePreflight";

const valid = (): ResourcePreflightInput => ({
  resourceKind: "water-stock", accountId: "tank-a", unit: "L", requiredUnit: "L", budgetUnit: "L", unitContractId: "litre-v1",
  openingBalance: 100, openingBalanceEvidence: "PASS", sourceEvidence: "PASS",
  evidenceFreshness: "PASS", requiredAmount: 30, heldReservations: 20,
  reservationEvidence: "PASS", budgetLimit: 40, conservativeConsumptionUpperBound: 35,
  budgetEvidence: "PASS"
});

describe("Arcane Incantations v1.9 resource preflight", () => {
  it("[RES19-EVAL-001] computes verified unreserved availability", () => {
    expect(evaluateResourcePreflight(valid())).toMatchObject({ outcome: "RESOURCE-READY", availableAmount: 80 });
  });
  it("[RES19-EVAL-002] refuses missing resource and unit contracts", () => {
    expect(evaluateResourcePreflight({ ...valid(), unitContractId: undefined }).outcome).toBe("RESOURCE-SPEC-UNDERSPECIFIED");
  });
  it("[RES19-EVAL-003] refuses implicit unit conversion", () => {
    expect(evaluateResourcePreflight({ ...valid(), requiredUnit: "mL" }).outcome).toBe("UNIT-CONTRACT-MISSING");
    expect(evaluateResourcePreflight({ ...valid(), budgetUnit: "mL" }).outcome).toBe("RESOURCE-OUTCOME-UNKNOWN");
  });
  it("[RES19-EVAL-004] refuses unknown opening balances", () => {
    expect(evaluateResourcePreflight({ ...valid(), openingBalance: null }).outcome).toBe("RESOURCE-OUTCOME-UNKNOWN");
  });
  it("[RES19-EVAL-005] requires verified source and fresh evidence", () => {
    expect(evaluateResourcePreflight({ ...valid(), sourceEvidence: "FAIL" }).outcome).toBe("SOURCE-UNVERIFIED");
    expect(evaluateResourcePreflight({ ...valid(), evidenceFreshness: "FAIL" }).outcome).toBe("RESOURCE-EVIDENCE-STALE");
  });
  it("[RES19-EVAL-006] accounts for held reservations without calling them consumption", () => {
    expect(evaluateResourcePreflight({ ...valid(), heldReservations: 100 }).outcome).toBe("RESERVATION-CONFLICT");
    expect(evaluateResourcePreflight({ ...valid(), requiredAmount: 81 }).outcome).toBe("RESOURCE-INSUFFICIENT");
  });
  it("[RES19-EVAL-007] enforces conservative budget upper bounds", () => {
    expect(evaluateResourcePreflight({ ...valid(), conservativeConsumptionUpperBound: 41 }).outcome).toBe("BUDGET-EXCEEDED");
  });
  it("[RES19-EVAL-008] refuses incomplete or unverified budget evidence", () => {
    expect(evaluateResourcePreflight({ ...valid(), budgetEvidence: "UNKNOWN" }).outcome).toBe("RESOURCE-OUTCOME-UNKNOWN");
  });
  it("[RES19-EVAL-009] does not infer unit conversion or execution", () => {
    const result = evaluateResourcePreflight(valid());
    expect(result.limitations.join(" ")).toContain("No implicit or inferred unit conversion");
    expect(result.limitations.join(" ")).toContain("does not execute");
  });
});
