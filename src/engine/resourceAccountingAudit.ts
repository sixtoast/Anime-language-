/**
 * v1.9 §8 resource-accounting audit structure assessment.
 *
 * This is deliberately a presence-only check of the 14 top-level record
 * sections. It does not validate their contents or claim semantic audit
 * completeness. A reported resource outcome is copied verbatim and never
 * interpreted as conservation, feasibility, execution or overall success.
 */
export const RESOURCE_ACCOUNTING_AUDIT_SECTIONS = [
  "resourceDefinitions",
  "accountSnapshots",
  "budgets",
  "sourceClaims",
  "reservations",
  "ledgerEvents",
  "transformations",
  "conservationChecks",
  "estimates",
  "observations",
  "reconciliation",
  "uncertainty",
  "unresolvedDiscrepancies",
  "contractVersions"
] as const;

export type ResourceAccountingAuditSection =
  typeof RESOURCE_ACCOUNTING_AUDIT_SECTIONS[number];

export type ResourceAccountingAuditStructureStatus =
  | "AUDIT-STRUCTURE-PRESENT"
  | "AUDIT-STRUCTURE-INCOMPLETE"
  | "AUDIT-STRUCTURE-INVALID";

export interface ResourceAccountingAuditStructureInput {
  record: unknown;
  reportedResourceOutcome: string;
}

export interface ResourceAccountingAuditStructureResult {
  status: ResourceAccountingAuditStructureStatus;
  reportedResourceOutcome?: string;
  outcomeInterpretation: "NOT-ASSESSED";
  presentSections: ResourceAccountingAuditSection[];
  missingSections: ResourceAccountingAuditSection[];
  diagnostics: { code: string; message: string }[];
  limitations: string[];
}

const LIMITATIONS = [
  "Only the presence of the 14 top-level v1.9 record sections is checked; their shapes, contents and internal completeness are not validated.",
  "An explicit null or empty section counts as present and does not establish that required evidence or records exist.",
  "Contract versions, evidence references, provenance, uncertainty, rounding and tolerance content remain caller-supplied and unauthenticated.",
  "The reported resource outcome is preserved verbatim but is not interpreted, authenticated or promoted to an overall success claim.",
  "This assessment does not evaluate conservation, reconcile balances, mutate a ledger, authorise, execute or verify an effect."
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const nonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export function assessResourceAccountingAuditStructure(
  input: ResourceAccountingAuditStructureInput
): ResourceAccountingAuditStructureResult {
  const candidate = input as unknown as Record<string, unknown> | null;
  const record = isRecord(candidate) && isRecord(candidate.record)
    ? candidate.record
    : undefined;
  const reportedResourceOutcome = isRecord(candidate) &&
    nonEmptyString(candidate.reportedResourceOutcome)
    ? candidate.reportedResourceOutcome
    : undefined;

  if (!record || !reportedResourceOutcome) {
    return {
      status: "AUDIT-STRUCTURE-INVALID",
      ...(reportedResourceOutcome ? { reportedResourceOutcome } : {}),
      outcomeInterpretation: "NOT-ASSESSED",
      presentSections: [],
      missingSections: [...RESOURCE_ACCOUNTING_AUDIT_SECTIONS],
      diagnostics: [{
        code: "AUDIT-RECORD-INPUT-INVALID",
        message: "A non-array record object and a non-empty reported resource-outcome label are required."
      }],
      limitations: [...LIMITATIONS]
    };
  }

  const presentSections = RESOURCE_ACCOUNTING_AUDIT_SECTIONS.filter((section) =>
    Object.prototype.hasOwnProperty.call(record, section) &&
    record[section] !== undefined
  );
  const missingSections = RESOURCE_ACCOUNTING_AUDIT_SECTIONS.filter((section) =>
    !Object.prototype.hasOwnProperty.call(record, section) ||
    record[section] === undefined
  );

  if (missingSections.length > 0) {
    return {
      status: "AUDIT-STRUCTURE-INCOMPLETE",
      reportedResourceOutcome,
      outcomeInterpretation: "NOT-ASSESSED",
      presentSections,
      missingSections,
      diagnostics: [{
        code: "AUDIT-RECORD-SECTIONS-MISSING",
        message: "The following top-level v1.9 audit sections are absent or undefined: " + missingSections.join(", ") + "."
      }],
      limitations: [...LIMITATIONS]
    };
  }

  return {
    status: "AUDIT-STRUCTURE-PRESENT",
    reportedResourceOutcome,
    outcomeInterpretation: "NOT-ASSESSED",
    presentSections,
    missingSections: [],
    diagnostics: [],
    limitations: [...LIMITATIONS]
  };
}
