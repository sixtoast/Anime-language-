import {describe,expect,it} from "vitest";
import {handFlameConstructionExample as example} from "./constructionWorkedExampleEvidence";
describe("Phase 4 hand-flame Construction evidence",()=>{
 it("[CON-WORKED-001] preserves the source sequence and all six dot-delimited chunks",()=>{expect(example.sourceSequence).toBe("mel · po da za shi to za ma · kan ken · he ha · sa shi za se · kas");expect(example.chunks).toHaveLength(6)});
 it("[CON-WORKED-002] records MEL as example-backed fused reference evidence",()=>{expect(example.chunks[0].sourceText).toBe("mel");expect(example.chunks[0].interpretation).toContain("me + anchor coda l");expect(example.chunks[0].unresolved).toContain("landmark")});
 it("[CON-WORKED-003] does not invent token glosses for the second and fifth chunks",()=>{expect(example.chunks[1].evidenceStatus).toBe("UNRESOLVED");expect(example.chunks[4].evidenceStatus).toBe("UNRESOLVED")});
 it("[CON-WORKED-004] keeps KAN/KEN semantics partial and asymmetric",()=>{expect(example.chunks[2].evidenceStatus).toBe("PARTIAL-EXAMPLE");expect(example.chunks[2].interpretation).toContain("held energy state");expect(example.chunks[2].interpretation).toContain("KAN")});
 it("[CON-WORKED-005] keeps H-series glosses separate from executable coupling",()=>{expect(example.chunks[3].evidenceStatus).toBe("PROVISIONAL");expect(example.chunks[3].unresolved).toContain("Participant order")});
 it("[CON-WORKED-006] records KAS release only as partial example evidence",()=>{expect(example.chunks[5].evidenceStatus).toBe("PARTIAL-EXAMPLE");expect(example.chunks[5].interpretation).toContain("release")});
 it("[CON-WORKED-007] does not claim stage mapping, complete parsing or feasibility",()=>{expect(example.limits.some(x=>x.includes("chunk-to-stage mapping is not asserted"))).toBe(true);expect(example.limits.some(x=>x.includes("not fully parsed"))).toBe(true);expect(example.limits.some(x=>x.includes("feasibility"))).toBe(true)});
});
