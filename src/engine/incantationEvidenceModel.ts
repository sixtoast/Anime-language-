export const INCANTATION_EVIDENCE_PROFILE="INCANTATION-EVIDENCE-1.0" as const;
export const EVIDENCE_CLASSES=["ASSERTED","DERIVED","OBSERVED","VERIFIED"] as const;
export const TEMPORAL_OPERATORS=["AT-START","AT-CHECK","AT-COMPLETION","THROUGHOUT","WITHIN-INTERVAL","UNTIL","BEFORE-AND-AFTER","CONTINUOUS"] as const;
export type EvidenceClass=typeof EVIDENCE_CLASSES[number];
export type EvidenceDecision="ACCEPTED-BY-DECLARED-POLICY"|"REJECTED-PROVENANCE"|"UNKNOWN-STALE"|"UNKNOWN-INSUFFICIENT"|"CONFLICT-UNRESOLVED"|"INVALID-EVIDENCE";
export interface EvidenceRecord{id:string;subjectId:string;predicateId:string;result:"TRUE"|"FALSE";class:EvidenceClass;source:string;method:string;observedAt:string;validUntil:string;uncertainty?:number;coverage?:string;derivationRule?:string;verificationContract?:string;}
export interface EvidencePolicy{acceptedClasses:EvidenceClass[];maxAgeSeconds:number;maxUncertainty?:number;requiredCoverage?:string;requireDerivationRule?:boolean;requireVerificationContract?:boolean;}
export interface EvidenceReview{decision:EvidenceDecision;accepted:boolean;issues:string[];evidenceId:string;asOf:string;canonEffect:"NONE";}
const iso=(v:unknown):number|null=>{if(typeof v!=="string"||!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/.test(v))return null;const n=Date.parse(v);return Number.isFinite(n)?n:null;};
const obj=(v:unknown):v is Record<string,unknown>=>v!==null&&typeof v==="object"&&!Array.isArray(v);
export function reviewEvidenceRecord(record:unknown,policy:unknown,asOf:string):EvidenceReview{
 const fail=(decision:EvidenceDecision,issues:string[],id=""):EvidenceReview=>({decision,accepted:false,issues,evidenceId:id,asOf,canonEffect:"NONE"});
 if(!obj(record)||!obj(policy)||!Array.isArray(policy.acceptedClasses)||typeof policy.maxAgeSeconds!=="number"||policy.maxAgeSeconds<0)return fail("INVALID-EVIDENCE",["Evidence record and a valid explicit policy are required."]);
 const id=typeof record.id==="string"?record.id:"";
 if(!id||typeof record.subjectId!=="string"||!record.subjectId||typeof record.predicateId!=="string"||!record.predicateId||typeof record.source!=="string"||!record.source||typeof record.method!=="string"||!record.method)return fail("INVALID-EVIDENCE",["Evidence identity, subject, predicate, source and method are required."],id);
 if(!EVIDENCE_CLASSES.includes(record.class as EvidenceClass)||!["TRUE","FALSE"].includes(String(record.result)))return fail("INVALID-EVIDENCE",["Evidence class or result is invalid."],id);
 const now=iso(asOf),at=iso(record.observedAt),until=iso(record.validUntil);
 if(now===null||at===null||until===null||until<at)return fail("INVALID-EVIDENCE",["asOf, observedAt and validUntil must be valid UTC timestamps; validity cannot end before observation."],id);
 if(at>now)return fail("INVALID-EVIDENCE",["Future-dated evidence cannot establish a current result."],id);
 if(now-at>policy.maxAgeSeconds*1000||now>until)return fail("UNKNOWN-STALE",["Evidence exceeds the declared maximum age or its validity window has expired."],id);
 if(!policy.acceptedClasses.includes(record.class))return fail("REJECTED-PROVENANCE",["Evidence class is not accepted by the predicate policy."],id);
 if(policy.requireDerivationRule===true&&(record.class==="DERIVED"&&(typeof record.derivationRule!=="string"||!record.derivationRule)))return fail("UNKNOWN-INSUFFICIENT",["Derived evidence requires a reproducible derivation rule."],id);
 if(policy.requireVerificationContract===true&&(record.class==="VERIFIED"&&(typeof record.verificationContract!=="string"||!record.verificationContract)))return fail("UNKNOWN-INSUFFICIENT",["Verified evidence requires its acceptance contract."],id);
 if(typeof policy.maxUncertainty==="number"&&(typeof record.uncertainty!=="number"||record.uncertainty<0||record.uncertainty>policy.maxUncertainty))return fail("UNKNOWN-INSUFFICIENT",["Evidence uncertainty is missing or exceeds the declared threshold."],id);
 if(typeof policy.requiredCoverage==="string"&&record.coverage!==policy.requiredCoverage)return fail("UNKNOWN-INSUFFICIENT",["Evidence does not meet the required coverage declaration."],id);
 return{decision:"ACCEPTED-BY-DECLARED-POLICY",accepted:true,issues:[],evidenceId:id,asOf,canonEffect:"NONE"};
}
export function reviewEvidenceSet(records:unknown,policy:unknown,asOf:string):{decision:EvidenceDecision;reviews:EvidenceReview[];conflictingEvidenceIds:string[];canonEffect:"NONE"}{
 if(!Array.isArray(records))return{decision:"INVALID-EVIDENCE",reviews:[],conflictingEvidenceIds:[],canonEffect:"NONE"};
 const reviews=records.map(r=>reviewEvidenceRecord(r,policy,asOf));
 const conflicts=new Set<string>();
 const groups=new Map<string,{truth?:string;ids:string[]}>();
 reviews.forEach((review,i)=>{if(!review.accepted)return;const r=records[i] as EvidenceRecord;const key=r.subjectId+"|"+r.predicateId;const g=groups.get(key)??{ids:[]};g.ids.push(r.id);if(g.truth&&g.truth!==r.result)g.ids.forEach(x=>conflicts.add(x));g.truth=r.result;groups.set(key,g);});
 const conflictIds=[...conflicts];
 return{decision:conflictIds.length?"CONFLICT-UNRESOLVED":reviews.some(r=>!r.accepted)?(reviews.find(r=>!r.accepted) as EvidenceReview).decision:"ACCEPTED-BY-DECLARED-POLICY",reviews,conflictingEvidenceIds:conflictIds,canonEffect:"NONE"};
}
export function reviewTemporalContract(input:unknown):{valid:boolean;issues:string[];continuityEstablished:false;canonEffect:"NONE"}{
 const issues:string[]=[];
 if(!obj(input)||!TEMPORAL_OPERATORS.includes(input.operator as typeof TEMPORAL_OPERATORS[number]))return{valid:false,issues:["A recognised temporal operator is required."],continuityEstablished:false,canonEffect:"NONE"};
 const operator=input.operator as string;
 if(operator==="THROUGHOUT"||operator==="CONTINUOUS"||operator==="UNTIL"){
  if(!obj(input.monitoringContract)||!input.monitoringContract.method||!input.monitoringContract.latency||!input.monitoringContract.coverage||!input.monitoringContract.uncertainty||!input.monitoringContract.failureBehaviour)issues.push("Continuous/UNTIL semantics require a monitoring or enforcement contract with method, latency, coverage, uncertainty and failure behaviour.");
 }
 if(operator==="UNTIL"&&(!input.stopEvent||typeof input.stopEvent!=="string"))issues.push("UNTIL requires an explicit stopping event.");
 if(operator==="WITHIN-INTERVAL"&&(!input.intervalStart||!input.intervalEnd))issues.push("WITHIN-INTERVAL requires explicit interval boundaries.");
 if(operator==="BEFORE-AND-AFTER"&&input.claimsContinuous===true)issues.push("Boundary observations do not establish continuous preservation.");
 return{valid:issues.length===0,issues,continuityEstablished:false,canonEffect:"NONE"};
}
export function reviewPostcondition(input:unknown):{result:"NOT-EVALUATED"|"SATISFIED"|"FAILED"|"UNVERIFIED"|"INVALID";dependentStepEligible:boolean;reason:string;canonEffect:"NONE"}{
 const base={dependentStepEligible:false,canonEffect:"NONE" as const};
 if(!obj(input)||typeof input.executionAttempted!=="boolean")return{...base,result:"INVALID",reason:"Execution-attempt status must be explicit."};
 if(!input.executionAttempted)return{...base,result:"NOT-EVALUATED",reason:"An unattempted operation cannot pass its postcondition."};
 if(!["TRUE","FALSE","UNKNOWN","ERROR","INVALID","NOT-EVALUATED"].includes(String(input.predicateResult)))return{...base,result:"INVALID",reason:"A recognised predicate result is required."};
 if(input.predicateResult==="TRUE")return{...base,result:"SATISFIED",dependentStepEligible:true,reason:"Postcondition result is TRUE; eligibility is limited to this declared dependency and does not itself execute it.",canonEffect:"NONE"};
 if(input.predicateResult==="FALSE")return{...base,result:"FAILED",reason:"Postcondition is established false."};
 if(input.predicateResult==="UNKNOWN"||input.predicateResult==="ERROR"||input.predicateResult==="NOT-EVALUATED")return{...base,result:"UNVERIFIED",reason:"Postcondition has not been established."};
 return{...base,result:"INVALID",reason:"Invalid predicate result cannot verify an outcome."};
}
