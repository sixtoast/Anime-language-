import {describe,expect,it} from "vitest";
import {fusedReferenceEvidence,reviewFusedConstructionReference} from "./constructionFusedReferenceEvidence";
describe("performed fused Construction reference evidence",()=>{
 it("[CON-REF-FUSED-001] records MEL as me plus anchor coda l",()=>{const r=reviewFusedConstructionReference("mel");expect(r.status).toBe("EXAMPLE-RECORDED");expect(r.entry?.components).toEqual(["me","l"]);expect(r.entry?.decomposition).toBe("me + anchor coda l")});
 it("[CON-REF-FUSED-002] preserves the hand referent and MI surface-scope association",()=>{expect(fusedReferenceEvidence[0].exampleReferent).toBe("hand");expect(fusedReferenceEvidence[0].associatedFormalScope).toBe("MI surface-scope")});
 it("[CON-REF-FUSED-003] keeps general landmark morphology unresolved",()=>{expect(fusedReferenceEvidence[0].generalMorphology).toBe("UNRESOLVED");expect(fusedReferenceEvidence[0].limitation).toContain("productive anchor-coda inventory")});
 it("[CON-REF-FUSED-004] does not conflate performed MEL with formal me binding",()=>{const r=reviewFusedConstructionReference("mel");expect(r.createsBinding).toBe(false);expect(r.message).toContain("does not create a formal reference binding")});
 it("[CON-REF-FUSED-005] rejects unrecorded forms without inventing a paradigm",()=>{const r=reviewFusedConstructionReference("nel");expect(r.status).toBe("UNRECOGNISED");expect(r.entry).toBeNull();expect(r.createsBinding).toBe(false)});
 it("[CON-REF-FUSED-006] handles empty and whitespace input",()=>{expect(reviewFusedConstructionReference(" ").status).toBe("EMPTY")});
 it("[CON-REF-FUSED-007] normalises case and surrounding whitespace only",()=>{expect(reviewFusedConstructionReference(" MEL ").status).toBe("EXAMPLE-RECORDED")});
});
