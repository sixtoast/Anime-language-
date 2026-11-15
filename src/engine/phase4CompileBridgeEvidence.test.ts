import{describe,expect,it}from"vitest";
import{phase4SubsystemArchitecture,phase4CompileBridgeUnknowns,phase4CompileBridgeBoundary,reviewPhase4CompileBridgeEvidence}from"./phase4CompileBridgeEvidence";
describe("Phase 8BV Phase 4 compile-bridge evidence boundary",()=>{
it("[P4-BRIDGE-001] records the two Phase 4 subsystems",()=>{expect(phase4SubsystemArchitecture.subsystems.map(x=>x.id)).toEqual(["CONSTRUCTION","EXPRESSION"]);});
it("[P4-BRIDGE-002] preserves the Construction version and responsibility",()=>{expect(phase4SubsystemArchitecture.subsystems[0]).toMatchObject({version:"v2.0",description:"Feet, couplings and scoped references"});});
it("[P4-BRIDGE-003] preserves the Expression version and responsibility",()=>{expect(phase4SubsystemArchitecture.subsystems[1]).toMatchObject({version:"v3.0-L",description:"Typed prefix operators"});});
it("[P4-BRIDGE-004] records bridge existence without inventing its contract",()=>{expect(phase4SubsystemArchitecture.compileBridge.evidenceStatus).toBe("OPENING-STATEMENT-RECOVERED");expect(phase4SubsystemArchitecture.compileBridge.contractStatus).toBe("SCOPE-UNRECOVERED");});
it("[P4-BRIDGE-005] distinguishes the current traceability tool from the compiler",()=>{expect(phase4SubsystemArchitecture.currentWorkbenchBridge).toMatchObject({sourceNotation:"phase-6g-provisional",targetModel:"incantation-contract-v1.0-v2.1",executable:false});expect(phase4CompileBridgeBoundary.nonEquivalence).toContain("not the Phase 4");});
it("[P4-BRIDGE-006] keeps missing compiler contracts explicit",()=>{expect(phase4CompileBridgeUnknowns.length).toBeGreaterThanOrEqual(8);expect(phase4CompileBridgeUnknowns.some(x=>x.includes("Feet"))).toBe(true);});
it("[P4-BRIDGE-007] prohibits compiler implementation before source recovery",()=>{const r=reviewPhase4CompileBridgeEvidence();expect(r.mayImplementCompiler).toBe(false);expect(r.boundary.canonEffect).toBe("NONE");});
});
