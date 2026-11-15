/** Phase 8CL — fail-closed compiler-readiness gate for Construction macros. */
import { constructionMacroContractAudit } from "./constructionMacroContractAudit";
const required = ["inputSignature","outputSignature","footCardinality","sequenceScope","preconditions","resourceSemantics","sideEffects","termination","compositionWithOtherMacros"] as const;
const specific: Readonly<Record<string, readonly string[]>> = {
 TRAK:["Exact expansion is not recovered.","Physical meaning and resource effect of discrete change are not recovered."],
 KREN:["Historical proposal requires owner confirmation.","Approved Foot mapping and operational contract are not recovered."],
 FREM:["ken association is limited to one worked example.","General maintenance conditions, duration and termination are not recovered."],
 SHREN:["kas association is limited to one worked example.","Release target, mode and safety conditions are not recovered."],
 BRAN:["H-series domain/property mapping is provisional.","Coupling participants, order, direction, physical vector and resource costs are unresolved."],
 VARE:["Modifier attachment and scope are not recovered.","Preference conflict resolution and failure policy are not recovered."]
};
export const constructionMacroContractReadiness = constructionMacroContractAudit.map(record => {
 const missingDimensions = required.filter(field => record[field] === "NOT-RECOVERED" || record[field] === "NOT-ESTABLISHED");
 const specificBlockers = specific[record.macro] ?? [];
 const readinessStatus = record.roleEvidence === "PROPOSED-UNCONFIRMED" ? "PROPOSED-OWNER-CONFIRMATION"
  : record.roleEvidence === "PARTIAL-FIXTURE-EVIDENCE" ? "PARTIAL-FIXTURE-ONLY" : "ROLE-RECOVERED-CONTRACT-INCOMPLETE";
 return { macro:record.macro,gloss:record.gloss,evidenceStatus:record.roleEvidence,readinessStatus,missingDimensions,specificBlockers,blockerCount:missingDimensions.length+specificBlockers.length,readyForCompiler:false as const,executable:false as const };
});
export const constructionMacroContractReadinessSummary = {
 macroCount:constructionMacroContractReadiness.length,
 compilerReadyCount:constructionMacroContractReadiness.filter(x=>x.readyForCompiler).length,
 allContractsIncomplete:constructionMacroContractReadiness.every(x=>x.blockerCount>0),
 allNonExecutable:constructionMacroContractReadiness.every(x=>!x.executable),
 commonRequiredDimensions:required,compilerEnabled:false,canonEffect:"NONE"
} as const;
export function reviewConstructionMacroReadiness(value:unknown) {
 if(typeof value!=="string" || !value.trim()) return null;
 const macro=value.trim().toUpperCase();
 return constructionMacroContractReadiness.find(x=>x.macro===macro) ?? null;
}
