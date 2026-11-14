/** Phase 8BW — evidence-gated interface readiness audit; deliberately not a compiler. */
export const PHASE4_BRIDGE_REQUIREMENTS=[
 {id:"SOURCE",label:"Complete Phase 4 §3 source contract",status:"UNRECOVERED"},
 {id:"VERSIONS",label:"Approved source/target version compatibility",status:"UNRECOVERED"},
 {id:"EXPRESSION-TYPES",label:"Expression operand and result type rules",status:"UNRECOVERED"},
 {id:"OPERATOR-MAP",label:"Operator-to-Construction mapping",status:"UNRECOVERED"},
 {id:"REFERENCE-MAP",label:"Scoped reference and identity mapping",status:"UNRECOVERED"},
 {id:"SPATIAL-MAP",label:"Spatial frame, role and vector mapping",status:"UNRECOVERED"},
 {id:"FOOT-MAP",label:"Construction Foot and macro mapping",status:"UNRECOVERED"},
 {id:"COUPLING-MAP",label:"Coupling participants and attachment mapping",status:"UNRECOVERED"},
 {id:"QUANTITY-MAP",label:"Quantity, units and attachment mapping",status:"UNRECOVERED"},
 {id:"CONTROL-RELEASE",label:"Control, release and lifecycle mapping",status:"UNRECOVERED"},
 {id:"ERROR-MODEL",label:"Typed diagnostics and failure semantics",status:"UNRECOVERED"},
 {id:"OUTPUT-MODEL",label:"Declarative Construction output contract",status:"UNRECOVERED"}
] as const;
export type BridgeRequirementId=typeof PHASE4_BRIDGE_REQUIREMENTS[number]["id"];
export type BridgeRequirementState="UNRECOVERED"|"RECOVERED-UNREVIEWED"|"APPROVED";
export interface BridgeEvidenceInput {
 sourceVersion:"v3.0-L"|string;
 targetVersion:"v2.0"|string;
 targetRepresentation:"CONSTRUCTION-PLAN"|"INCANTATION-CONTRACT"|"UNKNOWN";
 sourceParse:"PARSED"|"FAILED"|"NOT-CHECKED";
 expressionTyping:"VALID"|"INVALID"|"NOT-DEFINED";
 requirements?:Partial<Record<BridgeRequirementId,BridgeRequirementState>>;
}
export interface BridgeReadinessReport {
 status:"BLOCKED-SOURCE"|"BLOCKED-PARSE"|"BLOCKED-TYPING"|"BLOCKED-VERSION"|"BLOCKED-REPRESENTATION"|"BLOCKED-CONTRACT"|"RESEARCH-READY";
 compilePermitted:false;
 executable:false;
 canonEffect:"NONE";
 sourceVersion:string;
 targetVersion:string;
 targetRepresentation:string;
 blockers:string[];
 requirements:Array<{id:BridgeRequirementId;label:string;state:BridgeRequirementState}>;
}
export function assessPhase4BridgeReadiness(input:BridgeEvidenceInput):BridgeReadinessReport{
 const requirements=PHASE4_BRIDGE_REQUIREMENTS.map(item=>({id:item.id,label:item.label,state:input.requirements?.[item.id]??"UNRECOVERED" as BridgeRequirementState}));
 const blockers:string[]=[];
 if(requirements[0].state!=="APPROVED")blockers.push("The complete Phase 4 §3 bridge contract has not been recovered and approved.");
 if(input.sourceParse!=="PARSED")blockers.push(input.sourceParse==="FAILED"?"The source Expression did not parse.":"Source Expression parsing has not been established.");
 if(input.expressionTyping!=="VALID")blockers.push(input.expressionTyping==="INVALID"?"Expression type validation failed.":"Expression type rules have not been established.");
 if(input.sourceVersion!=="v3.0-L"||input.targetVersion!=="v2.0")blockers.push("The supplied versions do not match the Phase 4 opening's described subsystem pair (v3.0-L → v2.0).");
 if(input.targetRepresentation!=="CONSTRUCTION-PLAN")blockers.push("The target must be a Construction-plan representation, not an Incantation contract or unknown target.");
 const missing=requirements.filter(r=>r.state!=="APPROVED");
 if(missing.length)blockers.push("Unapproved interface requirements: "+missing.map(r=>r.id).join(", ")+".");
 const status:BridgeReadinessReport["status"]=requirements[0].state!=="APPROVED"?"BLOCKED-SOURCE":input.sourceParse!=="PARSED"?"BLOCKED-PARSE":input.expressionTyping!=="VALID"?"BLOCKED-TYPING":input.sourceVersion!=="v3.0-L"||input.targetVersion!=="v2.0"?"BLOCKED-VERSION":input.targetRepresentation!=="CONSTRUCTION-PLAN"?"BLOCKED-REPRESENTATION":missing.length?"BLOCKED-CONTRACT":"RESEARCH-READY";
 return {status,compilePermitted:false,executable:false,canonEffect:"NONE",sourceVersion:input.sourceVersion,targetVersion:input.targetVersion,targetRepresentation:input.targetRepresentation,blockers,requirements};
}
export const phase4BridgeReadinessBoundary={
 purpose:"Research gate for deciding whether a future compiler contract is sufficiently specified to design.",
 notACompiler:true,
 noTranslation:true,
 noExecution:true,
 approvalRequired:true,
 note:"RESEARCH-READY means evidence is sufficient to begin a separately approved compiler design; it never enables compilation or execution."
} as const;
