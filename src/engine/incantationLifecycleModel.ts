export const INCANTATION_LIFECYCLE_PROFILE="INCANTATION-LIFECYCLE-1.0" as const;
export const INVOCATION_STATES=["REJECTED","VALIDATED","CONTRACT-ACCEPTED","AUTHORISED","READY","ATTEMPTED","EXECUTION-REPORTED","OUTCOME-VERIFIED","OUTCOME-FAILED","OUTCOME-UNKNOWN"] as const;
export const INTERRUPT_STATES=["NOT-ACTIVE","INTERRUPT-REQUESTED","INTERRUPT-ACKNOWLEDGED","STOP-CONFIRMED","STOP-PARTIAL","STOP-UNKNOWN","NOT-INTERRUPTIBLE"] as const;
export type InvocationState=typeof INVOCATION_STATES[number];
export type InterruptState=typeof INTERRUPT_STATES[number];
export interface LifecycleEvent{id:string;sequence:number;state:InvocationState;at:string;source:string;details?:string;}
export interface LifecycleRecord{profile:typeof INCANTATION_LIFECYCLE_PROFILE;invocationId:string;events:LifecycleEvent[];interruptEvents:{sequence:number;state:InterruptState;at:string;source:string}[];}
export interface LifecycleReview{disposition:"LIFECYCLE-COHERENT"|"LIFECYCLE-INCOMPLETE"|"LIFECYCLE-INVALID";issues:string[];currentState:InvocationState|null;attempted:boolean;outcomeVerified:boolean;failurePreserved:boolean;interruptState:InterruptState|null;executable:false;canonEffect:"NONE";limitation:string;}
const LIMIT="This reviewer checks append-only lifecycle event order and declared status transitions. It does not authenticate timestamps or sources, validate contract/authority decisions, execute operations, prove cessation, verify physical outcomes or implement recovery.";
const allowed:Record<InvocationState,InvocationState[]>={REJECTED:[],VALIDATED:["CONTRACT-ACCEPTED","REJECTED"],"CONTRACT-ACCEPTED":["AUTHORISED","REJECTED"],AUTHORISED:["READY","REJECTED"],READY:["ATTEMPTED","REJECTED"],ATTEMPTED:["EXECUTION-REPORTED","OUTCOME-FAILED","OUTCOME-UNKNOWN"],"EXECUTION-REPORTED":["OUTCOME-VERIFIED","OUTCOME-FAILED","OUTCOME-UNKNOWN"],"OUTCOME-VERIFIED":[],"OUTCOME-FAILED":[],"OUTCOME-UNKNOWN":[]};
const interrupts:Record<InterruptState,InterruptState[]>={"NOT-ACTIVE":["INTERRUPT-REQUESTED","NOT-INTERRUPTIBLE"],"INTERRUPT-REQUESTED":["INTERRUPT-ACKNOWLEDGED","STOP-CONFIRMED","STOP-PARTIAL","STOP-UNKNOWN"],"INTERRUPT-ACKNOWLEDGED":["STOP-CONFIRMED","STOP-PARTIAL","STOP-UNKNOWN"],"STOP-CONFIRMED":[],"STOP-PARTIAL":[],"STOP-UNKNOWN":[],"NOT-INTERRUPTIBLE":[]};
const obj=(v:unknown):v is Record<string,unknown>=>v!==null&&typeof v==="object"&&!Array.isArray(v);
const iso=(v:unknown)=>typeof v==="string"&&/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/.test(v)&&Number.isFinite(Date.parse(v));
export function reviewInvocationLifecycle(input:unknown):LifecycleReview{
 const issues:string[]=[];if(!obj(input)||input.profile!==INCANTATION_LIFECYCLE_PROFILE||typeof input.invocationId!=="string"||!input.invocationId||!Array.isArray(input.events)||!Array.isArray(input.interruptEvents))return{disposition:"LIFECYCLE-INVALID",issues:["A profile, invocation id, events and interruptEvents array are required."],currentState:null,attempted:false,outcomeVerified:false,failurePreserved:false,interruptState:null,executable:false,canonEffect:"NONE",limitation:LIMIT};
 const ids=new Set<string>();let previous:InvocationState|null=null,lastAt=-Infinity,attempted=false,failed=false,verified=false;
 input.events.forEach((raw,i)=>{const p="events["+i+"]";if(!obj(raw)){issues.push(p+" must be an event object.");return;}
 if(typeof raw.id!=="string"||!raw.id||ids.has(raw.id))issues.push(p+" has a missing or duplicate event id.");else ids.add(raw.id);
 if(raw.sequence!==i)issues.push(p+" sequence must be contiguous and append-only from zero.");
 if(!iso(raw.at))issues.push(p+" requires a UTC timestamp.");else{const t=Date.parse(raw.at as string);if(t<lastAt)issues.push(p+" timestamp precedes an earlier event.");lastAt=t;}
 if(typeof raw.source!=="string"||!raw.source)issues.push(p+" requires an event source.");
 if(!INVOCATION_STATES.includes(raw.state as InvocationState)){issues.push(p+" has an unknown invocation state.");return;}
 const state=raw.state as InvocationState;
 if(previous===null&&state!=="REJECTED"&&state!=="VALIDATED")issues.push("Lifecycle must begin with REJECTED or VALIDATED.");
 if(previous!==null&&!allowed[previous].includes(state))issues.push("Forbidden transition "+previous+" → "+state+".");
 if(state==="ATTEMPTED")attempted=true;if(state==="OUTCOME-FAILED")failed=true;if(state==="OUTCOME-VERIFIED")verified=true;
 previous=state;
 });
 if(verified&&!attempted)issues.push("Outcome cannot be verified without an execution attempt.");
 if(failed&&!attempted)issues.push("An execution failure cannot be recorded without an attempt.");
 let interrupt:InterruptState|null=null;let intAt=-Infinity;
 input.interruptEvents.forEach((raw,i)=>{const p="interruptEvents["+i+"]";if(!obj(raw)){issues.push(p+" must be an object.");return;}
 if(raw.sequence!==i)issues.push(p+" sequence must be contiguous from zero.");if(!iso(raw.at))issues.push(p+" requires a UTC timestamp.");else{const t=Date.parse(raw.at as string);if(t<intAt)issues.push(p+" timestamp regressed.");intAt=t;}
 if(typeof raw.source!=="string"||!raw.source)issues.push(p+" requires a source.");
 if(!INTERRUPT_STATES.includes(raw.state as InterruptState)){issues.push(p+" has an unknown interruption state.");return;}
 const state=raw.state as InterruptState;if(interrupt===null&&state!=="NOT-ACTIVE")issues.push("Interruption history must begin with NOT-ACTIVE.");
 if(interrupt!==null&&!interrupts[interrupt].includes(state))issues.push("Forbidden interruption transition "+interrupt+" → "+state+".");
 interrupt=state;
 });
 if(input.events.length===0)issues.push("At least one lifecycle event is required.");
 const invalid=issues.some(x=>/Forbidden|unknown|missing or duplicate|must begin|must be contiguous|timestamp|without an attempt|At least/.test(x));
 return{disposition:invalid?"LIFECYCLE-INVALID":issues.length?"LIFECYCLE-INCOMPLETE":"LIFECYCLE-COHERENT",issues,currentState:previous,attempted,outcomeVerified:verified,failurePreserved:failed,interruptState:interrupt,executable:false,canonEffect:"NONE",limitation:LIMIT};
}
export interface RecoveryBranch{ id:string;fromFailedOperation:string;independentOfFailedGuarantee:boolean;declaredOperations:string[];typedAndValidated:boolean;authorised:boolean;}
export function reviewRecoveryBranch(input:unknown):{eligible:boolean;disposition:"EXPLICIT-BRANCH-ELIGIBLE-FOR-EXTERNAL-REVIEW"|"RECOVERY-BLOCKED"|"RECOVERY-INVALID";issues:string[];execution:"NOT-PERFORMED";canonEffect:"NONE"}{
 const issues:string[]=[];if(!obj(input))return{eligible:false,disposition:"RECOVERY-INVALID",issues:["Recovery branch must be an object."],execution:"NOT-PERFORMED",canonEffect:"NONE"};
 if(typeof input.id!=="string"||!input.id||typeof input.fromFailedOperation!=="string"||!input.fromFailedOperation||!Array.isArray(input.declaredOperations)||input.declaredOperations.length===0)issues.push("Branch id, failed operation and non-empty declared operation list are required.");
 if(input.independentOfFailedGuarantee!==true)issues.push("Independence from the failed guarantee must be explicitly established.");
 if(input.typedAndValidated!==true)issues.push("Recovery operations must be explicitly typed and validated.");
 if(input.authorised!==true)issues.push("Recovery branch requires separate external authorisation.");
 const invalid=issues.some(x=>x.includes("required."));return{eligible:issues.length===0,disposition:invalid?"RECOVERY-INVALID":issues.length?"RECOVERY-BLOCKED":"EXPLICIT-BRANCH-ELIGIBLE-FOR-EXTERNAL-REVIEW",issues,execution:"NOT-PERFORMED",canonEffect:"NONE"};
}
export const lifecycleBoundaries=["A later success event cannot erase an earlier failure event.","READY is not ATTEMPTED; EXECUTION-REPORTED is not OUTCOME-VERIFIED.","OUTCOME-UNKNOWN is not success.","Interruption status is recorded independently of invocation status.","INTERRUPT-ACKNOWLEDGED is not STOP-CONFIRMED; STOP-PARTIAL and STOP-UNKNOWN are not full stop.","A recovery branch is never inferred and must be independent of the failed guarantee, typed, validated and externally authorised.","This profile is a lifecycle audit model, not an executor, authority provider, rollback system or safe-state guarantee."] as const;
