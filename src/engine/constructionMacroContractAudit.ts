/**
 * Phase 8CE — Construction macro contract audit.
 * Records recovered role evidence separately from the absent operational contract.
 * No signatures, composition rules or executable semantics are inferred.
 */
import { constructionMacroEvidence } from "./constructionMacroEvidence";

export type MacroContractFieldStatus = "RECORDED-ROLE-EVIDENCE" | "PARTIAL-FIXTURE-EVIDENCE" | "PROPOSED-UNCONFIRMED" | "NOT-RECOVERED";
export interface ConstructionMacroContractAudit {
  macro: string;
  gloss: string;
  roleEvidence: MacroContractFieldStatus;
  evidence: string;
  footScope: "FRAME-GROUP-ASSOCIATION" | "FIXTURE-FOOT-ASSOCIATION" | "H-DOMAIN-FAMILY" | "MODIFIER-ROLE" | "UNRESOLVED";
  inputSignature: "NOT-RECOVERED";
  outputSignature: "NOT-RECOVERED";
  footCardinality: "NOT-RECOVERED";
  sequenceScope: "NOT-RECOVERED";
  preconditions: "NOT-RECOVERED";
  resourceSemantics: "NOT-RECOVERED";
  sideEffects: "NOT-RECOVERED";
  termination: "NOT-RECOVERED";
  compositionWithOtherMacros: "NOT-ESTABLISHED";
  executable: false;
}
const byForm = new Map(constructionMacroEvidence.map(entry => [entry.form, entry]));
const records: readonly ConstructionMacroContractAudit[] = [
  {macro:"TRAK",gloss:"alter",roleEvidence:"RECORDED-ROLE-EVIDENCE",evidence:"Phase 4 §3.2 describes voiceless-stop frames p/t/k for discrete change.",footScope:"FRAME-GROUP-ASSOCIATION",inputSignature:"NOT-RECOVERED",outputSignature:"NOT-RECOVERED",footCardinality:"NOT-RECOVERED",sequenceScope:"NOT-RECOVERED",preconditions:"NOT-RECOVERED",resourceSemantics:"NOT-RECOVERED",sideEffects:"NOT-RECOVERED",termination:"NOT-RECOVERED",compositionWithOtherMacros:"NOT-ESTABLISHED",executable:false},
  {macro:"KREN",gloss:"establish",roleEvidence:"PROPOSED-UNCONFIRMED",evidence:"Phase 4 §3.2 proposes voiced-stop frames b/d/g as a reinforced counterpart; owner confirmation remains outstanding.",footScope:"FRAME-GROUP-ASSOCIATION",inputSignature:"NOT-RECOVERED",outputSignature:"NOT-RECOVERED",footCardinality:"NOT-RECOVERED",sequenceScope:"NOT-RECOVERED",preconditions:"NOT-RECOVERED",resourceSemantics:"NOT-RECOVERED",sideEffects:"NOT-RECOVERED",termination:"NOT-RECOVERED",compositionWithOtherMacros:"NOT-ESTABLISHED",executable:false},
  {macro:"FREM",gloss:"maintain",roleEvidence:"PARTIAL-FIXTURE-EVIDENCE",evidence:"Phase 5.22 hand-flame fixture associates ken with a held energy state; matrix association to FREM is partial.",footScope:"FIXTURE-FOOT-ASSOCIATION",inputSignature:"NOT-RECOVERED",outputSignature:"NOT-RECOVERED",footCardinality:"NOT-RECOVERED",sequenceScope:"NOT-RECOVERED",preconditions:"NOT-RECOVERED",resourceSemantics:"NOT-RECOVERED",sideEffects:"NOT-RECOVERED",termination:"NOT-RECOVERED",compositionWithOtherMacros:"NOT-ESTABLISHED",executable:false},
  {macro:"SHREN",gloss:"release",roleEvidence:"PARTIAL-FIXTURE-EVIDENCE",evidence:"Phase 5.22 hand-flame fixture associates kas with release; matrix association to SHREN is partial.",footScope:"FIXTURE-FOOT-ASSOCIATION",inputSignature:"NOT-RECOVERED",outputSignature:"NOT-RECOVERED",footCardinality:"NOT-RECOVERED",sequenceScope:"NOT-RECOVERED",preconditions:"NOT-RECOVERED",resourceSemantics:"NOT-RECOVERED",sideEffects:"NOT-RECOVERED",termination:"NOT-RECOVERED",compositionWithOtherMacros:"NOT-ESTABLISHED",executable:false},
  {macro:"BRAN",gloss:"couple",roleEvidence:"RECORDED-ROLE-EVIDENCE",evidence:"Phase 4 §3.2 describes an h-domain syllable family as coupling vocabulary.",footScope:"H-DOMAIN-FAMILY",inputSignature:"NOT-RECOVERED",outputSignature:"NOT-RECOVERED",footCardinality:"NOT-RECOVERED",sequenceScope:"NOT-RECOVERED",preconditions:"NOT-RECOVERED",resourceSemantics:"NOT-RECOVERED",sideEffects:"NOT-RECOVERED",termination:"NOT-RECOVERED",compositionWithOtherMacros:"NOT-ESTABLISHED",executable:false},
  {macro:"VARE",gloss:"prefer",roleEvidence:"RECORDED-ROLE-EVIDENCE",evidence:"Phase 4 §3.2 and §6 G-4 describe a soft-requirement modifier paired with hard REQUIRE.",footScope:"MODIFIER-ROLE",inputSignature:"NOT-RECOVERED",outputSignature:"NOT-RECOVERED",footCardinality:"NOT-RECOVERED",sequenceScope:"NOT-RECOVERED",preconditions:"NOT-RECOVERED",resourceSemantics:"NOT-RECOVERED",sideEffects:"NOT-RECOVERED",termination:"NOT-RECOVERED",compositionWithOtherMacros:"NOT-ESTABLISHED",executable:false}
] as const;

export const constructionMacroContractAudit = records;
export const macroContractAuditBoundary = {
  recordedInventoryCount: constructionMacroEvidence.length,
  auditedInventoryCount: records.length,
  allInputSignaturesRecovered: false,
  allOutputSignaturesRecovered: false,
  footCardinalityRecovered: false,
  compositionRulesRecovered: false,
  executionEnabled: false,
  canonEffect: "NONE"
} as const;

export function reviewConstructionMacroContract(input: unknown): ConstructionMacroContractAudit | null {
  if (typeof input !== "string" || !input.trim()) return null;
  const key = input.trim().toUpperCase();
  return records.find(record => record.macro === key) ?? null;
}

export function reviewConstructionMacroComposition(left: unknown, right: unknown) {
  if (typeof left !== "string" || typeof right !== "string") return null;
  const a = left.trim().toUpperCase(), b = right.trim().toUpperCase();
  if (!a || !b || !records.some(record => record.macro === a) || !records.some(record => record.macro === b)) return null;
  return {
    left: a, right: b,
    status: "NOT-ESTABLISHED" as const,
    ordering: "NOT-RECOVERED" as const,
    sharedFootScope: "NOT-ESTABLISHED" as const,
    compatibility: "NOT-ESTABLISHED" as const,
    executable: false as const,
    explanation: "Both macro names are recognised, but no source-backed composition, ordering, compatibility or shared Foot-scope rule is recovered."
  };
}
