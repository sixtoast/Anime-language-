export const EXPRESSION_MODIFIER_BLOCK_PROFILE = "ARCANE-MODIFIER-BLOCK-EVIDENCE-1.0" as const;
export type ModifierBlockEvidenceStatus = "CURRENT-CANON-PRINCIPLE" | "HISTORICAL-GRAMMAR-RULE" | "CURRENT-PARSER-OBSERVATION" | "UNRESOLVED";
export interface ModifierBlockEvidence { id:string; claim:string; source:string; status:ModifierBlockEvidenceStatus; boundary:string; }
export const expressionModifierBlockEvidence:readonly ModifierBlockEvidence[]=[
{id:"V3-HEAD-ARG-MOD",claim:"Current Formal Arcane surface order is HEAD + ARGUMENTS + MODIFIERS.",source:"Arcane Language v3.0-L §2",status:"CURRENT-CANON-PRINCIPLE",boundary:"Establishes broad order only; does not specify attachment target, scope resolution or modifier grammar."},
{id:"P4-G4-ATTACH",claim:"A modifier is a clause-level head attaching to the nearest preceding clause at the same block level.",source:"Phase 4 audit §6 G-4; D-038",status:"HISTORICAL-GRAMMAR-RULE",boundary:"Historical grammar decision; current v3.0-L applicability is not explicitly recovered."},
{id:"P4-G4-CLASSES",claim:"Historical modifier classes include time, requirement, control state, coupling and spatial roles.",source:"Phase 4 audit §6 G-4",status:"HISTORICAL-GRAMMAR-RULE",boundary:"Class inventory is historical evidence, not a complete current modifier lexicon or signature table."},
{id:"P4-G5-DELIMITERS",claim:"Historical IF, WHILE, UNTIL and EACH blocks open with METO and close with DOGU.",source:"Phase 4 audit §6 G-5",status:"HISTORICAL-GRAMMAR-RULE",boundary:"Do not assume every historical control form is present in current v3.0-L."},
{id:"P4-G5-PROSODY",claim:"Historical Performed speech may realise block delimiters through pitch reset and lengthening.",source:"Phase 4 audit §6 G-5",status:"HISTORICAL-GRAMMAR-RULE",boundary:"A performed-register convention; not evidence that pitch alone safely delimits every current block."},
{id:"P4-G5-OMISSION",claim:"A one-clause block may omit explicit delimiters in the historical Performed profile.",source:"Phase 4 audit §6 G-5",status:"HISTORICAL-GRAMMAR-RULE",boundary:"Scope, conditions and current applicability of omission remain unconfirmed."},
{id:"P4-G6-CONDITIONS",claim:"Historical IF fires when its whole condition becomes true; ONSET makes one inner term edge-based; WHILE continues while true; UNTIL stops when true.",source:"Phase 4 audit §6 G-6",status:"HISTORICAL-GRAMMAR-RULE",boundary:"These are historical control semantics; exact current operator inventory and surface forms remain separate."},
{id:"V3-CONTROL-INVENTORY",claim:"Current v3.0-L §9 lists GRAN, GRAT, GRAK, BEK and ZET as logic/control operators.",source:"Arcane Language v3.0-L §9",status:"CURRENT-CANON-PRINCIPLE",boundary:"The current list does not by itself recover block syntax, EACH/UNTIL forms or ONSET semantics."},
{id:"PARSER-MODIFIER-GAP",claim:"The Phase 6G SurfaceNode union has no dedicated modifier or clause-attachment node.",source:"src/engine/surfaceParser.ts",status:"CURRENT-PARSER-OBSERVATION",boundary:"Implementation gap observation only; not a claim that no future representation can encode modifiers."},
{id:"PARSER-BLOCK-SUPPORT",claim:"The Phase 6G parser has provisional METO/DOGU block parsing for its CONTROL set.",source:"src/engine/surfaceParser.ts",status:"CURRENT-PARSER-OBSERVATION",boundary:"This is parser-specific provisional behaviour, not canon validation or a complete historical/current control grammar."},
{id:"NESTING-SCOPE",claim:"Abstract nested-expression notation does not specify how a modifier attaches to an outer expression versus a nested argument.",source:"Phase 2 §1 and §4; Phase 4 §6 G-4",status:"UNRESOLVED",boundary:"Current spoken modifier scope and the mapping between nested expression and clause/block levels are not recovered."},
{id:"VERSION-BOUNDARY",claim:"Phase 4 D-038 records G-1 to G-6 as decided in its historical profile; v3.0-L remains a distinct current language specification.",source:"Phase 4 Table 16 D-038; Arcane Language v3.0-L",status:"HISTORICAL-GRAMMAR-RULE",boundary:"No automatic promotion, merger or parser rewrite is authorised by this reconciliation."}
] as const;
export interface ModifierBlockReview {profile:typeof EXPRESSION_MODIFIER_BLOCK_PROFILE;evidence:readonly ModifierBlockEvidence[];recoveredHistoricalRules:string[];currentPrinciples:string[];implementationGaps:string[];unresolved:string[];canonEffect:"NONE";parserChanged:false;executable:false;}
export function reviewExpressionModifierBlocks():ModifierBlockReview{return{
profile:EXPRESSION_MODIFIER_BLOCK_PROFILE,
evidence:expressionModifierBlockEvidence,
recoveredHistoricalRules:[
"Modifiers attach to the nearest preceding clause at the same block level in the Phase 4 grammar.",
"Phase 4 lists five modifier classes: time, requirement, control state, coupling and spatial roles.",
"Phase 4 blocks use METO and DOGU in the historical grammar.",
"Phase 4 records pitch reset and lengthening as performed-speech block-boundary cues.",
"Phase 4 permits omission of delimiters for a one-clause block in its historical Performed profile.",
"Phase 4 distinguishes IF, ONSET, WHILE and UNTIL condition behaviour."
],
currentPrinciples:["v3.0-L specifies HEAD + ARGUMENTS + MODIFIERS ordering.","v3.0-L §9 lists a narrower named logic/control inventory.","v3.0-L §14 describes prosodic phrase-boundary cues, but does not explicitly equate them with Phase 4 block delimiters."],
implementationGaps:["The provisional SurfaceNode AST has no dedicated modifier/clause-attachment node.","The provisional parser does not implement Phase 4 G-4 nearest-same-level modifier attachment.","The parser's CONTROL set is a provisional subset and does not implement the full historical IF/WHILE/UNTIL/EACH inventory."],
unresolved:["Whether Phase 4 G-4/G-5/G-6 remain normative in current v3.0-L.","How current spoken syntax distinguishes outer modifiers from nested-argument modifiers.","Whether performed pitch reset/lengthening and one-clause omission remain valid in the current register.","How current BEK/ZET blocks, historical EACH/UNTIL and ONSET map across versions.","How modifiers attach to Construction phrases without conflating expression and Construction layers."],
canonEffect:"NONE",parserChanged:false,executable:false
};}
