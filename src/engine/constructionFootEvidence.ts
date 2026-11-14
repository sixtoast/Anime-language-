/** Evidence ledger for recovered Construction Foot inventory; not a semantic grammar. */
export interface ConstructionFrameEvidence { consonant:string; canonicalForm:string; status:"SOURCE-BACKED"; semanticContrast:"UNRESOLVED"; evidence:string }
export interface ConstructionParameterEvidence { vowel:string; family:string; status:"PROVISIONAL"; execution:"NOT-DEFINED"; evidence:string }
export const constructionFrameInventory: readonly ConstructionFrameEvidence[] = [
 {consonant:"p",canonicalForm:"pa",status:"SOURCE-BACKED",semanticContrast:"UNRESOLVED",evidence:"Phase 4 L-03; Phase 5.15"},
 {consonant:"b",canonicalForm:"ba",status:"SOURCE-BACKED",semanticContrast:"UNRESOLVED",evidence:"Phase 4 L-03; Phase 5.15"},
 {consonant:"t",canonicalForm:"ta",status:"SOURCE-BACKED",semanticContrast:"UNRESOLVED",evidence:"Phase 4 L-03; Phase 5.15"},
 {consonant:"d",canonicalForm:"da",status:"SOURCE-BACKED",semanticContrast:"UNRESOLVED",evidence:"Phase 4 L-03; Phase 5.15"},
 {consonant:"k",canonicalForm:"ka",status:"SOURCE-BACKED",semanticContrast:"UNRESOLVED",evidence:"Phase 4 L-03; Phase 5.15"},
 {consonant:"g",canonicalForm:"ga",status:"SOURCE-BACKED",semanticContrast:"UNRESOLVED",evidence:"Phase 4 L-03; Phase 5.15"},
] as const;
export const constructionParameterInventory: readonly ConstructionParameterEvidence[] = [
 {vowel:"a",family:"Energy",status:"PROVISIONAL",execution:"NOT-DEFINED",evidence:"Phase 4 §3.2; Phase 5.15"},
 {vowel:"u",family:"Motion",status:"PROVISIONAL",execution:"NOT-DEFINED",evidence:"Phase 4 §3.2; Phase 5.15"},
 {vowel:"o",family:"Extent",status:"PROVISIONAL",execution:"NOT-DEFINED",evidence:"Phase 4 §3.2; Phase 5.15"},
 {vowel:"e",family:"Structure/form",status:"PROVISIONAL",execution:"NOT-DEFINED",evidence:"Phase 4 §3.2; Phase 5.15"},
 {vowel:"i",family:"Information",status:"PROVISIONAL",execution:"NOT-DEFINED",evidence:"Phase 4 §3.2; Phase 5.15"},
 {vowel:"ə",family:"Baseline",status:"PROVISIONAL",execution:"NOT-DEFINED",evidence:"Phase 4 §3.2; Phase 5.15"},
] as const;
export const constructionFootEvidenceBoundary = {
 shape:"CVC",
 shapeEvidenceDiscrepancy:{ status:"UNRESOLVED-SOURCE-DISCREPANCY", primary:"Phase 5.15: CVC frame + parameter vowel + relation coda.", conflictingSummary:"Phase 5.16 C-02: frame + parameter vowel + optional relation coda.", treatment:"Do not collapse these statements into one canon rule. CV is recognised as a frame form; CVC is structurally recognised but remains semantically unresolved. Owner/source confirmation is required to settle whether the coda is mandatory in every Foot context." },
 relationCoda:"The relation occupies the final consonant position; the complete coda inventory and coda-to-relation meanings are not recovered.",
 cvForms:"pa, ba, ta, da, ka, ga are documented canonical frame forms, not complete CVC Feet.",
 unresolved:["semantic contrast carried by each frame consonant","complete relation-coda inventory and its meanings","productive frame × parameter × relation combinations","full Foot argument structure and composition","physical/resource semantics and execution"],
 source:"Phase 4 §§3.1–3.2, §10; Phase 5.15 Construction Contract Matrix; Phase 5.16 C-02, C-06, C-09",
 canonEffect:"NONE"
} as const;
