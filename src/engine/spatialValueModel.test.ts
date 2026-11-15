import {describe,expect,it} from "vitest";
import {assessSpatialPositionFixture,assessSpatialVectorFixture,proposedDisplacementMagnitude,proposedDisplacementDot,workedDisplacementFixture,workedVelocityFixture} from "./spatialValueModel";
const clone=<T,>(v:T):T=>JSON.parse(JSON.stringify(v)) as T;
describe("Phase 8BS typed spatial value model",()=>{
 it("[SPATIAL-VALUE-001] accepts a complete proposal-level displacement record",()=>{expect(assessSpatialVectorFixture(workedDisplacementFixture).status).toBe("ACCEPTED_BY_PROPOSED_TYPE_RULE");});
 it("[SPATIAL-VALUE-002] calculates the worked Euclidean magnitude",()=>{expect(proposedDisplacementMagnitude(workedDisplacementFixture).value).toBeCloseTo(Math.sqrt(14));});
 it("[SPATIAL-VALUE-003] calculates a same-frame displacement dot product",()=>{const r=proposedDisplacementDot(workedDisplacementFixture,workedDisplacementFixture);expect(r.value).toBe(14);expect(r.dimension.length).toBe(2);});
 it("[SPATIAL-VALUE-004] keeps velocity distinct from displacement",()=>{expect(assessSpatialVectorFixture(workedVelocityFixture).status).toBe("ACCEPTED_BY_PROPOSED_TYPE_RULE");expect(()=>proposedDisplacementMagnitude(workedVelocityFixture)).toThrow();});
 it("[SPATIAL-VALUE-005] rejects a missing frame identity",()=>{const v=clone(workedDisplacementFixture);v.frameIdentity=" ";expect(assessSpatialVectorFixture(v).status).toBe("REJECTED_BY_PROPOSED_TYPE_RULE");});
 it("[SPATIAL-VALUE-006] blocks cross-frame dot products without a transform",()=>{const a=clone(workedDisplacementFixture),b=clone(workedDisplacementFixture);b.frameIdentity="FRAME-TEST-02";expect(()=>proposedDisplacementDot(a,b)).toThrow(/frame identities differ/);});
 it("[SPATIAL-VALUE-007] blocks mana-state vectors from spatial operations",()=>{const v={...clone(workedDisplacementFixture),kind:"ManaStateVector" as const};expect(assessSpatialVectorFixture(v).status).toBe("BLOCKED_BY_MISSING_CONTRACT");});
 it("[SPATIAL-VALUE-008] rejects incompatible component dimensions",()=>{const v=clone(workedDisplacementFixture);v.components.Z.dimension.time=1;expect(assessSpatialVectorFixture(v).status).toBe("REJECTED_BY_PROPOSED_TYPE_RULE");});
 it("[SPATIAL-VALUE-009] requires an origin/reference for spatial positions",()=>{const p={...clone(workedDisplacementFixture),kind:"SpatialPosition" as const,originReferenceId:""};expect(assessSpatialPositionFixture(p).status).toBe("REJECTED_BY_PROPOSED_TYPE_RULE");});
 it("[SPATIAL-VALUE-010] accepts a fully declared position under the proposal",()=>{const p={...clone(workedDisplacementFixture),kind:"SpatialPosition" as const,originReferenceId:"ORIGIN-TEST-01"};expect(assessSpatialPositionFixture(p).status).toBe("ACCEPTED_BY_PROPOSED_TYPE_RULE");});
 it("[SPATIAL-VALUE-011] rejects malformed and non-finite component values",()=>{const v=clone(workedDisplacementFixture);v.components.X.value=Number.NaN;expect(assessSpatialVectorFixture(v).status).toBe("REJECTED_BY_PROPOSED_TYPE_RULE");});
 it("[SPATIAL-VALUE-012] rejects mixed component unit labels without conversion",()=>{const v=clone(workedDisplacementFixture);v.components.Z.unitLabel="cm";expect(assessSpatialVectorFixture(v).status).toBe("REJECTED_BY_PROPOSED_TYPE_RULE");});
 it("[SPATIAL-VALUE-013] preserves proposal and non-canon boundaries",()=>{expect(workedDisplacementFixture.sourceStatus).toBe("PROPOSAL-FIXTURE");});
});
