import{describe,expect,it}from"vitest";
import{constructionFootSourceClaims,constructionFootPrimaryAuthority,constructionFootConflictAdjudication,reviewConstructionFootSourceAdjudication}from"./constructionFootSourceAdjudication";
describe("Phase 8BY Foot-coda source provenance adjudication",()=>{
it("[CON-FOOT-PROV-001] preserves both conflicting summary claims",()=>{expect(constructionFootSourceClaims.map(x=>x.status)).toEqual(["CVC-REQUIRED","CODA-OPTIONAL"])});
it("[CON-FOOT-PROV-002] records both as secondary recovery matrices",()=>{expect(constructionFootSourceClaims.every(x=>x.sourceKind==="SECONDARY-RECOVERY-MATRIX")).toBe(true)});
it("[CON-FOOT-PROV-003] identifies the Phase 4 DOCX as primary authority",()=>{expect(constructionFootPrimaryAuthority.source).toContain("Arcane_Language_Audit_Phase_4.docx")});
it("[CON-FOOT-PROV-004] does not claim full primary-source inspection",()=>{expect(constructionFootPrimaryAuthority.fullBodyInspection).toBe("NOT-COMPLETED")});
it("[CON-FOOT-PROV-005] assigns no precedence to either summary",()=>{expect(constructionFootConflictAdjudication.precedence).toBe("NOT-ASSIGNED")});
it("[CON-FOOT-PROV-006] requires inspection of cited primary sections",()=>{expect(constructionFootConflictAdjudication.nextEvidenceRequired[0]).toContain("§§3.1 and 10")});
it("[CON-FOOT-PROV-007] does not promote either morphology rule",()=>{const r=reviewConstructionFootSourceAdjudication();expect(r.status).toBe("CONFLICT-OPEN");expect(r.primarySourceInspected).toBe(false);expect(r.canonEffect).toBe("NONE")});
it("[CON-FOOT-PROV-008] remains non-executable",()=>{expect(constructionFootConflictAdjudication.executable).toBe(false);expect(reviewConstructionFootSourceAdjudication().executable).toBe(false)});
});
