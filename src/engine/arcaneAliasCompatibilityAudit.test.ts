import{describe,expect,it}from"vitest";
import{auditArcaneAliasCompatibility,arcaneAliasAuditLimits}from"./arcaneAliasCompatibilityAudit";
import{bundledLexiconLoad}from"./bundledLexicon";
describe("Phase 8CY-P Arcane alias compatibility audit",()=>{
 const records=auditArcaneAliasCompatibility();
 it("[ALIAS-AUDIT-001] covers the seven Phase 4 alias decisions",()=>expect(records.map(x=>[x.legacyForm,x.preferredForm])).toEqual([["frata","fraja"],["fraka","frama"],["drim","drum"],["ren","ben"],["grak","grash"],["kwak","kwash"],["dral","dras"]]));
 it("[ALIAS-AUDIT-002] confirms all seven aliases against the explicit registry",()=>expect(records.every(x=>x.aliasRegistered)).toBe(true));
 it("[ALIAS-AUDIT-003] confirms all preferred lexicon targets exist",()=>expect(records.every(x=>x.targetEntryPresent)).toBe(true));
 it("[ALIAS-AUDIT-004] requires explicit alias opt-in",()=>expect(records.every(x=>x.resolutionWithoutAlias===x.legacyForm&&x.resolutionWithAlias===x.preferredForm)).toBe(true));
 it("[ALIAS-AUDIT-005] parses all six preferred operator forms after alias resolution",()=>expect(records.filter(x=>x.kind==="OPERATOR").every(x=>x.parserWithAlias.ok&&x.parserWithAlias.resolvedNode===x.preferredForm.toUpperCase())).toBe(true));
 it("[ALIAS-AUDIT-006] resolves REN to the lexical atom BEN, not an operator",()=>{const x=records.find(x=>x.legacyForm==="ren")!;expect(x.kind).toBe("LEXICAL-ATOM");expect(x.parserWithAlias.resolvedNode).toBe("BEN")});
 it("[ALIAS-AUDIT-007] does not parse legacy operator forms without alias resolution",()=>expect(records.filter(x=>x.kind==="OPERATOR").every(x=>!x.parserWithoutAlias.ok)).toBe(true));
 it("[ALIAS-AUDIT-008] preserves the source glosses from preferred entries",()=>expect(records.every(x=>x.gloss!=="UNRECOVERED")).toBe(true));
 it("[ALIAS-AUDIT-009] retains the RE and RA homophone collisions",()=>{expect(bundledLexiconLoad.registry.collisions.has("re")).toBe(true);expect(bundledLexiconLoad.registry.collisions.has("ra")).toBe(true)});
 it("[ALIAS-AUDIT-010] labels the audit provisional and non-executable",()=>expect(arcaneAliasAuditLimits).toMatchObject({notation:"phase-6g-provisional",aliasesReviewed:7,operatorAliases:6,lexicalAliases:1,executable:false,canonEffect:"NONE"}));
});
