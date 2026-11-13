import {describe,expect,it} from "vitest";
import {constructionFrameInventory,constructionParameterInventory,constructionFootEvidenceBoundary} from "./constructionFootEvidence";
describe("Construction Foot evidence inventory",()=>{
 it("[CON-FOOT-EVID-001] preserves six source-backed frame consonants",()=>{expect(constructionFrameInventory.map(x=>x.consonant)).toEqual(["p","b","t","d","k","g"]);expect(constructionFrameInventory.every(x=>x.status==="SOURCE-BACKED")).toBe(true)});
 it("[CON-FOOT-EVID-002] leaves frame semantic contrasts unresolved",()=>{expect(constructionFrameInventory.every(x=>x.semanticContrast==="UNRESOLVED")).toBe(true)});
 it("[CON-FOOT-EVID-003] preserves six provisional parameter families",()=>{expect(constructionParameterInventory.map(x=>[x.vowel,x.family])).toEqual([["a","Energy"],["u","Motion"],["o","Extent"],["e","Structure/form"],["i","Information"],["ə","Baseline"]]);expect(constructionParameterInventory.every(x=>x.status==="PROVISIONAL")).toBe(true)});
 it("[CON-FOOT-EVID-004] does not promote parameter families to executable semantics",()=>{expect(constructionParameterInventory.every(x=>x.execution==="NOT-DEFINED")).toBe(true)});
 it("[CON-FOOT-EVID-005] distinguishes CV frame forms from complete CVC Feet",()=>{expect(constructionFootEvidenceBoundary.shape).toBe("CVC");expect(constructionFootEvidenceBoundary.cvForms).toContain("not complete CVC Feet")});
 it("[CON-FOOT-EVID-006] leaves coda inventory and productive composition unresolved",()=>{expect(constructionFootEvidenceBoundary.relationCoda).toContain("not recovered");expect(constructionFootEvidenceBoundary.unresolved).toContain("productive frame × parameter × relation combinations")});
 it("[CON-FOOT-EVID-007] preserves the CVC versus optional-coda source discrepancy",()=>{expect(constructionFootEvidenceBoundary.shapeEvidenceDiscrepancy.status).toBe("UNRESOLVED-SOURCE-DISCREPANCY");expect(constructionFootEvidenceBoundary.shapeEvidenceDiscrepancy.primary).toContain("CVC");expect(constructionFootEvidenceBoundary.shapeEvidenceDiscrepancy.conflictingSummary).toContain("optional");});
});
