/** Phase 8AV: evidence model of the archived Phase 5.22 hand-flame parse tree.
 * It records the six fixture slots, not a reusable Construction parser.
 */
export const constructionFixtureProfile = {
  id:"PHASE-5.22-HAND-FLAME",
  source:"Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_22_Report.md",
  parserSha256:"8041e7e40cd6e152aa9d38982e2a8986515a1aa7bc315dbfc1e7065e72ee2905",
  exactSurface:"mel · po da za shi to za ma · kan ken · he ha · sa shi za se · kas",
  phraseCount:6,
  boundary:"Middle dots are required phrase boundaries in this fixture profile.",
  generalGrammar:false,
  physicalFeasibility:false,
  canonEffect:"NONE"
} as const;
export interface ConstructionFixturePhrase {
  index:number;
  id:string;
  surface:string;
  tokens:readonly string[];
  nodeType:string;
  reading:string;
  evidence:"FIXTURE-READ"|"EXAMPLE-LEVEL"|"PROVISIONAL";
  unresolved:readonly string[];
}
export const constructionFixtureParseTree:readonly ConstructionFixturePhrase[] = [
 {index:1,id:"anchor",surface:"mel",tokens:["mel"],nodeType:"AnchorReference",reading:"Anchor token; Phase 5.15 associates the example with me + anchor coda l and MI surface scope anchored to the hand.",evidence:"EXAMPLE-LEVEL",unresolved:["General landmark inventory and geometry","Productive anchor-coda morphology","Whether other anchors follow the same pattern"]},
 {index:2,id:"position",surface:"po da za shi to za ma",tokens:["po","da","za","shi","to","za","ma"],nodeType:"Position",reading:"Role po = position; axis da = +Y; quantity za-shi-to-za-ma = 0.2 metre.",evidence:"FIXTURE-READ",unresolved:["General spatial-role and vector grammar","Coordinate frame and origin","Quantity attachment outside this fixture"]},
 {index:3,id:"feet",surface:"kan ken",tokens:["kan","ken"],nodeType:"ConstructionFootSequence",reading:"Two documented example Foot tokens; kan is listed as alias TRAK ENRA and ken as FREM / structure held.",evidence:"EXAMPLE-LEVEL",unresolved:["Foot internal morphology and coda segmentation","General macro expansion and arity","Targets, magnitude and termination conditions"]},
 {index:4,id:"couplings",surface:"he ha",tokens:["he","ha"],nodeType:"CouplingSequence",reading:"H-series heavy coupling tokens; he matter/mechanical-or-chemical and ha energy/thermal are explicitly provisional domain labels.",evidence:"PROVISIONAL",unresolved:["Participant types and cardinality","Order, direction and coupling vector","Physical mapping, magnitude and resource cost"]},
 {index:5,id:"duration",surface:"sa shi za se",tokens:["sa","shi","za","se"],nodeType:"Duration",reading:"Quantity sa-shi-za-se = 5.0 seconds under the fixture digit/unit tables.",evidence:"FIXTURE-READ",unresolved:["General duration grammar and unit policy","Whether this quantity binds to a stage, coupling or whole construction","Timing semantics and runtime behaviour"]},
 {index:6,id:"release",surface:"kas",tokens:["kas"],nodeType:"Release",reading:"KAS is listed as an example-level alias of SHREN / release.",evidence:"EXAMPLE-LEVEL",unresolved:["General release signature and target","Safety/interlock conditions","Post-release state and resource accounting"]}
] as const;
export interface ConstructionFixtureTreeAudit {
  accepted:boolean;
  phraseCount:number;
  tokenCount:number;
  tree:typeof constructionFixtureParseTree;
  profile:typeof constructionFixtureProfile;
  executable:false;
  canonEffect:"NONE";
  reason:"EXACT-FIXTURE-MATCH"|"NOT-EXACT-FIXTURE";
}
export function auditConstructionFixtureParseTree(value:unknown):ConstructionFixtureTreeAudit {
 const accepted=typeof value==="string" && value.trim()===constructionFixtureProfile.exactSurface;
 return {
  accepted,phraseCount:constructionFixtureParseTree.length,
  tokenCount:constructionFixtureParseTree.reduce((n,p)=>n+p.tokens.length,0),
  tree:constructionFixtureParseTree,profile:constructionFixtureProfile,
  executable:false,canonEffect:"NONE",
  reason:accepted?"EXACT-FIXTURE-MATCH":"NOT-EXACT-FIXTURE"
 };
}
