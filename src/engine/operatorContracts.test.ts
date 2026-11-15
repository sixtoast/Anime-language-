import{describe,expect,it}from"vitest";import{getOperatorContract,operatorContractAliases}from"./operatorContracts";import{bundledLexiconLoad}from"./bundledLexicon";
describe("Phase 8CY-Q preferred operator contract aliases",()=>{
it("[OPCON-ALIAS-001] maps FRAJA to the provisional FRATA contract",()=>expect(getOperatorContract("FRAJA")).toMatchObject({operator:"FRAJA",arity:2,arityStatus:"provisional-audit-signature"}));
it("[OPCON-ALIAS-002] maps FRAMA to the provisional FRAKA contract",()=>expect(getOperatorContract("FRAMA")).toMatchObject({operator:"FRAMA",arity:2,arityStatus:"provisional-audit-signature"}));
it("[OPCON-ALIAS-003] maps DRUM to the provisional DRIM contract",()=>expect(getOperatorContract("DRUM")).toMatchObject({operator:"DRUM",arity:2,arityStatus:"provisional-audit-signature"}));
it("[OPCON-ALIAS-004] maps DRAS to the provisional DRAL contract",()=>expect(getOperatorContract("DRAS")).toMatchObject({operator:"DRAS",arity:3,arityStatus:"provisional-audit-signature"}));
it("[OPCON-ALIAS-005] maps GRASH to the unresolved GRAK contract",()=>expect(getOperatorContract("GRASH")).toMatchObject({operator:"GRASH",arity:null,arityStatus:"unresolved"}));
it("[OPCON-ALIAS-006] maps KWASH to the unresolved KWAK contract",()=>expect(getOperatorContract("KWASH")).toMatchObject({operator:"KWASH",arity:null,arityStatus:"unresolved"}));
it("[OPCON-ALIAS-007] aligns all six preferred mappings with the explicit lexicon alias registry",()=>{for(const a of operatorContractAliases)expect(bundledLexiconLoad.registry.aliases.get(a.phase2Form.toLowerCase())?.preferredForm).toBe(a.preferredForm.toLowerCase())});
it("[OPCON-ALIAS-008] retains legacy contracts and excludes REN as an operator",()=>{expect(getOperatorContract("FRATA")?.operator).toBe("FRATA");expect(getOperatorContract("REN")).toBeUndefined()});
it("[OPCON-ALIAS-009] adds provenance without closing signature questions",()=>{const c=getOperatorContract("FRAJA")!;expect(c.source.some(x=>x.includes("Phase 4 §5.1"))).toBe(true);expect(c.inputTypes).toBeNull();expect(c.outputType).toBeNull();expect(c.arityStatus).toBe("provisional-audit-signature")});
});