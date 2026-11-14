/**
 * Phase 8CD — Construction Foot morphology evidence reviewer.
 *
 * Recognises source-backed frame forms and structurally possible CVC forms
 * without asserting that a CVC candidate is a lexical Foot. The source
 * discrepancy over mandatory/optional relation codas remains unresolved.
 */
import { constructionFrameInventory, constructionParameterInventory, constructionFootEvidenceBoundary } from "./constructionFootEvidence";
import { reviewConstructionFrameMacroAssociation } from "./constructionFrameContrastEvidence";

export type FootMorphologyReviewStatus =
  | "EMPTY"
  | "FRAME-FORM-RECORDED"
  | "CVC-STRUCTURE-CANDIDATE"
  | "UNRECOGNISED-SHAPE";

export interface FootMorphologyReview {
  input: string;
  normalized: string;
  status: FootMorphologyReviewStatus;
  frameConsonant: string | null;
  frameForm: string | null;
  parameterVowel: string | null;
  parameterFamily: string | null;
  relationCoda: string | null;
  codaMeaning: "NOT-RECOVERED" | "NOT-APPLICABLE";
  codaRequirement: "UNRESOLVED-SOURCE-DISCREPANCY";
  macroAssociation: "TRAK" | "KREN" | "NONE-RECORDED" | "NOT-APPLICABLE";
  lexicalFootValidity: "NOT-ESTABLISHED";
  executable: false;
  explanation: string;
}

const frames = new Set(constructionFrameInventory.map(item => item.consonant));
const vowels = new Map(constructionParameterInventory.map(item => [item.vowel, item.family]));
const frameMacro = (consonant: string): FootMorphologyReview["macroAssociation"] => {
  if (reviewConstructionFrameMacroAssociation("TRAK")?.frameSet.includes(consonant)) return "TRAK";
  if (reviewConstructionFrameMacroAssociation("KREN")?.frameSet.includes(consonant)) return "KREN";
  return "NONE-RECORDED";
};

export const footMorphologyEvidenceBoundary = {
  cvcEvidence: constructionFootEvidenceBoundary.shapeEvidenceDiscrepancy,
  frameFormsAreCompleteFeet: false,
  cvcShapeProvesLexicalValidity: false,
  parameterFamiliesAreProvisional: true,
  relationCodaInventoryRecovered: false,
  productiveParadigmRecovered: false,
  executable: false
} as const;

export function reviewConstructionFootMorphology(input: unknown): FootMorphologyReview {
  const raw = typeof input === "string" ? input : "";
  const normalized = raw.trim().toLowerCase();
  const empty = !normalized;
  if (empty) return {
    input: raw, normalized, status: "EMPTY", frameConsonant: null, frameForm: null,
    parameterVowel: null, parameterFamily: null, relationCoda: null,
    codaMeaning: "NOT-APPLICABLE", codaRequirement: "UNRESOLVED-SOURCE-DISCREPANCY",
    macroAssociation: "NOT-APPLICABLE", lexicalFootValidity: "NOT-ESTABLISHED",
    executable: false, explanation: "Enter a candidate form. No Foot or operation is inferred."
  };

  const consonant = normalized[0];
  const vowel = normalized[1];
  const knownFrame = frames.has(consonant);
  const knownVowel = vowels.has(vowel);
  if (normalized.length === 2 && knownFrame && normalized === consonant + vowel) {
    const macro = frameMacro(consonant);
    return {
      input: raw, normalized, status: "FRAME-FORM-RECORDED",
      frameConsonant: consonant,
      frameForm: constructionFrameInventory.find(item => item.consonant === consonant)?.canonicalForm ?? null,
      parameterVowel: vowel, parameterFamily: vowels.get(vowel) ?? null,
      relationCoda: null, codaMeaning: "NOT-APPLICABLE",
      codaRequirement: "UNRESOLVED-SOURCE-DISCREPANCY",
      macroAssociation: macro, lexicalFootValidity: "NOT-ESTABLISHED",
      executable: false,
      explanation: "This is a recorded CV frame form, not an established complete Foot. The parameter family is provisional and the macro association does not define individual consonant meaning."
    };
  }

  if (normalized.length === 3 && knownFrame && knownVowel && /^[a-z]$/.test(normalized[2])) {
    return {
      input: raw, normalized, status: "CVC-STRUCTURE-CANDIDATE",
      frameConsonant: consonant,
      frameForm: constructionFrameInventory.find(item => item.consonant === consonant)?.canonicalForm ?? null,
      parameterVowel: vowel, parameterFamily: vowels.get(vowel) ?? null,
      relationCoda: normalized[2], codaMeaning: "NOT-RECOVERED",
      codaRequirement: "UNRESOLVED-SOURCE-DISCREPANCY",
      macroAssociation: frameMacro(consonant), lexicalFootValidity: "NOT-ESTABLISHED",
      executable: false,
      explanation: "This matches the documented CVC structural outline, but the coda inventory, coda meaning, lexical validity and mandatory/optional status are unresolved. Shape recognition does not validate a Foot."
    };
  }

  return {
    input: raw, normalized, status: "UNRECOGNISED-SHAPE",
    frameConsonant: null, frameForm: null, parameterVowel: null, parameterFamily: null,
    relationCoda: null, codaMeaning: "NOT-RECOVERED",
    codaRequirement: "UNRESOLVED-SOURCE-DISCREPANCY",
    macroAssociation: "NONE-RECORDED", lexicalFootValidity: "NOT-ESTABLISHED",
    executable: false,
    explanation: "This input does not match a recovered CV frame form or the provisional CVC structural outline."
  };
}
