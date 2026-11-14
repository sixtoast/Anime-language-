/** Phase 8BY — provenance adjudication for the conflicting Foot-coda summaries. */
export const constructionFootSourceClaims=[
 {id:"P5.15-FOOT-CVC",source:"Arcane_Phase_5_15_Construction_Contract_Matrix.csv",sourceKind:"SECONDARY-RECOVERY-MATRIX",citedAuthority:["Phase 4 §3.1","Phase 4 §10","P4-T05","P4-T10"],claim:"CVC: frame consonant + parameter vowel + relation coda.",status:"CVC-REQUIRED"},
 {id:"P5.16-C02-FOOT-CV",source:"Arcane_Phase_5_16_Construction_Recovery_Matrix.csv",sourceKind:"SECONDARY-RECOVERY-MATRIX",citedAuthority:["Phase 4 §3.1","lexicon tools"],claim:"Frame + parameter vowel + optional relation coda.",status:"CODA-OPTIONAL"}
] as const;
export const constructionFootPrimaryAuthority={
 source:"sources/originals/Arcane_Language_Audit_Phase_4.docx",
 format:"DOCX",
 byteIdentity:"VERIFIED-IN-ARCHIVE-REPORT",
 fullBodyInspection:"NOT-COMPLETED",
 relevantSections:["§3.1","§10"],
 authorityRole:"PRIMARY-SOURCE-REQUIRED-FOR-ADJUDICATION",
} as const;
export const constructionFootConflictAdjudication={
 status:"SECONDARY-SUMMARY-CONFLICT",
 claims:constructionFootSourceClaims,
 primaryAuthority:constructionFootPrimaryAuthority,
 precedence:"NOT-ASSIGNED",
 resolution:"PENDING-PRIMARY-SOURCE-INSPECTION",
 permittedConclusion:"The recovered summaries disagree about whether a relation coda is mandatory. Both cite Phase 4 §3.1, while the full primary document has not been inspected; neither summary is promoted over the other.",
 prohibitedConclusions:["CVC is definitively mandatory in every context","CV is definitively a complete Foot","Phase 5.15 overrides Phase 5.16","Phase 5.16 overrides Phase 5.15","The disagreement is merely typographical"],
 nextEvidenceRequired:["Inspect the complete original Phase 4 DOCX, especially §§3.1 and 10, including tables and footnotes","Compare each summary against the exact primary passages and any cited P4-T05/P4-T10 test definitions","Record whether optionality is contextual, versioned, erroneous or genuinely contradictory"],
 canonEffect:"NONE",
 executable:false
} as const;
export type ConstructionFootAdjudicationReview={
 status:"CONFLICT-OPEN"; precedence:"NOT-ASSIGNED"; sourceCount:2; primarySourceInspected:false;
 conclusion:string; nextEvidence:string[]; canonEffect:"NONE"; executable:false;
};
export function reviewConstructionFootSourceAdjudication():ConstructionFootAdjudicationReview{
 return {status:"CONFLICT-OPEN",precedence:"NOT-ASSIGNED",sourceCount:constructionFootSourceClaims.length,primarySourceInspected:false,conclusion:constructionFootConflictAdjudication.permittedConclusion,nextEvidence:[...constructionFootConflictAdjudication.nextEvidenceRequired],canonEffect:"NONE",executable:false};
}
