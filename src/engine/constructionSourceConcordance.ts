/** Phase 8AQ source concordance: metadata and evidence status only.
 * It deliberately does not equate the indexed text transcriptions with the loose DOCX.
 */
export type ConstructionSourceStatus = "ORIGINAL-BINARY-PRESENT" | "INDEXED-TRANSCRIPTION" | "SOURCE-MATRIX" | "CONFLICT-OPEN";
export interface ConstructionSourceArtifact {
  id: string; label: string; path: string; status: ConstructionSourceStatus;
  contentSha256?: string; extractedCharacters?: number; previewLimit?: number;
  gitBlobSha?: string; bytes?: number; equivalenceToOriginal: "NOT-APPLICABLE" | "UNVERIFIED";
  note: string;
}
export const constructionSourceArtifacts: readonly ConstructionSourceArtifact[] = [
  { id:"phase4-docx", label:"Loose Phase 4 original DOCX", path:"sources/originals/Arcane_Language_Audit_Phase_4.docx", status:"ORIGINAL-BINARY-PRESENT", gitBlobSha:"e3dca2ef236f89be442556c989e79d5b977a82b1", bytes:27027, equivalenceToOriginal:"NOT-APPLICABLE", note:"Binary source is present in Git, but the UTF-8 file reader cannot inspect its contents. Its document-body transcription has not been independently verified in this phase." },
  { id:"phase4-docx-index", label:"Archive-index DOCX text entry", path:"sources/archive-reports/mega-pack-text-index.md", status:"INDEXED-TRANSCRIPTION", contentSha256:"c8204667c204227ba474fd0b5245fd66f1ba081565671f5a28cf65efb513eaea", extractedCharacters:21121, previewLimit:1800, equivalenceToOriginal:"UNVERIFIED", note:"Archive member name: Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Language_Audit_Phase_4 2.docx. Only the first 1,800 extracted characters are stored in the index." },
  { id:"phase4-text-index", label:"Archive-index TXT transcription", path:"sources/archive-reports/mega-pack-text-index.md", status:"INDEXED-TRANSCRIPTION", contentSha256:"247ccc59f074309d6bed69213acff68ddd4fc09ced80565f7176a10d2515e450", extractedCharacters:22019, previewLimit:1800, equivalenceToOriginal:"UNVERIFIED", note:"Archive member name: Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Language_Audit_Phase_4 4.txt. This is a distinct indexed text artifact; byte identity or textual identity with the loose DOCX is not established." },
  { id:"phase5-15-matrix", label:"Phase 5.15 Construction Contract Matrix", path:"sources/originals/Arcane_Phase_5_15_Construction_Contract_Matrix.csv", status:"SOURCE-MATRIX", equivalenceToOriginal:"NOT-APPLICABLE", note:"Explicitly records CVC Foot shape, six frame classes, provisional parameter families, relation-coda position, coupling and macro evidence." },
  { id:"phase5-16-matrix", label:"Phase 5.16 Construction Recovery Matrix", path:"sources/originals/Arcane_Phase_5_16_Construction_Recovery_Matrix.csv", status:"CONFLICT-OPEN", equivalenceToOriginal:"NOT-APPLICABLE", note:"C-02 describes an optional relation coda, conflicting with the CVC statement in Phase 5.15. C-09 preserves the wider v2.0 recovery gap." }
] as const;
export interface ConstructionSourceClaim {
  id:string; subject:string; status:"SOURCE-BACKED-STRUCTURE"|"PROVISIONAL"|"PARTIAL-EXAMPLE"|"CONFLICT-OPEN"|"UNRECOVERED";
  sourceIds: readonly string[]; statement:string; boundary:string;
}
export const constructionSourceClaims: readonly ConstructionSourceClaim[] = [
  { id:"FOOT-SHAPE", subject:"Construction Foot shape", status:"CONFLICT-OPEN", sourceIds:["phase5-15-matrix","phase5-16-matrix"], statement:"Phase 5.15 specifies frame + parameter vowel + relation coda (CVC); Phase 5.16 C-02 describes the relation coda as optional.", boundary:"Do not select either reading as settled canon; CV forms are documented frame forms, not proven complete Feet." },
  { id:"FRAME-INVENTORY", subject:"Frame consonants", status:"SOURCE-BACKED-STRUCTURE", sourceIds:["phase5-15-matrix"], statement:"Six frame classes p, b, t, d, k, g are recorded, represented by pa, ba, ta, da, ka, ga.", boundary:"The individual semantic contrast of each consonant remains unrecovered." },
  { id:"PARAMETER-FAMILIES", subject:"Parameter vowels", status:"PROVISIONAL", sourceIds:["phase5-15-matrix","phase5-16-matrix"], statement:"The recorded family labels are a/energy, u/motion, o/extent, e/structure-form, i/information and ə/baseline.", boundary:"These labels are provisional; no operational semantics or physical calculation is defined." },
  { id:"RELATION-CODAS", subject:"Relation codas", status:"UNRECOVERED", sourceIds:["phase5-15-matrix"], statement:"The relation is encoded in the final coda position.", boundary:"The complete coda inventory and coda-to-relation mapping are not recovered." },
  { id:"H-COUPLINGS", subject:"H-series couplings", status:"PROVISIONAL", sourceIds:["phase5-15-matrix","phase5-16-matrix"], statement:"The family hə/he/ha/hu/hi/ho and glosses mana/matter/energy/living/information/field are recorded.", boundary:"Domain-to-physical mapping, participants, direction, signatures and resource costs remain unresolved." },
  { id:"MACROS", subject:"Six Construction macros", status:"PARTIAL-EXAMPLE", sourceIds:["phase5-15-matrix"], statement:"TRAK/KREN frame groups, FREM/SHREN example associations, BRAN coupling family and VARE soft-requirement role are recorded at differing evidence strengths.", boundary:"Do not infer macro expansions, arity, argument order, executable semantics or stage attachment." },
  { id:"HAND-FLAME", subject:"Hand-flame example", status:"PARTIAL-EXAMPLE", sourceIds:["phase5-15-matrix","phase5-16-matrix"], statement:"A tokenised example is recorded, including MEL-like reference, KAN/KEN, H-series forms and KAS.", boundary:"The example is not a complete grammar parse, feasibility proof or productive rule set." }
] as const;
export function findConstructionSourceClaim(id: unknown): ConstructionSourceClaim | null {
  if (typeof id !== "string") return null;
  return constructionSourceClaims.find(claim => claim.id === id) ?? null;
}
export function findConstructionSourceArtifact(id: unknown): ConstructionSourceArtifact | null {
  if (typeof id !== "string") return null;
  return constructionSourceArtifacts.find(artifact => artifact.id === id) ?? null;
}
export const constructionSourceConcordanceLimits = {
  executable:false, canonEffect:"NONE",
  transcriptionEquivalence:"UNVERIFIED",
  rule:"Archive-index metadata and partial excerpts are not a complete source transcription. Do not merge artifacts or resolve conflicts without inspecting the full source."
} as const;
