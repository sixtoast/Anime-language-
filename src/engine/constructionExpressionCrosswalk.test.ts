import{describe,expect,it}from"vitest";
import{reviewExpressionConstructionPair,reviewExpressionOperator,reviewConstructionTarget,expressionOperatorFamilies,constructionMacroRelationships,expressionConstructionCrosswalkRules,phase8bxCrosswalkBoundary}from"./constructionExpressionCrosswalk";
describe("Phase 8BX Expression/Construction evidence crosswalk",()=>{
it("[P4-XW-001] inventories the four formal operator families",()=>{expect(expressionOperatorFamilies.map(x=>x.id)).toEqual(["ARITHMETIC","SPATIAL","LOGIC-CONTROL","INFORMATION-STATE"])});
it("[P4-XW-002] preserves all six Construction macro records",()=>{expect(constructionMacroRelationships.map(x=>x.macro)).toEqual(["TRAK","KREN","FREM","SHREN","BRAN","VARE"])});
it("[P4-XW-003] does not infer FRAPA to TRAK from conceptual similarity",()=>{expect(reviewExpressionConstructionPair("FRAPA","TRAK")?.status).toBe("NOT-ESTABLISHED")});
it("[P4-XW-004] does not infer spatial operators map to axes or Feet",()=>{expect(reviewExpressionOperator("DRIM")?.mappingStatus).toBe("NOT-ESTABLISHED")});
it("[P4-XW-005] preserves KREN proposal status without promoting mapping",()=>{const r=reviewExpressionConstructionPair("FRATA","KREN");expect(r?.macroEvidence).toBe("PROPOSED");expect(r?.status).toBe("NOT-ESTABLISHED")});
it("[P4-XW-006] keeps FREM and SHREN example-only",()=>{expect(reviewExpressionConstructionPair("BEK","FREM")?.macroEvidence).toBe("PARTIAL-EXAMPLE");expect(reviewExpressionConstructionPair("ZET","SHREN")?.macroEvidence).toBe("PARTIAL-EXAMPLE")});
it("[P4-XW-007] keeps BRAN's coupling signature unresolved",()=>{expect(reviewConstructionTarget("BRAN")?.macroStatus).toBe("PATTERN-DESCRIBED");expect(reviewConstructionTarget("he")?.couplingStatus).toBe("UNRESOLVED")});
it("[P4-XW-008] does not treat VARE as an operator mapping",()=>{expect(reviewExpressionConstructionPair("GRAK","VARE")?.macroEvidence).toBe("ROLE-DESCRIBED")});
it("[P4-XW-009] fails closed for unknown forms",()=>{expect(reviewExpressionConstructionPair("UNKNOWN","NOT-A-MACRO")?.operatorKnown).toBe(false);expect(reviewExpressionConstructionPair("UNKNOWN","NOT-A-MACRO")?.macroKnown).toBe(false)});
it("[P4-XW-010] rejects malformed lookup input",()=>{expect(reviewExpressionConstructionPair(null,"TRAK")).toBeNull();expect(reviewExpressionOperator(" ")).toBeNull()});
it("[P4-XW-011] records explicit evidence boundaries",()=>{expect(expressionConstructionCrosswalkRules).toHaveLength(6);expect(phase8bxCrosswalkBoundary.mappingTableRecovered).toBe(false);expect(phase8bxCrosswalkBoundary.endToEndTraceRecovered).toBe(false)});
it("[P4-XW-012] keeps every macro mapping unestablished",()=>{expect(constructionMacroRelationships.every(x=>x.mappingToExpression==="NOT-ESTABLISHED")).toBe(true)});
});
