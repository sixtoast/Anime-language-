import{describe,it,expect}from"vitest";
import{parseSurfaceExpression}from"./surfaceParser";
import{reviewArcaneBindingOperators}from"./arcaneBindingOperatorReconciliation";
const atoms=["ri","vanu"];
describe("Arcane binding operator reconciliation",()=>{
it("[BIND-REC-001] recognises the provisional KWAM identifier-expression shape",()=>{const p=parseSurfaceExpression("kwam ki sho ri",{knownAtoms:atoms});const r=reviewArcaneBindingOperators(p);expect(p.ok).toBe(true);expect(r.operatorCounts.KWAM).toBe(1);expect(r.findings.some(f=>f.code==="BINDING-IDENTIFIER-PARSER-FORMAT")).toBe(true)});
it("[BIND-REC-002] recognises the provisional KWAT identifier shape",()=>{const p=parseSurfaceExpression("kwat ki sho",{knownAtoms:atoms});const r=reviewArcaneBindingOperators(p);expect(p.ok).toBe(true);expect(r.operatorCounts.KWAT).toBe(1)});
it("[BIND-REC-003] keeps binding identifier compatibility unresolved",()=>{const r=reviewArcaneBindingOperators(parseSurfaceExpression("kwat ki sho"));expect(r.identifierCompatibility).toBe("UNRESOLVED")});
it("[BIND-REC-004] reports canonical arity as unspecified",()=>{const r=reviewArcaneBindingOperators(parseSurfaceExpression("kwat ki sho"));expect(r.findings.some(f=>f.code==="CANONICAL-ARITY-UNSPECIFIED")).toBe(true)});
it("[BIND-REC-005] identifies the KWASH legacy representation",()=>{const p=parseSurfaceExpression("kwash ki sho",{allowLegacyAliases:false});const r=reviewArcaneBindingOperators(p);expect(r.operatorCounts.KWASH).toBe(1);expect(r.findings.some(f=>f.code==="KWAK-LEGACY-ALIAS")).toBe(true)});
it("[BIND-REC-006] does not accept direct KWAK as a usable provisional operator",()=>{const p=parseSurfaceExpression("kwak ki sho");expect(p.ok).toBe(false)});
it("[BIND-REC-007] reports unavailable parse without attempting repair",()=>expect(reviewArcaneBindingOperators(parseSurfaceExpression("kwam")).disposition).toBe("PARSE-UNAVAILABLE"));
it("[BIND-REC-008] does not evaluate or execute bindings",()=>{const r=reviewArcaneBindingOperators(parseSurfaceExpression("kwat ki sho"));expect(r.evaluation).toBe("NOT-PERFORMED");expect(r.executable).toBe(false);expect(r.canonEffect).toBe("NONE")});
it("[BIND-REC-009] does not claim semantic equivalence",()=>expect(reviewArcaneBindingOperators(parseSurfaceExpression("kwat ki sho")).semanticEquivalence).toBe("NOT-CLAIMED"));
it("[BIND-REC-010] reports no binding operators in an ordinary atom",()=>expect(reviewArcaneBindingOperators(parseSurfaceExpression("ri",{knownAtoms:atoms})).disposition).toBe("NO-BINDING-OPERATORS"));
});