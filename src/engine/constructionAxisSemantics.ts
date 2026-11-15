/** Phase 8BR — source-grounded signed-axis assignments from Arcane v3.0-L §4.
 * This is a lexical direction registry, not a vector constructor or frame model.
 */
export type CanonicalSpatialAxisForm = "PA" | "BA" | "TA" | "DA" | "KA" | "GA";
export interface CanonicalSpatialAxisAssignment {
  form: CanonicalSpatialAxisForm;
  coordinateAxis: "X" | "Y" | "Z";
  sign: -1 | 1;
  direction: "left" | "right" | "below" | "above" | "behind" | "forward";
  consonant: "P" | "B" | "T" | "D" | "K" | "G";
  voicing: "voiceless" | "voiced";
  oppositeForm: CanonicalSpatialAxisForm;
  source: "Arcane v3.0-L §4";
  status: "CANONICAL-DIRECTION-ASSIGNMENT";
}
export const constructionAxisSemantics = {
  version: "V3.0-L",
  convention: { positiveX: "right", positiveY: "above", positiveZ: "forward" },
  axes: [
    {form:"PA",coordinateAxis:"X",sign:-1,direction:"left",consonant:"P",voicing:"voiceless",oppositeForm:"BA",source:"Arcane v3.0-L §4",status:"CANONICAL-DIRECTION-ASSIGNMENT"},
    {form:"BA",coordinateAxis:"X",sign:1,direction:"right",consonant:"B",voicing:"voiced",oppositeForm:"PA",source:"Arcane v3.0-L §4",status:"CANONICAL-DIRECTION-ASSIGNMENT"},
    {form:"TA",coordinateAxis:"Y",sign:-1,direction:"below",consonant:"T",voicing:"voiceless",oppositeForm:"DA",source:"Arcane v3.0-L §4",status:"CANONICAL-DIRECTION-ASSIGNMENT"},
    {form:"DA",coordinateAxis:"Y",sign:1,direction:"above",consonant:"D",voicing:"voiced",oppositeForm:"TA",source:"Arcane v3.0-L §4",status:"CANONICAL-DIRECTION-ASSIGNMENT"},
    {form:"KA",coordinateAxis:"Z",sign:-1,direction:"behind",consonant:"K",voicing:"voiceless",oppositeForm:"GA",source:"Arcane v3.0-L §4",status:"CANONICAL-DIRECTION-ASSIGNMENT"},
    {form:"GA",coordinateAxis:"Z",sign:1,direction:"forward",consonant:"G",voicing:"voiced",oppositeForm:"KA",source:"Arcane v3.0-L §4",status:"CANONICAL-DIRECTION-ASSIGNMENT"}
  ],
  phonologicalObservation: {
    pairs: [["P","B"],["T","D"],["K","G"]],
    contrast: "voiceless-versus-voiced",
    sourceClaim: "The voiced/voiceless distinction gives a subtle internal symmetry.",
    semanticRuleInferred: false
  },
  unresolved: ["origin and frame identity","component magnitude and coordinate value representation","axis-form combination and vector construction","frame transformation and local-frame orientation","unit attachment and dimensional typing"],
  limits: { vectorConstructorRecovered:false,frameIdentityEncoded:false,axisCompositionRuleRecovered:false,executable:false,canonEffect:"NONE" }
} as const satisfies { version:string; convention:{positiveX:string;positiveY:string;positiveZ:string}; axes:readonly CanonicalSpatialAxisAssignment[]; phonologicalObservation:{pairs:readonly (readonly string[])[];contrast:string;sourceClaim:string;semanticRuleInferred:boolean}; unresolved:readonly string[]; limits:{vectorConstructorRecovered:boolean;frameIdentityEncoded:boolean;axisCompositionRuleRecovered:boolean;executable:boolean;canonEffect:string} };
export function reviewConstructionAxis(form:unknown):CanonicalSpatialAxisAssignment|null {
  if(typeof form!=="string")return null;
  return constructionAxisSemantics.axes.find(axis=>axis.form===form)??null;
}
export function reviewOppositeConstructionAxis(form:unknown):CanonicalSpatialAxisAssignment|null {
  const axis=reviewConstructionAxis(form);
  return axis?reviewConstructionAxis(axis.oppositeForm):null;
}
