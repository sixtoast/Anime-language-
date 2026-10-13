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
