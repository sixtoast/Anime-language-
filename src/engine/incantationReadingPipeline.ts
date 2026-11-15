export const INCANTATION_READING_PIPELINE_PROFILE = "ARCANE-INCANTATION-READING-PIPELINE-1.0" as const;
export type EvidenceState = "PASS" | "FAIL" | "UNRESOLVED" | "NOT-RUN";
export type LanguageReadStage = "lexicalRecognition" | "structuralParsing" | "scopeResolution" | "semanticTyping";
export type ContractStage = "targetResolution" | "preconditions" | "resourceAccounting" | "authority" | "policy" | "lifecycleAndOutcome";
export type ConstructionStage = "reference" | "spatialRole" | "constructionFeet" | "couplings" | "quantity" | "control" | "release";
export type LayerState = "REJECTED" | "INCOMPLETE" | "READABLE" | "CONTRACT-REVIEWED" | "CONSTRUCTION-REVIEWED";
export interface LayerAssessment<T extends string> { state:LayerState; stages:Record<T,EvidenceState>; unresolved:T[]; failed:T[]; }
export interface IncantationReadingAssessment {
 profile:typeof INCANTATION_READING_PIPELINE_PROFILE;
 language:LayerAssessment<LanguageReadStage>;
 incantationContract:LayerAssessment<ContractStage>;
 manaConstruction:LayerAssessment<ConstructionStage>;
 overall:"READING-ONLY"|"INCOMPLETE"|"REJECTED";
 executionPermitted:false;
 physicalFeasibilityEstablished:false;
 canonEffect:"NONE";
}
const languageOrder:readonly LanguageReadStage[]=["lexicalRecognition","structuralParsing","scopeResolution","semanticTyping"];
const contractOrder:readonly ContractStage[]=["targetResolution","preconditions","resourceAccounting","authority","policy","lifecycleAndOutcome"];
const constructionOrder:readonly ConstructionStage[]=["reference","spatialRole","constructionFeet","couplings","quantity","control","release"];
function assess<T extends string>(order:readonly T[],input:Partial<Record<T,EvidenceState>>,reviewedState:LayerState):LayerAssessment<T>{
 const stages={} as Record<T,EvidenceState>;
 for(const stage of order)stages[stage]=input[stage]??"NOT-RUN";
 const failed=order.filter(stage=>stages[stage]==="FAIL");
 const unresolved=order.filter(stage=>stages[stage]==="UNRESOLVED"||stages[stage]==="NOT-RUN");
 const state:LayerState=failed.length?"REJECTED":unresolved.length?"INCOMPLETE":reviewedState;
 return {state,stages,unresolved,failed};
}
export function assessIncantationReading(input:{
 language?:Partial<Record<LanguageReadStage,EvidenceState>>;
 incantationContract?:Partial<Record<ContractStage,EvidenceState>>;
 manaConstruction?:Partial<Record<ConstructionStage,EvidenceState>>;
}={}):IncantationReadingAssessment{
 const language=assess(languageOrder,input.language??{},"READABLE");
 const incantationContract=assess(contractOrder,input.incantationContract??{},"CONTRACT-REVIEWED");
 const manaConstruction=assess(constructionOrder,input.manaConstruction??{},"CONSTRUCTION-REVIEWED");
 const overall=language.state==="REJECTED"?"REJECTED":language.state!=="READABLE"?"INCOMPLETE":"READING-ONLY";
 return {profile:INCANTATION_READING_PIPELINE_PROFILE,language,incantationContract,manaConstruction,overall,executionPermitted:false,physicalFeasibilityEstablished:false,canonEffect:"NONE"};
}
export const incantationReadingPipelinePrinciples=[
 "Lexical recognition establishes only that forms are recognised.",
 "Structural parsing establishes only a recoverable tree under a named grammar profile.",
 "Scope resolution must precede semantic acceptance where modifiers, blocks or bindings affect interpretation.",
 "Semantic typing annotates expressions; it does not evaluate them or prove physical feasibility.",
 "Incantation contracts are a separate design layer covering targets, preconditions, resources, authority, policy and lifecycle/outcome.",
 "Mana Construction is separately reviewed through reference, spatial role, Construction Feet, couplings, quantity, control and release.",
 "A PRECEDES relation between Construction stages does not establish data dependency, mandatory presence, cardinality or execution.",
 "No state in this reading pipeline authorises execution."
] as const;
