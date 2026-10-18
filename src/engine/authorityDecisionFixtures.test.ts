import { describe, expect, it } from "vitest";
import authorityDecisionSpec from "../../docs/canon/arcane-incantations-v2.0-authority-and-authorization-decision-contracts.md?raw";
import { authorityDecisionFixtures, parseAuthorityDecisionFixtures } from "./authorityDecisionFixtures";

describe("Arcane Incantations v2.0 authority-decision specification fixtures", () => {
  it("[AUTH20-TEST-001] reads all 60 fixtures directly from the locked specification", () => {
    expect(authorityDecisionFixtures).toHaveLength(60);
    expect(authorityDecisionFixtures[0]?.id).toBe("AUTH20-01");
    expect(authorityDecisionFixtures.at(-1)?.id).toBe("AUTH20-60");
  });

  it("[AUTH20-TEST-002] preserves every stable identity in sequence", () => {
    const ids = authorityDecisionFixtures.map((fixture) => fixture.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(Array.from({ length: 60 }, (_, index) => "AUTH20-" + String(index + 1).padStart(2, "0")));
  });

  it("[AUTH20-TEST-003] preserves permit, denial, uncertainty and unavailable as distinct outcomes", () => {
    expect(authorityDecisionFixtures.find((fixture) => fixture.id === "AUTH20-01")?.expectedOutcome).toBe("PERMIT");
    expect(authorityDecisionFixtures.find((fixture) => fixture.id === "AUTH20-07")?.expectedOutcome).toContain("DENY; block");
    expect(authorityDecisionFixtures.find((fixture) => fixture.id === "AUTH20-23")?.expectedOutcome).toContain("INDETERMINATE; block");
    expect(authorityDecisionFixtures.find((fixture) => fixture.id === "AUTH20-54")?.expectedOutcome).toContain("UNAVAILABLE; block");
  });

  it("[AUTH20-TEST-004] retains the non-substitution rule for resources, authority, consent and execution", () => {
    expect(authorityDecisionFixtures.find((fixture) => fixture.id === "AUTH20-46")?.expectedOutcome).toContain("resource success does not override it");
    expect(authorityDecisionFixtures.find((fixture) => fixture.id === "AUTH20-48")).toMatchObject({ caseDescription: expect.stringContaining("required consent gate is absent"), expectedOutcome: "Block" });
    expect(authorityDecisionFixtures.find((fixture) => fixture.id === "AUTH20-60")?.expectedOutcome).toContain("execution remains NOT-EXECUTED");
    expect(authorityDecisionSpec).toContain("not evidence of a runtime");
    expect(authorityDecisionSpec).toContain("without selecting a universal authority hierarchy");
  });

  it("[AUTH20-TEST-005] rejects a missing fixture table", () => {
    expect(() => parseAuthorityDecisionFixtures("# no fixture table")).toThrow("table header not found");
  });

  it("[AUTH20-TEST-006] rejects malformed rows instead of silently truncating them", () => {
    expect(() => parseAuthorityDecisionFixtures(
      authorityDecisionSpec.replace(
        "| AUTH20-01 | Complete request, trusted issuer, exact current permit, scope matches | PERMIT |",
        "| AUTH20-01 | broken row |"
      )
    )).toThrow("Malformed authority decision fixture row");
  });

  it("[AUTH20-TEST-007] rejects duplicate fixture identities", () => {
    const duplicate = authorityDecisionSpec.replace(
      "| AUTH20-02 | Request omits SUBJECT | MALFORMED-REQUEST; block |",
      "| AUTH20-01 | Request omits SUBJECT | MALFORMED-REQUEST; block |"
    );
    expect(() => parseAuthorityDecisionFixtures(duplicate)).toThrow("Duplicate authority decision fixture ID");
  });

  it("[AUTH20-TEST-008] exposes the source fixture set as specification records only", () => {
    expect(authorityDecisionSpec).toContain("not evidence of an implemented authority service");
    expect(authorityDecisionSpec).toContain("No spoken Arcane syntax for authority decisions is established");
    expect(authorityDecisionFixtures.every((fixture) => fixture.caseDescription.length > 0 && fixture.expectedOutcome.length > 0)).toBe(true);
  });
});
