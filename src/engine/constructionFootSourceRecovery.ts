/**
 * Phase 8AX — direct source observations for Construction Foot morphology.
 * Whole-token evidence is deliberately kept separate from segmental analysis.
 */
import { constructionFrameInventory, constructionParameterInventory, constructionFootEvidenceBoundary } from "./constructionFootEvidence";

export type ConstructionFootSourceFormStatus =
  | "CANONICAL-CV-FRAME-FORM"
  | "OBSERVED-WHOLE-EXAMPLE-TOKEN"
  | "STRUCTURE-ONLY-UNRESOLVED"
  | "UNSUPPORTED-SHAPE";

export const constructionFootSourceRecovery = {
  phase: "8AX",
  source: {
    path: "sources/originals/arcane_phase_5_22_parser.py",
    gitBlobSha: "e6202bdf9a3c726e4103aece1ba711a287d5899d",
    extractedCharacters: 8612,
    sourceStatus: "FULL-STANDALONE-SOURCE-INSPECTED",
    parserScope: "PHASE-5.22-HAND-FLAME-FIXTURE-ONLY"
  },
  frameForms: constructionFrameInventory,
  parameterFamilies: constructionParameterInventory,
  observedWholeTokens: [
    { token: "kan", alias: "TRAK ENRA", surfaceShape: "CVC-ORTHOGRAPHIC", observedSegments: ["k", "a", "n"], segmentationStatus: "NOT-ESTABLISHED" },
    { token: "ken", alias: "FREM / structure held", surfaceShape: "CVC-ORTHOGRAPHIC", observedSegments: ["k", "e", "n"], segmentationStatus: "NOT-ESTABLISHED" },
    { token: "kas", alias: "SHREN / release", surfaceShape: "CVC-ORTHOGRAPHIC", observedSegments: ["k", "a", "s"], segmentationStatus: "NOT-ESTABLISHED" }
  ],
  observedFinalLetters: ["n", "s"],
  codaInventoryStatus: "INCOMPLETE-AND-UNRESOLVED",
  footShapeDiscrepancy: constructionFootEvidenceBoundary.shapeEvidenceDiscrepancy,
  interpretationLimits: [
    "The Phase 5.22 source treats kan, ken and kas as whole example-level tokens with aliases; it does not decompose them into frame, parameter vowel and relation coda.",
    "The observed final letters n and s are occurrences in three example tokens, not a complete relation-coda inventory.",
    "The shared initial k does not establish a common productive frame meaning or macro derivation.",
    "The differing a/e vowels do not establish executable parameter semantics.",
    "The aliases TRAK ENRA, FREM / structure held and SHREN / release remain whole-token associations, not independent segment meanings.",
    "The six canonical CV forms remain frame forms, not proven complete Feet.",
    "The Phase 5.15 CVC statement and Phase 5.16 C-02 optional-coda statement remain unresolved.",
    "No productive frame × vowel × coda paradigm, general Foot parser, physical effect or execution contract is recovered."
  ],
  executable: false,
  canonEffect: "NONE"
} as const;

export interface ConstructionFootSourceFormReview {
  input: string;
  status: ConstructionFootSourceFormStatus;
  message: string;
  evidence: string[];
  executable: false;
  canonEffect: "NONE";
}

export function reviewConstructionFootSourceForm(value: unknown): ConstructionFootSourceFormReview {
  const input = typeof value === "string" ? value.trim().toLowerCase() : "";
  const frame = constructionFootSourceRecovery.frameForms.find(item => item.canonicalForm === input);
  if (frame) {
    return { input, status: "CANONICAL-CV-FRAME-FORM", message: input + " is a documented canonical CV frame form, not a complete CVC Foot.", evidence: ["Phase 4 L-03", "Phase 5.15 Construction Contract Matrix"], executable: false, canonEffect: "NONE" };
  }
  const whole = constructionFootSourceRecovery.observedWholeTokens.find(item => item.token === input);
  if (whole) {
    return { input, status: "OBSERVED-WHOLE-EXAMPLE-TOKEN", message: input + " is recorded as a whole Phase 5.22 example token associated with " + whole.alias + ". Its internal segment meanings are not established.", evidence: ["Standalone Phase 5.22 parser FEET table", "Phase 5.15/5.16 Construction matrices"], executable: false, canonEffect: "NONE" };
  }
  const chars = Array.from(input);
  if (chars.length === 3 && /^[pbtdkg][aeuoiə][bcdfghjklmnpqrstvwxyz]$/.test(input)) {
    return { input, status: "STRUCTURE-ONLY-UNRESOLVED", message: input + " matches the recorded CVC character pattern, but its coda membership, frame × vowel licensing and meaning are unresolved. Shape alone does not make it a valid Foot.", evidence: ["Phase 5.15 CVC structural statement", "Phase 5.16 C-02 optional-coda conflict"], executable: false, canonEffect: "NONE" };
  }
  return { input, status: "UNSUPPORTED-SHAPE", message: "No recovered Construction Foot source rule recognises this input as a canonical CV frame form or one of the three whole example tokens.", evidence: [], executable: false, canonEffect: "NONE" };
}
