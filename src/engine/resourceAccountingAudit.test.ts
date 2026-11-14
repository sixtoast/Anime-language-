import { describe, expect, it } from "vitest";
import {
  assessResourceAccountingAuditStructure,
  RESOURCE_ACCOUNTING_AUDIT_SECTIONS
} from "./resourceAccountingAudit";

const record = (): Record<string, unknown> => ({
  resourceDefinitions: [],
  accountSnapshots: [],
  budgets: [],
  sourceClaims: [],
  reservations: [],
  ledgerEvents: [],
  transformations: [],
  conservationChecks: [],
  estimates: [],
  observations: [],
  reconciliation: null,
  uncertainty: null,
  unresolvedDiscrepancies: [],
  contractVersions: []
});

describe("Arcane Incantations v1.9 audit-record structure assessment", () => {
  it("[RES19-AUDIT-001] recognises all 14 top-level sections while preserving an unknown outcome", () => {
    const result = assessResourceAccountingAuditStructure({
      record: record(),
      reportedResourceOutcome: "RESOURCE-OUTCOME-UNKNOWN"
    });

    expect(result).toMatchObject({
      status: "AUDIT-STRUCTURE-PRESENT",
      reportedResourceOutcome: "RESOURCE-OUTCOME-UNKNOWN",
      outcomeInterpretation: "NOT-ASSESSED",
      presentSections: [...RESOURCE_ACCOUNTING_AUDIT_SECTIONS],
      missingSections: [],
      diagnostics: []
    });
  });

  it("[RES19-AUDIT-002] reports absent and undefined sections without filling them", () => {
    const incomplete = record();
    delete incomplete.reservations;
    incomplete.contractVersions = undefined;

    const result = assessResourceAccountingAuditStructure({
      record: incomplete,
      reportedResourceOutcome: "RESOURCE-OUTCOME-UNKNOWN"
    });

    expect(result.status).toBe("AUDIT-STRUCTURE-INCOMPLETE");
    expect(result.missingSections).toEqual(["reservations", "contractVersions"]);
    expect(result.diagnostics).toContainEqual(expect.objectContaining({
      code: "AUDIT-RECORD-SECTIONS-MISSING"
    }));
    expect(Object.prototype.hasOwnProperty.call(incomplete, "reservations")).toBe(false);
    expect(incomplete.contractVersions).toBeUndefined();
  });

  it("[RES19-AUDIT-003] treats explicit null and empty collections as present rather than inventing content", () => {
    const result = assessResourceAccountingAuditStructure({
      record: record(),
      reportedResourceOutcome: "RESOURCE-OUTCOME-UNKNOWN"
    });

    expect(result.status).toBe("AUDIT-STRUCTURE-PRESENT");
    expect(result.presentSections).toContain("reconciliation");
    expect(result.presentSections).toContain("uncertainty");
    expect(result.presentSections).toContain("contractVersions");
    expect(result.limitations).toContain(
      "An explicit null or empty section counts as present and does not establish that required evidence or records exist."
    );
  });

  it("[RES19-AUDIT-004] preserves a failed resource outcome without promoting it to success", () => {
    const result = assessResourceAccountingAuditStructure({
      record: record(),
      reportedResourceOutcome: "CONSERVATION-MISMATCH"
    });

    expect(result).toMatchObject({
      status: "AUDIT-STRUCTURE-PRESENT",
      reportedResourceOutcome: "CONSERVATION-MISMATCH",
      outcomeInterpretation: "NOT-ASSESSED"
    });
  });

  it("[RES19-AUDIT-005] rejects malformed records and missing outcome labels", () => {
    expect(assessResourceAccountingAuditStructure({
      record: [],
      reportedResourceOutcome: "RESOURCE-OUTCOME-UNKNOWN"
    }).status).toBe("AUDIT-STRUCTURE-INVALID");
    expect(assessResourceAccountingAuditStructure({
      record: record(),
      reportedResourceOutcome: " "
    }).status).toBe("AUDIT-STRUCTURE-INVALID");
  });

  it("[RES19-AUDIT-006] does not mutate the supplied record", () => {
    const supplied = record();
    const before = JSON.stringify(supplied);

    assessResourceAccountingAuditStructure({
      record: supplied,
      reportedResourceOutcome: "RESOURCE-OUTCOME-UNKNOWN"
    });

    expect(JSON.stringify(supplied)).toBe(before);
  });
});
