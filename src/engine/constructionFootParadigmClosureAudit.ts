/**
 * Phase 8CI — Construction Foot paradigm evidence-closure audit.
 * Integrates existing source ledgers into one explicit slot/coverage matrix.
 * This is a gap register, not a generated lexicon or grammar.
 */
import { constructionFrameInventory, constructionParameterInventory, constructionFootEvidenceBoundary } from "./constructionFootEvidence";
import { constructionFootMorphologyAudit } from "./constructionFootMorphologyAudit";
import { constructionFootSourceRecovery } from "./constructionFootSourceRecovery";
import { constructionFootConflictAdjudication } from "./constructionFootSourceAdjudication";
import { reviewConstructionFootComposition } from "./constructionFootComposition";
import { constructionLexicalSegmentationAudit } from "./constructionLexicalSegmentationAudit";

type EvidenceState = "SOURCE-BACKED-INVENTORY" | "PROVISIONAL-ASSOCIATION" | "STRUCTURAL-STATEMENT-ONLY" | "EXAMPLE-OCCURRENCE-ONLY" | "UNRECOVERED" | "CONFLICT-OPEN";
interface SlotEvidence {
  slot: "FRAME" | "PARAMETER-VOWEL" | "RELATION-CODA";
  evidenceState: EvidenceState;
  recoveredItems: readonly string[];
  permittedConclusion: string;
  missingEvidence: readonly string[];
}
const codaLetters = [...new Set(constructionFootSourceRecovery.observedFinalLetters)];
const wholeTokenForms = constructionFootSourceRecovery.observedWholeTokens.map(item => item.token);

export const constructionFootParadigmClosureAudit = {
  phase: "8CI",
  sourceBoundary: [
    "Phase 4 L-03 and §3.2 as cited by the recovered matrices",
    "Phase 5.15 Construction Contract Matrix",
    "Phase 5.16 Construction Recovery Matrix C-02/C-06/C-09",
    "Standalone Phase 5.22 parser source"
  ],
  slots: [
    {
      slot: "FRAME" as const,
      evidenceState: "SOURCE-BACKED-INVENTORY" as const,
      recoveredItems: constructionFrameInventory.map(item => item.consonant),
      permittedConclusion: "Six frame consonants and their six canonical CV frame forms are recorded.",
      missingEvidence: ["Individual frame-consonant semantic contrasts", "Complete frame-to-macro operational mapping"]
    },
    {
      slot: "PARAMETER-VOWEL" as const,
      evidenceState: "PROVISIONAL-ASSOCIATION" as const,
      recoveredItems: constructionParameterInventory.map(item => item.vowel),
      permittedConclusion: "Six parameter-vowel families are listed provisionally; their semantics are not executable.",
      missingEvidence: ["Owner-confirmed vowel meanings", "Parameter value representation and units", "Combination licensing and interaction rules"]
    },
    {
      slot: "RELATION-CODA" as const,
      evidenceState: "UNRECOVERED" as const,
      recoveredItems: [],
      permittedConclusion: "A relation-coda position is described in the CVC account, but no complete coda inventory or coda-to-relation mapping is recovered.",
      missingEvidence: ["Complete coda inventory", "Coda-to-relation meanings", "Phonological constraints", "Coda optionality context"]
    }
  ] satisfies readonly SlotEvidence[],
  frameParameterCoverage: {
    totalPairs: constructionFootMorphologyAudit.coverage.pairCount,
    explicitlyRecordedFrameForms: constructionFootMorphologyAudit.frameVowelMatrix
      .filter(item => item.status === "CANONICAL-CV-FRAME")
      .map(item => item.form),
    unresolvedCombinations: constructionFootMorphologyAudit.frameVowelMatrix
      .filter(item => item.status === "UNRESOLVED-COMBINATION")
      .map(item => item.form),
    unresolvedPairCount: constructionFootMorphologyAudit.coverage.unresolvedPairCount,
    productiveLicensing: "NOT-ESTABLISHED" as const
  },
  codaEvidence: {
    inventory: codaLetters,
    observedWholeTokens: wholeTokenForms,
    observationCount: codaLetters.length,
    interpretation: "The letters n and s are final-character occurrences in whole example tokens kan, ken and kas. They are not a coda inventory and are not licensed relation morphemes.",
    segmentation: "NOT-ESTABLISHED" as const,
    codaMembership: "NOT-ESTABLISHED" as const
  },
  wholeTokenEvidence: constructionFootSourceRecovery.observedWholeTokens.map(item => ({
    surface: item.token,
    alias: item.alias,
    shape: item.surfaceShape,
    segmentation: item.segmentationStatus,
    lexicalFootValidity: "NOT-ESTABLISHED" as const
  })),
  sourceConflict: {
    status: constructionFootConflictAdjudication.status,
    precedence: constructionFootConflictAdjudication.precedence,
    resolution: constructionFootConflictAdjudication.resolution,
    readings: reviewConstructionFootComposition("pa").readings.map(item => ({
      sourceReading: item.sourceReading,
      codaRequirement: item.codaRequirement
    }))
  },
  crossAuditIntegrity: {
    handFlameWholeTokenSetMatchesSourceRecovery: wholeTokenForms.every(token =>
      constructionLexicalSegmentationAudit.occurrences.some(item => item.surface === token && item.footStatus === "WHOLE-EXAMPLE-TOKEN")
    ),
    noFixtureTokenPromotedToCompleteFoot: constructionLexicalSegmentationAudit.occurrences.every(item =>
      item.footStatus !== "WHOLE-EXAMPLE-TOKEN" || item.identityStatus === "SOURCE-RECORDED"
    ),
    canonEffect: "NONE" as const,
    executable: false as const
  },
  closure: {
    frameInventory: "RECOVERED",
    parameterInventory: "RECOVERED-PROVISIONAL",
    relationCodaInventory: "NOT-RECOVERED",
    productiveFrameParameterCodaParadigm: "NOT-RECOVERED",
    completeFootSemantics: "NOT-RECOVERED",
    parserReadiness: "NOT-READY",
    sourceAdjudication: "BLOCKED-ON-PRIMARY-PHASE-4-INSPECTION"
  },
  limits: [
    constructionFootEvidenceBoundary.shapeEvidenceDiscrepancy.treatment,
    "The 6 × 6 frame–parameter table is an evidence coverage matrix, not a set of 36 licensed forms.",
    "No Cartesian product with observed final letters is generated; n and s are only occurrences in three whole example tokens.",
    "No lexical, semantic, physical, resource or execution rule is inferred from orthographic shape."
  ],
  executable: false,
  canonEffect: "NONE"
} as const;

export function reviewConstructionFootParadigmClosure() {
  const audit = constructionFootParadigmClosureAudit;
  return {
    frameCount: audit.slots[0].recoveredItems.length,
    parameterVowelCount: audit.slots[1].recoveredItems.length,
    relationCodaInventoryCount: audit.slots[2].recoveredItems.length,
    frameParameterPairCount: audit.frameParameterCoverage.totalPairs,
    recordedFrameFormCount: audit.frameParameterCoverage.explicitlyRecordedFrameForms.length,
    unresolvedFrameParameterCount: audit.frameParameterCoverage.unresolvedPairCount,
    wholeExampleTokenCount: audit.wholeTokenEvidence.length,
    codaRequirementConflict: audit.sourceConflict.status,
    parserReadiness: audit.closure.parserReadiness,
    executable: false as const,
    canonEffect: "NONE" as const
  };
}
