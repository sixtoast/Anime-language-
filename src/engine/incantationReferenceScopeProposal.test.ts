import { describe, expect, it } from "vitest";
import {
  reviewIncantationReferenceScopeProposal,
  INCANTATION_REFERENCE_SCOPE_PROPOSAL_PROFILE as P,
  type ProposedScopeDeclaration,
  type ProposedScopeOperation,
} from "./incantationReferenceScopeProposal";

const ref = (lifetime: "SPELL" | "CURRENT-STEP" = "SPELL"): Record<string, unknown> => ({
  label: "target",
  referenceClass: "TARGET",
  scope: "pi",
  resolution: "RESOLVED",
  lifetime,
  bindingState: "COMMITTED",
  referentId: "entity-1",
});

const spell: ProposedScopeDeclaration = {
  bindingId: "r1",
  lifetime: "SPELL",
  declaredAt: "PRELUDE",
  reference: ref(),
};

const local: ProposedScopeDeclaration = {
  bindingId: "r2",
  lifetime: "CURRENT-STEP",
  declaredAt: "OPERATION",
  operationId: "op-a",
  reference: ref("CURRENT-STEP"),
};

const localWithoutOwner: ProposedScopeDeclaration = {
  bindingId: "r2",
  lifetime: "CURRENT-STEP",
  declaredAt: "OPERATION",
  reference: ref("CURRENT-STEP"),
};

const input = (
  declarations: ProposedScopeDeclaration[] = [spell],
  operations: ProposedScopeOperation[] = [
    {
      operationId: "op-a",
      uses: [{ bindingId: declarations[0].bindingId, operationId: "op-a" }],
    },
    {
      operationId: "op-b",
      uses: [{ bindingId: declarations[0].bindingId, operationId: "op-b" }],
    },
  ],
) => ({ profile: P, declarations, operations });

describe("Reference scope proposal", () => {
  it("[REF-SCOPE-001] permits spell prelude binding across operations", () => {
    expect(reviewIncantationReferenceScopeProposal(input()).disposition).toBe(
      "SCOPE-CONSISTENT-PROPOSAL",
    );
  });

  it("[REF-SCOPE-002] permits current-step binding in its owner operation", () => {
    expect(
      reviewIncantationReferenceScopeProposal(
        input([local], [{ operationId: "op-a", uses: [{ bindingId: "r2", operationId: "op-a" }] }]),
      ).disposition,
    ).toBe("SCOPE-CONSISTENT-PROPOSAL");
  });

  it("[REF-SCOPE-003] blocks current-step cross-operation use", () => {
    expect(
      reviewIncantationReferenceScopeProposal(input([local])).findings.some(
        (finding) => finding.code === "CURRENT-STEP-CROSS-OPERATION-USE",
      ),
    ).toBe(true);
  });

  it("[REF-SCOPE-004] blocks spell declaration outside prelude", () => {
    expect(
      reviewIncantationReferenceScopeProposal(
        input([{ ...spell, declaredAt: "OPERATION", operationId: "op-a" }]),
      ).findings.some((finding) => finding.code === "SPELL-BINDING-NOT-PRELUDE"),
    ).toBe(true);
  });

  it("[REF-SCOPE-005] blocks current-step declaration without owner", () => {
    expect(
      reviewIncantationReferenceScopeProposal(input([localWithoutOwner])).disposition,
    ).toBe("SCOPE-INCONSISTENT-PROPOSAL");
  });

  it("[REF-SCOPE-006] rejects duplicate declaration ids", () => {
    expect(
      reviewIncantationReferenceScopeProposal(input([spell, { ...spell }])).findings.some(
        (finding) => finding.code === "DUPLICATE-DECLARATION",
      ),
    ).toBe(true);
  });

  it("[REF-SCOPE-007] rejects unknown binding use", () => {
    expect(
      reviewIncantationReferenceScopeProposal(
        input([spell], [{ operationId: "op-a", uses: [{ bindingId: "missing", operationId: "op-a" }] }]),
      ).findings.some((finding) => finding.code === "UNKNOWN-BINDING"),
    ).toBe(true);
  });

  it("[REF-SCOPE-008] blocks promotion of current-step reference", () => {
    expect(
      reviewIncantationReferenceScopeProposal(
        input([{ ...spell, reference: ref("CURRENT-STEP") }]),
      ).findings.some((finding) => finding.code === "SPELL-BINDING-LOCAL-OWNER"),
    ).toBe(true);
  });

  it("[REF-SCOPE-009] requires committed resolved identity", () => {
    expect(
      reviewIncantationReferenceScopeProposal(
        input([{ ...spell, reference: { ...ref(), bindingState: "PROPOSED" } }]),
      ).disposition,
    ).toBe("INVALID-PROPOSAL");
  });

  it("[REF-SCOPE-010] requires unique operation ids", () => {
    expect(
      reviewIncantationReferenceScopeProposal(
        input([spell], [
          { operationId: "op-a", uses: [] },
          { operationId: "op-a", uses: [] },
        ]),
      ).findings.length,
    ).toBeGreaterThan(0);
  });

  it("[REF-SCOPE-011] does not invent spoken syntax or equivalence", () => {
    const report = reviewIncantationReferenceScopeProposal(input());
    expect(report.spokenSyntax).toBe("NOT-DEFINED");
    expect(report.semanticEquivalence).toBe("NOT-CLAIMED");
    expect(report.executable).toBe(false);
    expect(report.canonEffect).toBe("NONE");
  });

  it("[REF-SCOPE-012] rejects malformed profile and arrays", () => {
    expect(
      reviewIncantationReferenceScopeProposal({
        profile: "wrong",
        declarations: [],
        operations: [],
      }).disposition,
    ).toBe("INVALID-PROPOSAL");
  });
});
