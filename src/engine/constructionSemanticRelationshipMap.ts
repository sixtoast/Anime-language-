/**
 * Phase 8CK — cross-inventory Construction semantic relationship map.
 * Evidence types are retained; lexical association is not a grammar rule.
 */
import { constructionMacroEvidence } from "./constructionMacroEvidence";
import { constructionFrameMacroAssociations } from "./constructionFrameContrastEvidence";
import { constructionCouplingEvidence } from "./constructionCouplingEvidence";
import { constructionReferenceInventory } from "./constructionReferenceInventory";
import { maintenanceReleaseFixtureEvidence } from "./constructionMaintenanceReleaseEvidence";
import { constructionMacroContractAudit } from "./constructionMacroContractAudit";
import { constructionMacroStageScopeAudit } from "./constructionMacroStageScopeAudit";

export const constructionSemanticRelationshipMap = {
  nodes: {
    macros: constructionMacroEvidence.map(item => ({ id: item.form, gloss: item.gloss, evidenceStatus: item.evidenceStatus })),
    frameGroups: constructionFrameMacroAssociations.map(item => ({
      id: item.macro === "TRAK" ? "voiceless-stop" : "voiced-stop",
      members: item.frameSet,
      macro: item.macro,
      evidenceStatus: item.evidenceStatus
    })),
    couplingForms: constructionCouplingEvidence.map(item => ({ id: item.form, gloss: item.gloss, physicalMappingStatus: item.physicalMappingStatus })),
    fixtureTokens: [
      { id: "KAN", surface: "kan", macro: "TRAK", note: "Whole-token alias TRAK ENRA in the Phase 5.22 fixture." },
      { id: "KEN", surface: "ken", macro: "FREM", note: "Whole-token association with held structure / energy state." },
      { id: "KAS", surface: "kas", macro: "SHREN", note: "Whole-token association with release." }
    ],
    referenceForms: constructionReferenceInventory.filter(item => item.form === "mel")
  },
  relationships: [
    { id: "TRAK-FRAMES", from: "TRAK", to: "voiceless-stop", kind: "MACRO-TO-FRAME-GROUP", evidence: "DESCRIBED-PATTERN", source: "Phase 4 §3.2; Phase 5.15 TRAK row", claim: "TRAK is associated with p/t/k voiceless-stop frames for discrete change.", boundary: "No individual p/t/k meanings, Foot cardinality, expansion or execution rule is recovered." },
    { id: "KREN-FRAMES", from: "KREN", to: "voiced-stop", kind: "MACRO-TO-FRAME-GROUP", evidence: "PROPOSED-OWNER-CONFIRMATION", source: "Phase 4 §3.2; Phase 5.15 KREN row", claim: "KREN is proposed as a reinforced counterpart associated with b/d/g voiced-stop frames.", boundary: "This remains a proposal in the historical evidence. No individual consonant meanings or confirmed morphology are recovered." },
    { id: "FREM-KEN", from: "FREM", to: "KEN", kind: "MACRO-TO-WHOLE-FIXTURE-TOKEN", evidence: "PARTIAL-FIXTURE-ASSOCIATION", source: "Phase 5.22 hand-flame fixture; Phase 5.15 matrix", claim: "The whole token ken is associated with FREM and a held energy/structure state in one example.", boundary: "ken is not segmented into a productive Foot or established as the FREM expansion." },
    { id: "SHREN-KAS", from: "SHREN", to: "KAS", kind: "MACRO-TO-WHOLE-FIXTURE-TOKEN", evidence: "PARTIAL-FIXTURE-ASSOCIATION", source: "Phase 5.22 hand-flame fixture; Phase 5.15 matrix", claim: "The whole token kas is associated with SHREN and release in one example.", boundary: "kas is not segmented into a productive Foot or established as the SHREN expansion; release target, mode and safety remain unresolved." },
    { id: "TRAK-KAN", from: "TRAK", to: "KAN", kind: "MACRO-TO-WHOLE-FIXTURE-TOKEN", evidence: "PARTIAL-FIXTURE-ASSOCIATION", source: "Phase 5.22 hand-flame parser FEETS table; Phase 5.15 matrix", claim: "kan is recorded with the whole-token alias TRAK ENRA.", boundary: "This alias does not define TRAK arity, ENRA syntax or a macro expansion." },
    { id: "BRAN-H-SERIES", from: "BRAN", to: "H-SERIES", kind: "MACRO-TO-COUPLING-FAMILY", evidence: "DESCRIBED-PATTERN", source: "Phase 4 §3.2; Phase 5.15 BRAN row", claim: "BRAN is associated with the h-domain syllable family.", boundary: "The family glosses do not establish coupling participants, argument order, direction, signature or physical mechanism." },
    ...constructionCouplingEvidence.map(item => ({ id: "H-" + item.form, from: "H-SERIES", to: item.form, kind: "COUPLING-FORM-TO-DOMAIN-GLOSS", evidence: "GLOSS-RECORDED-PHYSICAL-MAPPING-PROVISIONAL" as const, source: "Phase 4 §§3.2–3.3; Phase 5.15; Phase 5.16 C-07", claim: item.form + " is recorded with the domain gloss '" + item.gloss + "'.", boundary: "The physical mapping is provisional; full argument signature, direction, validity and operational relation are unresolved." })),
    { id: "VARE-REQUIRE", from: "VARE", to: "REQUIRE", kind: "MODIFIER-TO-REQUIREMENT-ROLE", evidence: "ROLE-DESCRIBED", source: "Phase 4 §3.2; Phase 4 §6 G-4", claim: "VARE is described as a soft-requirement modifier paired with hard REQUIRE.", boundary: "Attachment site, scope, conflict resolution, failure policy and operational semantics are not recovered." },
    { id: "MEL-REFERENCE", from: "MEL", to: "me+anchor-l", kind: "WORKED-EXAMPLE-REFERENCE", evidence: "INVENTORY-ONLY", source: "Phase 4 §8; Phase 5.15 MEL row; Phase 5.16 C-05/C-09", claim: "mel is a worked-example form associated with me plus anchor coda l and the hand referent.", boundary: "This single example does not establish a productive anchor-coda paradigm or a general reference formation rule." }
  ],
  nonRelationships: [
    { from: "TRAK", to: "KREN", status: "NOT-ESTABLISHED", reason: "A described versus proposed frame-group contrast does not establish a general oppositional or derivational grammar." },
    { from: "FREM", to: "SHREN", status: "NOT-ESTABLISHED", reason: "Fixture surface order does not prove a causal lifecycle, mandatory sequence or macro composition rule." },
    { from: "BRAN", to: "he/ha", status: "NOT-ESTABLISHED", reason: "The example contains he ha after maintenance; the source does not assign those forms as BRAN's complete arguments or define participant order." },
    { from: "all macros", to: "seven Construction stages", status: "NOT-ESTABLISHED", reason: "No macro-to-stage assignment, stage scope or data dependency is recovered." },
    { from: "all macros", to: "Foot cardinality", status: "NOT-ESTABLISHED", reason: "No macro input/output signature or number of Feet consumed/produced is recovered." }
  ],
  contractClosure: {
    macrosAudited: constructionMacroContractAudit.length,
    signaturesRecovered: constructionMacroContractAudit.every(item => item.inputSignature !== "NOT-RECOVERED" && item.outputSignature !== "NOT-RECOVERED"),
    macroCompositionRecovered: constructionMacroContractAudit.every(item => item.compositionWithOtherMacros !== "NOT-ESTABLISHED"),
    stageAssignmentsRecovered: constructionMacroStageScopeAudit.boundaries.macroToStageMappingRecovered,
    fixtureOrder: maintenanceReleaseFixtureEvidence.surfaceOrder,
    fixtureCausalLifecycle: maintenanceReleaseFixtureEvidence.causalLifecycle
  },
  executable: false,
  canonEffect: "NONE"
} as const;

export function reviewConstructionSemanticRelationship(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return null;
  const key = value.trim().toUpperCase();
  return constructionSemanticRelationshipMap.relationships.find(item =>
    item.id === key || item.from.toUpperCase() === key || item.to.toUpperCase() === key
  ) ?? null;
}
