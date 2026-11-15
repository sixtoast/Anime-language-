import { describe, expect, it } from "vitest";
import { BINDING_LIFECYCLE_EVIDENCE_PROFILE, BINDING_LIFECYCLE_DIMENSIONS, reviewBindingLifecycleEvidence, type BindingLifecycleClaim } from "./bindingLifecycleEvidence";
const claims: BindingLifecycleClaim[] = BINDING_LIFECYCLE_DIMENSIONS.map(d => ({dimension:d,status:"ESTABLISHED",evidence:["source:"+d]}));
const record=(overrides: Partial<BindingLifecycleClaim> = {}) => ({profile:BINDING_LIFECYCLE_EVIDENCE_PROFILE,bindingLabel:"binding-A",claims:claims.map(c=>({...c,...(c.dimension===overrides.dimension?overrides:{})}))});
describe("Arcane binding lifecycle evidence",()=>{
 it("[BIND-LIFE-001] accepts complete explicit claims for owner review",()=>expect(reviewBindingLifecycleEvidence(record()).disposition).toBe("EVIDENCE-COMPLETE-FOR-OWNER-REVIEW"));
 it("[BIND-LIFE-002] leaves missing visibility unresolved",()=>expect(reviewBindingLifecycleEvidence({...record(),claims:claims.filter(c=>c.dimension!=="visibility")}).dimensions.visibility).toBe("NOT-SUPPLIED"));
 it("[BIND-LIFE-003] leaves missing lifetime unresolved",()=>expect(reviewBindingLifecycleEvidence({...record(),claims:claims.filter(c=>c.dimension!=="lifetime")}).dimensions.lifetime).toBe("NOT-SUPPLIED"));
 it("[BIND-LIFE-004] preserves unresolved mutation policy",()=>expect(reviewBindingLifecycleEvidence(record({dimension:"mutation",status:"UNRESOLVED",evidence:[]})).disposition).toBe("INCOMPLETE"));
 it("[BIND-LIFE-005] preserves unresolved freshness policy",()=>expect(reviewBindingLifecycleEvidence(record({dimension:"freshness",status:"UNRESOLVED",evidence:[]})).dimensions.freshness).toBe("UNRESOLVED"));
 it("[BIND-LIFE-006] preserves unresolved invalidation policy",()=>expect(reviewBindingLifecycleEvidence(record({dimension:"invalidation",status:"UNRESOLVED",evidence:[]})).dimensions.invalidation).toBe("UNRESOLVED"));
 it("[BIND-LIFE-007] flags conflicting claims",()=>expect(reviewBindingLifecycleEvidence(record({dimension:"lifetime",status:"CONFLICTING",evidence:["a","b"]})).disposition).toBe("CONFLICTING"));
 it("[BIND-LIFE-008] requires evidence for established claims",()=>expect(reviewBindingLifecycleEvidence(record({dimension:"creation",evidence:[]})).disposition).toBe("INVALID"));
 it("[BIND-LIFE-009] rejects duplicate dimension claims",()=>expect(reviewBindingLifecycleEvidence({...record(),claims:[...claims,claims[0]]}).disposition).toBe("INVALID"));
 it("[BIND-LIFE-010] rejects malformed profile and claim records",()=>expect(reviewBindingLifecycleEvidence({profile:"wrong",bindingLabel:"x",claims:[]}).disposition).toBe("INVALID"));
 it("[BIND-LIFE-011] does not infer transitions or define grammar",()=>{const r=reviewBindingLifecycleEvidence(record());expect(r.lifecycleTransitionsInferred).toBe(false);expect(r.grammarDefined).toBe(false);});
 it("[BIND-LIFE-012] never creates or evaluates bindings",()=>{const r=reviewBindingLifecycleEvidence(record());expect(r.bindingCreated).toBe(false);expect(r.evaluationPerformed).toBe(false);expect(r.executable).toBe(false);expect(r.canonEffect).toBe("NONE");});
});
