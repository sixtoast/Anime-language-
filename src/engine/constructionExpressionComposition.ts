import { constructionStageOrder, type ConstructionStage } from "./constructionOrderAudit";

/** Evidence container; empty arrays mean no evidence attached to this review, not optional grammar. */
export const CONSTRUCTION_COMPOSITION_STAGES = constructionStageOrder;
export type ConstructionCompositionEvidenceStatus = "RECORDED" | "PARTIAL" | "UNRECOVERED";

export interface ConstructionStageEvidenceRecord {
  id: string;
  stage: ConstructionStage;
  status: ConstructionCompositionEvidenceStatus;
  version: string;
  source: string;
  claims: readonly string[];
  unresolved: readonly string[];
  note?: string;
}
export interface ConstructionExpressionComposition {
  id: string;
  surface?: { text: string; version: string; source: string };
  /** Multiple source records are preserved; this does not establish stage cardinality. */
  stageEvidence: Record<ConstructionStage, readonly ConstructionStageEvidenceRecord[]>;
  executable: false;
  canonEffect: "NONE";
}
export interface ConstructionCompositionStageSummary {
  stage: ConstructionStage;
  recordCount: number;
  recordedCount: number;
  partialCount: number;
  unrecoveredCount: number;
  status: "NO-RECORD" | "EVIDENCE-RECORDED";
}
export interface ConstructionExpressionCompositionReview {
  compositionId: string;
  status: "NO-EVIDENCE" | "EVIDENCE-PARTIAL" | "EVIDENCE-RECORDED";
  stageSummaries: ConstructionCompositionStageSummary[];
  stagesWithEvidence: ConstructionStage[];
  stagesWithoutRecords: ConstructionStage[];
  evidenceRecordCount: number;
  malformedRecordCount: number;
  diagnostics: string[];
  grammarValidity: "NOT-ASSESSED";
  stageCardinality: "NOT-ESTABLISHED";
  stageDependency: "NOT-ESTABLISHED";
  executable: false;
  canonEffect: "NONE";
  limitation: string;
}
const LIMITATION = "This composition groups documentary evidence by the seven recovered Construction stage labels. It does not parse Arcana, impose a stage sequence, infer mandatory or optional stages, resolve interfaces or cardinality, validate a spell, establish physical feasibility, or execute an operation.";

export function createEmptyConstructionExpressionComposition(id: string): ConstructionExpressionComposition {
  const stageEvidence = constructionStageOrder.reduce((records, stage) => {
    records[stage] = [];
    return records;
  }, {} as Record<ConstructionStage, readonly ConstructionStageEvidenceRecord[]>);
  return { id, stageEvidence, executable: false, canonEffect: "NONE" };
}

/** Reviews an untrusted composition without filling gaps or choosing between sources. */
export function reviewConstructionExpressionComposition(input: ConstructionExpressionComposition): ConstructionExpressionCompositionReview {
  const diagnostics: string[] = [];
  const stageSummaries = constructionStageOrder.map(stage => {
    const records = input.stageEvidence[stage];
    let recordedCount = 0, partialCount = 0, unrecoveredCount = 0;
    for (const record of records) {
      if (!record || record.stage !== stage || typeof record.id !== "string" || !record.id.trim() ||
        typeof record.version !== "string" || !record.version.trim() ||
        typeof record.source !== "string" || !record.source.trim() ||
        !Array.isArray(record.claims) || !Array.isArray(record.unresolved)) {
        diagnostics.push(stage + ": malformed evidence record; source data retained but not counted.");
        continue;
      }
      if (record.status === "RECORDED") recordedCount += 1;
      else if (record.status === "PARTIAL") partialCount += 1;
      else if (record.status === "UNRECOVERED") unrecoveredCount += 1;
      else diagnostics.push(stage + ": unknown evidence status; record not classified.");
    }
    return { stage, recordCount: records.length, recordedCount, partialCount, unrecoveredCount, status: records.length === 0 ? "NO-RECORD" as const : "EVIDENCE-RECORDED" as const };
  });
  const stagesWithEvidence = stageSummaries.filter(item => item.recordCount > 0).map(item => item.stage);
  const stagesWithoutRecords = stageSummaries.filter(item => item.recordCount === 0).map(item => item.stage);
  const evidenceRecordCount = stageSummaries.reduce((total, item) => total + item.recordCount, 0);
  const malformedRecordCount = diagnostics.length;
  const status = evidenceRecordCount === 0 ? "NO-EVIDENCE" :
    stagesWithoutRecords.length > 0 || malformedRecordCount > 0 || stageSummaries.some(item => item.partialCount > 0 || item.unrecoveredCount > 0)
      ? "EVIDENCE-PARTIAL" : "EVIDENCE-RECORDED";
  return {
    compositionId: input.id, status, stageSummaries, stagesWithEvidence, stagesWithoutRecords,
    evidenceRecordCount, malformedRecordCount, diagnostics,
    grammarValidity: "NOT-ASSESSED", stageCardinality: "NOT-ESTABLISHED", stageDependency: "NOT-ESTABLISHED",
    executable: false, canonEffect: "NONE", limitation: LIMITATION
  };
}
