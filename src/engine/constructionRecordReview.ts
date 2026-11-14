import { auditConstructionOrder, type ConstructionStage, type ConstructionOrderAudit } from "./constructionOrderAudit";

export type ConstructionEvidenceStatus = "ATTESTED" | "PROVISIONAL" | "UNRESOLVED" | "NOT-SUPPLIED";

export interface ConstructionElementEvidence {
  stage: ConstructionStage;
  status: ConstructionEvidenceStatus;
  /** Human-readable supplied content; never interpreted as Arcane syntax here. */
  content?: string;
  source?: string;
  note?: string;
}

export interface ConstructionRecord {
  id: string;
  elements: ConstructionElementEvidence[];
}

export interface ConstructionRecordReview {
  recordId: string;
  order: ConstructionOrderAudit;
  evidenceCounts: Record<ConstructionEvidenceStatus, number>;
  presentStages: ConstructionStage[];
  unresolvedStages: ConstructionStage[];
  provisionalStages: ConstructionStage[];
  attestedStages: ConstructionStage[];
  missingStages: ConstructionStage[];
  status: "EMPTY-RECORD" | "EVIDENCE-INCOMPLETE" | "EVIDENCE-QUALIFIED";
  canClaimConstructionComplete: false;
  findings: string[];
  limitation: string;
}

const LIMITATION =
  "This is an evidence inventory, not a Construction parser, completeness proof, physical feasibility test, spell validator, or execution engine. ATTESTED means only that the record marks an element as attested; this module does not independently verify its source.";

export function reviewConstructionRecord(record: ConstructionRecord): ConstructionRecordReview {
  const stages = record.elements.map(element => element.stage);
  const order = auditConstructionOrder(stages);
  const evidenceCounts: Record<ConstructionEvidenceStatus, number> = {
    ATTESTED: 0, PROVISIONAL: 0, UNRESOLVED: 0, "NOT-SUPPLIED": 0
  };
  for (const element of record.elements) evidenceCounts[element.status] += 1;

  const presentStages = [...new Set(record.elements
    .filter(element => element.status !== "NOT-SUPPLIED")
    .map(element => element.stage))];
  const unresolvedStages = [...new Set(record.elements
    .filter(element => element.status === "UNRESOLVED")
    .map(element => element.stage))];
  const provisionalStages = [...new Set(record.elements
    .filter(element => element.status === "PROVISIONAL")
    .map(element => element.stage))];
  const attestedStages = [...new Set(record.elements
    .filter(element => element.status === "ATTESTED")
    .map(element => element.stage))];
  const missingStages = [...new Set(record.elements
    .filter(element => element.status === "NOT-SUPPLIED")
    .map(element => element.stage))];

  const status = record.elements.length === 0
    ? "EMPTY-RECORD"
    : unresolvedStages.length || provisionalStages.length || missingStages.length || order.status !== "ORDER_CONSISTENT"
      ? "EVIDENCE-INCOMPLETE"
      : "EVIDENCE-QUALIFIED";

  const findings = [
    ...unresolvedStages.map(stage => stage + " is explicitly unresolved."),
    ...provisionalStages.map(stage => stage + " is provisional."),
    ...missingStages.map(stage => stage + " is marked not supplied."),
    ...(order.status === "ORDER_INCONSISTENT" ? ["The supplied elements violate the recovered relative stage order."] : []),
    ...(order.status === "INSUFFICIENT_SEQUENCE" ? ["No stage sequence was supplied."] : []),
    ...(status === "EVIDENCE-QUALIFIED" ? ["All supplied elements are marked attested and follow the recovered order; this is not proof of semantic or physical completeness."] : [])
  ];

  return {
    recordId: record.id,
    order,
    evidenceCounts,
    presentStages,
    unresolvedStages,
    provisionalStages,
    attestedStages,
    missingStages,
    status,
    canClaimConstructionComplete: false,
    findings,
    limitation: LIMITATION
  };
}
