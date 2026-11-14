/** Phase 8AS/8AT: source-bounded and historical fixture reading of the Phase 4 hand-flame example.
 * This is an evidence display model, not a parser, compiler, or physical simulator.
 */
export type HandFlameEvidence = "EXAMPLE-BACKED" | "PARTIAL-EXAMPLE" | "ARCHIVED-FIXTURE-PARSE" | "UNRESOLVED";
export interface HandFlameSegment {
  id:string;
  tokens:readonly string[];
  surface:string;
  evidence:HandFlameEvidence;
  sourceReading:string;
  unresolved:string;
  parseScope:"PHASE4-EXAMPLE-ONLY"|"PHASE5.22-FIXTURE-ONLY"|"NOT-PARSED";
}
export const handFlameSourceSequence = "mel · po da za shi to za ma · kan ken · he ha · sa shi za se · kas";
export const handFlameSegments:readonly HandFlameSegment[] = [
 {id:"reference",tokens:["mel"],surface:"mel",evidence:"EXAMPLE-BACKED",sourceReading:"Phase 5.15 identifies mel as me + anchor coda l in this example, with MI surface scope anchored to the hand.",unresolved:"The general landmark system, anchor-coda inventory and productive MEL construction rule are not recovered.",parseScope:"PHASE4-EXAMPLE-ONLY"},
 {id:"configuration-a",tokens:["po","da","za","shi","to","za","ma"],surface:"po da za shi to za ma",evidence:"ARCHIVED-FIXTURE-PARSE",sourceReading:"The archived Phase 5.22 bounded parser reads this phrase as a position role, +Y axis and metre-closed quantity. This is a fixture-specific parse, not a general construction grammar.",unresolved:"The full spatial role/vector grammar and general quantity attachment rules are not established by this one fixture.",parseScope:"PHASE5.22-FIXTURE-ONLY"},
 {id:"maintenance",tokens:["kan","ken"],surface:"kan ken",evidence:"PARTIAL-EXAMPLE",sourceReading:"The Phase 5.22 parser records KAN as an example-level alias of TRAK ENRA and KEN as FREM / structure held. The Phase 5.15 matrix separately associates KEN with a held-energy state.",unresolved:"These are fixture-level associations, not universal expansions or complete signatures; target binding, magnitude and termination conditions remain open.",parseScope:"PHASE5.22-FIXTURE-ONLY"},
 {id:"coupling",tokens:["he","ha"],surface:"he ha",evidence:"PARTIAL-EXAMPLE",sourceReading:"The archived Phase 5.22 parser labels HE as matter/mechanical-or-chemical domain and HA as energy/thermal domain, explicitly provisional; both are H-series heavy coupling syllables.",unresolved:"The physical/domain mapping is provisional; coupling order, participants, vector, magnitude and resource cost are not established.",parseScope:"PHASE5.22-FIXTURE-ONLY"},
 {id:"configuration-b",tokens:["sa","shi","za","se"],surface:"sa shi za se",evidence:"ARCHIVED-FIXTURE-PARSE",sourceReading:"The archived Phase 5.22 bounded parser reads this phrase as a duration quantity in seconds.",unresolved:"This does not establish the general syntax, units, timing semantics or quantity-stage contract beyond the documented fixture.",parseScope:"PHASE5.22-FIXTURE-ONLY"},
 {id:"release",tokens:["kas"],surface:"kas",evidence:"PARTIAL-EXAMPLE",sourceReading:"The archived Phase 5.22 parser records KAS as an example-level alias of SHREN / release.",unresolved:"This is not a universal SHREN expansion or general release signature; target and safety conditions remain absent.",parseScope:"PHASE5.22-FIXTURE-ONLY"}
] as const;
export const handFlameHistoricalParserEvidence = {
 archiveMember:"Arcane_Phase_6S_Typed_Expression_Integration/arcane_phase_5_22_parser.py",
 parserSha256:"8041e7e40cd6e152aa9d38982e2a8986515a1aa7bc315dbfc1e7065e72ee2905",
 reportMember:"Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_22_Report.md",
 resultsMember:"Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_22_Results.json",
 reportedTests:{passed:17,failed:0,total:17},
 status:"ARCHIVED-RESULT-REPORTED-NOT-RERUN",
 scope:"One exact six-phrase hand-flame fixture; not the general Construction grammar.",
 limits:["No physical feasibility evaluation.","The archived parser is not the current website runtime and has not been rerun in this phase."]
} as const;
export interface HandFlameAudit {
 validSurface:boolean;
 segments:readonly HandFlameSegment[];
 tokenCount:number;
 segmentCount:number;
 evidenceCounts:Readonly<Record<HandFlameEvidence,number>>;
 historicalParser:typeof handFlameHistoricalParserEvidence;
 executable:false;
 canonEffect:"NONE";
 limitations:readonly string[];
}
const LIMITATIONS = [
 "An archived Phase 5.22 parser reports a bounded parse for this exact fixture; this evidence model does not implement that parser or generalise its grammar.",
 "Energy magnitude, extent and matter-coupling parameters are unspecified in the source matrix.",
 "No feasibility check or physical execution is established.",
 "The display preserves source grouping and marks Phase 5.22 fixture-only interpretations separately from general grammar."
] as const;
export function auditHandFlameSurface(value:unknown):HandFlameAudit {
 const validSurface=typeof value==="string" && value.trim()===handFlameSourceSequence;
 const counts:Record<HandFlameEvidence,number>={"EXAMPLE-BACKED":0,"PARTIAL-EXAMPLE":0,"ARCHIVED-FIXTURE-PARSE":0,"UNRESOLVED":0};
 for(const segment of handFlameSegments) counts[segment.evidence]+=1;
 return {validSurface,segments:handFlameSegments,tokenCount:handFlameSegments.reduce((n,s)=>n+s.tokens.length,0),segmentCount:handFlameSegments.length,evidenceCounts:counts,historicalParser:handFlameHistoricalParserEvidence,executable:false,canonEffect:"NONE",limitations:LIMITATIONS};
}
export function findHandFlameSegment(id:unknown):HandFlameSegment|null {
 if(typeof id!=="string") return null;
 return handFlameSegments.find(segment=>segment.id===id)??null;
}
