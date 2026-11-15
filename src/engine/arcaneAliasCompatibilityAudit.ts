import {bundledLexiconLoad} from "./bundledLexicon";
import {parseSurfaceExpression,type SurfaceNode} from "./surfaceParser";
import {resolveLexiconForm} from "./lexiconRegistry";

export type ArcaneAliasKind="OPERATOR"|"LEXICAL-ATOM";
export interface ArcaneAliasAuditRecord{
 legacyForm:string;preferredForm:string;gloss:string;kind:ArcaneAliasKind;sourceDecision:string;
 registryEvidence:string|null;aliasRegistered:boolean;targetEntryPresent:boolean;
 resolutionWithoutAlias:string;resolutionWithAlias:string;
 parserWithoutAlias:{ok:boolean;diagnosticCode:string|null};
 parserWithAlias:{ok:boolean;diagnosticCode:string|null;resolvedNode:string|null};
 matchesExpectedTarget:boolean;
 originalInputPreserved:true;executable:false;
}
const aliasFixtures=[
 {legacyForm:"frata",preferredForm:"fraja",kind:"OPERATOR",input:"frata ki sho to sho"},
 {legacyForm:"fraka",preferredForm:"frama",kind:"OPERATOR",input:"fraka ki sho to sho"},
 {legacyForm:"drim",preferredForm:"drum",kind:"OPERATOR",input:"drim ki sho to sho"},
 {legacyForm:"ren",preferredForm:"ben",kind:"LEXICAL-ATOM",input:"ren"},
 {legacyForm:"grak",preferredForm:"grash",kind:"OPERATOR",input:"grak ki sho"},
 {legacyForm:"kwak",preferredForm:"kwash",kind:"OPERATOR",input:"kwak ki sho"},
 {legacyForm:"dral",preferredForm:"dras",kind:"OPERATOR",input:"dral ki sho to sho gt"}
] as const;
function diagnosticCode(result:{diagnostics:{code:string}[]}):string|null{return result.diagnostics[0]?.code??null}
function resolvedNode(node:SurfaceNode|undefined):string|null{
 if(!node)return null;
 if(node.kind==="call")return node.operator;
 if(node.kind==="atom")return node.form;
 return node.kind.toUpperCase();
}
export const arcaneAliasAuditLimits={profile:"ARCANE-ALIAS-COMPATIBILITY-1.0",sourceDecision:"Phase 4 §5.1 / D-032; Phase 5.5 alias registry; Phase 5.6 audit",sourceVersion:"v5-draft + Phase 5.5 explicit alias registry",notation:"phase-6g-provisional",aliasesReviewed:7,operatorAliases:6,lexicalAliases:1,aliasOptInRequired:true,homophoneDisambiguationPerformed:false,semanticValidationPerformed:false,executable:false,canonEffect:"NONE"} as const;
export function auditArcaneAliasCompatibility():ArcaneAliasAuditRecord[]{
 const registry=bundledLexiconLoad.registry;
 return aliasFixtures.map(spec=>{
  const registered=registry.aliases.get(spec.legacyForm);
  const without=resolveLexiconForm(registry,spec.legacyForm);
  const withAlias=resolveLexiconForm(registry,spec.legacyForm,{allowLegacyAliases:true});
  const parsedWithout=parseSurfaceExpression(spec.input,{lexiconRegistry:registry});
  const parsedWith=parseSurfaceExpression(spec.input,{lexiconRegistry:registry,allowLegacyAliases:true});
  const targetEntry=registry.entries.get(spec.preferredForm);
  const node=resolvedNode(parsedWith.ast);
  const expectedNode=spec.kind==="OPERATOR"?spec.preferredForm.toUpperCase():spec.preferredForm.toUpperCase();
  return{
   legacyForm:spec.legacyForm,preferredForm:spec.preferredForm,
   gloss:targetEntry?.glosses[0]??"UNRECOVERED",
   kind:spec.kind,sourceDecision:"Phase 4 §5.1 / D-032",
   registryEvidence:registered?.evidence??null,
   aliasRegistered:registered?.preferredForm===spec.preferredForm,
   targetEntryPresent:Boolean(targetEntry),
   resolutionWithoutAlias:without.resolvedForm,
   resolutionWithAlias:withAlias.resolvedForm,
   parserWithoutAlias:{ok:parsedWithout.ok,diagnosticCode:diagnosticCode(parsedWithout)},
   parserWithAlias:{ok:parsedWith.ok,diagnosticCode:diagnosticCode(parsedWith),resolvedNode:node},
   matchesExpectedTarget:registered?.preferredForm===spec.preferredForm&&Boolean(targetEntry)&&parsedWith.ok&&node===expectedNode,
   originalInputPreserved:true as const,executable:false as const
  };
 });
}
