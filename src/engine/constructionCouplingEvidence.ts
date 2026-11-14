/** Evidence-only H-series coupling inventory. Sources: Phase 4 §§3.2–3.3; Phase 5.15; Phase 5.16 C-07; Phase 7X §7. */
export type CouplingEvidenceStatus = "GLOSS-RECORDED" | "UNRECOGNISED" | "EMPTY";
export interface CouplingEvidenceEntry { form: string; gloss: string; sourceVersion: "v2.0"; signatureStatus: "UNRESOLVED"; physicalMappingStatus: "PROVISIONAL"; limitation: string; }
const limitation = "Full argument signature, direction, validity conditions and operational relation are not recovered.";
export const constructionCouplingEvidence: readonly CouplingEvidenceEntry[] = [
  { form: "hə", gloss: "mana", sourceVersion: "v2.0", signatureStatus: "UNRESOLVED", physicalMappingStatus: "PROVISIONAL", limitation },
  { form: "he", gloss: "matter", sourceVersion: "v2.0", signatureStatus: "UNRESOLVED", physicalMappingStatus: "PROVISIONAL", limitation },
  { form: "ha", gloss: "energy", sourceVersion: "v2.0", signatureStatus: "UNRESOLVED", physicalMappingStatus: "PROVISIONAL", limitation },
  { form: "hu", gloss: "living", sourceVersion: "v2.0", signatureStatus: "UNRESOLVED", physicalMappingStatus: "PROVISIONAL", limitation },
  { form: "hi", gloss: "information", sourceVersion: "v2.0", signatureStatus: "UNRESOLVED", physicalMappingStatus: "PROVISIONAL", limitation },
  { form: "ho", gloss: "field", sourceVersion: "v2.0", signatureStatus: "UNRESOLVED", physicalMappingStatus: "PROVISIONAL", limitation }
] as const;
export interface CouplingEvidenceReview { input: string; status: CouplingEvidenceStatus; entry: CouplingEvidenceEntry | null; message: string; executable: false; }
export function reviewConstructionCoupling(input: string): CouplingEvidenceReview {
  const normalized = input.trim().toLowerCase();
  if (!normalized) return { input, status: "EMPTY", entry: null, message: "Enter an H-series form to look up its recorded v2.0 gloss.", executable: false };
  const entry = constructionCouplingEvidence.find(item => item.form === normalized) ?? null;
  if (!entry) return { input, status: "UNRECOGNISED", entry: null, message: "This form is not one of the six H-series entries in the recovered registry. No coupling meaning is inferred.", executable: false };
  return { input, status: "GLOSS-RECORDED", entry, message: "The source records this gloss only. Argument slots, direction, validity conditions and physical effect remain unresolved; this lookup is not a coupling operation.", executable: false };
}
