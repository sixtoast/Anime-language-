/** Disambiguates overloaded "frame" terminology across Arcane subsystems. No canon effect. */
export type ConstructionFrameTermId = "FOOT-CONSONANT-CLASS" | "VECTOR-COORDINATE-FRAME" | "FRAME-TRANSFORM-AUDIT";
export interface ConstructionFrameTerm { id: ConstructionFrameTermId; label: string; source: string; description: string; status: "SOURCE-BACKED"; semanticRelationToFoot: "UNRESOLVED" | "DISTINCT-SUBSYSTEM" }
export const constructionFrameTerminology: readonly ConstructionFrameTerm[] = [
 { id:"FOOT-CONSONANT-CLASS", label:"Construction Foot frame consonants", source:"Phase 4 L-03; Phase 5.15 Frame inventory", description:"Six structural consonant classes p, b, t, d, k and g, represented by canonical CV forms pa, ba, ta, da, ka and ga. Their individual semantic contrasts are not recovered.", status:"SOURCE-BACKED", semanticRelationToFoot:"UNRESOLVED" },
 { id:"VECTOR-COORDINATE-FRAME", label:"Typed vector coordinate frames", source:"Phase 5.8 provisional type checker", description:"world, caster and local labels qualify vector coordinate context in the separate dimensional/type-checking model.", status:"SOURCE-BACKED", semanticRelationToFoot:"DISTINCT-SUBSYSTEM" },
 { id:"FRAME-TRANSFORM-AUDIT", label:"Explicit frame transforms and handedness", source:"Phase 5.9 semantic-frame audit script", description:"The audit script defines world/caster/local bases and handedness for vector operations. It does not define Foot consonant meanings.", status:"SOURCE-BACKED", semanticRelationToFoot:"DISTINCT-SUBSYSTEM" }
] as const;
