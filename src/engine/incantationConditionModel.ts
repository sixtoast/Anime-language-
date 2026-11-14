export const INCANTATION_CONDITION_PROFILE = "INCANTATION-CONDITIONS-1.0" as const;
export const CONDITION_KINDS = ["PRECONDITION","LIMIT","INVARIANT","RESOURCE-BOUND","POSTCONDITION"] as const;
export const CONDITION_CHECK_TIMES = ["BEFORE","DURING","AFTER","BEFORE-AND-DURING"] as const;
export const PREDICATE_RESULTS = ["TRUE","FALSE","UNKNOWN","ERROR","INVALID","NOT-EVALUATED"] as const;
export const CONDITION_FAILURE_POLICIES = ["BLOCK","ABORT-DEPENDENTS","REPORT-ONLY"] as const;
export type PredicateResult = typeof PREDICATE_RESULTS[number];
export interface IncantationConditionRecord {
 id:string; kind:typeof CONDITION_KINDS[number]; predicateId:string; predicateVersion:string;
 argumentBindings:unknown[]; requiredResult:"TRUE"|"FALSE"; temporalOperator:string;
 checkTime:typeof CONDITION_CHECK_TIMES[number]; scope:string; evidencePolicy:unknown;
 failurePolicy:typeof CONDITION_FAILURE_POLICIES[number]; safetyCritical:boolean;
}
export interface ConditionReviewIssue {code:string;path:string;message:string;}
export interface ConditionReview {
 profile:typeof INCANTATION_CONDITION_PROFILE; disposition:"CONDITION-RECORD-STRUCTURALLY-COMPLETE"|"CONDITION-RECORD-INCOMPLETE"|"CONDITION-RECORD-INVALID";
 issues:ConditionReviewIssue[]; conditionCount:number; duplicateIds:string[];
 predicateEvaluation:"NOT-PERFORMED"; feasibility:"NOT-ASSESSED"; executable:false; canonEffect:"NONE"; limitation:string;
}
const LIMITATION="This reviewer checks condition declaration shape and prerequisite result handling. It does not evaluate predicate truth, inspect evidence quality, resolve references, type-check bindings, monitor invariants, estimate resources, assess feasibility or authorise/execute operations.";
const object=(v:unknown):v is Record<string,unknown>=>v!==null&&typeof v==="object"&&!Array.isArray(v);
const nonEmpty=(v:unknown):v is string=>typeof v==="string"&&v.trim().length>0;
const issue=(code:string,path:string,message:string):ConditionReviewIssue=>({code,path,message});
export function reviewIncantationConditions(input:unknown):ConditionReview {
 if(!object(input))return invalid([issue("INVALID-INPUT","$","Input must be an object.")],0,[]);
 if(input.profile!==INCANTATION_CONDITION_PROFILE)return invalid([issue("UNSUPPORTED-PROFILE","profile","Exact INCANTATION-CONDITIONS-1.0 profile is required.")],0,[]);
 if(!Array.isArray(input.conditions))return invalid([issue("CONDITIONS-ARRAY-REQUIRED","conditions","conditions must be an array.")],0,[]);
 const issues:ConditionReviewIssue[]=[],ids=new Set<string>(),duplicates=new Set<string>();
 input.conditions.forEach((raw,i)=>{
  const p="conditions["+i+"]";
  if(!object(raw)){issues.push(issue("CONDITION-INVALID",p,"Condition must be an object."));return;}
  if(!nonEmpty(raw.id)){issues.push(issue("CONDITION-ID-MISSING",p+".id","Every condition requires a stable id."));}
  else if(ids.has(raw.id)){duplicates.add(raw.id);issues.push(issue("CONDITION-ID-DUPLICATE",p+".id","Condition ids must be unique within the spell."));}else ids.add(raw.id);
  if(!CONDITION_KINDS.includes(raw.kind as typeof CONDITION_KINDS[number]))issues.push(issue("CONDITION-KIND-INVALID",p+".kind","Unsupported condition kind."));
  if(!nonEmpty(raw.predicateId)||!nonEmpty(raw.predicateVersion))issues.push(issue("PREDICATE-IDENTITY-MISSING",p,"Predicate id and version are required; a name alone is not a registered definition."));
  if(!Array.isArray(raw.argumentBindings))issues.push(issue("ARGUMENT-BINDINGS-REQUIRED",p+".argumentBindings","Typed argument bindings must be supplied as an array."));
  if(raw.requiredResult!=="TRUE"&&raw.requiredResult!=="FALSE")issues.push(issue("REQUIRED-RESULT-INVALID",p+".requiredResult","Required result must explicitly be TRUE or FALSE."));
  if(!nonEmpty(raw.temporalOperator))issues.push(issue("TEMPORAL-OPERATOR-MISSING",p+".temporalOperator","A temporal operator must be declared."));
  if(!CONDITION_CHECK_TIMES.includes(raw.checkTime as typeof CONDITION_CHECK_TIMES[number]))issues.push(issue("CHECK-TIME-INVALID",p+".checkTime","Check time must be BEFORE, DURING, AFTER or BEFORE-AND-DURING."));
  if(!nonEmpty(raw.scope))issues.push(issue("SCOPE-MISSING",p+".scope","Condition scope must be explicit."));
  if(!object(raw.evidencePolicy))issues.push(issue("EVIDENCE-POLICY-MISSING",p+".evidencePolicy","Evidence policy must be an explicit object."));
  if(!CONDITION_FAILURE_POLICIES.includes(raw.failurePolicy as typeof CONDITION_FAILURE_POLICIES[number]))issues.push(issue("FAILURE-POLICY-INVALID",p+".failurePolicy","Failure policy must be BLOCK, ABORT-DEPENDENTS or REPORT-ONLY."));
  if(raw.safetyCritical===true&&raw.failurePolicy==="REPORT-ONLY")issues.push(issue("SAFETY-REPORT-ONLY-FORBIDDEN",p+".failurePolicy","A safety-critical condition cannot use REPORT-ONLY."));
 });
 const invalidCodes=["INVALID-INPUT","UNSUPPORTED-PROFILE","CONDITIONS-ARRAY-REQUIRED","CONDITION-INVALID","CONDITION-ID-DUPLICATE","CONDITION-KIND-INVALID","REQUIRED-RESULT-INVALID","CHECK-TIME-INVALID","FAILURE-POLICY-INVALID","SAFETY-REPORT-ONLY-FORBIDDEN"];
 const invalidShape=issues.some(x=>invalidCodes.includes(x.code));
 return {profile:INCANTATION_CONDITION_PROFILE,disposition:invalidShape?"CONDITION-RECORD-INVALID":issues.length?"CONDITION-RECORD-INCOMPLETE":"CONDITION-RECORD-STRUCTURALLY-COMPLETE",issues,conditionCount:input.conditions.length,duplicateIds:[...duplicates],predicateEvaluation:"NOT-PERFORMED",feasibility:"NOT-ASSESSED",executable:false,canonEffect:"NONE",limitation:LIMITATION};
}
function invalid(issues:ConditionReviewIssue[],conditionCount:number,duplicateIds:string[]):ConditionReview{return{profile:INCANTATION_CONDITION_PROFILE,disposition:"CONDITION-RECORD-INVALID",issues,conditionCount,duplicateIds,predicateEvaluation:"NOT-PERFORMED",feasibility:"NOT-ASSESSED",executable:false,canonEffect:"NONE",limitation:LIMITATION};}
export type PrerequisiteGateResult = "RELEASED"|"BLOCKED-FAILED"|"BLOCKED-UNRESOLVED"|"BLOCKED-ERROR"|"BLOCKED-INVALID"|"BLOCKED-NOT-EVALUATED"|"INVALID-REQUIREMENT";
export function reviewPrerequisiteGate(input:unknown):{result:PrerequisiteGateResult;requiredResult:"TRUE"|"FALSE"|null;actualResult:PredicateResult|null;mayProceed:boolean;reason:string;execution:"NOT-PERFORMED";canonEffect:"NONE"} {
 const base={mayProceed:false,execution:"NOT-PERFORMED" as const,canonEffect:"NONE" as const};
 if(!object(input)||(input.requiredResult!=="TRUE"&&input.requiredResult!=="FALSE")||!PREDICATE_RESULTS.includes(input.actualResult as PredicateResult))return{...base,result:"INVALID-REQUIREMENT",requiredResult:null,actualResult:null,reason:"A required TRUE/FALSE result and recognised predicate result are mandatory."};
 const actual=input.actualResult as PredicateResult,required=input.requiredResult as "TRUE"|"FALSE";
 if(actual==="NOT-EVALUATED")return{...base,result:"BLOCKED-NOT-EVALUATED",requiredResult:required,actualResult:actual,reason:"A condition that has not been evaluated cannot release a dependent operation."};
 if(actual==="UNKNOWN")return{...base,result:"BLOCKED-UNRESOLVED",requiredResult:required,actualResult:actual,reason:"Unknown evidence is not converted into a pass or a false result."};
 if(actual==="ERROR")return{...base,result:"BLOCKED-ERROR",requiredResult:required,actualResult:actual,reason:"Predicate evaluation error blocks the dependent operation."};
 if(actual==="INVALID")return{...base,result:"BLOCKED-INVALID",requiredResult:required,actualResult:actual,reason:"An invalid predicate or input cannot satisfy a prerequisite."};
 if(actual!==required)return{...base,result:"BLOCKED-FAILED",requiredResult:required,actualResult:actual,reason:"The actual predicate result does not match the explicitly required result."};
 return{...base,result:"RELEASED",requiredResult:required,actualResult:actual,mayProceed:true,reason:"The supplied predicate result matches the required result. This releases only this declared gate; it is not authorisation or execution.",execution:"NOT-PERFORMED",canonEffect:"NONE"};
}
export const incantationConditionBoundaries=[
 "A predicate identifier and version do not prove that a registry definition or evaluator exists.",
 "TRUE, FALSE, UNKNOWN, ERROR and INVALID are distinct; UNKNOWN and ERROR never satisfy a required gate.",
 "A condition declaration is not a fact about the world and does not evaluate itself.",
 "Required FALSE is supported only as an explicitly declared negative result; it is never silently inverted.",
 "AT-START is not THROUGHOUT; boundary checks do not prove continuous invariance.",
 "REPORT-ONLY cannot satisfy a safety-critical guard.",
 "Passing a prerequisite gate is not mechanism feasibility, external authorisation, execution or outcome verification.",
 "The reviewer does not create preparatory operations, recovery branches, monitoring, rollback or containment."
] as const;
