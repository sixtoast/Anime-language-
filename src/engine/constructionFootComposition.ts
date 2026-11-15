import { reviewConstructionFootShape, type FootShapeReview } from "./constructionFootShape";
export type FootSourceReadingId = "P5.15-CVC-REQUIRED" | "P5.16-CODA-OPTIONAL";
export type FootSlotAssessment = "INVALID-SHAPE" | "REQUIRED-CODA-ABSENT" | "OPTIONAL-CODA-ABSENT" | "THREE-SLOT-SHAPE-PRESENT";
export interface FootSourceReadingAssessment {
 sourceReading: FootSourceReadingId; codaRequirement: "REQUIRED" | "OPTIONAL"; slotAssessment: FootSlotAssessment;
 framePrefix: "CANONICAL-CV-FRAME" | "UNRECOVERED-FRAME-VOWEL-COMBINATION" | "NOT-ASSESSABLE";
 codaEvidence: "NO-CODA-SUPPLIED" | "CODA-MEMBERSHIP-UNRESOLVED" | "NOT-ASSESSABLE";
 conclusion: "UNRESOLVED"; explanation: string;
}
export interface ConstructionFootCompositionReview { input: string; shape: FootShapeReview; readings: readonly [FootSourceReadingAssessment, FootSourceReadingAssessment]; limitation: string; }
const LIMITATION = "Parallel source-reading comparison only. Neither reading establishes productive Foot morphology, coda membership, semantic interpretation, physical validity, feasibility or execution.";
export function reviewConstructionFootComposition(value: unknown): ConstructionFootCompositionReview {
 const shape=reviewConstructionFootShape(value), valid=shape.status!=="SHAPE-INVALID", hasCoda=valid&&shape.relationCoda!==null;
 const canonical=shape.frame!==null&&shape.parameterVowel!==null&&["pa","ba","ta","da","ka","ga"].includes(shape.frame+shape.parameterVowel);
 const framePrefix:FootSourceReadingAssessment["framePrefix"]=!valid?"NOT-ASSESSABLE":canonical?"CANONICAL-CV-FRAME":"UNRECOVERED-FRAME-VOWEL-COMBINATION";
 const codaEvidence:FootSourceReadingAssessment["codaEvidence"]=!valid?"NOT-ASSESSABLE":hasCoda?"CODA-MEMBERSHIP-UNRESOLVED":"NO-CODA-SUPPLIED";
 const make=(sourceReading:FootSourceReadingId,codaRequirement:"REQUIRED"|"OPTIONAL"):FootSourceReadingAssessment=>{
  let slotAssessment:FootSlotAssessment, explanation:string;
  if(!valid){slotAssessment="INVALID-SHAPE";explanation="The input fails basic structural checks and cannot be assessed against this source reading.";}
  else if(!hasCoda&&codaRequirement==="REQUIRED"){slotAssessment="REQUIRED-CODA-ABSENT";explanation="This reading requires a relation-coda slot, but the input supplies only frame and parameter-vowel positions.";}
  else if(!hasCoda){slotAssessment="OPTIONAL-CODA-ABSENT";explanation="The optional-coda summary permits an absent coda structurally; this does not prove a complete or productive Foot.";}
  else{slotAssessment="THREE-SLOT-SHAPE-PRESENT";explanation="Three positions are occupied, but the final letter's phonological status, coda membership and relation meaning remain unrecovered.";}
  return {sourceReading,codaRequirement,slotAssessment,framePrefix,codaEvidence,conclusion:"UNRESOLVED",explanation};
 };
 return {input:typeof value==="string"?value:"",shape,readings:[make("P5.15-CVC-REQUIRED","REQUIRED"),make("P5.16-CODA-OPTIONAL","OPTIONAL")],limitation:LIMITATION};
}
