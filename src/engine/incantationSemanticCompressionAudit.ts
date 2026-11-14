import { INCANTATION_ARGUMENT_PROFILE } from "./incantationArgumentModel";
export const INCANTATION_SEMANTIC_COMPRESSION_PROFILE = "INCANTATION-SEMANTIC-COMPRESSION-AUDIT-1.0" as const;
export interface ReferenceFactoringCandidate { referentId:string; label:string; referenceClass:string; scope:string; lifetime:string; occurrenceCount:number; operationIds:string[]; status:"ELIGIBLE-DECLARATION-FACTORING-CANDIDATE"|"BLOCKED"; blockers:string[]; }
export interface IncantationSemanticCompressionAudit { profile:typeof INCANTATION_SEMANTIC_COMPRESSION_PROFILE; disposition:"CANDIDATES-FOUND"|"NO-SAFE-CANDIDATES"|"INVALID-INPUT"; operationCount:number; referenceOccurrenceCount:number; candidates:ReferenceFactoringCandidate[]; potentialDuplicateOccurrences:number; grammarCompressionStatus:"NOT-DEFINED"; semanticEquivalence:"NOT-PROVEN"; transformationPerformed:false; spokenSyntaxValidation:"NOT-PERFORMED"; executable:false; canonEffect:"NONE"; issues:string[]; limitation:string; }
const LIMITATION = "This audit identifies repeated, identical, resolved, committed SPELL-lifetime reference declarations across operation records. It does not rewrite an Incantation, define binding syntax, prove scope hoisting safe, calculate character savings, parse spoken Arcane, establish semantic equivalence, authorise or execute a spell. Candidate means suitable for grammar-design review, not approved compression.";
const isObject = (v:unknown):v is Record<string,unknown> => v !== null && typeof v === "object" && !Array.isArray(v);
const nonEmpty = (v:unknown):v is string => typeof v === "string" && v.trim().length > 0;
interface Entry { operationId:string; label:string; referenceClass:string; scope:string; resolution:string; lifetime:string; bindingState:string; referentId:string; }
function invalid(issues:string[]):IncantationSemanticCompressionAudit { return {profile:INCANTATION_SEMANTIC_COMPRESSION_PROFILE,disposition:"INVALID-INPUT",operationCount:0,referenceOccurrenceCount:0,candidates:[],potentialDuplicateOccurrences:0,grammarCompressionStatus:"NOT-DEFINED",semanticEquivalence:"NOT-PROVEN",transformationPerformed:false,spokenSyntaxValidation:"NOT-PERFORMED",executable:false,canonEffect:"NONE",issues,limitation:LIMITATION}; }
function signature(e:Entry):string { return JSON.stringify([e.label,e.referenceClass,e.scope,e.resolution,e.lifetime,e.bindingState,e.referentId]); }
export function auditIncantationSemanticCompression(input:unknown):IncantationSemanticCompressionAudit {
 if (!isObject(input) || !Array.isArray(input.operations)) return invalid(["Input must be an object with an operations array."]);
 const issues:string[] = [], operationIds = new Set<string>(), entries:Entry[] = [];
 input.operations.forEach((raw,index) => {
  const path = "operations[" + index + "]";
  if (!isObject(raw) || !nonEmpty(raw.operationId)) { issues.push(path + " requires a non-empty operationId."); return; }
  if (operationIds.has(raw.operationId)) issues.push(path + ".operationId must be unique.");
  operationIds.add(raw.operationId);
  if (!isObject(raw.arguments) || raw.arguments.profile !== INCANTATION_ARGUMENT_PROFILE || !Array.isArray(raw.arguments.references)) { issues.push(path + ".arguments must contain an INCANTATION-ARGUMENTS-1.0 references array."); return; }
  raw.arguments.references.forEach((ref,refIndex) => {
   if (!isObject(ref)) { issues.push(path + ".arguments.references[" + refIndex + "] must be an object."); return; }
   if (!nonEmpty(ref.label) || !nonEmpty(ref.referenceClass) || !nonEmpty(ref.scope) || !nonEmpty(ref.resolution) || !nonEmpty(ref.lifetime) || !nonEmpty(ref.bindingState) || !nonEmpty(ref.referentId)) { issues.push(path + ".arguments.references[" + refIndex + "] is missing a required reference field."); return; }
   entries.push({operationId:raw.operationId,label:ref.label,referenceClass:ref.referenceClass,scope:ref.scope,resolution:ref.resolution,lifetime:ref.lifetime,bindingState:ref.bindingState,referentId:ref.referentId});
  });
 });
 if (issues.length) return invalid(issues);
 const byReferent = new Map<string,Entry[]>();
 for (const entry of entries) { const group = byReferent.get(entry.referentId) ?? []; group.push(entry); byReferent.set(entry.referentId,group); }
 const candidates:ReferenceFactoringCandidate[] = [];
 for (const [referentId,group] of byReferent) {
  const distinctOperations = [...new Set(group.map(e => e.operationId))];
  if (distinctOperations.length < 2) continue;
  const blockers:string[] = [], first = group[0];
  if (group.some(e => signature(e) !== signature(first))) blockers.push("Reference declarations sharing this referent identity differ in label, class, scope, resolution, lifetime or binding state.");
  if (group.some(e => e.resolution !== "RESOLVED")) blockers.push("Every occurrence must be resolved.");
  if (group.some(e => e.bindingState !== "COMMITTED")) blockers.push("Every occurrence must be committed.");
  if (group.some(e => e.lifetime !== "SPELL")) blockers.push("Only SPELL-lifetime references are eligible; CURRENT-STEP references cannot be hoisted.");
  if (group.length !== distinctOperations.length) blockers.push("The same reference occurs more than once within at least one operation; usage and multiplicity require separate review.");
  candidates.push({referentId,label:first.label,referenceClass:first.referenceClass,scope:first.scope,lifetime:first.lifetime,occurrenceCount:group.length,operationIds:distinctOperations,status:blockers.length?"BLOCKED":"ELIGIBLE-DECLARATION-FACTORING-CANDIDATE",blockers});
 }
 const eligible = candidates.filter(c => c.status === "ELIGIBLE-DECLARATION-FACTORING-CANDIDATE");
 return {profile:INCANTATION_SEMANTIC_COMPRESSION_PROFILE,disposition:eligible.length?"CANDIDATES-FOUND":"NO-SAFE-CANDIDATES",operationCount:input.operations.length,referenceOccurrenceCount:entries.length,candidates,potentialDuplicateOccurrences:eligible.reduce((sum,c) => sum + c.occurrenceCount - 1,0),grammarCompressionStatus:"NOT-DEFINED",semanticEquivalence:"NOT-PROVEN",transformationPerformed:false,spokenSyntaxValidation:"NOT-PERFORMED",executable:false,canonEffect:"NONE",issues:[],limitation:LIMITATION};
}