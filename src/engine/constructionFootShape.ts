/**
 * Structural-only recogniser for recovered Construction Foot evidence.
 * Canonical CV frame forms are exactly pa, ba, ta, da, ka and ga.
 * Other frame+parameter combinations and all CVC codas remain unresolved:
 * the complete productive paradigm and coda inventory are not recovered.
 */
export type FootShapeStatus = "FRAME-FORM-RECOGNISED" | "SHAPE-INVALID" | "UNRESOLVED";
export interface FootShapeReview {
  input: string;
  status: FootShapeStatus;
  frame: string | null;
  parameterVowel: string | null;
  relationCoda: string | null;
  notes: string[];
  limitation: string;
}
const FRAMES = new Set(["p", "b", "t", "d", "k", "g"]);
const PARAMETER_VOWELS = new Set(["a", "u", "o", "e", "i", "ə"]);
const CANONICAL_CV_FORMS = new Set(["pa", "ba", "ta", "da", "ka", "ga"]);
const LIMITATION = "Structural recognition only. Parameter-vowel property mappings are provisional and the relation-coda inventory is incomplete; this does not establish Foot meaning, construction validity, feasibility or execution.";

export function reviewConstructionFootShape(input: string): FootShapeReview {
  const notes: string[] = [];
  if (input.length !== 2 && input.length !== 3) {
    return { input, status: "SHAPE-INVALID", frame: null, parameterVowel: null, relationCoda: null,
      notes: ["Expected the recovered CV or CVC structural length."], limitation: LIMITATION };
  }
  const frame = input[0];
  const parameterVowel = input[1];
  const relationCoda = input.length === 3 ? input[2] : null;
  if (!FRAMES.has(frame)) {
    return { input, status: "SHAPE-INVALID", frame, parameterVowel, relationCoda,
      notes: ["The initial consonant is not one of the six recovered frame consonants."], limitation: LIMITATION };
  }
  if (!PARAMETER_VOWELS.has(parameterVowel)) {
    return { input, status: "SHAPE-INVALID", frame, parameterVowel, relationCoda,
      notes: ["The medial character is not in the recovered parameter-vowel set."], limitation: LIMITATION };
  }
  if (relationCoda && PARAMETER_VOWELS.has(relationCoda)) {
    return { input, status: "SHAPE-INVALID", frame, parameterVowel, relationCoda,
      notes: ["The final relation-coda position must be consonantal, not a parameter vowel."], limitation: LIMITATION };
  }
  if (!relationCoda && CANONICAL_CV_FORMS.has(input)) {
    notes.push("This is one of the six explicitly recovered canonical CV frame forms.");
    notes.push("It is a frame form, not evidence that a complete CVC Foot is present.");
    notes.push("The parameter-vowel mapping remains provisional.");
    return { input, status: "FRAME-FORM-RECOGNISED", frame, parameterVowel, relationCoda, notes, limitation: LIMITATION };
  }
  notes.push("The initial consonant and medial vowel belong to the recovered structural inventories.");
  if (!relationCoda) {
    notes.push("This frame × parameter-vowel combination is not among the six recovered canonical CV forms; the productive combination inventory is unavailable.");
  } else {
    notes.push("A final relation-coda position is present, but the complete coda inventory and coda-to-relation meanings are not recovered.");
    if (!CANONICAL_CV_FORMS.has(input.slice(0, 2))) notes.push("The frame × parameter-vowel combination is not among the six recovered canonical CV forms.");
  }
  notes.push("The parameter-vowel mapping remains provisional.");
  return { input, status: "UNRESOLVED", frame, parameterVowel, relationCoda, notes, limitation: LIMITATION };
}
