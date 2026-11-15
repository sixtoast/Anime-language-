export const INCANTATION_REFERENCE_SCOPE_PROPOSAL_PROFILE="INCANTATION-REFERENCE-SCOPE-PROPOSAL-1.0" as const;
export type ProposedBindingLifetime="SPELL"|"CURRENT-STEP";
export interface ProposedScopeDeclaration { bindingId:string; lifetime:ProposedBindingLifetime; declaredAt:"PRELUDE"|"OPERATION"; operationId?:string; reference:Record<string,unknown>; }
export interface ProposedScopeUse { bindingId:string; operationId:string; }
export interface ProposedScopeOperation { operationId:string; uses:ProposedScopeUse[]; }
export interface ReferenceScopeProposalInput { profile:typeof INCANTATION_REFERENCE_SCOPE_PROPOSAL_PROFILE; declarations:ProposedScopeDeclaration[]; operations:ProposedScopeOperation[]; }
export interface ReferenceScopeFinding { code:"DUPLICATE-DECLARATION"|"UNKNOWN-BINDING"|"UNKNOWN-OPERATION"|"SPELL-BINDING-NOT-PRELUDE"|"CURRENT-STEP-BINDING-NOT-LOCAL"|"CURRENT-STEP-CROSS-OPERATION-USE"|"SPELL-BINDING-LOCAL-OWNER"|"INVALID-REFERENCE"|"UNSUPPORTED-LIFETIME"; path:string; message:string; }
export interface ReferenceScopeProposalReview { profile:typeof INCANTATION_REFERENCE_SCOPE_PROPOSAL_PROFILE; disposition:"SCOPE-CONSISTENT-PROPOSAL"|"SCOPE-INCONSISTENT-PROPOSAL"|"INVALID-PROPOSAL"; declarationCount:number; operationCount:number; useCount:number; findings:ReferenceScopeFinding[]; rules:{spellLifetime:"PRELUDE-DECLARED-AVAILABLE-TO-ALL-OPERATIONS";currentStepLifetime:"OPERATION-LOCAL-ONLY";shadowing:"DISALLOWED";forwardReferences:"NOT-APPLICABLE-PRELUDE-DECLARATIONS";}; canonEffect:"NONE"; spokenSyntax:"NOT-DEFINED"; semanticEquivalence:"NOT-CLAIMED"; executable:false; }
const obj=(v:unknown):v is Record<string,any>=>v!==null&&typeof v==="object"&&!Array.isArray(v);
const nonempty=(v:unknown):v is string=>typeof v==="string"&&v.trim().length>0;
interface ScopeDeclarationRecord { bindingId:string; lifetime:unknown; declaredAt:unknown; operationId?:unknown; reference:Record<string,any>; }
export function reviewIncantationReferenceScopeProposal(input:unknown):ReferenceScopeProposalReview{
 const findings:ReferenceScopeFinding[]=[];
 const add=(code:ReferenceScopeFinding["code"],path:string,message:string)=>findings.push({code,path,message});
 const invalid=(message:string):ReferenceScopeProposalReview=>({profile:INCANTATION_REFERENCE_SCOPE_PROPOSAL_PROFILE,disposition:"INVALID-PROPOSAL",declarationCount:0,operationCount:0,useCount:0,findings:[{code:"INVALID-REFERENCE",path:"$",message}],rules:{spellLifetime:"PRELUDE-DECLARED-AVAILABLE-TO-ALL-OPERATIONS",currentStepLifetime:"OPERATION-LOCAL-ONLY",shadowing:"DISALLOWED",forwardReferences:"NOT-APPLICABLE-PRELUDE-DECLARATIONS"},canonEffect:"NONE",spokenSyntax:"NOT-DEFINED",semanticEquivalence:"NOT-CLAIMED",executable:false});
 if(!obj(input)||input.profile!==INCANTATION_REFERENCE_SCOPE_PROPOSAL_PROFILE||!Array.isArray(input.declarations)||!Array.isArray(input.operations))return invalid("Exact scope proposal profile, declarations array and operations array are required.");
 const operationIds=new Set<string>();
 input.operations.forEach((op:any,i:number)=>{if(!obj(op)||!nonempty(op.operationId)||!Array.isArray(op.uses)){add("INVALID-REFERENCE","operations["+i+"]","Each operation needs a unique id and uses array.");return;}if(operationIds.has(op.operationId))add("UNKNOWN-OPERATION","operations["+i+"].operationId","Operation identifiers must be unique.");operationIds.add(op.operationId);});
 const declarations=new Map<string,ScopeDeclarationRecord>();
 input.declarations.forEach((raw:any,i:number)=>{
  const path="declarations["+i+"]";
  if(!obj(raw)){add("INVALID-REFERENCE",path,"Declaration needs a non-empty binding id and complete reference record.");return;}
  const bindingId=raw.bindingId;
  const reference=raw.reference;
  if(!nonempty(bindingId)||!obj(reference)){add("INVALID-REFERENCE",path,"Declaration needs a non-empty binding id and complete reference record.");return;}
  if(declarations.has(bindingId)){add("DUPLICATE-DECLARATION",path+".bindingId","Binding identifiers cannot be redeclared or shadowed.");return;}
  if(reference.resolution!=="RESOLVED"||reference.bindingState!=="COMMITTED"||!nonempty(reference.referentId)||!nonempty(reference.label)||!nonempty(reference.scope)||!nonempty(reference.referenceClass))add("INVALID-REFERENCE",path+".reference","Only complete, resolved, committed references with stable identity can be declared.");
  if(raw.lifetime!=="SPELL"&&raw.lifetime!=="CURRENT-STEP")add("UNSUPPORTED-LIFETIME",path+".lifetime","Lifetime must be SPELL or CURRENT-STEP.");
  if(raw.lifetime==="SPELL"&&(raw.declaredAt!=="PRELUDE"||raw.operationId!==undefined))add("SPELL-BINDING-NOT-PRELUDE",path,"SPELL declarations must be in the spell prelude and cannot belong to one operation.");
  if(raw.lifetime==="CURRENT-STEP"&&(raw.declaredAt!=="OPERATION"||!nonempty(raw.operationId)))add("CURRENT-STEP-BINDING-NOT-LOCAL",path,"CURRENT-STEP declarations must name their owning operation.");
  if(raw.lifetime==="SPELL"&&reference.lifetime!=="SPELL")add("SPELL-BINDING-LOCAL-OWNER",path+".reference.lifetime","A spell-wide declaration cannot promote a current-step source reference.");
  if(raw.lifetime==="CURRENT-STEP"&&reference.lifetime!=="CURRENT-STEP")add("CURRENT-STEP-BINDING-NOT-LOCAL",path+".reference.lifetime","A current-step declaration must retain current-step lifetime.");
  const declaration:ScopeDeclarationRecord={
   bindingId,
   lifetime:raw.lifetime,
   declaredAt:raw.declaredAt,
   ...(Object.prototype.hasOwnProperty.call(raw,"operationId")?{operationId:raw.operationId}:{}),
   reference,
  };
  declarations.set(bindingId,declaration);
 });
 let useCount=0;
 input.operations.forEach((op:any,i:number)=>{if(!obj(op)||!Array.isArray(op.uses))return;op.uses.forEach((u:any,j:number)=>{useCount++;const path="operations["+i+"].uses["+j+"]";if(!obj(u)||!nonempty(u.bindingId)||!nonempty(u.operationId)){add("INVALID-REFERENCE",path,"Use requires bindingId and operationId.");return;}if(u.operationId!==op.operationId)add("UNKNOWN-OPERATION",path+".operationId","Use operation id must match its containing operation.");const d=declarations.get(u.bindingId);if(!d){add("UNKNOWN-BINDING",path+".bindingId","Use refers to no declared binding.");return;}if(d.lifetime==="CURRENT-STEP"&&d.operationId!==op.operationId)add("CURRENT-STEP-CROSS-OPERATION-USE",path,"CURRENT-STEP binding cannot be used by another operation.");if(!operationIds.has(op.operationId))add("UNKNOWN-OPERATION",path+".operationId","Binding use must belong to a declared operation.");if(d.lifetime==="CURRENT-STEP"){const ownerOperationId=d.operationId;if(!nonempty(ownerOperationId)||!operationIds.has(ownerOperationId))add("UNKNOWN-OPERATION","declarations."+d.bindingId+".operationId","Owning operation for CURRENT-STEP binding does not exist.");}});});
 const invalidCount=findings.some(f=>f.code==="INVALID-REFERENCE");
 return {profile:INCANTATION_REFERENCE_SCOPE_PROPOSAL_PROFILE,disposition:invalidCount?"INVALID-PROPOSAL":findings.length?"SCOPE-INCONSISTENT-PROPOSAL":"SCOPE-CONSISTENT-PROPOSAL",declarationCount:input.declarations.length,operationCount:input.operations.length,useCount,findings,rules:{spellLifetime:"PRELUDE-DECLARED-AVAILABLE-TO-ALL-OPERATIONS",currentStepLifetime:"OPERATION-LOCAL-ONLY",shadowing:"DISALLOWED",forwardReferences:"NOT-APPLICABLE-PRELUDE-DECLARATIONS"},canonEffect:"NONE",spokenSyntax:"NOT-DEFINED",semanticEquivalence:"NOT-CLAIMED",executable:false};
}