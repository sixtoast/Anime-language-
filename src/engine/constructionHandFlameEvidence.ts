/** Phase 8AS: source-bounded structural reading of the Phase 4 hand-flame example.
 * This is an evidence display model, not a parser, compiler, or physical simulator.
 */
export type HandFlameEvidence = "EXAMPLE-BACKED" | "PARTIAL-EXAMPLE" | "UNRESOLVED";
export interface HandFlameSegment {
  id:string;
  tokens:readonly string[];
  surface:string;
  evidence:HandFlameEvidence;
  sourceReading:string;
  unresolved:string;
}
export const handFlameSourceSequence = "mel · po da za shi to za ma · kan ken · he ha · sa shi za se · kas";
export const handFlameSegments:readonly HandFlameSegment[] = [
 {id:"reference",tokens:["mel"],surface:"mel",evidence:"EXAMPLE-BACKED",sourceReading:"Phase 5.15 identifies mel as me + anchor coda l in this example, with MI surface scope anchored to the hand.",unresolved:"The general landmark system, anchor-coda inventory and productive MEL construction rule are not recovered."},
 {id:"configuration-a",tokens:["po","da","za","shi","to","za","ma"],surface:"po da za shi to za ma",evidence:"UNRESOLVED",sourceReading:"The token sequence is recorded in the worked example.",unresolved:"The matrices do not provide a complete token-by-token semantic parse, Foot segmentation or spatial binding for this run."},
 {id:"maintenance",tokens:["kan","ken"],surface:"kan ken",evidence:"PARTIAL-EXAMPLE",sourceReading:"The example associates ken with a held-energy state; KAN/KEN general rules are unavailable.",unresolved:"KAN's exact rule, KEN's general signature, target binding, magnitude and termination conditions are not recovered."},
 {id:"coupling",tokens:["he","ha"],surface:"he ha",evidence:"PARTIAL-EXAMPLE",sourceReading:"The H-series are heavy coupling syllables; he/ha occur in the example.",unresolved:"The physical/domain mapping is provisional; coupling order, participants, vector, magnitude and resource cost are not established."},
 {id:"configuration-b",tokens:["sa","shi","za","se"],surface:"sa shi za se",evidence:"UNRESOLVED",sourceReading:"The token sequence is recorded in the worked example.",unresolved:"No complete token-by-token semantic parse, Foot segmentation or spatial binding is supplied."},
 {id:"release",tokens:["kas"],surface:"kas",evidence:"PARTIAL-EXAMPLE",sourceReading:"The example associates kas with release; SHREN is glossed Release at macro level.",unresolved:"The relationship between KAS and SHREN is not a recovered expansion or universal release signature; target and safety conditions are absent."}
] as const;
export interface HandFlameAudit {
 validSurface:boolean;
 segments:readonly HandFlameSegment[];
 tokenCount:number;
 segmentCount:number;
 evidenceCounts:Readonly<Record<HandFlameEvidence,number>>;
 executable:false;
 canonEffect:"NONE";
 limitations:readonly string[];
}
const LIMITATIONS = [
 "The sequence is tokenised but not fully parsed.",
 "Energy magnitude, extent and matter-coupling parameters are unspecified in the source matrix.",
 "No feasibility check or physical execution is established.",
 "The display preserves the source grouping; it does not infer stage boundaries or grammar."
] as const;
export function auditHandFlameSurface(value:unknown):HandFlameAudit {
 const validSurface=typeof value==="string" && value.trim()===handFlameSourceSequence;
 const counts:Record<HandFlameEvidence,number>={"EXAMPLE-BACKED":0,"PARTIAL-EXAMPLE":0,"UNRESOLVED":0};
 for(const segment of handFlameSegments) counts[segment.evidence]+=1;
 return {validSurface,segments:handFlameSegments,tokenCount:handFlameSegments.reduce((n,s)=>n+s.tokens.length,0),segmentCount:handFlameSegments.length,evidenceCounts:counts,executable:false,canonEffect:"NONE",limitations:LIMITATIONS};
}
export function findHandFlameSegment(id:unknown):HandFlameSegment|null {
 if(typeof id!=="string") return null;
 return handFlameSegments.find(segment=>segment.id===id)??null;
}
