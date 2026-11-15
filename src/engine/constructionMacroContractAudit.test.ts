import {describe,expect,it} from "vitest";
import {constructionMacroContractAudit,macroContractAuditBoundary,reviewConstructionMacroContract,reviewConstructionMacroComposition} from "./constructionMacroContractAudit";
describe("Phase 8CE Construction macro contract audit",()=>{
 it("[MACRO-CON-001] inventories exactly the six recorded Construction macros",()=>{expect(constructionMacroContractAudit.map(x=>x.macro)).toEqual(["TRAK","KREN","FREM","SHREN","BRAN","VARE"]);expect(macroContractAuditBoundary.auditedInventoryCount).toBe(6)});
 it("[MACRO-CON-002] keeps TRAK described and KREN proposed",()=>{expect(reviewConstructionMacroContract("TRAK")?.roleEvidence).toBe("RECORDED-ROLE-EVIDENCE");expect(reviewConstructionMacroContract("KREN")?.roleEvidence).toBe("PROPOSED-UNCONFIRMED")});
 it("[MACRO-CON-003] keeps FREM and SHREN fixture associations partial",()=>{expect(reviewConstructionMacroContract("FREM")?.roleEvidence).toBe("PARTIAL-FIXTURE-EVIDENCE");expect(reviewConstructionMacroContract("SHREN")?.roleEvidence).toBe("PARTIAL-FIXTURE-EVIDENCE")});
 it("[MACRO-CON-004] keeps BRAN coupling family distinct from coupling contract",()=>{expect(reviewConstructionMacroContract("BRAN")?.footScope).toBe("H-DOMAIN-FAMILY");expect(reviewConstructionMacroContract("BRAN")?.inputSignature).toBe("NOT-RECOVERED")});
 it("[MACRO-CON-005] keeps VARE modifier role distinct from REQUIRE implementation",()=>{expect(reviewConstructionMacroContract("VARE")?.footScope).toBe("MODIFIER-ROLE");expect(reviewConstructionMacroContract("VARE")?.sideEffects).toBe("NOT-RECOVERED")});
 it("[MACRO-CON-006] does not invent input signatures",()=>{expect(constructionMacroContractAudit.every(x=>x.inputSignature==="NOT-RECOVERED")).toBe(true)});
 it("[MACRO-CON-007] does not invent output signatures",()=>{expect(constructionMacroContractAudit.every(x=>x.outputSignature==="NOT-RECOVERED")).toBe(true)});
 it("[MACRO-CON-008] does not infer Foot cardinality or sequence scope",()=>{expect(constructionMacroContractAudit.every(x=>x.footCardinality==="NOT-RECOVERED"&&x.sequenceScope==="NOT-RECOVERED")).toBe(true)});
 it("[MACRO-CON-009] does not infer preconditions or resource limits",()=>{expect(constructionMacroContractAudit.every(x=>x.preconditions==="NOT-RECOVERED"&&x.resourceSemantics==="NOT-RECOVERED")).toBe(true)});
 it("[MACRO-CON-010] does not infer side effects or physical outcomes",()=>{expect(constructionMacroContractAudit.every(x=>x.sideEffects==="NOT-RECOVERED")).toBe(true)});
 it("[MACRO-CON-011] reports macro-to-macro composition as unresolved",()=>{expect(reviewConstructionMacroComposition("TRAK","FREM")?.status).toBe("NOT-ESTABLISHED");expect(reviewConstructionMacroComposition("TRAK","FREM")?.ordering).toBe("NOT-RECOVERED")});
 it("[MACRO-CON-012] fails closed and keeps all macros non-executable",()=>{expect(reviewConstructionMacroContract("UNKNOWN")).toBeNull();expect(reviewConstructionMacroContract(null)).toBeNull();expect(constructionMacroContractAudit.every(x=>x.executable===false)).toBe(true)});
});
