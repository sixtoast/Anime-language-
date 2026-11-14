import { describe, expect, it } from "vitest";
import { constructionAxisSemantics, reviewConstructionAxis, reviewOppositeConstructionAxis } from "./constructionAxisSemantics";
describe("Phase 8BR canonical signed-axis semantics",()=>{
 it("[CON-AXIS-001] records all six source-assigned directions",()=>{expect(constructionAxisSemantics.axes.map(a=>[a.form,a.coordinateAxis,a.sign,a.direction])).toEqual([["PA","X",-1,"left"],["BA","X",1,"right"],["TA","Y",-1,"below"],["DA","Y",1,"above"],["KA","Z",-1,"behind"],["GA","Z",1,"forward"]]);});
 it("[CON-AXIS-002] records the canonical positive coordinate convention",()=>{expect(constructionAxisSemantics.convention).toEqual({positiveX:"right",positiveY:"above",positiveZ:"forward"});});
 it("[CON-AXIS-003] pairs opposite signs on each coordinate dimension",()=>{for(const [a,b] of [["PA","BA"],["TA","DA"],["KA","GA"]]){expect(reviewConstructionAxis(a)?.oppositeForm).toBe(b);expect(reviewConstructionAxis(b)?.oppositeForm).toBe(a);}});
 it("[CON-AXIS-004] preserves the source-recorded voicing contrast",()=>{expect(constructionAxisSemantics.phonologicalObservation.pairs).toEqual([["P","B"],["T","D"],["K","G"]]);expect(constructionAxisSemantics.phonologicalObservation.semanticRuleInferred).toBe(false);});
 it("[CON-AXIS-005] does not infer origin or frame identity",()=>{expect(constructionAxisSemantics.unresolved).toContain("origin and frame identity");expect(constructionAxisSemantics.limits.frameIdentityEncoded).toBe(false);});
 it("[CON-AXIS-006] does not infer vector construction or axis composition",()=>{expect(constructionAxisSemantics.limits.vectorConstructorRecovered).toBe(false);expect(constructionAxisSemantics.limits.axisCompositionRuleRecovered).toBe(false);});
 it("[CON-AXIS-007] fails closed for unknown or malformed axis forms",()=>{expect(reviewConstructionAxis("XA")).toBeNull();expect(reviewConstructionAxis(null)).toBeNull();expect(reviewOppositeConstructionAxis("XA")).toBeNull();});
 it("[CON-AXIS-008] resolves opposite axis records without changing meanings",()=>{expect(reviewOppositeConstructionAxis("PA")?.form).toBe("BA");expect(reviewOppositeConstructionAxis("GA")?.form).toBe("KA");});
 it("[CON-AXIS-009] remains non-executable and canon-neutral",()=>{expect(constructionAxisSemantics.limits.executable).toBe(false);expect(constructionAxisSemantics.limits.canonEffect).toBe("NONE");});
});
