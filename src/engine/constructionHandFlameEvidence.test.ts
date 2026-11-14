import {describe,expect,it} from "vitest";
import {auditHandFlameSurface,findHandFlameSegment,handFlameSegments,handFlameSourceSequence} from "./constructionHandFlameEvidence";
describe("Phase 4 hand-flame evidence model",()=>{
 it("[CON-HF-001] preserves the exact source sequence",()=>{expect(handFlameSourceSequence).toBe("mel · po da za shi to za ma · kan ken · he ha · sa shi za se · kas");expect(auditHandFlameSurface(handFlameSourceSequence).validSurface).toBe(true)});
 it("[CON-HF-002] rejects changed, trimmed or non-string surfaces",()=>{expect(auditHandFlameSurface(handFlameSourceSequence+" kas").validSurface).toBe(false);expect(auditHandFlameSurface(" "+handFlameSourceSequence).validSurface).toBe(false);expect(auditHandFlameSurface(null).validSurface).toBe(false)});
 it("[CON-HF-003] preserves six source groups in order",()=>{expect(handFlameSegments.map(s=>s.id)).toEqual(["reference","configuration-a","maintenance","coupling","configuration-b","release"])});
 it("[CON-HF-004] records mel as example-backed reference",()=>{expect(findHandFlameSegment("reference")?.sourceReading).toContain("me + anchor coda l")});
 it("[CON-HF-005] does not invent semantics for first configuration group",()=>{expect(findHandFlameSegment("configuration-a")?.evidence).toBe("UNRESOLVED")});
 it("[CON-HF-006] keeps KAN/KEN partial and distinguishes their uncertainty",()=>{const s=findHandFlameSegment("maintenance");expect(s?.evidence).toBe("PARTIAL-EXAMPLE");expect(s?.unresolved).toContain("KAN's exact rule")});
 it("[CON-HF-007] records he/ha as example H-series forms only",()=>{const s=findHandFlameSegment("coupling");expect(s?.tokens).toEqual(["he","ha"]);expect(s?.unresolved).toContain("provisional")});
 it("[CON-HF-008] does not invent semantics for second configuration group",()=>{expect(findHandFlameSegment("configuration-b")?.evidence).toBe("UNRESOLVED")});
 it("[CON-HF-009] keeps KAS example-bounded",()=>{expect(findHandFlameSegment("release")?.unresolved).toContain("not a recovered expansion")});
 it("[CON-HF-010] counts all 18 tokens without changing grouping",()=>{const a=auditHandFlameSurface(handFlameSourceSequence);expect(a.tokenCount).toBe(18);expect(a.segmentCount).toBe(6)});
 it("[CON-HF-011] reports evidence counts without promoting uncertainty",()=>{expect(auditHandFlameSurface(handFlameSourceSequence).evidenceCounts).toEqual({"EXAMPLE-BACKED":1,"PARTIAL-EXAMPLE":3,"UNRESOLVED":2})});
 it("[CON-HF-012] exposes unknown segment lookup as null",()=>{expect(findHandFlameSegment("unknown")).toBeNull();expect(findHandFlameSegment(undefined)).toBeNull()});
 it("[CON-HF-013] remains non-executable and has no canon effect",()=>{expect(auditHandFlameSurface(handFlameSourceSequence)).toMatchObject({executable:false,canonEffect:"NONE"})});
 it("[CON-HF-014] states parsing and feasibility limitations",()=>{expect(auditHandFlameSurface(handFlameSourceSequence).limitations.join(" ")).toContain("not fully parsed");expect(auditHandFlameSurface(handFlameSourceSequence).limitations.join(" ")).toContain("feasibility")});
});
