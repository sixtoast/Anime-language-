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
const isLetter = (value: string) => /^\p{L}$/u.test(value);

export function reviewConstructionFootShape(value: unknown): FootShapeReview {
  const input = typeof value === "string" ? value : "";
  const invalid = (notes: string[], frame: string | null = null, parameterVowel: string | null = null, relationCoda: string | null = null): FootShapeReview => ({
    input, status: "SHAPE-INVALID", frame, parameterVowel, relationCoda, notes, limitation: LIMITATION
  });
  if (typeof value !== "string") return invalid(["Input must be a string; non-string values are not valid Construction Foot forms."]);
  const characters = Array.from(input);
  if (characters.length !== 2 && characters.length !== 3) return invalid(["Expected the recovered CV or CVC structural length."]);
  if (!characters.every(isLetter)) {
    return invalid(["Every structural position must contain a letter; punctuation, whitespace and control characters are not valid slot contents."],
      characters[0] ?? null, characters[1] ?? null, characters.length === 3 ? characters[2] : null);
  }
  const [frame, parameterVowel, relationCoda = null] = characters;
  if (!FRAMES.has(frame)) return invalid(["The initial consonant is not one of the six recovered frame consonants."], frame, parameterVowel, relationCoda);
  if (!PARAMETER_VOWELS.has(parameterVowel)) return invalid(["The medial character is not in the recovered parameter-vowel set."], frame, parameterVowel, relationCoda);
  if (relationCoda && PARAMETER_VOWELS.has(relationCoda)) {
    return invalid(["The final relation-coda position must not contain one of the six recovered parameter vowels."], frame, parameterVowel, relationCoda);
  }
  if (!relationCoda && CANONICAL_CV_FORMS.has(input)) {
    return { input, status: "FRAME-FORM-RECOGNISED", frame, parameterVowel, relationCoda,
      notes: ["This is one of the six explicitly recovered canonical CV frame forms.", "It is a frame form, not evidence that a complete CVC Foot is present.", "The parameter-vowel mapping remains provisional."], limitation: LIMITATION };
  }
  const notes = ["The initial consonant and medial vowel belong to the recovered structural inventories."];
  if (!relationCoda) {
    notes.push("This frame × parameter-vowel combination is not among the six recovered canonical CV forms; the productive combination inventory is unavailable.");
  } else {
    notes.push("A final letter occupies the relation-coda slot, but letter shape alone does not establish that it is a consonant in the source phonology or a permitted relation coda.");
    notes.push("The complete coda inventory and coda-to-relation meanings are not recovered.");
    if (!CANONICAL_CV_FORMS.has(input.slice(0, 2))) notes.push("The frame × parameter-vowel combination is not among the six recovered canonical CV forms.");
  }
  notes.push("The parameter-vowel mapping remains provisional.");
  return { input, status: "UNRESOLVED", frame, parameterVowel, relationCoda, notes, limitation: LIMITATION };
}
