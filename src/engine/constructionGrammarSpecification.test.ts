import { describe, expect, it } from "vitest";
import { CONSTRUCTION_GRAMMAR_SPEC_VERSION, constructionGrammarSpecification, constructionGrammarSpecificationSummary, constructionGrammarStageOrder, reviewConstructionGrammarEvidence } from "./constructionGrammarSpecification";
describe("Integrated Construction grammar evidence specification",()=>{
 it("[GRAMMAR-8CP-001] versions the evidence specification",()=>{expect(CONSTRUCTION_GRAMMAR_SPEC_VERSION).toBe("0.1.0-evidence");});
 it("[GRAMMAR-8CP-002] represents all seven Construction stages",()=>{expect(constructionGrammarSpecification.map(x=>x.id)).toEqual(["REFERENCE","SPATIAL-ROLE-VECTOR","CONSTRUCTION-FEET","COUPLINGS","QUANTITY","CONTROL","RELEASE"]);});
 it("[GRAMMAR-8CP-003] preserves precedence-only stage relationships",()=>{expect(constructionGrammarStageOrder).toHaveLength(6);expect(constructionGrammarStageOrder.every(x=>x.interfaceStatus==="UNRECOVERED"&&x.dataDependency==="NOT-ESTABLISHED")).toBe(true);});
 it("[GRAMMAR-8CP-004] keeps the Foot coda conflict visible",()=>{expect(constructionGrammarSpecification.find(x=>x.id==="CONSTRUCTION-FEET")?.status).toBe("UNRESOLVED-SOURCE-DISCREPANCY");});
 it("[GRAMMAR-8CP-005] includes all six incomplete macro contracts",()=>{expect(constructionGrammarSpecificationSummary.macroCount).toBe(6);expect(constructionGrammarSpecificationSummary.macroCompilerReadyCount).toBe(0);});
 it("[GRAMMAR-8CP-006] blocks productive grammar validation",()=>{expect(constructionGrammarSpecificationSummary.productiveGrammarRecovered).toBe(false);expect(constructionGrammarSpecificationSummary.grammarValidatorEnabled).toBe(false);expect(constructionGrammarSpecification.every(x=>x.permitsGrammarValidation===false)).toBe(true);});
 it("[GRAMMAR-8CP-007] recognises a frame without accepting a Construction",()=>{const r=reviewConstructionGrammarEvidence("pa");expect(r.grammarDisposition).toBe("EVIDENCE-RECOGNISED-NOT-GRAMMAR-VALIDATED");expect(r.canAcceptAsValidConstruction).toBe(false);});
 it("[GRAMMAR-8CP-008] preserves whole example tokens without Foot decomposition",()=>{const r=reviewConstructionGrammarEvidence("kan");expect(r.grammarDisposition).toBe("EVIDENCE-RECOGNISED-NOT-GRAMMAR-VALIDATED");expect(r.candidate.frameConsonant).toBeNull();});
 it("[GRAMMAR-8CP-009] flags CVC candidates for source adjudication",()=>{expect(reviewConstructionGrammarEvidence("pan").grammarDisposition).toBe("CANDIDATE-REQUIRES-SOURCE-ADJUDICATION");});
 it("[GRAMMAR-8CP-010] does not declare unknown input canonically invalid",()=>{expect(reviewConstructionGrammarEvidence("xyz").grammarDisposition).toBe("NO-BOUNDED-EVIDENCE-MATCH");});
 it("[GRAMMAR-8CP-011] keeps Expression mapping unestablished",()=>{expect(reviewConstructionGrammarEvidence("pa").expressionMapping).toBe("NOT-ESTABLISHED");});
 it("[GRAMMAR-8CP-012] keeps reviews non-executable and canon-neutral",()=>{const r=reviewConstructionGrammarEvidence("da");expect(r.executable).toBe(false);expect(r.canonEffect).toBe("NONE");});
});
