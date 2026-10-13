import { describe, expect, it } from "vitest";
import fixtureData from "../../tests/fixtures/phase6g-surface-parser-cases.json";
import { auditPhase6GFixtures, type Phase6GFixture } from "./phase6gFixtureAudit";

const suite = fixtureData as {
  suiteId: string;
  cases: Phase6GFixture[];
};

describe("recovered Phase 6G fixture observations", () => {
  const audit = auditPhase6GFixtures(suite.suiteId, suite.cases);

  it("produces exactly one observation for each recovered stable fixture ID", () => {
    expect(audit.fixtureCount).toBe(suite.cases.length);
    expect(audit.observations.map((item) => item.id)).toEqual(suite.cases.map((item) => item.id));
    expect(new Set(audit.observations.map((item) => item.id)).size).toBe(suite.cases.length);
  });

  it("checks expected root-node kinds for directly accepted fixtures", () => {
    const cases: Phase6GFixture[] = [
      { id: "NODE-001", category: "numeral", label: "correct quantity root", input: "ki sho", expected: "accept", expectedNode: "QuantityLiteral", canonStatus: "provisional" },
      { id: "NODE-002", category: "numeral", label: "incorrect expected root", input: "ki sho", expected: "accept", expectedNode: "Call", canonStatus: "provisional" }
    ];
    const audit = auditPhase6GFixtures("ROOT-NODE-CHECK", cases);
    expect(audit.observations[0]?.observedNode).toBe("QuantityLiteral");
    expect(audit.observations[0]?.comparison).toBe("match");
    expect(audit.observations[1]?.comparison).toBe("mismatch");
    expect(audit.directMismatches).toBe(1);
  });

  it("probes recovered identifier fixtures in the KWAT identifier slot without changing their input", () => {
    const acceptedIdentifier = audit.observations.find((item) => item.id === "P6G-FX-005");
    const rejectedIdentifier = audit.observations.find((item) => item.id === "P6G-FX-006");
    expect(acceptedIdentifier?.input).toBe("KI TO SHO");
    expect(acceptedIdentifier?.observedSlotNode).toBe("Identifier");
    expect(acceptedIdentifier?.comparison).toBe("context-dependent");
    expect(rejectedIdentifier?.input).toBe("KI TO");
    expect(rejectedIdentifier?.slotProbeDiagnosticCodes).toContain("IDENTIFIER_NOT_CLOSED");
    expect(rejectedIdentifier?.comparison).toBe("context-dependent");
  });

  it("compares only explicitly mapped historical diagnostic families", () => {
    const byId = (id: string) => audit.observations.find((item) => item.id === id);
    expect(byId("P6G-FX-003")?.errorFamilyComparison).toBe("match");
    expect(byId("P6G-FX-004")?.errorFamilyComparison).toBe("match");
    expect(byId("P6G-FX-006")?.errorFamilyComparison).toBe("match");
    expect(byId("P6G-FX-009")?.errorFamilyComparison).toBe("match");
    expect(byId("P6G-FX-010")?.errorFamilyComparison).toBe("match");
    // Archived Python code accepts these numerals; prose-level homophone expectations differ.
    expect(byId("P6G-FX-011")?.errorFamilyComparison).toBe("not-comparable");
    expect(byId("P6G-FX-012")?.errorFamilyComparison).toBe("not-comparable");
    expect(byId("P6G-FX-011")?.note).toContain("Archived Python numeral()");
    expect(byId("P6G-FX-012")?.note).toContain("Archived Python numeral()");
    expect(byId("P6G-FX-011")?.historicalBehavior).toBe("accept");
    expect(byId("P6G-FX-012")?.historicalBehavior).toBe("accept");
    expect(byId("P6G-FX-011")?.historicalEvidence).toContain("Parser.numeral()");
    expect(byId("P6G-FX-012")?.historicalEvidence).toContain("Parser.numeral()");
    expect(byId("P6G-FX-013")?.errorFamilyComparison).toBe("match");
    expect(byId("P6G-FX-015")?.errorFamilyComparison).toBe("match");
    expect(byId("P6G-FX-008")?.errorFamilyComparison).toBeUndefined();
  });

  it("records a control call containing a block without treating its signature as approved", () => {
    const controlCase = audit.observations.find((item) => item.id === "P6G-FX-008");
    expect(controlCase?.observedShape).toBe("Call-with-Block");
    expect(controlCase?.comparison).toBe("context-dependent");
    expect(controlCase?.note).toContain("Context-dependent fixture");
    expect(audit.canonEffect).toBe("none");
  });

  it("records current alias-normalisation behaviour only when explicitly enabled for the fixture", () => {
    const aliasCase = audit.observations.find((item) => item.id === "P6G-FX-014");
    expect(aliasCase?.comparison).toBe("match");
    expect(aliasCase?.observedOperator).toBe("FRAJA");
  });

  it("keeps unresolved homophone fixtures rejected by the current parser", () => {
    expect(audit.observations.find((item) => item.id === "P6G-FX-011")?.comparison)
      .toBe("conditional-unresolved");
    expect(audit.observations.find((item) => item.id === "P6G-FX-012")?.comparison)
      .toBe("conditional-unresolved");
  });

  it("reports diagnostic-family comparisons separately from direct syntax comparisons", () => {
    expect(audit.diagnosticFamilyMatches).toBe(7);
    expect(audit.diagnosticFamilyMismatches).toBe(0);
    expect(audit.diagnosticFamiliesNotComparable).toBe(2);
    expect(audit.directMatches).toBe(9);
    expect(audit.directMismatches).toBe(0);
    // Equal counts here are coincidental; they represent different comparisons.
  });

  it("does not guess when a historical error family has no explicit mapping", () => {
    const unknownFamily: Phase6GFixture = {
      id: "ERROR-FAMILY-UNKNOWN",
      category: "diagnostic",
      label: "unmapped historical family",
      input: "ki to",
      expected: "reject",
      expectedErrorFamily: "historical-family-not-mapped",
      canonStatus: "provisional"
    };
    const result = auditPhase6GFixtures("UNKNOWN-ERROR-FAMILY", [unknownFamily]);
    expect(result.observations[0]?.errorFamilyComparison).toBe("not-comparable");
    expect(result.diagnosticFamiliesNotComparable).toBe(1);
  });

  it("does not label observational comparisons as fixture acceptance or canon approval", () => {
    expect(audit.status).toBe("observations-generated-not-acceptance");
    expect(audit.canonEffect).toBe("none");
    expect(audit.observations.every((item) => item.note.length > 0)).toBe(true);
  });
});
