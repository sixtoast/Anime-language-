import { constructionRelationCodaInventory } from "./constructionFootEvidence";

/**
 * Structural-only recogniser for recovered Construction Foot evidence.
 * Surface orthography uses ng and sh as digraphs, each representing one
 * relation-coda segment. Recognition never attests a lexical Foot.
 */
export type FootShapeStatus =
  | "FRAME-FORM-RECOGNISED"
  | "CVC-SHAPE-RECOGNISED"
  | "SHAPE-INVALID"
  | "UNRESOLVED";

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
const SOURCE_BACKED_CODAS = new Set(constructionRelationCodaInventory.map(item => item.form));
const LIMITATION =
  "Structural recognition only. Parameter-vowel property mappings remain provisional; a recognised CVC outline does not attest a lexical Foot, establish productive combinations, define physical semantics, prove construction validity or permit execution.";
const isLetter = (value: string) => /^\p{L}$/u.test(value);

export function reviewConstructionFootShape(value: unknown): FootShapeReview {
  const input = typeof value === "string" ? value : "";
  const invalid = (
    notes: string[],
    frame: string | null = null,
    parameterVowel: string | null = null,
    relationCoda: string | null = null
  ): FootShapeReview => ({
    input,
    status: "SHAPE-INVALID",
    frame,
    parameterVowel,
    relationCoda,
    notes,
    limitation: LIMITATION
  });

  if (typeof value !== "string") {
    return invalid(["Input must be a string; non-string values are not valid Construction Foot forms."]);
  }

  const characters = Array.from(input);
  if (characters.length < 2) {
    return invalid(["Expected at least a frame consonant and parameter vowel."]);
  }

  const [frame, parameterVowel] = characters;
  const relationCoda = characters.length > 2 ? characters.slice(2).join("") : null;

  if (!characters.every(isLetter)) {
    return invalid(
      ["Every structural position must contain a letter; punctuation, whitespace and control characters are not valid slot contents."],
      frame ?? null,
      parameterVowel ?? null,
      relationCoda
    );
  }

  if (!FRAMES.has(frame)) {
    return invalid(["The initial consonant is not one of the six recovered frame consonants."], frame, parameterVowel, relationCoda);
  }

  if (!PARAMETER_VOWELS.has(parameterVowel)) {
    return invalid(["The medial character is not in the recovered parameter-vowel set."], frame, parameterVowel, relationCoda);
  }

  if (relationCoda === null && CANONICAL_CV_FORMS.has(input)) {
    return {
      input,
      status: "FRAME-FORM-RECOGNISED",
      frame,
      parameterVowel,
      relationCoda: null,
      notes: [
        "This is one of the six explicitly recovered canonical CV frame forms.",
        "It is a frame form, not evidence that a complete CVC Foot is present.",
        "The parameter-vowel mapping remains provisional."
      ],
      limitation: LIMITATION
    };
  }

  if (relationCoda === null) {
    return {
      input,
      status: "UNRESOLVED",
      frame,
      parameterVowel,
      relationCoda: null,
      notes: [
        "The initial consonant and medial vowel belong to the recovered structural inventories.",
        "This frame × parameter-vowel combination is not among the six recovered canonical CV forms; the productive combination inventory is unavailable.",
        "The parameter-vowel mapping remains provisional."
      ],
      limitation: LIMITATION
    };
  }

  if (PARAMETER_VOWELS.has(relationCoda)) {
    return invalid(
      ["The final relation-coda position must not contain one of the six recovered parameter vowels."],
      frame,
      parameterVowel,
      relationCoda
    );
  }

  const codaCodePoints = Array.from(relationCoda);
  if (codaCodePoints.length > 1 && !SOURCE_BACKED_CODAS.has(relationCoda)) {
    return invalid(
      ["The final orthographic sequence is not a recovered relation-coda grapheme; ng and sh are the documented multi-letter coda spellings."],
      frame,
      parameterVowel,
      relationCoda
    );
  }

  if (SOURCE_BACKED_CODAS.has(relationCoda)) {
    return {
      input,
      status: "CVC-SHAPE-RECOGNISED",
      frame,
      parameterVowel,
      relationCoda,
      notes: [
        "The token matches the documented frame + parameter-vowel + relation-coda outline.",
        "The final grapheme is one of the five source-backed relation codas: m, n, ng, s or sh.",
        "This is structural recognition only: the productive frame × vowel × coda combination and lexical attestation are not established.",
        "The parameter-vowel family is provisional; coda family evidence does not supply a complete Foot meaning or physical effect."
      ],
      limitation: LIMITATION
    };
  }

  const notes = [
    "The initial consonant and medial vowel belong to the recovered structural inventories.",
    ...(!CANONICAL_CV_FORMS.has(input.slice(0, 2))
      ? ["The frame × parameter-vowel combination is not among the six recovered canonical CV forms."]
      : []),
    "The final letter is retained as an unresolved coda candidate; it is not in the five source-backed relation codas.",
    "Letter shape alone does not establish that an unfamiliar final letter is a permitted relation coda.",
    "The parameter-vowel mapping remains provisional."
  ];
  if (!CANONICAL_CV_FORMS.has(input.slice(0, 2))) {
    notes.push("The frame × parameter-vowel combination is not among the six recovered canonical CV forms.");
  }
  notes.push("Lexical attestation and productive combination status remain unresolved.");

  return {
    input,
    status: "UNRESOLVED",
    frame,
    parameterVowel,
    relationCoda,
    notes,
    limitation: LIMITATION
  };
}
