/** Phase 8CP — integrated, non-executable Construction grammar evidence specification. */
import { constructionFootEvidenceBoundary, constructionFrameInventory, constructionParameterInventory } from "./constructionFootEvidence";
import { reviewConstructionFootCandidate, type ConstructionFootCandidateReview } from "./constructionFootCandidateReview";
import { constructionMacroContractReadiness, constructionMacroContractReadinessSummary } from "./constructionMacroContractReadiness";
import { constructionStageRelationshipEvidence } from "./constructionStageRelationshipEvidence";
import { phase8bxCrosswalkBoundary } from "./constructionExpressionCrosswalk";

export const CONSTRUCTION_GRAMMAR_SPEC_VERSION = "0.1.0-evidence";
export type ConstructionGrammarEvidenceStatus = "SOURCE-BACKED-INVENTORY" | "PROVISIONAL-INVENTORY" | "PARTIAL-EXAMPLE" | "ORDER-ONLY" | "UNRESOLVED-SOURCE-DISCREPANCY" | "NOT-ESTABLISHED";
export interface ConstructionGrammarSection {
  id: string; label: string; status: ConstructionGrammarEvidenceStatus;
  recovered: readonly string[]; unresolved: readonly string[]; permitsGrammarValidation: false;
}
export const constructionGrammarSpecification: readonly ConstructionGrammarSection[] = [
 {id:"REFERENCE",label:"Reference and binding",status:"PARTIAL-EXAMPLE",recovered:["MI/NI/RI → DEFAULT-VOLUME","me → SELF-SURFACE","UNTIL-REPLACED within recovered reference context"],unresolved:["landmark inventory and identity","surface geometry","spoken reference syntax","phrase/clause boundary scope effects"],permitsGrammarValidation:false},
 {id:"SPATIAL-ROLE-VECTOR",label:"Spatial role and vector",status:"SOURCE-BACKED-INVENTORY",recovered:["Versioned spatial token inventory","six v3.0-L signed-axis glosses"],unresolved:["complete spatial argument syntax","origin and frame identity","vector literal syntax","cross-version integration with Construction Feet"],permitsGrammarValidation:false},
 {id:"CONSTRUCTION-FEET",label:"Construction Feet",status:"UNRESOLVED-SOURCE-DISCREPANCY",recovered:constructionFrameInventory.map(x=>x.canonicalForm),unresolved:["mandatory versus optional relation coda","complete coda inventory and meanings","productive frame/parameter/coda combinations","Foot composition and argument structure"],permitsGrammarValidation:false},
 {id:"COUPLINGS",label:"Couplings",status:"PROVISIONAL-INVENTORY",recovered:["H-series hə/he/ha/hu/hi/ho","he/matter and ha/energy fixture associations"],unresolved:["participant identities and order","direction and vector semantics","general domain mapping","resource cost and execution contract"],permitsGrammarValidation:false},
 {id:"QUANTITY",label:"Quantity",status:"PARTIAL-EXAMPLE",recovered:["A bounded 0.2 metre quantity phrase in the hand-flame fixture"],unresolved:["general numeric syntax","unit grammar","dimensional typing","quantity attachment and scope"],permitsGrammarValidation:false},
 {id:"CONTROL",label:"Control and maintenance",status:"PARTIAL-EXAMPLE",recovered:["ken is associated with a held-energy state in one fixture"],unresolved:["general control grammar","maintenance conditions","duration and termination","macro signature and side effects"],permitsGrammarValidation:false},
 {id:"RELEASE",label:"Release",status:"PARTIAL-EXAMPLE",recovered:["kas is associated with release in one fixture"],unresolved:["release target and mode","safety preconditions","release grammar","termination and resource effects"],permitsGrammarValidation:false}
] as const;
export const constructionGrammarStageOrder = constructionStageRelationshipEvidence.precedence.map(edge=>({from:edge.from,to:edge.to,relation:edge.relation,interfaceStatus:edge.interfaceStatus,dataDependency:edge.dataDependency}));
export const constructionGrammarSpecificationSummary = {
 version:CONSTRUCTION_GRAMMAR_SPEC_VERSION,stageCount:constructionStageRelationshipEvidence.stages.length,
 stageOrderEdgeCount:constructionGrammarStageOrder.length,frameCount:constructionFrameInventory.length,
 parameterCount:constructionParameterInventory.length,macroCount:constructionMacroContractReadinessSummary.macroCount,
 macroCompilerReadyCount:constructionMacroContractReadinessSummary.compilerReadyCount,
 codaStatus:constructionFootEvidenceBoundary.shapeEvidenceDiscrepancy.status,sectionCount:constructionGrammarSpecification.length,
 allSectionsBlockGrammarValidation:constructionGrammarSpecification.every(section=>!section.permitsGrammarValidation),
 productiveGrammarRecovered:false,grammarValidatorEnabled:false,compilerEnabled:false,executable:false,canonEffect:"NONE"
} as const;
export interface ConstructionGrammarEvidenceReview {
 specificationVersion:string; candidate:ConstructionFootCandidateReview;
 grammarDisposition:"EVIDENCE-RECOGNISED-NOT-GRAMMAR-VALIDATED"|"CANDIDATE-REQUIRES-SOURCE-ADJUDICATION"|"NO-BOUNDED-EVIDENCE-MATCH";
 grammarValidation:"NOT-PERFORMED"; macroContracts:"INCOMPLETE"; stageInterfaces:"UNRECOVERED";
 expressionMapping:"NOT-ESTABLISHED"; canAcceptAsValidConstruction:false; executable:false; canonEffect:"NONE"; explanation:string;
}
export function reviewConstructionGrammarEvidence(input:unknown):ConstructionGrammarEvidenceReview {
 const candidate=reviewConstructionFootCandidate(input);
 const grammarDisposition:ConstructionGrammarEvidenceReview["grammarDisposition"] =
  candidate.status==="CANONICAL-CV-FRAME"||candidate.status==="WHOLE-EXAMPLE-TOKEN" ? "EVIDENCE-RECOGNISED-NOT-GRAMMAR-VALIDATED"
  : candidate.status==="UNSUPPORTED-OR-UNRESOLVED" ? "NO-BOUNDED-EVIDENCE-MATCH" : "CANDIDATE-REQUIRES-SOURCE-ADJUDICATION";
 return {specificationVersion:CONSTRUCTION_GRAMMAR_SPEC_VERSION,candidate,grammarDisposition,grammarValidation:"NOT-PERFORMED",
  macroContracts:constructionMacroContractReadiness.every(x=>!x.readyForCompiler)?"INCOMPLETE":"INCOMPLETE",
  stageInterfaces:"UNRECOVERED",expressionMapping:phase8bxCrosswalkBoundary.mappingTableRecovered?"NOT-ESTABLISHED":"NOT-ESTABLISHED",
  canAcceptAsValidConstruction:false,executable:false,canonEffect:"NONE",
  explanation:"This classifies the candidate against bounded evidence only. A recognised frame or example token is not proof of a grammatical Construction. Complete syntax, Foot composition, macro contracts, stage interfaces and the Expression crosswalk remain unrecovered."};
}
export const constructionGrammarSpecificationLimitations = [
 "The seven stages are recorded in precedence order only; their interfaces and data dependencies are not established.",
 "Frame and parameter inventories are not a productive Cartesian grammar.",
 "The Foot relation-coda requirement remains disputed between Phase 5.15 and Phase 5.16 C-02.",
 "Whole example tokens are not decomposed into morphemes without primary evidence.",
 "Macro names and glosses do not supply signatures, arity, cardinality or execution semantics.",
 "Reference binding does not recover landmark identity or boundary scope.",
 "The formal Expression subsystem is not translated into Construction instructions.",
 "No output of this specification is a spell, executable instruction or claim of physical feasibility."
] as const;
