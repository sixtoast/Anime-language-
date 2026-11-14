import {describe,expect,it} from "vitest";
import {auditConstructionFixtureParseTree,constructionFixtureParseTree,constructionFixtureProfile} from "./constructionParseTreeContract";
const surface=constructionFixtureProfile.exactSurface;
describe("Phase 8AV historical Construction parse-tree contract",()=>{
 it("[CON-PTREE-001] preserves six exact historical phrase boundaries",()=>{expect(constructionFixtureParseTree).toHaveLength(6);expect(constructionFixtureParseTree.map(x=>x.surface).join(" · ")).toBe(surface);expect(constructionFixtureParseTree.reduce((n,x)=>n+x.tokens.length,0)).toBe(17)});
 it("[CON-PTREE-002] records MEL as anchor without overclaiming",()=>{const n=constructionFixtureParseTree[0];expect(n.id).toBe("anchor");expect(n.tokens).toEqual(["mel"]);expect(n.reading).toContain("anchor coda l");expect(n.unresolved.length).toBeGreaterThan(0)});
 it("[CON-PTREE-003] types position role and axis",()=>{const n=constructionFixtureParseTree[1];expect(n.nodeType).toBe("Position");expect(n.tokens.slice(0,2)).toEqual(["po","da"]);expect(n.reading).toContain("+Y")});
 it("[CON-PTREE-004] retains the exact 0.2 metre position quantity",()=>{expect(constructionFixtureParseTree[1].reading).toContain("0.2 metre");expect(constructionFixtureParseTree[1].tokens.slice(2)).toEqual(["za","shi","to","za","ma"])});
 it("[CON-PTREE-005] preserves KAN KEN without expanding them",()=>{const n=constructionFixtureParseTree[2];expect(n.tokens).toEqual(["kan","ken"]);expect(n.nodeType).toBe("ConstructionFootSequence");expect(n.unresolved.some(x=>x.includes("morphology"))).toBe(true)});
 it("[CON-PTREE-006] preserves provisional HE HA coupling labels",()=>{const n=constructionFixtureParseTree[3];expect(n.tokens).toEqual(["he","ha"]);expect(n.evidence).toBe("PROVISIONAL");expect(n.unresolved.length).toBeGreaterThan(0)});
 it("[CON-PTREE-007] retains the exact 5.0 seconds duration",()=>{const n=constructionFixtureParseTree[4];expect(n.nodeType).toBe("Duration");expect(n.tokens).toEqual(["sa","shi","za","se"]);expect(n.reading).toContain("5.0 seconds")});
 it("[CON-PTREE-008] preserves KAS as example-level release",()=>{const n=constructionFixtureParseTree[5];expect(n.tokens).toEqual(["kas"]);expect(n.evidence).toBe("EXAMPLE-LEVEL");expect(n.unresolved.length).toBeGreaterThan(0)});
 it("[CON-PTREE-009] only accepts the exact six-phrase fixture",()=>{expect(auditConstructionFixtureParseTree(surface).accepted).toBe(true);expect(auditConstructionFixtureParseTree(surface.replace(" · "," ")).accepted).toBe(false);expect(auditConstructionFixtureParseTree(surface+" · extra").accepted).toBe(false)});
 it("[CON-PTREE-010] remains non-executable and canon-neutral",()=>{const a=auditConstructionFixtureParseTree(surface);expect(a).toMatchObject({phraseCount:6,tokenCount:17,executable:false,canonEffect:"NONE",reason:"EXACT-FIXTURE-MATCH"});expect(a.profile.generalGrammar).toBe(false);expect(a.profile.physicalFeasibility).toBe(false)});
});
