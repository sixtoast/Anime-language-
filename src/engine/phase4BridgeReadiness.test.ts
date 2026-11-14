import{describe,expect,it}from"vitest";
import{assessPhase4BridgeReadiness,PHASE4_BRIDGE_REQUIREMENTS,phase4BridgeReadinessBoundary,type BridgeEvidenceInput}from"./phase4BridgeReadiness";
const base:BridgeEvidenceInput={sourceVersion:"v3.0-L",targetVersion:"v2.0",targetRepresentation:"CONSTRUCTION-PLAN",sourceParse:"PARSED",expressionTyping:"VALID"};
const approved=Object.fromEntries(PHASE4_BRIDGE_REQUIREMENTS.map(x=>[x.id,"APPROVED"])) as BridgeEvidenceInput["requirements"];
describe("Phase 8BW Expression-to-Construction readiness gate",()=>{
it("[P4-IFACE-001] blocks on the present source gap",()=>{expect(assessPhase4BridgeReadiness(base).status).toBe("BLOCKED-SOURCE")});
it("[P4-IFACE-002] requires complete §3 approval",()=>{const r=assessPhase4BridgeReadiness({...base,requirements:{...approved,SOURCE:"RECOVERED-UNREVIEWED"}});expect(r.status).toBe("BLOCKED-SOURCE")});
it("[P4-IFACE-003] requires successful parsing",()=>{expect(assessPhase4BridgeReadiness({...base,sourceParse:"FAILED",requirements:approved}).status).toBe("BLOCKED-PARSE")});
it("[P4-IFACE-004] requires established expression typing",()=>{expect(assessPhase4BridgeReadiness({...base,expressionTyping:"NOT-DEFINED",requirements:approved}).status).toBe("BLOCKED-TYPING")});
it("[P4-IFACE-005] enforces the documented subsystem versions",()=>{expect(assessPhase4BridgeReadiness({...base,sourceVersion:"phase-6g-provisional",requirements:approved}).status).toBe("BLOCKED-VERSION")});
it("[P4-IFACE-006] rejects Incantation contract as the Construction target",()=>{expect(assessPhase4BridgeReadiness({...base,targetRepresentation:"INCANTATION-CONTRACT",requirements:approved}).status).toBe("BLOCKED-REPRESENTATION")});
it("[P4-IFACE-007] requires each mapping family independently",()=>{const r=assessPhase4BridgeReadiness({...base,requirements:{...approved,"COUPLING-MAP":"UNRECOVERED"}});expect(r.status).toBe("BLOCKED-CONTRACT");expect(r.blockers.join(" ")).toContain("COUPLING-MAP")});
it("[P4-IFACE-008] does not treat recovered but unreviewed evidence as approved",()=>{const r=assessPhase4BridgeReadiness({...base,requirements:{...approved,"SPATIAL-MAP":"RECOVERED-UNREVIEWED"}});expect(r.status).toBe("BLOCKED-CONTRACT")});
it("[P4-IFACE-009] only reports research readiness after all gates",()=>{expect(assessPhase4BridgeReadiness({...base,requirements:approved}).status).toBe("RESEARCH-READY")});
it("[P4-IFACE-010] never enables compiler execution",()=>{const r=assessPhase4BridgeReadiness({...base,requirements:approved});expect(r).toMatchObject({compilePermitted:false,executable:false,canonEffect:"NONE"});expect(phase4BridgeReadinessBoundary.notACompiler).toBe(true)});
it("[P4-IFACE-011] reports all unresolved interface families",()=>{expect(PHASE4_BRIDGE_REQUIREMENTS.map(x=>x.id)).toEqual(["SOURCE","VERSIONS","EXPRESSION-TYPES","OPERATOR-MAP","REFERENCE-MAP","SPATIAL-MAP","FOOT-MAP","COUPLING-MAP","QUANTITY-MAP","CONTROL-RELEASE","ERROR-MODEL","OUTPUT-MODEL"])});
});
