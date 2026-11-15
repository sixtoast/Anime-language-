/** Evidence-bounded relationship map for the performed Construction stages.
 * Source: Phase 4 §3.3, as cited in Phase 5.15 and Phase 5.16 C-03.
 * Precedence does not assert data flow, argument consumption, cardinality,
 * feasibility or execution.
 */
export const constructionStageRelationshipEvidence = {
  source: "Phase 4 §3.3; Phase 5.15 Construction Contract Matrix; Phase 5.16 C-03",
  stages: [
    { id: "reference", label: "Reference" },
    { id: "spatial-role-vector", label: "Spatial role / vector" },
    { id: "construction-feet", label: "Construction Feet" },
    { id: "couplings", label: "Couplings" },
    { id: "quantity", label: "Quantity" },
    { id: "control", label: "Control" },
    { id: "release", label: "Release" }
  ],
  precedence: [
    { from: "reference", to: "spatial-role-vector", fromLabel: "Reference", toLabel: "Spatial role / vector", relation: "PRECEDES", evidenceStatus: "SOURCE-BACKED-ORDER", interfaceStatus: "UNRECOVERED", dataDependency: "NOT-ESTABLISHED" },
    { from: "spatial-role-vector", to: "construction-feet", fromLabel: "Spatial role / vector", toLabel: "Construction Feet", relation: "PRECEDES", evidenceStatus: "SOURCE-BACKED-ORDER", interfaceStatus: "UNRECOVERED", dataDependency: "NOT-ESTABLISHED" },
    { from: "construction-feet", to: "couplings", fromLabel: "Construction Feet", toLabel: "Couplings", relation: "PRECEDES", evidenceStatus: "SOURCE-BACKED-ORDER", interfaceStatus: "UNRECOVERED", dataDependency: "NOT-ESTABLISHED" },
    { from: "couplings", to: "quantity", fromLabel: "Couplings", toLabel: "Quantity", relation: "PRECEDES", evidenceStatus: "SOURCE-BACKED-ORDER", interfaceStatus: "UNRECOVERED", dataDependency: "NOT-ESTABLISHED" },
    { from: "quantity", to: "control", fromLabel: "Quantity", toLabel: "Control", relation: "PRECEDES", evidenceStatus: "SOURCE-BACKED-ORDER", interfaceStatus: "UNRECOVERED", dataDependency: "NOT-ESTABLISHED" },
    { from: "control", to: "release", fromLabel: "Control", toLabel: "Release", relation: "PRECEDES", evidenceStatus: "SOURCE-BACKED-ORDER", interfaceStatus: "UNRECOVERED", dataDependency: "NOT-ESTABLISHED" }
  ],
  unresolved: [
    "Whether any stage may be omitted or must occur exactly once.",
    "Whether a stage consumes a value or physical result produced by another stage.",
    "How references, spatial roles, Feet, couplings, quantities, control and release bind to one another.",
    "The internal syntax, argument signatures and transition conditions of each stage.",
    "Whether stage order alone is sufficient for a valid Construction."
  ],
  executable: false,
  canonEffect: "NONE"
} as const;

export function reviewConstructionStageRelationship(from: unknown, to: unknown) {
  if (typeof from !== "string" || typeof to !== "string") return null;
  return constructionStageRelationshipEvidence.precedence.find(edge => edge.from === from && edge.to === to) ?? null;
}
