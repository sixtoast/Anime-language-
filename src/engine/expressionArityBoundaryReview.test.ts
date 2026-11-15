import{describe,expect,it}from"vitest";
import{EXPRESSION_ARITY_BOUNDARY_PROFILE,expressionArityEvidence,reviewExpressionArityBoundaries}from"./expressionArityBoundaryReview";
describe("Phase 8DF fixed-arity and nested-expression evidence",()=>{
it("[EXPR-ARITY-001] exposes a versioned profile",()=>expect(reviewExpressionArityBoundaries().profile).toBe(EXPRESSION_ARITY_BOUNDARY_PROFILE));
it("[EXPR-ARITY-002] records fixed arity in Phase 4 G-1",()=>expect(expressionArityEvidence.find(x=>x.id==="P4-G1")?.status).toBe("HISTORICAL-GRAMMAR-RULE"));
it("[EXPR-ARITY-003] records separator-free boundaries",()=>expect(expressionArityEvidence.find(x=>x.id==="P4-G1")?.claim).toContain("no separator"));
it("[EXPR-ARITY-004] records no optional arguments",()=>expect(expressionArityEvidence.find(x=>x.id==="P4-G3")?.status).toBe("HISTORICAL-GRAMMAR-RULE"));
it("[EXPR-ARITY-005] records P4-T11 split",()=>expect(expressionArityEvidence.find(x=>x.id==="P4-T11")?.claim).toContain("1 and 23"));
it("[EXPR-ARITY-006] records P4-T12 split",()=>expect(expressionArityEvidence.find(x=>x.id==="P4-T12")?.claim).toContain("12 and 3"));
it("[EXPR-ARITY-007] records unterminated numeral rejection",()=>expect(expressionArityEvidence.find(x=>x.id==="P4-T13")?.claim).toContain("no parse"));
it("[EXPR-ARITY-008] distinguishes binding identifier rule",()=>expect(expressionArityEvidence.find(x=>x.id==="P4-T14")?.boundary).toContain("distinct"));
it("[EXPR-ARITY-009] marks abstract nesting notation provisional",()=>expect(expressionArityEvidence.find(x=>x.id==="P2-ABSTRACT-NESTING")?.status).toBe("PROVISIONAL-AUDIT-PROPOSAL"));
it("[EXPR-ARITY-010] preserves head-initial canon",()=>expect(expressionArityEvidence.find(x=>x.id==="V3-HEAD-INITIAL")?.status).toBe("CANON-GENERAL-PRINCIPLE"));
it("[EXPR-ARITY-011] does not promote Phase 2 signatures",()=>expect(reviewExpressionArityBoundaries().provisionalOnly.length).toBeGreaterThan(0));
it("[EXPR-ARITY-012] keeps spoken nesting unresolved",()=>expect(reviewExpressionArityBoundaries().spokenNestingSyntax).toBe("NOT-RECOVERED"));
it("[EXPR-ARITY-013] keeps binding operator signatures unresolved",()=>expect(reviewExpressionArityBoundaries().unresolved).toContain("Canonical signature and evaluation semantics for KWAM, KWAT and KWAK."));
it("[EXPR-ARITY-014] changes neither parser nor canon",()=>{const r=reviewExpressionArityBoundaries();expect(r.parserChanged).toBe(false);expect(r.canonEffect).toBe("NONE");expect(r.executable).toBe(false)});
});
