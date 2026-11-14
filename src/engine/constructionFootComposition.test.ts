import { describe, expect, it } from "vitest";
import { reviewConstructionFootComposition } from "./constructionFootComposition";
describe("source-conflict-aware Construction Foot composition review",()=>{
 it("[CON-FOOT-018] preserves both source readings without choosing one",()=>{const r=reviewConstructionFootComposition("pa");expect(r.readings.map(x=>x.sourceReading)).toEqual(["P5.15-CVC-REQUIRED","P5.16-CODA-OPTIONAL"]);expect(r.readings.every(x=>x.conclusion==="UNRESOLVED")).toBe(true);});
 it("[CON-FOOT-019] marks absent coda as missing under Phase 5.15",()=>expect(reviewConstructionFootComposition("pa").readings[0].slotAssessment).toBe("REQUIRED-CODA-ABSENT"));
 it("[CON-FOOT-020] marks absent coda as aligned only with optional-coda reading",()=>expect(reviewConstructionFootComposition("pa").readings[1].slotAssessment).toBe("OPTIONAL-CODA-ABSENT"));
 it("[CON-FOOT-021] does not treat three slots as a valid coda or complete Foot",()=>{const r=reviewConstructionFootComposition("paz");expect(r.readings.every(x=>x.slotAssessment==="THREE-SLOT-SHAPE-PRESENT"&&x.codaEvidence==="CODA-MEMBERSHIP-UNRESOLVED"&&x.conclusion==="UNRESOLVED")).toBe(true);});
 it("[CON-FOOT-022] preserves unrecovered frame-vowel combination",()=>expect(reviewConstructionFootComposition("puz").readings.every(x=>x.framePrefix==="UNRECOVERED-FRAME-VOWEL-COMBINATION")).toBe(true));
 it("[CON-FOOT-023] does not assess malformed input",()=>expect(reviewConstructionFootComposition("p-a").readings.every(x=>x.slotAssessment==="INVALID-SHAPE"&&x.framePrefix==="NOT-ASSESSABLE")).toBe(true));
});
