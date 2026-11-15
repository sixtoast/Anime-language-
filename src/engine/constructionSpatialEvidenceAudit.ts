/** Phase 8BL — version-bounded Construction spatial vocabulary evidence. */
export const constructionSpatialEvidenceAudit = {
  profiles: [
    {
      id: "HISTORICAL-PHASE-5.22-FIXTURE",
      version: "PHASE-5.22-FIXTURE-LOCAL",
      status: "EXACT-FIXTURE-READ",
      roleToken: { form: "po", reading: "position", status: "FIXTURE-READ" },
      axisToken: { form: "da", reading: "+Y", status: "FIXTURE-READ" },
      quantitySurface: "za shi to za ma",
      quantityReading: "0.2 metre",
      quantityStatus: "FIXTURE-READ",
      coordinateFrame: "NOT-RECOVERED",
      origin: "NOT-RECOVERED",
      generalisable: false,
      source: "Phase 5.22 hand-flame parse tree and fixture-local role/axis/digit/unit tables"
    },
    {
      id: "ARCANE-V3.0-L-SPATIAL-INVENTORY",
      version: "V3.0-L",
      status: "VERSION-BOUNDED-LEXICAL-INVENTORY",
      frameMarker: { form: "FE", gloss: "Frame", status: "INVENTORY-RECORDED" },
      signedAxisForms: ["PA", "BA", "TA", "DA", "KA", "GA"],
      relationForms: ["JO", "JUR", "JA", "JE", "JI"],
      geometryForms: ["PI", "LEN", "PLA", "SUR", "VOM", "PAR"],
      signatures: "NOT-RECOVERED-HERE",
      historicalPhase4Equivalence: "NOT-ESTABLISHED",
      source: "Arcane v3.0-L lexical inventory as separately recorded in Construction stage profile"
    }
  ],
  crossProfileChecks: [
    { surface: "da", fixtureRole: "AXIS +Y", v3InventoryRole: "SIGNED-AXIS-FORM DA", equivalence: "NOT-ESTABLISHED", reason: "The fixture's lowercase token and the v3.0-L uppercase inventory occur in different versioned evidence profiles; shared spelling alone does not prove shared identity or semantics." },
    { surface: "po", fixtureRole: "POSITION ROLE", v3InventoryRole: "NO-IDENTICAL-ENTRY-ESTABLISHED", equivalence: "NOT-ESTABLISHED", reason: "The fixture role does not define a v3.0-L operator or a general spatial syntax." }
  ],
  missingDimensions: ["coordinate frame selection", "origin and reference binding", "axis/vector composition and direction grammar", "unit conversion and quantity attachment", "spatial-role argument signatures", "transforms and frame changes", "bounds, validity and failure conditions"],
  limits: { fixtureGrammarGeneralised: false, v3InventoryBackProjectedToPhase4: false, sharedSpellingImpliesIdentity: false, executable: false, canonEffect: "NONE" }
} as const;

export function reviewConstructionSpatialProfile(id: unknown) {
  if (typeof id !== "string") return null;
  return constructionSpatialEvidenceAudit.profiles.find(profile => profile.id === id) ?? null;
}
