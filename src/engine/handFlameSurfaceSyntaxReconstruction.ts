/**
 * Phase 8CG — exact hand-flame surface syntax reconstruction.
 *
 * This is deliberately a fixture-profile recogniser, not a general grammar.
 * It recognises only the exact recovered middle-dot grouping and uses spaces
 * as token boundaries inside those six recorded phrases. No morpheme splitting,
 * stage mapping, semantic completion or execution is inferred.
 */
import { handFlameFixtureTraceability } from "./constructionFixtureTraceability";
import { handFlameSourceSequence } from "./constructionHandFlameEvidence";

export type HandFlameSurfaceStatus =
  | "EXACT-FIXTURE-RECONSTRUCTED"
  | "SURFACE-MISMATCH"
  | "EMPTY-INPUT"
  | "INVALID-INPUT";

export interface ReconstructedFixturePhrase {
  phraseIndex: number;
  surface: string;
  tokens: readonly string[];
  interpretationStatus: string;
  evidenceReferences: readonly string[];
  recordedClaims: readonly string[];
  unresolved: readonly string[];
  tokenisation: "WHITESPACE-BOUNDARY-ONLY";
  morphology: "NOT-ANALYSED";
  stageAssignment: "NOT-ESTABLISHED";
}

export function reconstructHandFlameSurface(input: unknown) {
  if (typeof input !== "string") {
    return {
      status: "INVALID-INPUT" as const,
      inputValid: false,
      exactMatch: false,
      phrases: [],
      tokenCount: 0,
      grammarValidity: "NOT-ASSESSED" as const,
      executable: false as const,
      canonEffect: "NONE" as const
    };
  }
  if (!input.trim()) {
    return {
      status: "EMPTY-INPUT" as const,
      inputValid: true,
      exactMatch: false,
      phrases: [],
      tokenCount: 0,
      grammarValidity: "NOT-ASSESSED" as const,
      executable: false as const,
      canonEffect: "NONE" as const
    };
  }

  const exactMatch = input === handFlameSourceSequence;
  if (!exactMatch) {
    return {
      status: "SURFACE-MISMATCH" as const,
      inputValid: true,
      exactMatch: false,
      phrases: [],
      tokenCount: 0,
      grammarValidity: "NOT-ASSESSED" as const,
      executable: false as const,
      canonEffect: "NONE" as const
    };
  }

  const phrases: ReconstructedFixturePhrase[] =
    handFlameFixtureTraceability.phrases.map(phrase => ({
      phraseIndex: phrase.phraseIndex,
      surface: phrase.surface,
      tokens: phrase.surface.split(" "),
      interpretationStatus: phrase.interpretationStatus,
      evidenceReferences: phrase.evidenceReferences,
      recordedClaims: phrase.recordedClaims,
      unresolved: phrase.unresolved,
      tokenisation: "WHITESPACE-BOUNDARY-ONLY",
      morphology: "NOT-ANALYSED",
      stageAssignment: "NOT-ESTABLISHED"
    }));

  return {
    status: "EXACT-FIXTURE-RECONSTRUCTED" as const,
    inputValid: true,
    exactMatch: true,
    delimiter: " · " as const,
    delimiterMeaning: "SOURCE-PHRASE-SEPARATOR-EXACT-FIXTURE-ONLY" as const,
    phrases,
    tokenCount: phrases.reduce((total, phrase) => total + phrase.tokens.length, 0),
    phraseCount: phrases.length,
    grammarValidity: "NOT-ASSESSED" as const,
    generalisation: "NOT-PERMITTED" as const,
    executable: false as const,
    canonEffect: "NONE" as const,
    limitations: [
      "The middle-dot separator is recognised only for this exact archived fixture.",
      "Whitespace token boundaries do not establish morpheme boundaries or lexical classes.",
      "Phrase interpretations are copied from the fixture evidence ledger, including unresolved and provisional statuses.",
      "No phrase is assigned to a Construction stage.",
      "This does not establish a general parser, a complete Construction grammar, feasibility or execution."
    ] as const
  };
}

export const handFlameSurfaceSyntaxProfile = {
  source: "Phase 4 §8; Phase 5.15/5.16 recovery matrix; Phase 5.22 archived parser fixture",
  exactSurface: handFlameSourceSequence,
  phraseSeparator: " · ",
  phraseCount: handFlameFixtureTraceability.phrases.length,
  phraseSurfaces: handFlameFixtureTraceability.phrases.map(phrase => phrase.surface),
  phraseStatuses: handFlameFixtureTraceability.phrases.map(phrase => phrase.interpretationStatus),
  tokenisationRule: "Split on literal spaces inside exact phrase surfaces only.",
  morphologyRule: "No automatic morphological segmentation.",
  stageMapping: "NOT-ESTABLISHED",
  grammarValidity: "NOT-ASSESSED",
  executable: false,
  canonEffect: "NONE"
} as const;
