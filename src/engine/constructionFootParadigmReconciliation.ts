/**
 * Phase 8CY-S — reconciliation of conflicting Construction Foot coda claims.
 * The five-coda matrix is retained as a historical hypothesis only.
 */
import {constructionFootParadigmSummary} from "./constructionFootParadigmEvidenceMatrix";
import {constructionFootParadigmClosureAudit} from "./constructionFootParadigmClosureAudit";
import {constructionFootMorphologyAudit} from "./constructionFootMorphologyAudit";
export const constructionFootParadigmReconciliation = {
 phase:"8CY-S",
 status:"CONFLICT-OPEN" as const,
 phase8ci:{
  relationCodaInventoryCount:constructionFootParadigmClosureAudit.slots[2].recoveredItems.length,
  sourceAdjudication:constructionFootParadigmClosureAudit.closure.sourceAdjudication,
  parserReadiness:constructionFootParadigmClosureAudit.closure.parserReadiness
 },
 phase8cyr:{
  claimedRelationCodaCount:constructionFootParadigmSummary.relationCodaCount,
  legacyCandidateCount:constructionFootParadigmSummary.candidateSpaceSize,
  claims:[ "m/n = FREM open-loop maintenance","ng = FREM feedback maintenance","s/sh = SHREN release" ]
 },
 frameParameterReviewPairs:constructionFootMorphologyAudit.coverage.pairCount,
 canonicalCvForms:constructionFootMorphologyAudit.frameVowelMatrix.filter(x=>x.status==="CANONICAL-CV-FRAME").map(x=>x.form),
 unresolvedPairs:constructionFootMorphologyAudit.coverage.unresolvedPairCount,
 codaInventoryStatus:"UNRECOVERED" as const,
 permittedCodaConclusion:"The five coda mappings are disputed source claims, not a verified inventory.",
 legacyCandidateDisposition:"RETAINED-FOR-AUDIT-NOT-RECOGNISED" as const,
 unresolvedQuestions:[
  "Whether §3.1–§3.3 and P4-T05/P4-T10 support the five coda mappings recorded in Phase 8CY-R",
  "Whether Phase 8CI's zero-entry coda closure predates or was superseded by a complete primary-source inspection",
  "Whether the Phase 5.15 CVC and Phase 5.16 optional-coda readings apply to different contexts or conflict"
 ],
 nextEvidenceGate:"Inspect exact Phase 4 §3.1–§3.3 paragraphs, Tables 2–3, §4 Table 4, §10 and P4-T05/P4-T10 definitions in one cited transcription.",
 executable:false as const,
 canonEffect:"NONE" as const
} as const;
