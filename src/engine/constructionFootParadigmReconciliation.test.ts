import {describe,expect,it} from "vitest";
import {constructionFootParadigmCandidates,constructionFootParadigmSummary,reviewConstructionFootParadigmCandidate} from "./constructionFootParadigmEvidenceMatrix";
import {constructionFootParadigmReconciliation as audit} from "./constructionFootParadigmReconciliation";
describe("Phase 8CY-S Construction Foot source reconciliation",()=>{
 it("[FOOT-RECON-S-001] identifies the five-coda contradiction",()=>{expect(audit.status).toBe("CONFLICT-OPEN");expect(audit.phase8ci.relationCodaInventoryCount).toBe(0);expect(audit.phase8cyr.claimedRelationCodaCount).toBe(5)});
 it("[FOOT-RECON-S-002] preserves 36 frame-vowel review pairs",()=>{expect(audit.frameParameterReviewPairs).toBe(36);expect(audit.canonicalCvForms).toEqual(["pa","ba","ta","da","ka","ga"]);expect(audit.unresolvedPairs).toBe(30)});
 it("[FOOT-RECON-S-003] disables lookup into legacy 180-item hypotheses",()=>{expect(constructionFootParadigmCandidates).toHaveLength(180);expect(reviewConstructionFootParadigmCandidate("pang")).toBeNull();expect(reviewConstructionFootParadigmCandidate("pas")).toBeNull();expect(audit.legacyCandidateDisposition).toBe("RETAINED-FOR-AUDIT-NOT-RECOGNISED")});
 it("[FOOT-RECON-S-004] does not promote disputed codas",()=>{expect(audit.codaInventoryStatus).toBe("UNRECOVERED");expect(audit.permittedCodaConclusion).toContain("not a verified inventory")});
 it("keeps source conflicts explicit and canon neutral",()=>{expect(audit.unresolvedQuestions).toContain("Whether §3.1–§3.3 and P4-T05/P4-T10 support the five coda mappings recorded in Phase 8CY-R");expect(audit.executable).toBe(false);expect(audit.canonEffect).toBe("NONE")});
});
