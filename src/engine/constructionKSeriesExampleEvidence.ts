/**
 * Evidence-only KAN/KEN/KAS inventory from the Phase 4 hand-flame example.
 * Source: Phase 4 §8; Phase 5.15 Construction Contract Matrix; Phase 5.16 C-08/C-09.
 * These records do not establish a productive Foot grammar or macro expansion.
 */
export type KSeriesExampleStatus = "PRESENT-RULE-UNRESOLVED" | "PARTIAL-HELD-STATE" | "PARTIAL-RELEASE";
export interface KSeriesExampleEvidence {
  form: "kan" | "ken" | "kas";
  status: KSeriesExampleStatus;
  evidence: string;
  unresolved: string;
  macroAssociation: "FREM-PARTIAL" | "SHREN-PARTIAL" | "NONE-ESTABLISHED";
  executable: false;
}
export const kSeriesExampleEvidence: readonly KSeriesExampleEvidence[] = [
 {form:"kan",status:"PRESENT-RULE-UNRESOLVED",evidence:"KAN appears in the hand-flame worked example as the first form in the source chunk 'kan ken'.",unresolved:"No exact gloss, independent semantic rule, argument structure, relation to KEN, or general Foot interpretation is recovered.",macroAssociation:"NONE-ESTABLISHED",executable:false},
 {form:"ken",status:"PARTIAL-HELD-STATE",evidence:"The hand-flame recovery associates KEN with a held energy state; the matrix associates this evidence with FREM only partially.",unresolved:"No general duration model, maintenance conditions, resource limits, termination behaviour, argument structure, or one-to-one FREM expansion is established.",macroAssociation:"FREM-PARTIAL",executable:false},
 {form:"kas",status:"PARTIAL-RELEASE",evidence:"The hand-flame recovery associates KAS with release; the matrix associates this evidence with SHREN only partially.",unresolved:"No general release grammar, target binding, release mode, safety conditions, argument structure, or one-to-one SHREN expansion is established.",macroAssociation:"SHREN-PARTIAL",executable:false}
] as const;
export type KSeriesReviewStatus = "EMPTY" | KSeriesExampleStatus | "UNRECOGNISED";
export interface KSeriesReview {input:string;status:KSeriesReviewStatus;entry:KSeriesExampleEvidence|null;message:string;executable:false}
export function reviewKSeriesExample(input:string):KSeriesReview {
 const normalized=input.trim().toLowerCase();
 if(!normalized)return {input,status:"EMPTY",entry:null,message:"Enter KAN, KEN or KAS to inspect the recovered example evidence.",executable:false};
 const entry=kSeriesExampleEvidence.find(item=>item.form===normalized)??null;
 if(!entry)return {input,status:"UNRECOGNISED",entry:null,message:"This form is not in the recovered KAN/KEN/KAS example inventory. No K-series rule is inferred.",executable:false};
 return {input,status:entry.status,entry,message:"This is partial worked-example evidence, not a complete Foot, macro expansion, or executable operation.",executable:false};
}
