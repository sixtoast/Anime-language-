/** Phase 8BV — evidence-only audit of the Phase 4 compile-bridge statement. */
export type Phase4BridgeEvidenceStatus="OPENING-STATEMENT-RECOVERED"|"SCOPE-UNRECOVERED"|"CURRENT-TOOL-IS-DIFFERENT";
export const phase4SubsystemArchitecture={
 source:{document:"ARCANE LANGUAGE AUDIT — PHASE 4",section:"§1 opening summary referring to §3",date:"10 October 2026",sourceClass:"CONSOLIDATION-CONTROL-DOCUMENT"},
 subsystems:[
  {id:"CONSTRUCTION",version:"v2.0",description:"Feet, couplings and scoped references",purpose:"Says what the mana does",evidenceStatus:"OPENING-STATEMENT-RECOVERED"},
  {id:"EXPRESSION",version:"v3.0-L",description:"Typed prefix operators",purpose:"Computes values, selects targets and controls timing",evidenceStatus:"OPENING-STATEMENT-RECOVERED"}
 ],
 compileBridge:{id:"PHASE4-COMPILE-BRIDGE",statement:"A compile bridge maps the Construction and Expression subsystems to one another.",evidenceStatus:"OPENING-STATEMENT-RECOVERED" as Phase4BridgeEvidenceStatus,contractStatus:"SCOPE-UNRECOVERED" as Phase4BridgeEvidenceStatus},
 currentWorkbenchBridge:{file:"src/engine/expressionConstructionBridge.ts",name:"Expression → Incantation boundary",sourceNotation:"phase-6g-provisional",targetModel:"incantation-contract-v1.0-v2.1",behaviour:"AST-path traceability records only; no translation rules",executable:false,canonEffect:"none",status:"CURRENT-TOOL-IS-DIFFERENT" as Phase4BridgeEvidenceStatus}
} as const;
export const phase4CompileBridgeUnknowns=[
 "Exact source and target representations and their version compatibility",
 "Whether compilation is one-way or supports round-trip transformations",
 "Expression parsing and semantic-analysis preconditions",
 "Mapping from typed operators and operands to Construction Feet, macros and coupling structures",
 "Mapping of scoped references, spatial roles, quantities, control and release",
 "Ordering, arity, type checking and error diagnostics at the bridge boundary",
 "Whether compilation produces a declarative Construction plan or an executable instruction sequence",
 "How authority, policy, resources, feasibility and the Incantation contract layer interact with the two-subsystem bridge"
] as const;
export const phase4CompileBridgeBoundary={
 status:"OPEN-QUESTION",
 recovered:"The Phase 4 opening explicitly states that a compile bridge maps the v2.0 Construction and v3.0-L Expression subsystems.",
 notRecovered:"The actual §3 bridge contract, transformation rules, signatures, ordering, diagnostics and runtime semantics are not visible in the checked-in excerpt.",
 nonEquivalence:"The current Phase 6G-to-Incantation traceability review is not the Phase 4 Expression-to-Construction compiler.",
 canonEffect:"NONE",
 executable:false
} as const;
export function reviewPhase4CompileBridgeEvidence(){
 return {
  architecture:phase4SubsystemArchitecture,
  unknowns:[...phase4CompileBridgeUnknowns],
  boundary:phase4CompileBridgeBoundary,
  mayImplementCompiler:false as const,
  reason:"The §3 contract is not fully recovered; no translation rule may be inferred from the opening summary."
 };
}
