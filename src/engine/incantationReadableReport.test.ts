import { describe, expect, it } from "vitest";
import { readStructuredIncantation } from "./incantationReadableReport";

const base = {
  profile: "INCANTATION-INTEGRATED-REVIEW-1.0",
  operations: [],
  relationships: {
    profile: "INCANTATION-RELATIONSHIPS-1.0",
    nodes: [],
    edges: [],
  },
  conditions: {
    profile: "INCANTATION-CONDITIONS-1.0",
    conditions: [],
  },
  evidence: {
    records: [],
    policy: { acceptedClasses: ["OBSERVED"], maxAgeSeconds: 60 },
    asOf: "2026-11-14T10:00:00Z",
  },
  temporalContracts: [],
  postconditions: [],
  lifecycleRecords: [],
  recoveryBranches: [],
};

describe("Structured Incantation reader", () => {
  it("[INC-READ-U-001] rejects unsupported profile", () => {
    expect(readStructuredIncantation({}).disposition).toBe("INVALID-RECORD");
  });

  it("[INC-READ-U-002] identifies empty operation set", () => {
    expect(readStructuredIncantation(base).disposition).toBe("INCOMPLETE-DECLARATIONS");
  });

  it("[INC-READ-U-003] reads TRAK without execution", () => {
    const report = readStructuredIncantation({
      ...base,
      operations: [
        {
          id: "op1",
          arguments: {
            operation: "trak",
            targetLabel: "TARGET-A",
            references: [],
            constraints: [],
          },
        },
      ],
    });

    expect(report.sections[0].lines[0]).toContain("TRAK — alter");
    expect(report.executable).toBe(false);
  });

  it("[INC-READ-U-004] preserves unresolved reference state", () => {
    const report = readStructuredIncantation({
      ...base,
      operations: [
        {
          id: "op1",
          arguments: {
            operation: "kren",
            references: [
              {
                label: "T",
                referenceClass: "TARGET",
                scope: "vom",
                resolution: "UNRESOLVED",
                bindingState: "PROPOSED",
              },
            ],
          },
        },
      ],
    });

    expect(
      report.sections[0].lines.some(
        (line) => line.includes("UNRESOLVED") && line.includes("PROPOSED"),
      ),
    ).toBe(true);
  });

  it("[INC-READ-U-005] reads spatial roles and coupling", () => {
    const report = readStructuredIncantation({
      ...base,
      operations: [
        {
          id: "op1",
          arguments: {
            operation: "bran",
            references: [],
            spatialRoles: [
              { marker: "po", value: { type: "Position", payload: "P1" } },
            ],
            coupling: {
              category: "he",
              participantA: "A",
              participantB: "B",
              relationModel: "unknown",
              validityScope: "spell",
            },
          },
        },
      ],
    });

    expect(
      report.sections[0].lines.some((line) => line.includes("Spatial role 1: po")),
    ).toBe(true);
    expect(report.sections[0].lines.some((line) => line.includes("Coupling: he"))).toBe(
      true,
    );
  });

  it("[INC-READ-U-006] reads graph nodes and edges", () => {
    const report = readStructuredIncantation({
      ...base,
      relationships: {
        ...base.relationships,
        nodes: [{ id: "g", type: "GOAL", resolution: "UNRESOLVED" }],
        edges: [{ id: "e", from: "g", to: "v", type: "GOAL-PROPERTY-VALUE" }],
      },
    });

    expect(report.sections[1].lines.some((line) => line.includes("GOAL-PROPERTY-VALUE"))).toBe(
      true,
    );
  });

  it("[INC-READ-U-007] reads conditions without evaluating", () => {
    const report = readStructuredIncantation({
      ...base,
      conditions: {
        ...base.conditions,
        conditions: [
          {
            id: "c1",
            kind: "PRECONDITION",
            predicateId: "p",
            predicateVersion: "1",
            requiredResult: "TRUE",
            checkTime: "BEFORE",
            failurePolicy: "BLOCK",
          },
        ],
      },
    });

    expect(report.sections[2].lines[0]).toContain("predicate p@1");
    expect(report.explicitNonDeterminations[2]).toContain("not established");
  });

  it("[INC-READ-U-008] labels absent evidence honestly", () => {
    expect(readStructuredIncantation(base).warnings).toContain(
      "No evidence records were supplied; declarations are not observations.",
    );
  });

  it("[INC-READ-U-009] reads lifecycle declarations", () => {
    const report = readStructuredIncantation({
      ...base,
      lifecycleRecords: [
        {
          events: [
            { sequence: 0, state: "VALIDATED", at: "2026-11-14T10:00:00Z" },
          ],
        },
      ],
    });

    expect(report.sections[4].lines).toContain(
      "0. VALIDATED at 2026-11-14T10:00:00Z",
    );
  });

  it("[INC-READ-U-010] preserves proposed KREN", () => {
    const report = readStructuredIncantation({
      ...base,
      operations: [{ id: "k", arguments: { operation: "kren" } }],
    });

    expect(report.warnings.some((warning) => warning.includes("KREN remains proposed"))).toBe(
      true,
    );
  });

  it("[INC-READ-U-011] never parses spoken Arcane or enables execution", () => {
    const report = readStructuredIncantation({
      ...base,
      operations: [{ id: "x", arguments: { operation: "frem" } }],
    });

    expect(report.spokenArcanaParsed).toBe(false);
    expect(report.executable).toBe(false);
    expect(report.canonEffect).toBe("NONE");
  });
});
