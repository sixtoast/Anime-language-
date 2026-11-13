import {describe,expect,it} from "vitest";
import {kSeriesExampleEvidence,reviewKSeriesExample} from "./constructionKSeriesExampleEvidence";
describe("KAN KEN KAS worked-example evidence",()=>{
 it("[CON-KSER-001] records KAN presence without inventing its rule",()=>{const r=reviewKSeriesExample("kan");expect(r.status).toBe("PRESENT-RULE-UNRESOLVED");expect(r.entry?.unresolved).toContain("No exact gloss")});
 it("[CON-KSER-002] associates KEN only with partial held-energy evidence",()=>{const r=reviewKSeriesExample("ken");expect(r.status).toBe("PARTIAL-HELD-STATE");expect(r.entry?.macroAssociation).toBe("FREM-PARTIAL")});
 it("[CON-KSER-003] associates KAS only with partial release evidence",()=>{const r=reviewKSeriesExample("kas");expect(r.status).toBe("PARTIAL-RELEASE");expect(r.entry?.macroAssociation).toBe("SHREN-PARTIAL")});
 it("[CON-KSER-004] does not infer a KAN/KEN pair rule",()=>{const a=reviewKSeriesExample("kan").entry;const e=reviewKSeriesExample("ken").entry;expect(a?.unresolved).toContain("relation to KEN");expect(e?.unresolved).toContain("one-to-one FREM expansion")});
 it("[CON-KSER-005] keeps all entries non-executable",()=>{expect(kSeriesExampleEvidence.every(item=>item.executable===false)).toBe(true)});
 it("[CON-KSER-006] rejects unrecorded forms",()=>{const r=reviewKSeriesExample("kam");expect(r.status).toBe("UNRECOGNISED");expect(r.entry).toBeNull()});
 it("[CON-KSER-007] handles empty input",()=>{expect(reviewKSeriesExample("  ").status).toBe("EMPTY")});
 it("[CON-KSER-008] normalises case and outer whitespace",()=>{expect(reviewKSeriesExample(" KAS ").status).toBe("PARTIAL-RELEASE")});
});
