import{describe,expect,it}from"vitest";
import{BINDING_SOURCE_RECONCILIATION_PROFILE,bindingSourceClaims,reviewBindingSourceReconciliation}from"./bindingSourceReconciliation";
describe("Phase 8DD binding source-version reconciliation",()=>{
it("[BIND-SRC-001] uses a versioned evidence profile",()=>expect(reviewBindingSourceReconciliation().profile).toBe(BINDING_SOURCE_RECONCILIATION_PROFILE));
it("[BIND-SRC-002] records D-019 as delegated historical decision",()=>expect(bindingSourceClaims[0].historicalStatus).toContain("DECIDED-BY-DELEGATION"));
it("[BIND-SRC-003] records SHO as historical dimensionless unit",()=>expect(bindingSourceClaims[0].claim).toContain("SHO"));
it("[BIND-SRC-004] records SHO-closed binding identifier convention",()=>expect(bindingSourceClaims[1].claim).toContain("numeral closed by SHO"));
it("[BIND-SRC-005] preserves current canon identifier caveat",()=>expect(bindingSourceClaims[1].currentCanonStatus).toContain("REMAINS-FOR-FORMALISATION"));
it("[BIND-SRC-006] prevents promotion into current canon",()=>expect(reviewBindingSourceReconciliation().promotionAllowed).toBe(false));
it("[BIND-SRC-007] keeps three binding operator meanings separate",()=>expect(bindingSourceClaims[2].currentCanonStatus).toBe("EXPLICITLY-ESTABLISHED"));
it("[BIND-SRC-008] does not generalise v2.0 persistence to v3.0-L",()=>expect(bindingSourceClaims[3].disposition).toBe("HISTORICAL-ONLY"));
it("[BIND-SRC-009] keeps reference-scope fusion historical",()=>expect(bindingSourceClaims[4].disposition).toBe("HISTORICAL-ONLY"));
it("[BIND-SRC-010] makes no parser, canon or execution change",()=>{const r=reviewBindingSourceReconciliation();expect(r.parserChanged).toBe(false);expect(r.executable).toBe(false);expect(r.canonEffect).toBe("NONE")});
});
