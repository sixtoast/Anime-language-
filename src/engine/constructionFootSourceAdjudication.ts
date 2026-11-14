/** Phase 8CY-W — reconciled primary-source adjudication for Construction Foot shape. */
export const constructionFootSourceClaims=[
 {id:"P5.15-FOOT-CVC",source:"Arcane_Phase_5_15_Construction_Contract_Matrix.csv",sourceKind:"SECONDARY-RECOVERY-MATRIX",citedAuthority:["Phase 4 §3.1","Phase 4 §10","P4-T05","P4-T10"],claim:"CVC: frame consonant + parameter vowel + relation coda.",status:"CVC-REQUIRED"},
 {id:"P5.16-C02-FOOT-CV",source:"Arcane_Phase_5_16_Construction_Recovery_Matrix.csv",sourceKind:"SECONDARY-RECOVERY-MATRIX",citedAuthority:["Phase 4 §3.1","lexicon tools"],claim:"Frame + parameter vowel + optional relation coda.",status:"CODA-OPTIONAL"}
] as const;
export const constructionFootPrimaryAuthority={
 source:"sources/originals/Arcane_Language_Audit_Phase_4.docx",
 format:"DOCX",
 byteIdentity:"VERIFIED-IN-ARCHIVE-REPORT",
 fullBodyInspection:"BODY-TRANSCRIPTION-REVIEWED-WITH-EXTRACTION-SCOPE-LIMITS",
 reviewedDerivative:"sources/extracted/phase4-docx-body-transcription.md",
 extractionScope:"Document-body paragraphs and tables; excludes footnotes/endnotes, comments, tracked-change intent, layout and floating objects.",
 relevantSections:["§3.1 Table 2","§3.2 Table 3","§4 Table 4","§8 Table 14","§10 Table 15 P4-T05/P4-T10"],
 authorityRole:"PRIMARY-SOURCE-REVIEWED"
} as const;
export const constructionFootConflictAdjudication={
 status:"PRIMARY-SOURCE-FAVOURED-SECONDARY-SUMMARY-CONFLICT",
 claims:constructionFootSourceClaims,
 primaryAuthority:constructionFootPrimaryAuthority,
 precedence:"PHASE4-DOCX-BODY-OVER-SECONDARY-SUMMARY",
 resolution:"CVC-PRIMARY-SOURCE-FAVOURED; P5.16-C02-CONTEXT-UNRESOLVED",
 permittedConclusion:"Phase 4 §3.1 Table 2 and §10 P4-T10 directly state the CVC Foot shape. The Phase 5.16 C-02 optional-coda statement remains a secondary-summary discrepancy whose intended context is not recovered. CVC is the current primary-source rule; no optional-coda grammar is implemented.",
 prohibitedConclusions:["CV is a complete Foot","The Phase 5.16 optional-coda wording overrides Phase 4","The optional-coda discrepancy is resolved as a typographical error","CVC shape proves that every frame-vowel-coda combination is lexically licensed","The 180 design-space combinations are attested words"],
 nextEvidenceRequired:["Recover the original v2.0 morphology source and the full Phase 5.16 C-02 context","Recover lexical attestations and expected tests for frame × vowel × coda combinations","Establish whether the Phase 5.16 optionality statement describes a narrower context, version difference or summary error"],
 supersedes:"docs/research/phase8by-construction-foot-source-provenance-adjudication.md",
 canonEffect:"NONE",
 executable:false
} as const;
export type ConstructionFootAdjudicationReview={
 status:"PRIMARY-SOURCE-FAVOURED-SECONDARY-SUMMARY-CONFLICT";
 precedence:"PHASE4-DOCX-BODY-OVER-SECONDARY-SUMMARY";
 sourceCount:2;primarySourceInspected:true;conclusion:string;nextEvidence:string[];canonEffect:"NONE";executable:false;
};
export function reviewConstructionFootSourceAdjudication():ConstructionFootAdjudicationReview{
 return {status:constructionFootConflictAdjudication.status,precedence:constructionFootConflictAdjudication.precedence,sourceCount:constructionFootSourceClaims.length,primarySourceInspected:true,conclusion:constructionFootConflictAdjudication.permittedConclusion,nextEvidence:[...constructionFootConflictAdjudication.nextEvidenceRequired],canonEffect:"NONE",executable:false};
}
