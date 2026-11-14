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
  { id:"phase4-text-index-2", label:"Second archive-index TXT transcription", path:"sources/archive-reports/mega-pack-text-index.md", status:"INDEXED-TRANSCRIPTION", contentSha256:"e82d13dbbf1fa3e48b3f50282490bb4436877d1a3c039a451b413dd26c3ba652", extractedCharacters:21846, previewLimit:1800, equivalenceToOriginal:"UNVERIFIED", note:"Archive member name: Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Language_Audit_Phase_4.txt. This distinct TXT record has not been verified against the DOCX-derived entry, the other TXT entry or the loose original." },
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
  { id:"H-COUPLINGS", subject:"H-series couplings", status:"PROVISIONAL", sourceIds:["phase5-15-matrix","phase5-16-matrix"], statement:"The heavy coupling syllable family is hə, he, ha, hu, hi, ho; its domain/property mapping is explicitly provisional.", boundary:"The physical coupling vector, participant types, direction, signatures, composition and resource costs remain unresolved." },
  { id:"MACRO-TRAK", subject:"TRAK", status:"SOURCE-BACKED-STRUCTURE", sourceIds:["phase5-15-matrix"], statement:"TRAK is described as Alter, associated with voiceless-stop frame consonants p, t, k and discrete change.", boundary:"The exact expansion, arity, physical semantics and resource semantics remain open; the association does not define individual consonant meanings." },
  { id:"MACRO-KREN", subject:"KREN", status:"PROVISIONAL", sourceIds:["phase5-15-matrix"], statement:"KREN is described as Establish, associated with voiced-stop frames b, d, g as a reinforced counterpart.", boundary:"The matrix marks this proposal as requiring owner confirmation. It is not approved canon or an executable contract." },
  { id:"MACRO-FREM", subject:"FREM", status:"PARTIAL-EXAMPLE", sourceIds:["phase5-15-matrix","phase5-16-matrix"], statement:"FREM is glossed Maintain; the hand-flame example uses ken as a held-energy state.", boundary:"The general pattern, expansion, arity, target binding and termination conditions are not recovered." },
  { id:"MACRO-SHREN", subject:"SHREN", status:"PARTIAL-EXAMPLE", sourceIds:["phase5-15-matrix","phase5-16-matrix"], statement:"SHREN is glossed Release; the hand-flame example uses kas for release.", boundary:"The general pattern, expansion, release target and safety conditions are not recovered." },
  { id:"MACRO-BRAN", subject:"BRAN", status:"PROVISIONAL", sourceIds:["phase5-15-matrix"], statement:"BRAN is described as Couple and associated with the h-domain syllable family.", boundary:"Coupling composition, order, physical vector and resource costs remain provisional or unresolved." },
  { id:"MACRO-VARE", subject:"VARE", status:"SOURCE-BACKED-STRUCTURE", sourceIds:["phase5-15-matrix"], statement:"VARE is described as a soft-requirement modifier paired with hard REQUIRE.", boundary:"Conflict resolution, failure policy, attachment and operational semantics remain open; no executable behaviour is defined." },
  { id:"HAND-FLAME", subject:"Hand-flame example", status:"PARTIAL-EXAMPLE", sourceIds:["phase5-15-matrix","phase5-16-matrix"], statement:"The recorded sequence is mel · po da za shi to za ma · kan ken · he ha · sa shi za se · kas.", boundary:"Tokenisation is checked, but the whole-spell parse and feasibility are not. Energy magnitude, extent and matter-coupling parameters are unspecified." }
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
