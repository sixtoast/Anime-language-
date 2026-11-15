/**
 * Phase 8CF — Construction macro / stage scope evidence audit.
 *
 * Compares the recorded macro evidence with the seven performed stages and
 * the exact Phase 5.22 hand-flame fixture. Observed placement is not promoted
 * into a stage assignment, argument scope, cardinality or causal dependency.
 */
import { constructionMacroEvidence } from "./constructionMacroEvidence";
import { constructionStageRelationshipEvidence } from "./constructionStageRelationshipEvidence";
import { handFlameSegments, handFlameHistoricalParserEvidence } from "./constructionHandFlameEvidence";

export const constructionMacroStageScopeAudit = {
  sourceStageOrder: constructionStageRelationshipEvidence.stages.map(stage => stage.id),
  stageEdges: constructionStageRelationshipEvidence.precedence.map(edge => ({
    from: edge.from, to: edge.to, relation: edge.relation,
    dataDependency: edge.dataDependency, interfaceStatus: edge.interfaceStatus
  })),
  macroRecords: constructionMacroEvidence.map(entry => {
    const fixtureSegment = entry.form === "FREM" ? "maintenance"
      : entry.form === "SHREN" ? "release"
      : entry.form === "TRAK" ? "maintenance"
      : null;
    return {
      macro: entry.form,
      evidenceStatus: entry.evidenceStatus,
      fixtureSegment,
      fixtureAssociation: entry.form === "TRAK"
        ? "KAN is a Phase 5.22 example-level alias of TRAK ENRA; no general expansion."
        : entry.form === "FREM"
          ? "KEN is associated with held energy state in the hand-flame example."
          : entry.form === "SHREN"
            ? "KAS is associated with release in the hand-flame example."
            : "No occurrence in the exact hand-flame fixture is recorded by the recovered segment inventory.",
      stageAssignment: "NOT-ESTABLISHED" as const,
      scope: "NOT-RECOVERED" as const,
      footCardinality: "NOT-RECOVERED" as const,
      causalDependency: "NOT-ESTABLISHED" as const,
      executable: false as const
    };
  }),
  fixture: {
    source: handFlameHistoricalParserEvidence.archiveMember,
    status: handFlameHistoricalParserEvidence.status,
    segmentOrder: handFlameSegments.map(segment => segment.id),
    note: "The segment order is a bounded example surface grouping. It is not a second definition of the seven-stage Construction order."
  },
  boundaries: {
    macroToStageMappingRecovered: false,
    macroScopeRecovered: false,
    macroFootCardinalityRecovered: false,
    fixtureOrderDefinesCausality: false,
    stagePrecedenceDefinesDataFlow: false,
    executable: false,
    canonEffect: "NONE"
  }
} as const;

export function reviewConstructionMacroStageScope(input: unknown) {
  if (typeof input !== "string" || !input.trim()) return null;
  const macro = input.trim().toUpperCase();
  return constructionMacroStageScopeAudit.macroRecords.find(record => record.macro === macro) ?? null;
}

export function compareFixtureSegmentWithStageOrder(segmentId: unknown) {
  if (typeof segmentId !== "string" || !segmentId.trim()) return null;
  const segment = handFlameSegments.find(item => item.id === segmentId);
  if (!segment) return null;
  return {
    segmentId: segment.id,
    observedFixtureIndex: handFlameSegments.findIndex(item => item.id === segment.id),
    observedFixtureSurface: segment.surface,
    evidenceStatus: segment.evidence,
    constructionStageAssignment: "NOT-ESTABLISHED" as const,
    relationshipToSevenStageOrder: "NOT-ESTABLISHED" as const,
    explanation: "This is an observed segment in one bounded example. It cannot be assigned to a Construction stage solely by its position or gloss."
  };
}
