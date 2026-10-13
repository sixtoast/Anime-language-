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

  it("records a control call containing a block without treating its signature as approved", () => {
    const controlCase = audit.observations.find((item) => item.id === "P6G-FX-008");
    expect(controlCase?.observedShape).toBe("Call-with-Block");
    expect(controlCase?.comparison).toBe("context-dependent");
    expect(controlCase?.note).toContain("Observation only");
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

  it("does not label observational comparisons as fixture acceptance or canon approval", () => {
    expect(audit.status).toBe("observations-generated-not-acceptance");
    expect(audit.canonEffect).toBe("none");
    expect(audit.observations.every((item) => item.note.length > 0)).toBe(true);
  });
});
