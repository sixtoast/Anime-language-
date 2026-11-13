/**
 * Evidence profiles for the seven performed Construction stages.
 * Historical stage order: Phase 4 §3.3 / Phase 5.15.
 * Cross-version spatial inventory is explicitly tagged v3.0-L and is not
 * asserted to be the historical Phase 4 Construction surface grammar.
 */
export const constructionStageContractProfiles = [
  {
    stage: "reference", label: "1. Reference", contractStatus: "PARTIAL-CONTRACT-RECOVERED",, versionBoundary: null
    recovered: ["MI / NI / RI use DEFAULT-VOLUME scope", "me is described as SELF-SURFACE", "reference persists UNTIL-REPLACED", "a missing replacement preserves the current binding; a valid replacement replaces it"],
    inputOutputStatus: "A reference token, reference identity and scope can be represented in the evidence/runtime guard; historical identifier syntax and downstream value type are not recovered.",
    bindingStatus: "Persistence is documented; binding to spatial values, Feet or couplings is not documented.",
    unresolved: ["anatomical landmarks and surface boundaries", "reference identity and identifier syntax", "existence, sensing, reachability and transformation semantics"]
  },
  {
    stage: "spatial-role-vector", label: "2. Spatial role / vector", contractStatus: "ORDER-BACKED-INTERNAL-CONTRACT-OPEN",
    recovered: ["the stage occurs after reference and before Feet in the performed order"],
    inputOutputStatus: "Historical Phase 4 input/output signatures and surface syntax are not recovered.",
    bindingStatus: "No source-backed rule establishes whether this stage consumes the active reference or supplies a value to any Foot.",
    versionBoundary: "Arcane v3.0-L separately lists FE (Frame), signed axes PA/BA/TA/DA/KA/GA, relations JO/JUR/JA/JE/JI and geometry PI/LEN/PLA/SUR/VOM/PAR. This inventory is not proof that these are the historical Phase 4 stage tokens, argument slots or binding rules.",
    unresolved: ["PO/FO/LO signatures and composition", "frame identity and coordinate binding", "accepted value kinds, units and transforms", "cross-stage reference binding"]
  },
  {
    stage: "construction-feet", label: "3. Construction Feet", contractStatus: "PARTIAL-SHAPE-ONLY",
    recovered: ["Phase 5.15 describes CVC: frame + parameter vowel + relation coda", "six frame consonants p/b/t/d/k/g", "six canonical CV frame forms pa/ba/ta/da/ka/ga"],
    inputOutputStatus: "Token shape can be inspected; productive Foot semantics and a complete typed output are not recovered.",
    bindingStatus: "No complete rule binds a Foot to a reference, spatial role, coupling or quantity.",
    versionBoundary: "Phase 5.16 C-02 describes an optional relation coda; preserve this conflict rather than normalising it.",
    unresolved: ["individual frame semantics", "provisional parameter-vowel meanings", "complete relation-coda inventory", "productive combinations and physical/resource semantics"]
  },
  {
    stage: "couplings", label: "4. Couplings", contractStatus: "GLOSS-AND-FAMILY-EVIDENCE-ONLY",, versionBoundary: null
    recovered: ["h + domain vowel family: hə/he/ha/hu/hi/ho", "recorded glosses mana/matter/energy/living/information/field"],
    inputOutputStatus: "Argument signature, participant types, direction and output type are unresolved.",
    bindingStatus: "No recovered rule specifies participant order or how a coupling attaches to one or more Feet.",
    unresolved: ["domain mapping is provisional", "coupling vector and physical mapping", "resource cost and validity conditions", "participant cardinality and order"]
  },
  {
    stage: "quantity", label: "5. Quantity", contractStatus: "ORDER-ONLY",, versionBoundary: null
    recovered: ["quantity is named as a performed stage after couplings and before control"],
    inputOutputStatus: "No Construction-specific syntax, quantity type, unit, input or output contract is recovered.",
    bindingStatus: "No source-backed rule states whether quantity modifies a Foot, coupling, whole configuration or another object.",
    unresolved: ["quantity representation and units", "scope and attachment", "limits, aggregation and conversion semantics"]
  },
  {
    stage: "control", label: "6. Control", contractStatus: "ORDER-ONLY",, versionBoundary: null
    recovered: ["control is named as a performed stage after quantity and before release"],
    inputOutputStatus: "No Construction-specific control syntax, input/output type or transition contract is recovered.",
    bindingStatus: "Do not attach VARE or other macros to this stage without direct evidence; VARE is separately described as a soft-requirement modifier.",
    unresolved: ["control vocabulary and scope", "attachment and transition conditions", "failure and interruption behaviour"]
  },
  {
    stage: "release", label: "7. Release", contractStatus: "PARTIAL-EXAMPLE-ONLY",, versionBoundary: null
    recovered: ["the hand-flame example contains kas for release", "Phase 5.15 associates SHREN with release as partial example evidence"],
    inputOutputStatus: "A general release signature, target type, release mode or result is not recovered.",
    bindingStatus: "The example does not establish which prior stage output release consumes.",
    unresolved: ["general release semantics", "release target and mode", "safety/interlock conditions", "resource and post-release state"]
  }
] as const;

export type ConstructionStageContractProfile = typeof constructionStageContractProfiles[number];

export const constructionStageContractProfileLimits = {
  executable: false,
  canonEffect: "NONE",
  rule: "Stage evidence is not an input/output signature. Precedence does not prove data flow or binding.",
  sourceBoundary: "Phase 4 historical Construction evidence and Arcane v3.0-L spatial inventory remain separately versioned."
} as const;

export function findConstructionStageContractProfile(stage: unknown) {
  if (typeof stage !== "string") return null;
  return constructionStageContractProfiles.find(profile => profile.stage === stage) ?? null;
}
