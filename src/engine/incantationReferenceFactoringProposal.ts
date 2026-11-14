import { INCANTATION_ARGUMENT_PROFILE } from "./incantationArgumentModel";
import { auditIncantationSemanticCompression } from "./incantationSemanticCompressionAudit";
export const INCANTATION_REFERENCE_FACTORING_PROFILE = "INCANTATION-REFERENCE-FACTORING-PROPOSAL-1.0" as const;
export type ReferenceSlot = { kind:"SHARED"; bindingId:string } | { kind:"INLINE"; reference:Record<string,unknown> };
export interface SharedReferenceBinding { bindingId:string; reference:Record<string,unknown>; }
export interface FactoredOperation { operationId:string; operationFields:Record<string,unknown>; argumentsWithoutReferences:Record<string,unknown>; referenceSlots:ReferenceSlot[]; }
export interface IncantationReferenceFactoringPackage { profile:typeof INCANTATION_REFERENCE_FACTORING_PROFILE; sourceProfile:unknown; sourceEnvelope:Record<string,unknown>; sharedBindings:SharedReferenceBinding[]; operations:FactoredOperation[]; auditDisposition:"CANDIDATES-FOUND"|"NO-SAFE-CANDIDATES"; factoredOccurrences:number; transformation:"STRUCTURED-IR-PACKAGING-ONLY"; spokenSyntax:"NOT-DEFINED"; scopeSemantics:"NOT-PROVEN"; semanticEquivalence:"NOT-CLAIMED"; executable:false; canonEffect:"NONE"; }
export interface ExpansionResult { disposition:"EXPANDED"|"INVALID-PACKAGE"; expanded:Record<string,unknown>|null; structuralRoundTrip:"EXACT"|"NOT-EXACT"|"NOT-CHECKED"; issues:string[]; semanticEquivalence:"NOT-CLAIMED"; spokenSyntax:"NOT-DEFINED"; executable:false; canonEffect:"NONE"; }
const isObject=(v:unknown):v is Record<string,any>=>v!==null&&typeof v==="object"&&!Array.isArray(v);
const clone=(v:any):any=>Array.isArray(v)?v.map(clone):isObject(v)?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,clone(x)])):v;
function canonical(v:any):any { if(Array.isArray(v))return v.map(canonical); if(isObject(v))return Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])); return v; }
function equal(a:unknown,b:unknown):boolean { return JSON.stringify(canonical(a))===JSON.stringify(canonical(b)); }
export function packageIncantationSharedReferences(input:unknown):IncantationReferenceFactoringPackage|null {
 if(!isObject(input)||!Array.isArray(input.operations))return null;
 const audit=auditIncantationSemanticCompression(input);
 if(audit.disposition==="INVALID-INPUT")return null;
 const bindings:SharedReferenceBinding[]=[];
 const bindingIdByReferent=new Map<string,string>();
 for(const candidate of audit.candidates.filter(c=>c.status==="ELIGIBLE-DECLARATION-FACTORING-CANDIDATE"))bindingIdByReferent.set(candidate.referentId,"shared-ref-"+String(bindingIdByReferent.size+1));
 const operations:FactoredOperation[]=[];
 for(const raw of input.operations as Record<string,any>[]){
  const args=raw.arguments as Record<string,any>, refs=args.references as Record<string,unknown>[], slots:ReferenceSlot[]=[];
  for(const reference of refs){
   const id=typeof reference.referentId==="string"?bindingIdByReferent.get(reference.referentId):undefined;
   if(id){slots.push({kind:"SHARED",bindingId:id});if(!bindings.some(b=>b.bindingId===id))bindings.push({bindingId:id,reference:clone(reference)});}
   else slots.push({kind:"INLINE",reference:clone(reference)});
  }
  const {references,...argumentsWithoutReferences}=args;
  const {operationId,...operationFields}=raw;
  delete operationFields.arguments;
  operations.push({operationId:operationId as string,operationFields:clone(operationFields),argumentsWithoutReferences:clone(argumentsWithoutReferences),referenceSlots:slots});
 }
 const {operations:discardedOperations,...sourceEnvelope}=input;
 return {profile:INCANTATION_REFERENCE_FACTORING_PROFILE,sourceProfile:input.profile??null,sourceEnvelope:clone(sourceEnvelope),sharedBindings:bindings,operations,auditDisposition:audit.disposition==="CANDIDATES-FOUND"?"CANDIDATES-FOUND":"NO-SAFE-CANDIDATES",factoredOccurrences:bindings.reduce((n,b)=>n+operations.reduce((m,o)=>m+o.referenceSlots.filter(s=>s.kind==="SHARED"&&s.bindingId===b.bindingId).length,0)-1,0),transformation:"STRUCTURED-IR-PACKAGING-ONLY",spokenSyntax:"NOT-DEFINED",scopeSemantics:"NOT-PROVEN",semanticEquivalence:"NOT-CLAIMED",executable:false,canonEffect:"NONE"};
}
export function expandIncantationSharedReferences(input:unknown,expectedOriginal?:unknown):ExpansionResult {
 const fail=(issues:string[]):ExpansionResult=>({disposition:"INVALID-PACKAGE",expanded:null,structuralRoundTrip:"NOT-CHECKED",issues,semanticEquivalence:"NOT-CLAIMED",spokenSyntax:"NOT-DEFINED",executable:false,canonEffect:"NONE"});
 if(!isObject(input)||input.profile!==INCANTATION_REFERENCE_FACTORING_PROFILE||!isObject(input.sourceEnvelope)||!Array.isArray(input.sharedBindings)||!Array.isArray(input.operations))return fail(["Exact reference-factoring package profile, source envelope, binding list and operations array are required."]);
 const bindings=new Map<string,Record<string,unknown>>();
 for(const b of input.sharedBindings){if(!isObject(b)||typeof b.bindingId!=="string"||!b.bindingId||!isObject(b.reference)||bindings.has(b.bindingId))return fail(["Shared bindings must have unique non-empty ids and complete reference objects."]);bindings.set(b.bindingId,b.reference);}
 const operationIds=new Set<string>(),operations:Record<string,unknown>[]=[];
 for(const op of input.operations){
  if(!isObject(op)||typeof op.operationId!=="string"||!op.operationId||operationIds.has(op.operationId)||!isObject(op.operationFields)||!isObject(op.argumentsWithoutReferences)||!Array.isArray(op.referenceSlots))return fail(["Each packaged operation needs a unique id, operation fields, argument fields and ordered reference slots."]);
  operationIds.add(op.operationId);const refs:Record<string,unknown>[]=[];
  for(const slot of op.referenceSlots){if(!isObject(slot))return fail(["Reference slot must be an object."]);if(slot.kind==="SHARED"){const ref=bindings.get(slot.bindingId);if(!ref)return fail(["Reference slot points to an unknown shared binding."]);refs.push(clone(ref));}else if(slot.kind==="INLINE"&&isObject(slot.reference))refs.push(clone(slot.reference));else return fail(["Reference slot kind or inline reference is invalid."]);}
  operations.push({...clone(op.operationFields),operationId:op.operationId,arguments:{...clone(op.argumentsWithoutReferences),profile:INCANTATION_ARGUMENT_PROFILE,references:refs}});
 }
 const expanded={...clone(input.sourceEnvelope),operations};
 return {disposition:"EXPANDED",expanded,structuralRoundTrip:expectedOriginal===undefined?"NOT-CHECKED":equal(expanded,expectedOriginal)?"EXACT":"NOT-EXACT",issues:[],semanticEquivalence:"NOT-CLAIMED",spokenSyntax:"NOT-DEFINED",executable:false,canonEffect:"NONE"};
}