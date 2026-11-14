/** Source-indexed, non-executable associations between Foot frame sets and Construction macros. */
export interface ConstructionFrameMacroAssociation {
  macro: "TRAK" | "KREN";
  frameSet: readonly string[];
  pattern: string;
  evidenceStatus: "DESCRIBED-PATTERN" | "PROPOSED-OWNER-CONFIRMATION";
  individualConsonantSemantics: "UNRESOLVED";
  executable: false;
  evidence: string;
  limitation: string;
}
const limitation = "This macro-level association does not establish individual consonant meanings, a productive Foot paradigm, macro expansion, arity, physical/resource semantics or execution.";
export const constructionFrameMacroAssociations: readonly ConstructionFrameMacroAssociation[] = [
  { macro:"TRAK", frameSet:["p","t","k"], pattern:"Alter; voiceless-stop frame; discrete change", evidenceStatus:"DESCRIBED-PATTERN", individualConsonantSemantics:"UNRESOLVED", executable:false, evidence:"Phase 4 §3.2; Phase 5.15 TRAK row", limitation },
  { macro:"KREN", frameSet:["b","d","g"], pattern:"Proposed reinforced counterpart; voiced-stop frame", evidenceStatus:"PROPOSED-OWNER-CONFIRMATION", individualConsonantSemantics:"UNRESOLVED", executable:false, evidence:"Phase 4 §3.2; Phase 5.15 KREN row", limitation }
] as const;
export function reviewConstructionFrameMacroAssociation(value: unknown): ConstructionFrameMacroAssociation | null {
  if (typeof value !== "string") return null;
  const key=value.trim().toUpperCase();
  return constructionFrameMacroAssociations.find(entry=>entry.macro===key) ?? null;
}
