import{describe,expect,it}from"vitest";
import{FORMAL_VERB_FOOT_ALIAS_PROFILE,formalVerbFootAliases,formalAliasArchitectureBoundary,reviewFormalVerbFootAlias}from"./formalVerbFootAliasEvidence";
describe("Phase 8DJ formal verb-to-Foot alias evidence",()=>{
it("[ALIAS-FOOT-001] exposes six formal alias records",()=>{expect(FORMAL_VERB_FOOT_ALIAS_PROFILE).toContain("ALIASES");expect(formalVerbFootAliases).toHaveLength(6)});
it("[ALIAS-FOOT-002] separates formal aliases from Expression AST heads",()=>{expect(formalAliasArchitectureBoundary.expressionSystem).toContain("typed prefix");expect(formalAliasArchitectureBoundary.formalAliasRole).toContain("common Foot patterns")});
it("[ALIAS-FOOT-003] records TRAK discrete-change frame group",()=>{const x=reviewFormalVerbFootAlias("TRAK");expect(x?.pattern).toEqual(["p","t","k"]);expect(x?.recoveredMeaning).toContain("discrete change")});
it("[ALIAS-FOOT-004] keeps KREN proposed",()=>expect(reviewFormalVerbFootAlias("KREN")?.status).toBe("PROPOSED-OWNER-CONFIRMATION"));
it("[ALIAS-FOOT-005] maps FREM m/n to open-loop maintenance",()=>expect(reviewFormalVerbFootAlias("FREM")?.recoveredMeaning).toContain("open-loop"));
it("[ALIAS-FOOT-006] maps FREM ng to feedback maintenance",()=>expect(reviewFormalVerbFootAlias("FREM")?.pattern).toContain("ng"));
it("[ALIAS-FOOT-007] maps SHREN s/sh to release",()=>{const x=reviewFormalVerbFootAlias("SHREN");expect(x?.pattern).toEqual(["s","sh"]);expect(x?.recoveredMeaning).toContain("release")});
it("[ALIAS-FOOT-008] records six BRAN heavy H-series forms",()=>expect(reviewFormalVerbFootAlias("BRAN")?.pattern).toEqual(["hə","he","ha","hu","hi","ho"]));
it("[ALIAS-FOOT-009] keeps BRAN physical mapping provisional",()=>expect(reviewFormalVerbFootAlias("BRAN")?.status).toBe("PATTERN-EXPLICIT-PHYSICAL-MAPPING-PROVISIONAL"));
it("[ALIAS-FOOT-010] keeps VARE a modifier and not a Foot",()=>{const x=reviewFormalVerbFootAlias("VARE");expect(x?.patternKind).toBe("REQUIREMENT-MODIFIER");expect(x?.status).toBe("EXPLICIT-MODIFIER-NOT-FOOT")});
it("[ALIAS-FOOT-011] records Macro Transparency Law without an invented expansion",()=>{expect(formalAliasArchitectureBoundary.formalAliasRole).toContain("Macro Transparency Law");expect(formalVerbFootAliases.every(x=>!x.exactExpansionRecovered)).toBe(true)});
it("[ALIAS-FOOT-012] does not invent macro signatures",()=>expect(formalVerbFootAliases.every(x=>!x.signatureRecovered)).toBe(true));
it("[ALIAS-FOOT-013] returns null for unknown aliases",()=>expect(reviewFormalVerbFootAlias("FRAPA")).toBeNull());
it("[ALIAS-FOOT-014] keeps compiler and execution disabled",()=>{expect(formalAliasArchitectureBoundary.compilerEnabled).toBe(false);expect(formalAliasArchitectureBoundary.executionEnabled).toBe(false);expect(formalVerbFootAliases.every(x=>!x.executable)).toBe(true)});
});
