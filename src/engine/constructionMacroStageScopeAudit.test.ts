import {describe,expect,it} from "vitest";
import {constructionMacroStageScopeAudit,reviewConstructionMacroStageScope,compareFixtureSegmentWithStageOrder} from "./constructionMacroStageScopeAudit";
describe("Phase 8CF Construction macro/stage scope audit",()=>{
 it("[MACRO-STAGE-001] preserves the seven source-backed performed stages",()=>{expect(constructionMacroStageScopeAudit.sourceStageOrder).toEqual(["reference","spatial-role-vector","construction-feet","couplings","quantity","control","release"])});
 it("[MACRO-STAGE-002] preserves the six adjacent precedence-only boundaries",()=>{expect(constructionMacroStageScopeAudit.stageEdges).toHaveLength(6);expect(constructionMacroStageScopeAudit.stageEdges.every(x=>x.dataDependency==="NOT-ESTABLISHED"&&x.interfaceStatus==="UNRECOVERED")).toBe(true)});
 it("[MACRO-STAGE-003] does not assign any macro to a Construction stage",()=>{expect(constructionMacroStageScopeAudit.macroRecords.every(x=>x.stageAssignment==="NOT-ESTABLISHED")).toBe(true)});
 it("[MACRO-STAGE-004] records FREM evidence only at the fixture maintenance segment",()=>{expect(reviewConstructionMacroStageScope("FREM")?.fixtureSegment).toBe("maintenance")});
 it("[MACRO-STAGE-005] records SHREN evidence only at the fixture release segment",()=>{expect(reviewConstructionMacroStageScope("SHREN")?.fixtureSegment).toBe("release")});
 it("[MACRO-STAGE-006] retains KAN as fixture-level TRAK ENRA alias without generalising",()=>{expect(reviewConstructionMacroStageScope("TRAK")?.fixtureAssociation).toContain("TRAK ENRA");expect(reviewConstructionMacroStageScope("TRAK")?.stageAssignment).toBe("NOT-ESTABLISHED")});
 it("[MACRO-STAGE-007] does not infer macro scope from token grouping",()=>{expect(constructionMacroStageScopeAudit.macroRecords.every(x=>x.scope==="NOT-RECOVERED")).toBe(true)});
 it("[MACRO-STAGE-008] does not infer causal or data dependency from fixture order",()=>{expect(compareFixtureSegmentWithStageOrder("maintenance")?.relationshipToSevenStageOrder).toBe("NOT-ESTABLISHED");expect(constructionMacroStageScopeAudit.boundaries.fixtureOrderDefinesCausality).toBe(false)});
 it("[MACRO-STAGE-009] does not infer a macro's Foot cardinality",()=>{expect(constructionMacroStageScopeAudit.macroRecords.every(x=>x.footCardinality==="NOT-RECOVERED")).toBe(true)});
 it("[MACRO-STAGE-010] keeps all stage and macro assignments non-executable",()=>{expect(constructionMacroStageScopeAudit.macroRecords.every(x=>!x.executable)).toBe(true);expect(constructionMacroStageScopeAudit.boundaries.executable).toBe(false)});
});
