import {describe,expect,it} from "vitest";
import {constructionFrameMacroAssociations,reviewConstructionFrameMacroAssociation} from "./constructionFrameContrastEvidence";
describe("Construction frame/macro evidence",()=>{
 it("[CON-FRAME-004] records the two distinct frame sets",()=>{expect(constructionFrameMacroAssociations.map(x=>[x.macro,x.frameSet])).toEqual([["TRAK",["p","t","k"]],["KREN",["b","d","g"]]])});
 it("[CON-FRAME-005] preserves TRAK as a described pattern",()=>{expect(reviewConstructionFrameMacroAssociation("trak")?.evidenceStatus).toBe("DESCRIBED-PATTERN")});
 it("[CON-FRAME-006] preserves KREN as proposed pending owner confirmation",()=>{expect(reviewConstructionFrameMacroAssociation("KREN")?.evidenceStatus).toBe("PROPOSED-OWNER-CONFIRMATION")});
 it("[CON-FRAME-007] leaves individual consonant semantics unresolved",()=>{expect(constructionFrameMacroAssociations.every(x=>x.individualConsonantSemantics==="UNRESOLVED")).toBe(true)});
 it("[CON-FRAME-008] keeps both associations non-executable",()=>{expect(constructionFrameMacroAssociations.every(x=>x.executable===false && x.limitation.includes("macro expansion"))).toBe(true)});
 it("rejects unknown, empty and non-string lookups",()=>{expect(reviewConstructionFrameMacroAssociation("BRAN")).toBeNull();expect(reviewConstructionFrameMacroAssociation("")).toBeNull();expect(reviewConstructionFrameMacroAssociation(7)).toBeNull()});
});
