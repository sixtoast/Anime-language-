/** Phase 8DJ — Phase 4 formal verb to Construction Foot alias evidence. */
export const FORMAL_VERB_FOOT_ALIAS_PROFILE="ARCANE-FORMAL-VERB-FOOT-ALIASES-1.0" as const;
export type AliasEvidenceStatus="EXPLICIT-PATTERN-ALIAS"|"PROPOSED-OWNER-CONFIRMATION"|"EXPLICIT-MODIFIER-NOT-FOOT"|"PATTERN-EXPLICIT-PHYSICAL-MAPPING-PROVISIONAL";
export type AliasPatternKind="FRAME-GROUP"|"RELATION-CODA"|"H-SERIES-COUPLING"|"REQUIREMENT-MODIFIER";
export interface FormalVerbFootAlias {
  formalVerb:string; gloss:string; patternKind:AliasPatternKind; pattern:string[];
  status:AliasEvidenceStatus; source:string; recoveredMeaning:string; unresolved:string[];
  exactExpansionRecovered:false; signatureRecovered:false; executable:false;
}
export const formalVerbFootAliases:readonly FormalVerbFootAlias[]=[
{formalVerb:"TRAK",gloss:"alter",patternKind:"FRAME-GROUP",pattern:["p","t","k"],status:"EXPLICIT-PATTERN-ALIAS",source:"Phase 4 §3.2 Table 3",recoveredMeaning:"Voiceless-stop frame group associated with discrete change.",unresolved:["Which individual Foot forms instantiate each alteration","Frame-consonant semantic contrasts","Foot argument slots, preconditions and physical/resource effects"],exactExpansionRecovered:false,signatureRecovered:false,executable:false},
{formalVerb:"KREN",gloss:"establish",patternKind:"FRAME-GROUP",pattern:["b","d","g"],status:"PROPOSED-OWNER-CONFIRMATION",source:"Phase 4 §3.2 Table 3",recoveredMeaning:"Proposed voiced-stop reinforced counterpart to TRAK.",unresolved:["Owner confirmation of the reinforced reading","Approved individual Foot forms and contrasts","Foot argument slots, preconditions and physical/resource effects"],exactExpansionRecovered:false,signatureRecovered:false,executable:false},
{formalVerb:"FREM",gloss:"maintain",patternKind:"RELATION-CODA",pattern:["m","n","ng"],status:"EXPLICIT-PATTERN-ALIAS",source:"Phase 4 §3.2 Table 3; D-036",recoveredMeaning:"m/n denote open-loop maintenance; ng (IPA ŋ) denotes maintenance with feedback.",unresolved:["Maintenance target and scope","Feedback mechanism and signal/response semantics","Duration, termination, resource semantics and Foot signatures"],exactExpansionRecovered:false,signatureRecovered:false,executable:false},
{formalVerb:"SHREN",gloss:"release",patternKind:"RELATION-CODA",pattern:["s","sh"],status:"EXPLICIT-PATTERN-ALIAS",source:"Phase 4 §3.2 Table 3",recoveredMeaning:"s/sh relation-coda family denotes release.",unresolved:["Release target and released state","Release mode and preconditions","Safety, resource and termination semantics"],exactExpansionRecovered:false,signatureRecovered:false,executable:false},
{formalVerb:"BRAN",gloss:"couple",patternKind:"H-SERIES-COUPLING",pattern:["hə","he","ha","hu","hi","ho"],status:"PATTERN-EXPLICIT-PHYSICAL-MAPPING-PROVISIONAL",source:"Phase 4 §3.2 Table 3; §3.3",recoveredMeaning:"h plus domain vowel forms six heavy coupling syllables.",unresolved:["Approved physical-domain mapping","Participant order, direction and coupling vector","Resource costs, validity and complete signatures"],exactExpansionRecovered:false,signatureRecovered:false,executable:false},
{formalVerb:"VARE",gloss:"prefer",patternKind:"REQUIREMENT-MODIFIER",pattern:["VARE","REQUIRE"],status:"EXPLICIT-MODIFIER-NOT-FOOT",source:"Phase 4 §3.2 Table 3",recoveredMeaning:"Soft-requirement modifier paired with hard REQUIRE; explicitly not a Foot.",unresolved:["Attachment scope","Conflict resolution and failure policy","Current formal representation and execution semantics"],exactExpansionRecovered:false,signatureRecovered:false,executable:false}
] as const;
export const formalAliasArchitectureBoundary={
expressionSystem:"v3.0-L typed prefix operators with fixed arity; head, arguments and modifier clauses.",
constructionSystem:"v2.0 Feet, h-couplings and fused references; Construction describes mana configuration.",
formalAliasRole:"Formal names for common Foot patterns; Phase 4 states each expands to a valid Construction under the Macro Transparency Law.",
notEstablished:["A one-to-one mapping from each v3.0-L AST operator node to one macro alias","Exact expansion sequence or Foot selection for a given invocation","Macro argument arity, input/output types, resource contract or physical feasibility"],
performedCompileOrder:["reference","spatial role and vector","Feet","couplings","quantity","control","release"],
referencePersistence:"A reference persists until replaced in the historical v2.0 performed profile.",
compilerEnabled:false,executionEnabled:false,canonEffect:"NONE"
} as const;
export function reviewFormalVerbFootAlias(input:unknown){
 if(typeof input!=="string"||!input.trim())return null;
 const key=input.trim().toUpperCase();
 const entry=formalVerbFootAliases.find(item=>item.formalVerb===key||item.gloss.toUpperCase()===key);
 return entry?{...entry,lexicalAliasRecovered:true as const,completeExpansion:"NOT-RECOVERED" as const,physicalFeasibility:"NOT-ESTABLISHED" as const}:null;
}
