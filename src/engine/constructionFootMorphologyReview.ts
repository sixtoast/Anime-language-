/** Phase 8CD — Construction Foot morphology evidence reviewer. */
import { constructionFrameInventory, constructionParameterInventory, constructionFootEvidenceBoundary } from "./constructionFootEvidence";
import { reviewConstructionFrameMacroAssociation } from "./constructionFrameContrastEvidence";
export type FootMorphologyReviewStatus = "EMPTY" | "FRAME-FORM-RECORDED" | "CVC-STRUCTURE-CANDIDATE" | "UNRECOGNISED-SHAPE";
export type RelationCodaMeaning = "NOT-RECOVERED" | "NOT-APPLICABLE" | "MAINTAIN-OPEN-LOOP" | "MAINTAIN-FEEDBACK" | "RELEASE";
export interface FootMorphologyReview { input:string; normalized:string; status:FootMorphologyReviewStatus; frameConsonant:string|null; frameForm:string|null; parameterVowel:string|null; parameterFamily:string|null; relationCoda:string|null; codaMeaning:RelationCodaMeaning; codaRequirement:"UNRESOLVED-SOURCE-DISCREPANCY"; macroAssociation:"TRAK"|"KREN"|"NONE-RECORDED"|"NOT-APPLICABLE"; lexicalFootValidity:"NOT-ESTABLISHED"; executable:false; explanation:string; }
const frames=new Set(constructionFrameInventory.map(item=>item.consonant));
const vowels=new Map(constructionParameterInventory.map(item=>[item.vowel,item.family]));
const relationCodaMeanings:Readonly<Record<string,RelationCodaMeaning>>={m:"MAINTAIN-OPEN-LOOP",n:"MAINTAIN-OPEN-LOOP",ng:"MAINTAIN-FEEDBACK",s:"RELEASE",sh:"RELEASE"};
const frameMacro=(consonant:string):FootMorphologyReview["macroAssociation"]=>{if(reviewConstructionFrameMacroAssociation("TRAK")?.frameSet.includes(consonant))return "TRAK";if(reviewConstructionFrameMacroAssociation("KREN")?.frameSet.includes(consonant))return "KREN";return "NONE-RECORDED";};
export const footMorphologyEvidenceBoundary={cvcEvidence:constructionFootEvidenceBoundary.shapeEvidenceDiscrepancy,frameFormsAreCompleteFeet:false,cvcShapeProvesLexicalValidity:false,parameterFamiliesAreProvisional:true,relationCodaInventoryRecovered:true,relationCodaInventory:["m","n","ng","s","sh"] as const,relationCodaSemanticsSource:"Phase 4 §3.2 Table 3; §11 D-036",productiveParadigmRecovered:false,executable:false} as const;
function makeResult(input:string,normalized:string,status:FootMorphologyReviewStatus,frame:string|null,vowel:string|null,coda:string|null,meaning:RelationCodaMeaning,macro:FootMorphologyReview["macroAssociation"],explanation:string):FootMorphologyReview{return {input,normalized,status,frameConsonant:frame,frameForm:frame?constructionFrameInventory.find(x=>x.consonant===frame)?.canonicalForm??null:null,parameterVowel:vowel,parameterFamily:vowel?vowels.get(vowel)??null:null,relationCoda:coda,codaMeaning:meaning,codaRequirement:"UNRESOLVED-SOURCE-DISCREPANCY",macroAssociation:macro,lexicalFootValidity:"NOT-ESTABLISHED",executable:false,explanation};}
export function reviewConstructionFootMorphology(input:unknown):FootMorphologyReview{
 const raw=typeof input==="string"?input:"",normalized=raw.trim().toLowerCase();
 if(!normalized)return makeResult(raw,normalized,"EMPTY",null,null,null,"NOT-APPLICABLE","NOT-APPLICABLE","Enter a candidate form. No Foot or operation is inferred.");
 const frame=normalized[0],vowel=normalized[1],knownFrame=frames.has(frame),knownVowel=vowels.has(vowel);
 if(normalized.length===2&&knownFrame&&normalized===frame+vowel)return makeResult(raw,normalized,"FRAME-FORM-RECORDED",frame,vowel,null,"NOT-APPLICABLE",frameMacro(frame),"This is a recorded CV frame form, not an established complete Foot. The parameter family remains provisional; the macro association is group-level and does not define individual consonant meaning. KREN remains a proposed, owner-confirmation reading.");
 const suffix=normalized.slice(2),legalCoda=suffix==="ng"||suffix==="sh"||(/^[a-z]$/.test(suffix)&&!vowels.has(suffix));
 if(knownFrame&&knownVowel&&legalCoda){
  const meaning=relationCodaMeanings[suffix]??"NOT-RECOVERED";
  const note=meaning==="NOT-RECOVERED"?"This matches the broad CVC outline, but this final consonant is not in the recovered five-member relation-coda set; phonotactic legality does not assign it a relation meaning.":meaning==="MAINTAIN-OPEN-LOOP"?"Phase 4 assigns this relation coda to open-loop maintenance. This is a source-backed coda association, not a complete Foot meaning or execution rule.":meaning==="MAINTAIN-FEEDBACK"?"Phase 4 D-036 assigns this relation coda to maintenance under feedback. This does not establish the feedback mechanism or a complete Foot meaning.":"Phase 4 assigns this relation coda to release. The release target and operational conditions remain unresolved.";
  return makeResult(raw,normalized,"CVC-STRUCTURE-CANDIDATE",frame,vowel,suffix,meaning,frameMacro(frame),note+" Lexical Foot validity and mandatory/optional status remain unresolved.");
 }
 return makeResult(raw,normalized,"UNRECOGNISED-SHAPE",null,null,null,"NOT-RECOVERED","NONE-RECORDED","This input does not match a recorded CV frame form or the documented CVC outline with a single- or two-letter final consonant.");
}
