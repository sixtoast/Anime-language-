/**
 * Evidence-only inventory for the six operational Construction macros.
 * Sources: Phase 4 §3.2 and §8; Phase 5.15 Construction Contract Matrix;
 * Phase 7A operator inventory reconciliation; Phase 7X §6.
 * This records source evidence and does not define executable signatures.
 */
export type ConstructionMacroStatus = "PATTERN-DESCRIBED" | "PROPOSED" | "PARTIAL-EXAMPLE" | "ROLE-DESCRIBED" | "UNRECOGNISED" | "EMPTY";
export interface ConstructionMacroEvidence {
  form: string;
  gloss: string;
  evidenceStatus: Exclude<ConstructionMacroStatus, "UNRECOGNISED" | "EMPTY">;
  recoveredEvidence: string;
  unresolvedContract: string;
  executable: false;
}
const notExecutable = false as const;
export const constructionMacroEvidence: readonly ConstructionMacroEvidence[] = [
  { form: "TRAK", gloss: "alter", evidenceStatus: "PATTERN-DESCRIBED", recoveredEvidence: "Phase 4 §3.2 describes voiceless-stop frames p, t and k for discrete change.", unresolvedContract: "Exact expansion, arity, input/output relation, and physical/resource semantics are not recovered.", executable: notExecutable },
  { form: "KREN", gloss: "establish", evidenceStatus: "PROPOSED", recoveredEvidence: "Phase 4 §3.2 proposes voiced-stop frames b, d and g as a reinforced counterpart to TRAK.", unresolvedContract: "The source marks this proposal as requiring owner confirmation; exact Foot mapping and operational meaning remain open.", executable: notExecutable },
  { form: "FREM", gloss: "maintain", evidenceStatus: "PARTIAL-EXAMPLE", recoveredEvidence: "The Phase 4 hand-flame example uses ken as a held energy state.", unresolvedContract: "A general pattern, duration semantics, maintenance conditions, resource limits and termination behaviour are not established.", executable: notExecutable },
  { form: "SHREN", gloss: "release", evidenceStatus: "PARTIAL-EXAMPLE", recoveredEvidence: "The Phase 4 hand-flame example uses kas for release.", unresolvedContract: "The general pattern, release target, release mode and safety conditions are not established.", executable: notExecutable },
  { form: "BRAN", gloss: "couple", evidenceStatus: "PATTERN-DESCRIBED", recoveredEvidence: "Phase 4 §3.2 describes h-domain syllables as a coupling family.", unresolvedContract: "Exact coupling composition, participant order, domain mapping and resource costs remain unresolved.", executable: notExecutable },
  { form: "VARE", gloss: "prefer", evidenceStatus: "ROLE-DESCRIBED", recoveredEvidence: "Phase 4 §3.2 and §6 G-4 describe a soft-requirement modifier paired with hard REQUIRE.", unresolvedContract: "Attachment, conflict resolution, failure policy and operational semantics remain open.", executable: notExecutable }
] as const;
export interface ConstructionMacroReview {
  input: string;
  status: ConstructionMacroStatus;
  entry: ConstructionMacroEvidence | null;
  message: string;
}
export function reviewConstructionMacro(input: string): ConstructionMacroReview {
  const normalized = input.trim().toUpperCase();
  if (!normalized) return { input, status: "EMPTY", entry: null, message: "Enter one of the six recorded operational forms." };
  const entry = constructionMacroEvidence.find(item => item.form === normalized) ?? null;
  if (!entry) return { input, status: "UNRECOGNISED", entry: null, message: "This is not one of the six operational forms in the recovered inventory. No meaning or signature is inferred." };
  return { input, status: entry.evidenceStatus, entry, message: "This is a source-evidence lookup, not a complete operator contract, parser signature, valid Construction or executable operation." };
}
