import { describe, expect, it } from "vitest";
import { evaluateResourcePreflight, type ResourcePreflightInput } from "./resourcePreflight";

const valid = (): ResourcePreflightInput => ({
  resourceKind: "water-stock", accountId: "tank-a", unit: "L", requiredUnit: "L", budgetUnit: "L", unitContractId: "litre-v1",
  contractVersionRef: "resource-contract:v1",
  openingBalance: 100, openingBalanceEvidence: "PASS", sourceEvidence: "PASS",
  evidenceFreshness: "PASS",
  availabilityWindow: {
    validFrom: "2026-01-01T00:00:00Z",
    validUntil: "2027-01-01T00:00:00Z",
    evaluationTime: "2026-06-01T00:00:00Z",
    evidenceRef: "availability-evidence:1",
    provenanceRef: "source-provenance:1"
  },
  requiredAmount: 30, heldReservations: 20,
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
    expect(evaluateResourcePreflight({ ...valid(), heldReservations: 101 }).outcome).toBe("RESERVATION-CONFLICT");
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
  it("[RES19-EVAL-010] requires an explicit availability window and provenance", () => {
    const baseWindow = valid().availabilityWindow!;
    const missing = evaluateResourcePreflight({ ...valid(), availabilityWindow: undefined });
    expect(missing.outcome).toBe("RESOURCE-OUTCOME-UNKNOWN");
    expect(missing.diagnostics).toContainEqual(expect.objectContaining({ code: "AVAILABILITY-WINDOW-UNRESOLVED" }));

    const missingProvenance = evaluateResourcePreflight({
      ...valid(),
      availabilityWindow: { ...baseWindow, provenanceRef: " " }
    });
    expect(missingProvenance.outcome).toBe("RESOURCE-OUTCOME-UNKNOWN");

    const invalidCalendarDate = evaluateResourcePreflight({
      ...valid(),
      availabilityWindow: { ...baseWindow, validFrom: "2026-02-30T00:00:00Z" }
    });
    expect(invalidCalendarDate.outcome).toBe("RESOURCE-OUTCOME-UNKNOWN");
  });
  it("[RES19-EVAL-011] marks availability evidence outside its window as stale", () => {
    const baseWindow = valid().availabilityWindow!;
    for (const evaluationTime of ["2025-12-31T23:59:59Z", "2027-01-01T00:00:01Z"]) {
      const result = evaluateResourcePreflight({
        ...valid(),
        availabilityWindow: { ...baseWindow, evaluationTime }
      });
      expect(result.outcome).toBe("RESOURCE-EVIDENCE-STALE");
      expect(result.diagnostics).toContainEqual(expect.objectContaining({ code: "RESOURCE-EVIDENCE-STALE" }));
    }
  });
  it("[RES19-EVAL-012] accepts only an unambiguous interior time in the availability window", () => {
    expect(evaluateResourcePreflight(valid()).outcome).toBe("RESOURCE-READY");
    const baseWindow = valid().availabilityWindow!;
    for (const evaluationTime of [baseWindow.validFrom, baseWindow.validUntil]) {
      const result = evaluateResourcePreflight({
        ...valid(),
        availabilityWindow: { ...baseWindow, evaluationTime }
      });
      expect(result.outcome).toBe("RESOURCE-OUTCOME-UNKNOWN");
      expect(result.diagnostics).toContainEqual(expect.objectContaining({
        code: "AVAILABILITY-WINDOW-BOUNDARY-AMBIGUOUS"
      }));
    }
  });
  it("[RES19-EVAL-013] returns the exact opaque contract version for downstream reconciliation", () => {
    const ready = evaluateResourcePreflight(valid());
    expect(ready).toMatchObject({ outcome: "RESOURCE-READY", contractVersionRef: "resource-contract:v1" });
    const missing = evaluateResourcePreflight({ ...valid(), contractVersionRef: " " });
    expect(missing.outcome).toBe("RESOURCE-SPEC-UNDERSPECIFIED");
    expect(missing.contractVersionRef).toBe("");
    expect(missing.diagnostics).toContainEqual(expect.objectContaining({ code: "RESOURCE-SPEC-UNDERSPECIFIED" }));
  });

  it("[RES19-EVAL-014] preserves nanosecond availability-window ordering", () => {
    const baseWindow = valid().availabilityWindow!;
    const preciseWindow = {
      ...baseWindow,
      validFrom: "2026-01-01T00:00:00.000000001Z",
      validUntil: "2026-01-01T00:00:00.000000003Z",
      evaluationTime: "2026-01-01T02:00:00.000000002+02:00"
    };
    expect(evaluateResourcePreflight({ ...valid(), availabilityWindow: preciseWindow }).outcome)
      .toBe("RESOURCE-READY");

    for (const evaluationTime of [
      "2026-01-01T02:00:00.000000001+02:00",
      "2026-01-01T02:00:00.000000003+02:00"
    ]) {
      const boundary = evaluateResourcePreflight({
        ...valid(),
        availabilityWindow: { ...preciseWindow, evaluationTime }
      });
      expect(boundary.outcome).toBe("RESOURCE-OUTCOME-UNKNOWN");
      expect(boundary.diagnostics).toContainEqual(expect.objectContaining({
        code: "AVAILABILITY-WINDOW-BOUNDARY-AMBIGUOUS"
      }));
    }

    for (const evaluationTime of [
      "2026-01-01T00:00:00.000000000Z",
      "2026-01-01T00:00:00.000000004Z"
    ]) {
      const stale = evaluateResourcePreflight({
        ...valid(),
        availabilityWindow: { ...preciseWindow, evaluationTime }
      });
      expect(stale.outcome).toBe("RESOURCE-EVIDENCE-STALE");
      expect(stale.diagnostics).toContainEqual(expect.objectContaining({
        code: "RESOURCE-EVIDENCE-STALE"
      }));
    }

    const unsupportedPrecision = evaluateResourcePreflight({
      ...valid(),
      availabilityWindow: {
        ...preciseWindow,
        evaluationTime: "2026-01-01T00:00:00.0000000001Z"
      }
    });
    expect(unsupportedPrecision.outcome).toBe("RESOURCE-OUTCOME-UNKNOWN");
    expect(unsupportedPrecision.diagnostics).toContainEqual(expect.objectContaining({
      code: "AVAILABILITY-WINDOW-UNRESOLVED"
    }));
  });


});
