/**
 * Phase 8BZ — H-series coupling composition evidence.
 * Source basis: Phase 4 §§3.2–3.3; Phase 5.15; Phase 5.16 C-07;
 * the bounded Phase 5.22 hand-flame fixture; Phase 7X §7.
 *
 * This is an evidence concordance, not a coupling grammar or physical model.
 */
import { constructionCouplingEvidence } from "./constructionCouplingEvidence";
import { reviewConstructionMacro } from "./constructionMacroEvidence";

export type HSeriesCompositionStatus =
  | "DOMAIN-GLOSS-RECORDED"
  | "FIXTURE-COOCCURRENCE-RECORDED"
  | "BRAN-FAMILY-ASSOCIATION"
  | "UNRECOGNISED"
  | "EMPTY";

export interface HSeriesDomainRecord {
  form: string;
  gloss: string;
  version: "v2.0";
  evidenceStatus: "GLOSS-RECORDED";
  argumentSignature: "UNRESOLVED";
  participantRole: "UNRESOLVED";
  directionality: "UNRESOLVED";
  physicalMapping: "PROVISIONAL";
  execution: false;
}

export const hSeriesDomainRecords: readonly HSeriesDomainRecord[] =
  constructionCouplingEvidence.map(entry => ({
    form: entry.form,
    gloss: entry.gloss,
    version: entry.sourceVersion,
    evidenceStatus: "GLOSS-RECORDED",
    argumentSignature: "UNRESOLVED",
    participantRole: "UNRESOLVED",
    directionality: "UNRESOLVED",
    physicalMapping: "PROVISIONAL",
    execution: false
  }));

export const handFlameCouplingObservation = {
  fixture: "Phase 5.22 hand-flame example",
  exactPhrase: "he ha",
  members: ["he", "ha"] as const,
  observation: "The two H-series forms co-occur in this order in one bounded example phrase.",
  orderMeaning: "NOT-ESTABLISHED",
  participantMapping: "NOT-ESTABLISHED",
  couplingOperation: "NOT-ESTABLISHED",
  generalisation: "NOT-PERMITTED",
  execution: false
} as const;

export const branCouplingAssociation = {
  macro: "BRAN",
  status: "PATTERN-DESCRIBED",
  evidence: "Phase 4 §3.2 associates BRAN with the h-domain coupling family.",
  relationToHSeries: "FAMILY-ASSOCIATION-ONLY",
  expansion: "NOT-RECOVERED",
  participantOrder: "UNRESOLVED",
  directionality: "UNRESOLVED",
  resourceSemantics: "UNRESOLVED",
  execution: false
} as const;

export interface HSeriesCompositionReview {
  input: string;
  status: HSeriesCompositionStatus;
  record: HSeriesDomainRecord | null;
  message: string;
  executable: false;
}

export function reviewHSeriesComposition(input: string): HSeriesCompositionReview {
  const normalized = input.trim().toLowerCase();
  if (!normalized) return {
    input, status: "EMPTY", record: null,
    message: "Enter one of the six recorded H-series forms.", executable: false
  };
  const record = hSeriesDomainRecords.find(item => item.form === normalized) ?? null;
  if (!record) return {
    input, status: "UNRECOGNISED", record: null,
    message: "No H-series gloss or coupling rule is inferred for this form.", executable: false
  };
  return {
    input, status: "DOMAIN-GLOSS-RECORDED", record,
    message: "This is a domain-gloss lookup only. It does not define a participant, argument slot, direction, physical law or executable coupling.",
    executable: false
  };
}

export function reviewHandFlameCouplingPhrase(input: string) {
  const normalized = input.trim().toLowerCase().replace(/\\s+/g, " ");
  if (normalized !== "he ha") return {
    input, status: "NOT-RECORDED" as const, observation: null,
    message: "Only the exact he ha co-occurrence is recorded in this bounded fixture; no other pair is inferred."
  };
  return {
    input, status: "FIXTURE-COOCCURRENCE-RECORDED" as const,
    observation: handFlameCouplingObservation,
    message: "The fixture records co-occurrence and surface order only. Semantic order, participant roles and coupling operation remain unestablished."
  };
}

export function reviewBranCouplingAssociation() {
  const macro = reviewConstructionMacro("BRAN");
  return {
    macroStatus: macro.status,
    association: branCouplingAssociation,
    message: "BRAN is associated with the H-series family at macro level; no expansion or composition rule is recovered.",
    executable: false as const
  };
}
