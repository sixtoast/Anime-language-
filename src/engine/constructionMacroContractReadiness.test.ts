import {describe,expect,it} from "vitest";
import {constructionMacroContractReadiness as records,constructionMacroContractReadinessSummary as summary,reviewConstructionMacroReadiness as review} from "./constructionMacroContractReadiness";
describe("Phase 8CL Construction macro contract readiness",()=>{
 it("[MACRO-CL-001] covers six macros",()=>expect(records.map(x=>x.macro)).toEqual(["TRAK","KREN","FREM","SHREN","BRAN","VARE"]));
 it("[MACRO-CL-002] retains KREN owner-confirmation status",()=>expect(review("kren")?.readinessStatus).toBe("PROPOSED-OWNER-CONFIRMATION"));
 it("[MACRO-CL-003] keeps FREM and SHREN fixture-only",()=>{expect(review("FREM")?.readinessStatus).toBe("PARTIAL-FIXTURE-ONLY");expect(review("SHREN")?.readinessStatus).toBe("PARTIAL-FIXTURE-ONLY")});
 it("[MACRO-CL-004] separates TRAK role from readiness",()=>{expect(review("TRAK")?.readinessStatus).toBe("ROLE-RECOVERED-CONTRACT-INCOMPLETE");expect(review("TRAK")?.readyForCompiler).toBe(false)});
 it("[MACRO-CL-005] retains BRAN provisional mapping blocker",()=>expect(review("BRAN")?.specificBlockers.join(" ")).toContain("provisional"));
 it("[MACRO-CL-006] retains VARE attachment and conflict blockers",()=>{const s=review("VARE")?.specificBlockers.join(" ");expect(s).toContain("attachment");expect(s).toContain("conflict")});
 it("[MACRO-CL-007] blocks on all nine shared dimensions",()=>expect(review("TRAK")?.missingDimensions).toEqual(["inputSignature","outputSignature","footCardinality","sequenceScope","preconditions","resourceSemantics","sideEffects","termination","compositionWithOtherMacros"]));
 it("[MACRO-CL-008] spelling does not supply signatures",()=>{expect(review("TRAK")?.missingDimensions).toContain("inputSignature");expect(review("TRAK")?.missingDimensions).toContain("outputSignature")});
 it("[MACRO-CL-009] every record has blockers",()=>expect(records.every(x=>x.blockerCount>0)).toBe(true));
 it("[MACRO-CL-010] no macro is compiler-ready",()=>{expect(records.every(x=>!x.readyForCompiler)).toBe(true);expect(summary.compilerReadyCount).toBe(0)});
 it("[MACRO-CL-011] all macros remain non-executable",()=>expect(records.every(x=>!x.executable)).toBe(true));
 it("[MACRO-CL-012] reports six incomplete contracts",()=>{expect(summary.macroCount).toBe(6);expect(summary.allContractsIncomplete).toBe(true)});
 it("[MACRO-CL-013] rejects unknown macro names",()=>expect(review("UNKNOWN")).toBeNull());
 it("[MACRO-CL-014] rejects empty and non-string lookups",()=>{expect(review("")).toBeNull();expect(review(null)).toBeNull()});
 it("[MACRO-CL-015] remains disabled and canon-neutral",()=>{expect(summary.compilerEnabled).toBe(false);expect(summary.canonEffect).toBe("NONE")});
});
