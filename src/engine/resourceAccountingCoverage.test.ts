import { describe, expect, it } from "vitest";
import { resourceAccountingFixtures } from "./resourceAccountingFixtures";
import { resourceAccountingCoverage, resourceAccountingCoverageAudit, resourceAccountingCoverageSummary } from "./resourceAccountingCoverage";
import { workbenchTests } from "./testRegistry";

const registeredTestSources = import.meta.glob("./*.test.ts", {
  eager: true,
  query: "?raw",
  import: "default"
}) as Record<string, string>;

describe("Arcane Incantations v1.9 fixture-to-implementation coverage audit", () => {
  it("[RES19-COVERAGE-001] maps all canonical fixtures exactly once in source order", () => {
    expect(resourceAccountingCoverageAudit).toMatchObject({
      fixtureCount: 60,
      mappedCount: 60,
      fixtureIdsMatch: true
    });
    expect(resourceAccountingCoverage.map((item) => item.fixtureId))
      .toEqual(resourceAccountingFixtures.map((fixture) => fixture.id));
    expect(new Set(resourceAccountingCoverage.map((item) => item.fixtureId)).size).toBe(60);
  });

  it("[RES19-COVERAGE-002] links only test IDs that exist in the workbench registry", () => {
    const registered = new Set(workbenchTests.map((test) => test.id));
    const missing = resourceAccountingCoverage.flatMap((item) =>
      item.testIds.filter((testId) => !registered.has(testId))
    );
    expect(missing).toEqual([]);
  });

  it("[RES19-COVERAGE-003] distinguishes bounded, partial, separate-gate and specification-only cases", () => {
    expect(resourceAccountingCoverageSummary.total).toBe(60);
    expect(
      resourceAccountingCoverageSummary.bounded +
      resourceAccountingCoverageSummary.partial +
      resourceAccountingCoverageSummary.separateGate +
      resourceAccountingCoverageSummary.specificationOnly
    ).toBe(60);
    for (const item of resourceAccountingCoverage) {
      expect(item.note.trim().length, item.fixtureId + " must explain its coverage boundary").toBeGreaterThan(0);
      if (item.status === "SPECIFICATION-ONLY") expect(item.testIds, item.fixtureId).toEqual([]);
      else expect(item.testIds.length, item.fixtureId).toBeGreaterThan(0);
    }
  });


  it("[RES19-COVERAGE-005] verifies each linked test marker against one registered source file", () => {
    const linkedIds = [...new Set(resourceAccountingCoverage.flatMap((item) => item.testIds))];

    for (const testId of linkedIds) {
      const entries = workbenchTests.filter((test) => test.id === testId);
      expect(entries, testId + " must resolve to exactly one registry entry").toHaveLength(1);
      const entry = entries[0];
      const engineTestPrefix = "src/engine/";
      expect(entry.file.startsWith(engineTestPrefix), testId + " must reference an engine test file").toBe(true);

      const sourceKey = "./" + entry.file.slice(engineTestPrefix.length);
      const source = registeredTestSources[sourceKey];
      expect(typeof source, testId + " source file must resolve through the Vite test-source glob").toBe("string");
      expect(
        source.split("[" + testId + "]").length - 1,
        testId + " marker must appear exactly once in its declared source file"
      ).toBe(1);
    }
  });

  it("[RES19-COVERAGE-004] keeps cross-gate and unsupported outcome cases outside bounded resource claims", () => {
    expect(resourceAccountingCoverage.find((item) => item.fixtureId === "RES19-36")?.status)
      .toBe("SEPARATE-GATE");
    expect(resourceAccountingCoverage.find((item) => item.fixtureId === "RES19-57")?.status)
      .toBe("PARTIAL");
    expect(resourceAccountingCoverage.find((item) => item.fixtureId === "RES19-60")?.status)
      .toBe("SPECIFICATION-ONLY");
    expect(resourceAccountingCoverage.find((item) => item.fixtureId === "RES19-30")?.status)
      .toBe("BOUNDED");
    const staleAvailability = resourceAccountingCoverage.find((item) => item.fixtureId === "RES19-35");
    expect(staleAvailability?.status).toBe("PARTIAL");
    expect(staleAvailability?.testIds).toEqual(expect.arrayContaining([
      "RES19-EVAL-010",
      "RES19-EVAL-011",
      "RES19-EVAL-012"
    ]));
  });
});
