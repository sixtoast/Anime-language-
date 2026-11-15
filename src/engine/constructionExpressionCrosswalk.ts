import { getOperatorContract } from "./operatorContracts";
import { reviewConstructionMacro } from "./constructionMacroEvidence";
import { reviewConstructionCoupling } from "./constructionCouplingEvidence";
import { reviewConstructionFrameMacroAssociation } from "./constructionFrameContrastEvidence";

/** Phase 8BX: an evidence crosswalk, not an operator-to-macro translation table. */
export const expressionOperatorFamilies=[
 {id:"ARITHMETIC",operators:["FRAPA","FRATA","FRAKA","FRALA","FRASHA"],description:"Quantity arithmetic and unary numeric transformation",constructionTarget:"NOT-ESTABLISHED"},
 {id:"SPATIAL",operators:["DRAN","DREM","DRIM","DRAL"],description:"Magnitude, vector products and comparison",constructionTarget:"NOT-ESTABLISHED"},
 {id:"LOGIC-CONTROL",operators:["GRAN","GRAT","GRAK","BEK","ZET"],description:"Boolean combination and control-flow concepts",constructionTarget:"NOT-ESTABLISHED"},
 {id:"INFORMATION-STATE",operators:["SIMA","NES","GAMA","DAVE","KWAM","KWAT","KWAK"],description:"Measurement, information access, inference, assignment, binding and live evaluation",constructionTarget:"NOT-ESTABLISHED"}
] as const;
export const constructionMacroRelationships=[
 {macro:"TRAK",relationship:"Alter; p/t/k voiceless-stop pattern",evidence:"PATTERN-DESCRIBED",mappingToExpression:"NOT-ESTABLISHED"},
 {macro:"KREN",relationship:"Proposed reinforced b/d/g counterpart to TRAK",evidence:"PROPOSED-OWNER-CONFIRMATION",mappingToExpression:"NOT-ESTABLISHED"},
 {macro:"FREM",relationship:"Maintain; ken is a partial held-state example",evidence:"PARTIAL-EXAMPLE",mappingToExpression:"NOT-ESTABLISHED"},
 {macro:"SHREN",relationship:"Release; kas is a partial release example",evidence:"PARTIAL-EXAMPLE",mappingToExpression:"NOT-ESTABLISHED"},
 {macro:"BRAN",relationship:"Couple; h-domain syllable family",evidence:"PATTERN-DESCRIBED-DOMAIN-PROVISIONAL",mappingToExpression:"NOT-ESTABLISHED"},
 {macro:"VARE",relationship:"Soft-requirement modifier paired with hard REQUIRE",evidence:"ROLE-DESCRIBED",mappingToExpression:"NOT-ESTABLISHED"}
] as const;
export const expressionConstructionCrosswalkRules=[
 {id:"XW-01",statement:"Expression and Construction are distinct subsystems; their conceptual bridge is source-backed."},
 {id:"XW-02",statement:"The Phase 5.15 matrix explicitly says a formal AST-to-Construction mapping table and end-to-end trace are not demonstrated."},
 {id:"XW-03",statement:"A macro's gloss or frame-set association is not an Expression operator signature."},
 {id:"XW-04",statement:"A formal operator's proposed arity or semantic description is not a Construction instruction."},
 {id:"XW-05",statement:"A matching domain word, mathematical concept or example token does not establish a cross-system mapping."},
 {id:"XW-06",statement:"No mapping is approved by this crosswalk; it is an inventory of evidence and explicit gaps."}
] as const;
export type CrosswalkReview={
 operator:string;macro:string;operatorKnown:boolean;macroKnown:boolean;
 operatorFamily:string|null;macroEvidence:string|null;
 status:"NOT-ESTABLISHED"; executable:false; canonEffect:"NONE"; reason:string;
};
export function reviewExpressionConstructionPair(operatorInput:unknown,macroInput:unknown):CrosswalkReview|null{
 if(typeof operatorInput!=="string"||typeof macroInput!=="string")return null;
 const operator=operatorInput.trim().toUpperCase(),macro=macroInput.trim().toUpperCase();
 if(!operator||!macro)return null;
 const contract=getOperatorContract(operator),macroReview=reviewConstructionMacro(macro);
 const family=expressionOperatorFamilies.find(x=>(x.operators as readonly string[]).includes(operator));
 return {operator,macro,operatorKnown:!!contract,macroKnown:!!macroReview.entry,operatorFamily:family?.id??null,macroEvidence:macroReview.entry?.evidenceStatus??null,status:"NOT-ESTABLISHED",executable:false,canonEffect:"NONE",reason:"The recovered Phase 5.15 matrix states that the Expression-to-Construction mapping is not demonstrated. No source-backed pairwise translation rule is available; lexical recognition on either side does not establish equivalence."};
}
export function reviewExpressionOperator(input:unknown){
 if(typeof input!=="string")return null;
 const operator=input.trim().toUpperCase();if(!operator)return null;
 const contract=getOperatorContract(operator);
 const family=expressionOperatorFamilies.find(x=>(x.operators as readonly string[]).includes(operator));
 return {operator,known:!!contract,family:family?.id??null,mappingStatus:"NOT-ESTABLISHED" as const,arityStatus:contract?.arityStatus??null,executable:false as const};
}
export function reviewConstructionTarget(input:unknown){
 if(typeof input!=="string")return null;
 const value=input.trim();
 if(!value)return null;
 const macro=reviewConstructionMacro(value),coupling=reviewConstructionCoupling(value);
 const frameMacro=reviewConstructionFrameMacroAssociation(value);
 return {input:value,macroStatus:macro.entry?.evidenceStatus??null,couplingStatus:coupling.entry?.signatureStatus??null,frameMacroStatus:frameMacro?.evidenceStatus??null,expressionMapping:"NOT-ESTABLISHED" as const,executable:false as const};
}
export const phase8bxCrosswalkBoundary={source:"Phase 5.15 Construction Contract Matrix; Phase 5.16 Construction Recovery Matrix; Phase 2 formal syntax audit; Phase 4 references as cited by the matrices",mappingTableRecovered:false,endToEndTraceRecovered:false,compilerImplemented:false,canonEffect:"NONE"} as const;
