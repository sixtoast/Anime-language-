/**
 * Phase 8CO — consolidated, fail-closed Construction Foot candidate review.
 *
 * This reviewer classifies evidence; it does not generate or validate a
 * productive Foot grammar. Whole example tokens are never segmented.
 */
import { constructionFrameInventory, constructionParameterInventory } from "./constructionFootEvidence";
import { constructionFootMorphologyAudit, reviewConstructionFootFrameVowel } from "./constructionFootMorphologyAudit";
import { constructionFootSourceRecovery } from "./constructionFootSourceRecovery";
import { reviewConstructionFootComposition } from "./constructionFootComposition";
import { reviewConstructionFrameMacroAssociation } from "./constructionFrameContrastEvidence";

export type ConstructionFootCandidateStatus =
  | "CANONICAL-CV-FRAME"
  | "WHOLE-EXAMPLE-TOKEN"
  | "UNRESOLVED-CV-COMBINATION"
  | "STRUCTURAL-CVC-CANDIDATE"
  | "UNSUPPORTED-OR-UNRESOLVED";

export interface ConstructionFootCandidateReview {
  input: string;
  status: ConstructionFootCandidateStatus;
  frameConsonant: string | null;
  parameterVowel: string | null;
  provisionalParameterFamily: string | null;
  frameMacroAssociation: "TRAK" | "KREN" | "NONE-RECORDED" | "NOT-APPLICABLE";
  relationCoda: string | null;
  codaMembership: "NOT-APPLICABLE" | "NOT-ESTABLISHED" | "NOT-SEGMENTED";
  codaRequirement: "UNRESOLVED-SOURCE-DISCREPANCY" | "NOT-APPLICABLE";
  lexicalFootValidity: "NOT-ESTABLISHED";
  sourceReadings: readonly {
    sourceReading: "P5.15-CVC-REQUIRED" | "P5.16-CODA-OPTIONAL";
    codaRequirement: "REQUIRED" | "OPTIONAL";
    slotAssessment: string;
    conclusion: "UNRESOLVED";
  }[] | null;
  evidence: readonly string[];
  explanation: string;
  executable: false;
  canonEffect: "NONE";
}

const canonicalForms = new Set(constructionFrameInventory.map(item => item.canonicalForm));
const parameterFamilies = new Map(constructionParameterInventory.map(item => [item.vowel, item.family]));
const wholeTokens = new Set(constructionFootSourceRecovery.observedWholeTokens.map(item => item.token));
const knownFrames = new Set(constructionFrameInventory.map(item => item.consonant));
const knownVowels = new Set(constructionParameterInventory.map(item => item.vowel));
const LIMITATION = "Evidence classification only. This is not a productive Foot grammar, lexical validator, physical model or execution engine.";

function result(
  input: string,
  status: ConstructionFootCandidateStatus,
  fields: Partial<ConstructionFootCandidateReview> = {}
): ConstructionFootCandidateReview {
  return {
    input, status,
    frameConsonant: null,
    parameterVowel: null,
    provisionalParameterFamily: null,
    frameMacroAssociation: "NOT-APPLICABLE",
    relationCoda: null,
    codaMembership: "NOT-APPLICABLE",
    codaRequirement: "NOT-APPLICABLE",
    lexicalFootValidity: "NOT-ESTABLISHED",
    sourceReadings: null,
    evidence: [],
    explanation: LIMITATION,
    executable: false,
    canonEffect: "NONE",
    ...fields
  };
}

export function reviewConstructionFootCandidate(value: unknown): ConstructionFootCandidateReview {
  if (typeof value !== "string" || value.length === 0) {
    return result(typeof value === "string" ? value : "", "UNSUPPORTED-OR-UNRESOLVED", {
      explanation: "A non-empty string is required. No normalisation or implicit token correction is applied."
    });
  }

  // Exact whole-token evidence takes precedence over tempting CVC segmentation.
  if (wholeTokens.has(value)) {
    const token = constructionFootSourceRecovery.observedWholeTokens.find(item => item.token === value)!;
    return result(value, "WHOLE-EXAMPLE-TOKEN", {
      frameConsonant: null,
      parameterVowel: null,
      relationCoda: null,
      codaMembership: "NOT-SEGMENTED",
      evidence: ["Standalone Phase 5.22 parser FEET table", "Phase 5.15/5.16 Construction matrices"],
      explanation: value + " is recorded as the complete whole-token example associated with " + token.alias + ". Its apparent letters are not segmented into a Foot frame, parameter vowel or relation coda."
    });
  }

  if (canonicalForms.has(value)) {
    const frame = constructionFrameInventory.find(item => item.canonicalForm === value)!;
    const macro = reviewConstructionFrameMacroAssociation("TRAK")?.frameSet.includes(frame.consonant)
      ? "TRAK" as const
      : reviewConstructionFrameMacroAssociation("KREN")?.frameSet.includes(frame.consonant)
        ? "KREN" as const : "NONE-RECORDED" as const;
    return result(value, "CANONICAL-CV-FRAME", {
      frameConsonant: frame.consonant,
      parameterVowel: value[1],
      provisionalParameterFamily: parameterFamilies.get(value[1]) ?? null,
      frameMacroAssociation: macro,
      evidence: ["Phase 4 L-03 as cited by Phase 5.15", "Phase 5.15 Construction Contract Matrix", "Phase 8BY frame-source adjudication"],
      explanation: value + " is one of the six recorded CV frame forms. It is not established as a complete Foot. Its parameter family is provisional; the p/t/k and b/d/g macro associations do not define individual consonant meanings."
    });
  }

  if (value.length === 2 && knownFrames.has(value[0]) && knownVowels.has(value[1])) {
    const cell = reviewConstructionFootFrameVowel(value[0], value[1]);
    const macro = reviewConstructionFrameMacroAssociation("TRAK")?.frameSet.includes(value[0])
      ? "TRAK" as const
      : reviewConstructionFrameMacroAssociation("KREN")?.frameSet.includes(value[0])
        ? "KREN" as const : "NONE-RECORDED" as const;
    return result(value, "UNRESOLVED-CV-COMBINATION", {
      frameConsonant: value[0],
      parameterVowel: value[1],
      provisionalParameterFamily: parameterFamilies.get(value[1]) ?? null,
      frameMacroAssociation: macro,
      evidence: ["Phase 4 §3.2 parameter-family summary as cited by Phase 5.15", "Phase 8CI 6 × 6 evidence-coverage matrix"],
      explanation: value + " uses a recovered frame consonant and a provisional parameter vowel, but it is not one of the six recorded canonical CV frame forms. The combination is not thereby invalid or licensed; its status remains unresolved."
    });
  }

  if (value.length === 3 && knownFrames.has(value[0]) && knownVowels.has(value[1]) && /^[a-z]$/.test(value[2]) && !knownVowels.has(value[2])) {
    const composition = reviewConstructionFootComposition(value);
    const macro = reviewConstructionFrameMacroAssociation("TRAK")?.frameSet.includes(value[0])
      ? "TRAK" as const
      : reviewConstructionFrameMacroAssociation("KREN")?.frameSet.includes(value[0])
        ? "KREN" as const : "NONE-RECORDED" as const;
    return result(value, "STRUCTURAL-CVC-CANDIDATE", {
      frameConsonant: value[0],
      parameterVowel: value[1],
      provisionalParameterFamily: parameterFamilies.get(value[1]) ?? null,
      frameMacroAssociation: macro,
      relationCoda: value[2],
      codaMembership: "NOT-ESTABLISHED",
      codaRequirement: "UNRESOLVED-SOURCE-DISCREPANCY",
      sourceReadings: composition.readings.map(item => ({
        sourceReading: item.sourceReading,
        codaRequirement: item.codaRequirement,
        slotAssessment: item.slotAssessment,
        conclusion: item.conclusion
      })),
      evidence: ["Phase 5.15 CVC structural summary", "Phase 5.16 C-02 optional-coda summary", "Phase 8BY primary-source conflict register"],
      explanation: value + " matches the provisional three-position outline. The final character is only a candidate coda: membership, meaning and licensing are unknown. The two recovered source summaries disagree about whether this position is mandatory."
    });
  }

  return result(value, "UNSUPPORTED-OR-UNRESOLVED", {
    evidence: [],
    explanation: "No exact source-backed frame form or whole example token matches this input, and it does not fit the bounded structural candidate pattern. This is not proof that the form is impossible in the unrecovered language."
  });
}

export const constructionFootCandidateReviewBoundary = {
  canonicalFrameForms: [...canonicalForms],
  wholeExampleTokens: [...wholeTokens],
  frameParameterCoverage: constructionFootMorphologyAudit.coverage,
  codaRequirement: "UNRESOLVED-SOURCE-DISCREPANCY",
  wholeTokenSegmentation: "PROHIBITED-WITHOUT-PRIMARY-EVIDENCE",
  normalisation: "NONE",
  grammarComplete: false,
  executable: false,
  canonEffect: "NONE"
} as const;
