import { describe, expect, it } from "vitest";
import {
  getRequiredContractFields,
  isAuthorityDecisionOutcome,
  isContractRecordKind,
  isDecisionOutcomePermitEligible,
  mapCompositionOutcomeToAuthority,
  validateContractRecord,
  type ContractRecordKind
} from "./incantationContractRecords";

const completeRecord = (kind: ContractRecordKind): Record<string, unknown> =>
  Object.fromEntries(getRequiredContractFields(kind).map((field) => [field, field.endsWith("S") ? [] : "declared"]));

describe("source-grounded incantation contract record validation", () => {
  it("[CONTRACT-REC-001] validates structural completeness for every v1.9-v2.1 record family", () => {
    const kinds: ContractRecordKind[] = [
      "RESOURCE-DEFINITION", "RESOURCE-ACCOUNT", "LEDGER-EVENT", "RESOURCE-SOURCE",
      "RESOURCE-TRANSFER", "RESOURCE-TRANSFORMATION", "RESOURCE-BUDGET",
      "RESERVATION", "CONSERVATION-CONTRACT", "AUTHORISATION-REQUEST",
      "AUTHORITY-DECISION", "POLICY-PROFILE", "POLICY-BUNDLE",
      "COMPOSITION-PLAN", "COMPOSITION-RECORD"
    ];
    for (const kind of kinds) {
      expect(validateContractRecord(kind, completeRecord(kind)).valid, kind).toBe(true);
    }
  });

  it("[CONTRACT-REC-002] reports each missing required field without guessing a value", () => {
    const record = completeRecord("AUTHORISATION-REQUEST");
    delete record.SUBJECT;
    delete record.TARGET;
    const result = validateContractRecord("AUTHORISATION-REQUEST", record);
    expect(result.valid).toBe(false);
    expect(result.issues.map((issue) => issue.field)).toEqual(["SUBJECT", "TARGET"]);
    expect(result.issues.every((issue) => issue.code === "REQUIRED_FIELD_MISSING")).toBe(true);
  });

  it("[CONTRACT-REC-003] rejects non-object records and empty required strings", () => {
    expect(validateContractRecord("AUTHORITY-DECISION", null).issues[0]?.code)
      .toBe("RECORD_NOT_OBJECT");
    const record = completeRecord("POLICY-PROFILE");
    record["PROFILE-VERSION"] = "  ";
    expect(validateContractRecord("POLICY-PROFILE", record).issues).toContainEqual(
      expect.objectContaining({ code: "REQUIRED_FIELD_EMPTY", field: "PROFILE-VERSION" })
    );
  });

  it("[CONTRACT-REC-004] permits empty collections where an explicit empty set is meaningful", () => {
    const record = completeRecord("AUTHORITY-DECISION");
    record.CONDITIONS = [];
    record["DELEGATION-CHAIN"] = [];
    expect(validateContractRecord("AUTHORITY-DECISION", record).valid).toBe(true);
  });

  it("[CONTRACT-REC-005] keeps all v2.0 authority outcomes distinct", () => {
    const outcomes = [
      "PERMIT", "DENY", "CONDITIONAL-PERMIT", "INDETERMINATE", "UNAVAILABLE",
      "EXPIRED", "REVOKED", "SCOPE-MISMATCH", "ISSUER-UNTRUSTED", "MALFORMED-DECISION"
    ];
    expect(outcomes.every(isAuthorityDecisionOutcome)).toBe(true);
    expect(isAuthorityDecisionOutcome("APPROVED")).toBe(false);
  });

  it("[CONTRACT-REC-006] only allows PERMIT or satisfied CONDITIONAL-PERMIT as outcome-eligible", () => {
    expect(isDecisionOutcomePermitEligible("PERMIT")).toBe(true);
    expect(isDecisionOutcomePermitEligible("CONDITIONAL-PERMIT", true)).toBe(true);
    expect(isDecisionOutcomePermitEligible("CONDITIONAL-PERMIT", false)).toBe(false);
    expect(isDecisionOutcomePermitEligible("INDETERMINATE")).toBe(false);
    expect(isDecisionOutcomePermitEligible("UNAVAILABLE")).toBe(false);
    expect(isDecisionOutcomePermitEligible("DENY")).toBe(false);
  });

  it("[CONTRACT-REC-007] maps explicit composition results without turning uncertainty into denial", () => {
    expect(mapCompositionOutcomeToAuthority("COMPOSED-PERMIT")).toBe("PERMIT");
    expect(mapCompositionOutcomeToAuthority("COMPOSED-DENY")).toBe("DENY");
    expect(mapCompositionOutcomeToAuthority("PROFILE-UNAVAILABLE")).toBe("UNAVAILABLE");
    expect(mapCompositionOutcomeToAuthority("PROFILE-UNTRUSTED")).toBe("ISSUER-UNTRUSTED");
    expect(mapCompositionOutcomeToAuthority("PROFILE-EXPIRED")).toBe("EXPIRED");
    for (const outcome of [
      "INDETERMINATE", "PROFILE-CONFLICT", "NO-APPLICABLE-PROFILE",
      "PROFILE-STALE", "COMPOSITION-ERROR"
    ] as const) {
      expect(mapCompositionOutcomeToAuthority(outcome)).toBe("INDETERMINATE");
    }
  });

  it("[CONTRACT-REC-008] never presents structural validity as runtime or execution validation", () => {
    const result = validateContractRecord("AUTHORITY-DECISION", completeRecord("AUTHORITY-DECISION"));
    expect(result.limitation).toContain("does not prove");
    expect(result.limitation).toContain("execution");
  });
  it("[CONTRACT-REC-009] rejects unknown runtime record kinds without indexing undefined schemas", () => {
    expect(isContractRecordKind("AUTHORITY-DECISION")).toBe(true);
    expect(isContractRecordKind("AUTHORITY-DECISION-PLUS")).toBe(false);
    expect(validateContractRecord("UNKNOWN-KIND" as never, {}).issues[0]).toMatchObject({
      code: "UNKNOWN_RECORD_KIND", recordKind: "UNKNOWN"
    });
  });
  it("[CONTRACT-REC-010] makes direct required-field lookup fail explicitly for unknown kinds", () => {
    expect(() => getRequiredContractFields("UNKNOWN-KIND" as never)).toThrow(RangeError);
  });
});
