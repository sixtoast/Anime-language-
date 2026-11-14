/**
 * Phase 8AW — version-bounded Construction grammar evidence consolidation.
 *
 * This module places three distinct evidence layers side by side:
 * (1) the performed seven-stage order, (2) the exact Phase 5.22 six-phrase
 * fixture tree, and (3) partial morphology/coupling contracts. It is an
 * evidence audit, not a reusable spoken grammar or spell compiler.
 */
import { constructionFixtureProfile, auditConstructionFixtureParseTree } from "./constructionParseTreeContract";
import { constructionStageContractProfiles, constructionStageContractProfileLimits } from "./constructionStageContractProfiles";
import { constructionStageRelationshipEvidence } from "./constructionStageRelationshipEvidence";
import { constructionFootEvidenceBoundary } from "./constructionFootEvidence";
import { constructionSourceClaims } from "./constructionSourceConcordance";
import { auditConstructionOrder, type ConstructionStage } from "./constructionOrderAudit";

export type ConstructionEvidenceClassification =
  | "VALID"
  | "INCOMPLETE"
  | "AMBIGUOUS"
  | "UNSUPPORTED"
  | "INVALID";

export const constructionGrammarEvidenceLayers = [
  {
    id: "FORMAL-ARCANE",
    status: "SEPARATE-LANGUAGE-LAYER",
    statement: "Formal Arcane expression syntax and operators are not the same grammar as performed Mana Construction stages.",
    boundary: "No bridge from formal expression AST to Construction surface syntax is asserted."
  },
  {
    id: "PERFORMED-STAGE-ORDER",
    status: "ORDER-ONLY",
    statement: "Reference → spatial role/vector → Construction Feet → couplings → quantity → control → release.",
    boundary: "Precedence does not establish mandatory cardinality, stage-internal syntax, input/output signatures or data flow."
  },
  {
    id: "PHASE-5.22-FIXTURE",
    status: "EXACT-FIXTURE-ONLY",
    statement: constructionFixtureProfile.exactSurface,
    boundary: "Six phrase nodes and 17 whitespace-delimited tokens; not a general Construction grammar."
  },
  {
    id: "FOOT-MORPHOLOGY",
    status: "CONFLICT-OPEN",
    statement: constructionFootEvidenceBoundary.shapeEvidenceDiscrepancy.primary + " " + constructionFootEvidenceBoundary.shapeEvidenceDiscrepancy.conflictingSummary,
    boundary: "CVC mandatory versus optional relation coda remains unresolved; six CV forms are frame forms, not proven complete Feet."
  },
  {
    id: "COUPLING-AND-MACROS",
    status: "PROVISIONAL-OR-EXAMPLE-LEVEL",
    statement: "H-series domain labels remain provisional; KAN/KEN/KAS remain example-level aliases.",
    boundary: "No participant signature, coupling vector, macro expansion, physical effect or resource model is inferred."
  }
] as const;

export const constructionGrammarConsolidation = {
  id: "PHASE-8AW",
  versionScope: "HISTORICAL-PHASE-4-TO-PHASE-5.22-EVIDENCE-WITH-V3.0-L-SEPARATED",
  classifications: ["VALID", "INCOMPLETE", "AMBIGUOUS", "UNSUPPORTED", "INVALID"] as const,
  layers: constructionGrammarEvidenceLayers,
  performedStages: constructionStageRelationshipEvidence.stages,
  stageProfiles: constructionStageContractProfiles,
  fixtureProfile: constructionFixtureProfile,
  phraseToStageMapping: "NOT-ESTABLISHED",
  explicitControlPhraseInFixtureTree: false,
  footMorphology: "AMBIGUOUS-CVC-VS-OPTIONAL-CODA",
  executable: false,
  canonEffect: "NONE",
  limitations: [
    "The six fixture phrases are not mapped one-to-one onto the seven performed stages.",
    "The fixture tree contains no explicit Control node; this does not prove the performed Control stage is absent from every construction.",
    "Phase 5.21 lexical-slot checks and Phase 5.22 phrase-tree parsing are separate validation layers.",
    "Axis tokens in the fixture and CV Construction frame forms belong to distinct profile-specific roles; shared spellings do not prove shared identity.",
    "Phase 5.22 digit, unit, axis and role tables remain fixture-scoped pending version/source reconciliation.",
    "Arcane v3.0-L spatial inventory is not back-projected into historical Phase 4 Construction syntax.",
    "The indexed archive excerpts do not provide the complete historical parser source."
  ]
} as const;

export interface ConstructionGrammarEvidenceAudit {
  classification: ConstructionEvidenceClassification;
  scope: "EXACT-HISTORICAL-FIXTURE" | "PERFORMED-STAGE-ORDER" | "GENERAL-CONSTRUCTION";
  accepted: boolean;
  issues: string[];
  evidence: string[];
  limitation: string;
  executable: false;
  canonEffect: "NONE";
}

const limitation = "Evidence classification only. This result is not a general parse, semantic validation, physical feasibility assessment or spell execution.";

export function auditConstructionGrammarEvidence(input: unknown): ConstructionGrammarEvidenceAudit {
  if (typeof input === "string") {
    const fixture = auditConstructionFixtureParseTree(input);
    if (fixture.accepted) {
      return {
        classification: "VALID",
        scope: "EXACT-HISTORICAL-FIXTURE",
        accepted: true,
        issues: [],
        evidence: ["Exact Phase 5.22 six-phrase surface match", "Six phrase nodes / 17 whitespace-delimited tokens", "Typed fixture-local position and duration values"],
        limitation,
        executable: false,
        canonEffect: "NONE"
      };
    }
    return {
      classification: "UNSUPPORTED",
      scope: "GENERAL-CONSTRUCTION",
      accepted: false,
      issues: ["No recovered general Construction surface grammar can classify this input."],
      evidence: [],
      limitation,
      executable: false,
      canonEffect: "NONE"
    };
  }

  if (Array.isArray(input)) {
    const order = auditConstructionOrder(input);
    if (order.status === "INVALID_SEQUENCE" || order.status === "ORDER_INCONSISTENT") {
      return {
        classification: "INVALID",
        scope: "PERFORMED-STAGE-ORDER",
        accepted: false,
        issues: order.issues.map(issue => issue.code + ": " + issue.message),
        evidence: ["The seven-stage precedence order is source-backed."],
        limitation,
        executable: false,
        canonEffect: "NONE"
      };
    }
    return {
      classification: "INCOMPLETE",
      scope: "PERFORMED-STAGE-ORDER",
      accepted: false,
      issues: order.status === "INSUFFICIENT_SEQUENCE" ? ["No stage sequence was supplied."] : ["Order is consistent, but stage completeness and internal contracts are not established."],
      evidence: ["The supplied stages follow the recovered performed order."],
      limitation,
      executable: false,
      canonEffect: "NONE"
    };
  }

  return {
    classification: "UNSUPPORTED",
    scope: "GENERAL-CONSTRUCTION",
    accepted: false,
    issues: ["Supply an exact historical fixture surface or a stage-name array for the supported evidence audit."],
    evidence: [],
    limitation,
    executable: false,
    canonEffect: "NONE"
  };
}

export function constructionGrammarEvidenceSummary() {
  return {
    classificationCount: constructionGrammarConsolidation.classifications.length,
    stageCount: constructionGrammarConsolidation.performedStages.length,
    fixturePhraseCount: constructionGrammarConsolidation.fixtureProfile.phraseCount,
    fixtureTokenCount: 17,
    stageContractCount: constructionGrammarConsolidation.stageProfiles.length,
    stageInterfacesRecovered: constructionStageContractProfileLimits.rule,
    phraseToStageMapping: constructionGrammarConsolidation.phraseToStageMapping,
    executable: false as const,
    canonEffect: "NONE" as const
  };
}
