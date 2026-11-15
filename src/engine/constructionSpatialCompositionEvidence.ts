/** Phase 8BQ — spatial category-composition evidence ledger. */
export type SpatialCompositionCategory = "FRAME" | "SIGNED-AXIS" | "RELATION" | "GEOMETRY";
export interface SpatialCategoryPairEvidence {
  id: string; left: SpatialCompositionCategory; right: SpatialCompositionCategory;
  status: "RECOVERED" | "NOT-ESTABLISHED"; source: string; unresolved: readonly string[];
}
const categories: readonly SpatialCompositionCategory[] = ["FRAME","SIGNED-AXIS","RELATION","GEOMETRY"];
const unresolved = ["whether categories may combine","argument and operand signatures","surface ordering and attachment","cardinality and repetition","scope, reference and frame binding","validity constraints and failure behaviour"] as const;
const categoryPairs: readonly SpatialCategoryPairEvidence[] = categories.flatMap((left,index) =>
  categories.slice(index+1).map(right => ({
    id:left+"--"+right,left,right,status:"NOT-ESTABLISHED" as const,
    source:"No recovered v3.0-L composition signature or combination rule in the reviewed spatial inventory",unresolved
  }))
);
export const constructionSpatialCompositionEvidence = {
  version:"V3.0-L", categoryPairs,
  fixtureObservations:[{
    id:"PHASE-5.22-HAND-FLAME-SPATIAL-PHRASE",version:"PHASE-5.22-FIXTURE-LOCAL",
    surface:"po da za shi to za ma",
    observations:[
      {role:"POSITION",surface:"po",reading:"position",status:"FIXTURE-READ"},
      {role:"AXIS",surface:"da",reading:"+Y",status:"FIXTURE-READ"},
      {role:"QUANTITY",surface:"za shi to za ma",reading:"0.2 metre",status:"FIXTURE-READ"}
    ],
    coOccurrence:"RECORDED-IN-EXACT-FIXTURE",orderingRule:"NOT-ESTABLISHED",
    attachmentRule:"NOT-ESTABLISHED",v3CategoryMapping:"NOT-ESTABLISHED",generalisable:false
  }],
  limits:{unestablishedDoesNotMeanInvalid:true,coOccurrenceDoesNotEstablishSyntax:true,categoryPairOrderIsNotOperandOrder:true,executable:false,canonEffect:"NONE"}
} as const;
export function reviewConstructionSpatialCategoryPair(left:unknown,right:unknown) {
  if(typeof left!=="string"||typeof right!=="string"||!categories.includes(left as SpatialCompositionCategory)||!categories.includes(right as SpatialCompositionCategory)||left===right)return null;
  return categoryPairs.find(pair=>(pair.left===left&&pair.right===right)||(pair.left===right&&pair.right===left))??null;
}
