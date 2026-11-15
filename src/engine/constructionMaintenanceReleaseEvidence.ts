/**
 * Phase 8CC — Maintenance and release evidence separation.
 * This models two bounded observations from the Phase 5.22 hand-flame fixture.
 * It does not establish a general lifecycle, temporal semantics or safety model.
 */
import { handFlameSegments, handFlameSourceSequence } from "./constructionHandFlameEvidence";
import { reviewConstructionMacro } from "./constructionMacroEvidence";

export const maintenanceReleaseFixtureEvidence = {
  fixture: "Phase 5.22 hand-flame example",
  surface: handFlameSourceSequence,
  maintenance: {
    segmentId: "maintenance",
    observedSurface: "kan ken",
    tokenAssociation: "KEN",
    macroAssociation: "FREM",
    reading: "structure held / held energy state",
    evidenceStatus: "PARTIAL-EXAMPLE",
    durationRule: "NOT-ESTABLISHED",
    maintenanceConditions: "NOT-ESTABLISHED",
    resourceLimits: "NOT-ESTABLISHED"
  },
  release: {
    segmentId: "release",
    observedSurface: "kas",
    tokenAssociation: "KAS",
    macroAssociation: "SHREN",
    reading: "release",
    evidenceStatus: "PARTIAL-EXAMPLE",
    releaseTarget: "NOT-ESTABLISHED",
    releaseMode: "NOT-ESTABLISHED",
    safetyConditions: "NOT-ESTABLISHED"
  },
  surfaceOrder: ["maintenance", "coupling", "duration", "release"] as const,
  causalLifecycle: "NOT-ESTABLISHED",
  generalisation: "NOT-PERMITTED",
  executable: false
} as const;

export type MaintenanceReleaseEvidenceStatus =
  | "MAINTENANCE-ASSOCIATION-RECORDED"
  | "RELEASE-ASSOCIATION-RECORDED"
  | "FIXTURE-SEQUENCE-RECORDED"
  | "UNRECOGNISED"
  | "EMPTY";

export function reviewMaintenanceReleaseEvidence(input: string) {
  const normalized = input.trim().toLowerCase();
  if (!normalized) return {
    input, status: "EMPTY" as const, evidence: null,
    message: "Enter ken, kas or the exact fixture surface."
  };
  if (normalized === "ken") return {
    input, status: "MAINTENANCE-ASSOCIATION-RECORDED" as const,
    evidence: maintenanceReleaseFixtureEvidence.maintenance,
    macro: reviewConstructionMacro("FREM"),
    message: "KEN is associated with a held state in this example. No general duration or maintenance contract is established.",
    executable: false as const
  };
  if (normalized === "kas") return {
    input, status: "RELEASE-ASSOCIATION-RECORDED" as const,
    evidence: maintenanceReleaseFixtureEvidence.release,
    macro: reviewConstructionMacro("SHREN"),
    message: "KAS is associated with release in this example. No general target, release mode or safety contract is established.",
    executable: false as const
  };
  if (normalized === handFlameSourceSequence.toLowerCase()) return {
    input, status: "FIXTURE-SEQUENCE-RECORDED" as const,
    evidence: maintenanceReleaseFixtureEvidence,
    segmentOrder: handFlameSegments.map(segment => segment.id),
    message: "The exact fixture surface and segment order are recorded. This does not prove a general causal lifecycle or clause grammar.",
    executable: false as const
  };
  return {
    input, status: "UNRECOGNISED" as const, evidence: null,
    message: "No maintenance or release meaning is inferred for this input.",
    executable: false as const
  };
}
