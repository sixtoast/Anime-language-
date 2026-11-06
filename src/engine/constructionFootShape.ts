/**
 * Structural-only recogniser for the recovered Construction Foot pattern.
 * Evidence: Phase 4 §§3.1–3.2 and 10; Phase 5.15 Construction Contract Matrix.
 * It recognises a frame consonant + parameter vowel + optional relation coda.
 * It does not assign final vowel meanings or validate the incomplete coda inventory.
 */
export type FootShapeStatus = "SHAPE-RECOGNISED" | "SHAPE-INVALID" | "UNRESOLVED";
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
  notes.push("Frame consonant and parameter-vowel positions match the recovered Foot shape.");
  if (relationCoda) notes.push("A final relation-coda position is present; its membership and meaning are not validated because the inventory is incomplete.");
  else notes.push("No relation-coda position is present.");
  notes.push("The parameter-vowel mapping remains provisional.");
  return { input, status: relationCoda ? "UNRESOLVED" : "SHAPE-RECOGNISED",
    frame, parameterVowel, relationCoda, notes, limitation: LIMITATION };
}
