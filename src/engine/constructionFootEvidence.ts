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
export const constructionRelationCodaInventory = [
 {form:"m",macro:"FREM",meaning:"OPEN-LOOP-MAINTENANCE",evidence:"Phase 4 §3.2 Table 3"},
 {form:"n",macro:"FREM",meaning:"OPEN-LOOP-MAINTENANCE",evidence:"Phase 4 §3.2 Table 3"},
 {form:"ng",ipa:"ŋ",macro:"FREM",meaning:"MAINTENANCE-WITH-FEEDBACK",evidence:"Phase 4 §3.2 Table 3; D-036"},
 {form:"s",macro:"SHREN",meaning:"RELEASE",evidence:"Phase 4 §3.2 Table 3"},
 {form:"sh",macro:"SHREN",meaning:"RELEASE",evidence:"Phase 4 §3.2 Table 3"}
] as const;
export const constructionFootEvidenceBoundary = {
 shape:"CVC",
 shapeEvidenceDiscrepancy:{ status:"PRIMARY-SOURCE-FAVOURED-SECONDARY-SUMMARY-CONFLICT", primary:"Phase 4 §3.1 Table 2 and §10 P4-T10: CVC frame + parameter vowel + relation coda.", conflictingSummary:"Phase 5.16 C-02: optional relation coda (secondary recovery summary).", treatment:"Use CVC as the documented Phase 4 primary-source shape for this profile. Retain the Phase 5.16 optional-coda wording as an unresolved secondary-summary context discrepancy; do not implement optional-coda grammar without recovering its intended context." },
 relationCoda:"Five source-backed relation codas: m/n = FREM open-loop maintenance; ng (IPA ŋ) = FREM maintenance with feedback; s/sh = SHREN release. The separate ten-member phonotactic coda inventory is not the same list.",
 cvForms:"pa, ba, ta, da, ka, ga are documented canonical frame forms, not complete CVC Feet.",
 unresolved:["semantic contrast carried by each frame consonant","productive frame × parameter-vowel × relation-coda combinations","productive frame × parameter × relation combinations","full Foot argument structure and composition","physical/resource semantics and execution"],
 source:"Phase 4 §§3.1–3.2, §10; Phase 5.15 Construction Contract Matrix; Phase 5.16 C-02, C-06, C-09",
 canonEffect:"NONE"
} as const;
