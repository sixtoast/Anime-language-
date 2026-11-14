/**
 * Phase 8CI — Construction Foot paradigm evidence-closure audit.
 * Integrates existing source ledgers into one explicit slot/coverage matrix.
 * This is a gap register, not a generated lexicon or grammar.
 */
import { constructionFrameInventory, constructionParameterInventory, constructionFootEvidenceBoundary, constructionRelationCodaInventory } from "./constructionFootEvidence";
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
const relationCodas = constructionRelationCodaInventory.map(item => item.form);
const wholeTokenForms = constructionFootSourceRecovery.observedWholeTokens.map(item => item.token);

export const constructionFootParadigmClosureAudit = {
  phase: "8CI",
  sourceBoundary: [
    "Phase 4 §3.1 Table 2 and §3.2 Table 3; reviewed document-body transcription",
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
      evidenceState: "SOURCE-BACKED-INVENTORY" as const,
      recoveredItems: relationCodas,
      permittedConclusion: "Five relation codas and their FREM/SHREN relations are explicitly listed in Phase 4 §3.2 Table 3.",
      missingEvidence: ["Productive frame × parameter × relation-coda licensing", "Whether Phase 5.16 C-02 describes a narrower optional-coda context", "Full Foot argument structure and composition"]
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
    inventory: relationCodas,
    observedWholeTokens: wholeTokenForms,
    observedFinalLetters: constructionFootSourceRecovery.observedFinalLetters,
    observationCount: relationCodas.length,
    interpretation: "Phase 4 Table 3 supplies the five relation codas and mappings. The final letters n and s in kan, ken and kas remain whole-token observations and do not prove internal segmentation.",
    segmentation: "WHOLE-EXAMPLE-TOKEN-SEGMENTATION-NOT-ESTABLISHED" as const,
    codaMembership: "SOURCE-BACKED-INVENTORY" as const
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
    relationCodaInventory: "RECOVERED-SOURCE-BACKED",
    productiveFrameParameterCodaParadigm: "NOT-RECOVERED",
    completeFootSemantics: "NOT-RECOVERED",
    parserReadiness: "NOT-READY",
    sourceAdjudication: "PRIMARY-SOURCE-REVIEWED; SECONDARY-C02-CONTEXT-OPEN"
  },
  limits: [
    constructionFootEvidenceBoundary.shapeEvidenceDiscrepancy.treatment,
    "The 6 × 6 frame–parameter table is an evidence coverage matrix, not a set of 36 licensed forms.",
    "The 180-item cross-product is design-space only; no lexical attestation or productive combination licensing is inferred.",
    "No lexical, physical, resource or execution rule is inferred from orthographic shape. The five coda-to-relation mappings are source-backed; complete Foot semantics remain unresolved."
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
