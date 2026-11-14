/** Phase 8BP — structured, version-bounded spatial grammar evidence.
 * This catalogue classifies inventory entries; it does not supply token signatures,
 * compositional syntax, coordinate mathematics or executable spatial operations.
 */
export type ConstructionSpatialCategory = "FRAME" | "SIGNED-AXIS" | "RELATION" | "GEOMETRY";
export interface ConstructionSpatialInventoryEntry {
  form: string;
  category: ConstructionSpatialCategory;
  recordedLabel: string;
  version: "V3.0-L";
  evidenceStatus: "INVENTORY-RECORDED";
  signatureStatus: "NOT-RECOVERED";
}
const entries: readonly ConstructionSpatialInventoryEntry[] = [
  { form: "FE", category: "FRAME", recordedLabel: "Frame", version: "V3.0-L", evidenceStatus: "INVENTORY-RECORDED", signatureStatus: "NOT-RECOVERED" },
  ...(["PA", "BA", "TA", "DA", "KA", "GA"] as const).map(form => ({ form, category: "SIGNED-AXIS" as const, recordedLabel: "Signed-axis form", version: "V3.0-L" as const, evidenceStatus: "INVENTORY-RECORDED" as const, signatureStatus: "NOT-RECOVERED" as const })),
  ...(["JO", "JUR", "JA", "JE", "JI"] as const).map(form => ({ form, category: "RELATION" as const, recordedLabel: "Spatial relation form", version: "V3.0-L" as const, evidenceStatus: "INVENTORY-RECORDED" as const, signatureStatus: "NOT-RECOVERED" as const })),
  ...(["PI", "LEN", "PLA", "SUR", "VOM", "PAR"] as const).map(form => ({ form, category: "GEOMETRY" as const, recordedLabel: "Geometry form", version: "V3.0-L" as const, evidenceStatus: "INVENTORY-RECORDED" as const, signatureStatus: "NOT-RECOVERED" as const }))
] as const;

export const constructionSpatialGrammarEvidence = {
  version: "V3.0-L",
  entries,
  categoryOrder: ["FRAME", "SIGNED-AXIS", "RELATION", "GEOMETRY"] as const,
  openInterfaces: [
    { id: "FRAME-SELECTION", question: "How is a frame selected or introduced?", status: "UNRECOVERED" },
    { id: "ORIGIN-BINDING", question: "How is an origin or reference bound to a frame?", status: "UNRECOVERED" },
    { id: "AXIS-COMPOSITION", question: "How do signed-axis forms compose into a vector or direction?", status: "UNRECOVERED" },
    { id: "RELATION-SIGNATURES", question: "What arguments and ordering do relation forms require?", status: "UNRECOVERED" },
    { id: "GEOMETRY-SIGNATURES", question: "What operands, dimensions or constraints do geometry forms require?", status: "UNRECOVERED" },
    { id: "QUANTITY-ATTACHMENT", question: "How do typed quantities attach to spatial forms and units?", status: "UNRECOVERED" },
    { id: "FRAME-TRANSFORMS", question: "How are frame changes, transforms and coordinate conversion expressed?", status: "UNRECOVERED" },
    { id: "VALIDITY-FAILURE", question: "What bounds, validity checks and failure conditions apply?", status: "UNRECOVERED" }
  ],
  historicalFixture: {
    version: "PHASE-5.22-FIXTURE-LOCAL",
    surface: "po da za shi to za ma",
    reading: "position · +Y · 0.2 metre",
    status: "EXACT-FIXTURE-READ",
    generalisable: false
  },
  limits: {
    categoryMembershipIsNotSyntax: true,
    tokenSignaturesInferred: false,
    crossVersionIdentityInferred: false,
    quantityGrammarInferred: false,
    executable: false,
    canonEffect: "NONE"
  }
} as const;

export function reviewConstructionSpatialInventoryEntry(form: unknown) {
  if (typeof form !== "string") return null;
  return constructionSpatialGrammarEvidence.entries.find(entry => entry.form === form) ?? null;
}
export function reviewConstructionSpatialCategory(category: unknown) {
  if (typeof category !== "string" || !constructionSpatialGrammarEvidence.categoryOrder.includes(category as ConstructionSpatialCategory)) return null;
  return constructionSpatialGrammarEvidence.entries.filter(entry => entry.category === category);
}
export function reviewConstructionSpatialInterface(id: unknown) {
  if (typeof id !== "string") return null;
  return constructionSpatialGrammarEvidence.openInterfaces.find(item => item.id === id) ?? null;
}
