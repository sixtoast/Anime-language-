/**
 * Parser for the locked Modern Vernacular v1.0 core.
 *
 * This is intentionally separate from the provisional Formal Arcane Phase 6G
 * parser. It accepts only constructions licensed by the v1.0 locked core and
 * reports blocked/unsupported forms instead of repairing or guessing them.
 */
export type ModernVernacularParticipant = "teshi" | "fezo";
export type ModernVernacularQuestionWord = "shuk" | "zosh";

export type ModernVernacularArgument =
  | { kind: "participant"; form: ModernVernacularParticipant }
  | { kind: "question-slot"; form: ModernVernacularQuestionWord; slot: "A" | "B" };

export type ModernVernacularAst =
  | { kind: "response"; form: "wang" | "kor" | "gep"; meaning: "yes" | "no" | "maybe" }
  | {
      kind: "clause";
      construction: "affirmative" | "negative" | "polar-question" | "information-question";
      participantA: ModernVernacularArgument;
      participantB: ModernVernacularArgument;
      predicate: "wish";
      polarity: "positive" | "negative";
      question: "none" | "polar" | "information";
    };

export type ModernVernacularDiagnosticCode =
  | "MV1_EMPTY_INPUT"
  | "MV1_UNKNOWN_FORM"
  | "MV1_UNSUPPORTED_CONSTRUCTION"
  | "MV1_BLOCKED_NEGATIVE_POLAR"
  | "MV1_BLOCKED_INFORMATION_POLAR"
  | "MV1_INVALID_ARGUMENT_SLOT"
  | "MV1_RESPONSE_NOT_CLAUSE_NEGATOR"
  | "MV12_INVALID_TRANSFER_FRAME"
  | "MV12_BLOCKED_ROLE_QUESTION"
  | "MV12_BLOCKED_NEGATIVE_POLAR"
  | "MV13_INVALID_MOTION_FRAME"
  | "MV13_UNMARKED_LOCATION"
  | "MV13_DUPLICATE_SPATIAL_ROLE"
  | "MV13_BLOCKED_SPATIAL_QUESTION"
  | "MV13_BLOCKED_NEGATIVE_POLAR"
  | "MV13_DEICTIC_CONFLICT";

export interface ModernVernacularDiagnostic {
  code: ModernVernacularDiagnosticCode;
  message: string;
  tokenIndex?: number;
  token?: string;
}

export interface ModernVernacularParseResult {
  ok: boolean;
  grammar: "modern-vernacular-v1.0-locked";
  ast?: ModernVernacularAst;
  diagnostics: ModernVernacularDiagnostic[];
}

const PARTICIPANTS = new Set(["teshi", "fezo"]);
const QUESTION_A = "shuk";
const QUESTION_B = "zosh";
const RESPONSES: Record<"wang" | "kor" | "gep", "yes" | "no" | "maybe"> = {
  wang: "yes",
  kor: "no",
  gep: "maybe"
};
const ALLOWED = new Set([
  "teshi", "fezo", "wish", "shuk", "zosh", "pun", "nava", "wang", "kor", "gep"
]);

function rejected(
  code: ModernVernacularDiagnosticCode,
  message: string,
  tokenIndex?: number,
  token?: string
): ModernVernacularParseResult {
  return {
    ok: false,
    grammar: "modern-vernacular-v1.0-locked",
    diagnostics: [{ code, message, ...(tokenIndex === undefined ? {} : { tokenIndex }), ...(token === undefined ? {} : { token }) }]
  };
}

function argumentA(form: string): ModernVernacularArgument | undefined {
  if (PARTICIPANTS.has(form)) return { kind: "participant", form: form as ModernVernacularParticipant };
  if (form === QUESTION_A) return { kind: "question-slot", form: "shuk", slot: "A" };
  return undefined;
}

function argumentB(form: string): ModernVernacularArgument | undefined {
  if (PARTICIPANTS.has(form)) return { kind: "participant", form: form as ModernVernacularParticipant };
  if (form === QUESTION_B) return { kind: "question-slot", form: "zosh", slot: "B" };
  return undefined;
}

export function parseModernVernacularV1(input: string): ModernVernacularParseResult {
  const tokens = input.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    return rejected("MV1_EMPTY_INPUT", "Enter a Modern Vernacular v1.0 expression.");
  }

  const unknownIndex = tokens.findIndex((token) => !ALLOWED.has(token));
  if (unknownIndex >= 0) {
    return rejected("MV1_UNKNOWN_FORM", `The form "${tokens[unknownIndex]}" is outside the locked v1.0 core inventory.`, unknownIndex, tokens[unknownIndex]);
  }

  if (tokens.length === 1 && Object.hasOwn(RESPONSES, tokens[0])) {
    const form = tokens[0] as "wang" | "kor" | "gep";
    const responseAst: Extract<ModernVernacularAst, { kind: "response" }> = {
      kind: "response",
      form,
      meaning: RESPONSES[form]
    };
    return {
      ok: true,
      grammar: "modern-vernacular-v1.0-locked",
      ast: responseAst,
      diagnostics: []
    };
  }

  if (tokens.length === 3 && tokens[0] === "kor" && tokens[1] === "wish") {
    return rejected("MV1_RESPONSE_NOT_CLAUSE_NEGATOR", "kor is a standalone response meaning no; it is not a clause negator.");
  }

  if (tokens.length === 3 && tokens[1] === "wish") {
    const a = argumentA(tokens[0]);
    const b = argumentB(tokens[2]);
    if (!a || !b) {
      return rejected("MV1_INVALID_ARGUMENT_SLOT", "The first slot accepts teshi, fezo or shuk; the second accepts teshi, fezo or zosh.", !a ? 0 : 2, !a ? tokens[0] : tokens[2]);
    }
    const isInformation = a.kind === "question-slot" || b.kind === "question-slot";
    return {
      ok: true,
      grammar: "modern-vernacular-v1.0-locked",
      ast: {
        kind: "clause",
        construction: isInformation ? "information-question" : "affirmative",
        participantA: a,
        participantB: b,
        predicate: "wish",
        polarity: "positive",
        question: isInformation ? "information" : "none"
      },
      diagnostics: []
    };
  }

  if (tokens.length === 4 && tokens[1] === "wish" && tokens[3] === "pun") {
    const a = argumentA(tokens[0]);
    const b = argumentB(tokens[2]);
    if (!a || !b) {
      return rejected("MV1_INVALID_ARGUMENT_SLOT", "The polar-question form requires two overt participant arguments.", !a ? 0 : 2, !a ? tokens[0] : tokens[2]);
    }
    if (a.kind === "question-slot" || b.kind === "question-slot") {
      return rejected("MV1_BLOCKED_INFORMATION_POLAR", "Combining an information question with pun is blocked in Modern Vernacular v1.0.");
    }
    return {
      ok: true,
      grammar: "modern-vernacular-v1.0-locked",
      ast: {
        kind: "clause",
        construction: "polar-question",
        participantA: a,
        participantB: b,
        predicate: "wish",
        polarity: "positive",
        question: "polar"
      },
      diagnostics: []
    };
  }

  if (tokens.length === 4 && tokens[1] === "nava" && tokens[2] === "wish") {
    const a = argumentA(tokens[0]);
    const b = argumentB(tokens[3]);
    if (!a || !b || a.kind !== "participant" || b.kind !== "participant") {
      return rejected("MV1_INVALID_ARGUMENT_SLOT", "Simple negation requires two overt participant arguments; question-word combinations are not licensed here.");
    }
    return {
      ok: true,
      grammar: "modern-vernacular-v1.0-locked",
      ast: {
        kind: "clause",
        construction: "negative",
        participantA: a,
        participantB: b,
        predicate: "wish",
        polarity: "negative",
        question: "none"
      },
      diagnostics: []
    };
  }

  if (tokens.length === 5 && tokens[1] === "nava" && tokens[2] === "wish" && tokens[4] === "pun") {
    return rejected("MV1_BLOCKED_NEGATIVE_POLAR", "Negative polar questions are blocked in Modern Vernacular v1.0.");
  }

  return rejected("MV1_UNSUPPORTED_CONSTRUCTION", "This token sequence is not licensed by the locked Modern Vernacular v1.0 core.");
}


/**
 * Parser for the locked Modern Vernacular v1.1 verb expansion.
 * Source of truth: docs/canon/arcane-modern-vernacular-v1.1-core-verb-expansion.md
 * This deliberately accepts only the six closed verb frames and their licensed
 * v1.0 question/negation operators. It does not infer unrestricted complements.
 */
export type ModernVernacularV11Verb = "nak" | "zir" | "shus" | "mos" | "mol" | "tut";
export type ModernVernacularV11Object = "rawu" | "gisho" | "losa";
export type ModernVernacularV11Ast = {
  kind: "clause";
  grammarVersion: "1.1";
  construction: "affirmative" | "negative" | "polar-question" | "information-question";
  subject: "teshi" | "fezo" | "shuk";
  predicate: ModernVernacularV11Verb;
  object: ModernVernacularV11Object | "zosh";
  polarity: "positive" | "negative";
  question: "none" | "polar" | "information";
  frame: "hearer-auditory-theme" | "speaker-utterance" | "knower-known-item" | "learner-acquired-content" | "eater-food" | "drinker-liquid";
};
export type ModernVernacularV11ParseResult = {
  ok: boolean;
  grammar: "modern-vernacular-v1.1-locked";
  ast?: ModernVernacularV11Ast;
  diagnostics: ModernVernacularDiagnostic[];
};

const V11_FRAMES: Record<ModernVernacularV11Verb, { object: ModernVernacularV11Object; frame: ModernVernacularV11Ast["frame"] }> = {
  nak: { object: "rawu", frame: "hearer-auditory-theme" },
  zir: { object: "rawu", frame: "speaker-utterance" },
  shus: { object: "rawu", frame: "knower-known-item" },
  mos: { object: "rawu", frame: "learner-acquired-content" },
  mol: { object: "gisho", frame: "eater-food" },
  tut: { object: "losa", frame: "drinker-liquid" }
};

function v11Rejected(code: ModernVernacularDiagnosticCode, message: string, tokenIndex?: number, token?: string): ModernVernacularV11ParseResult {
  return {
    ok: false,
    grammar: "modern-vernacular-v1.1-locked",
    diagnostics: [{ code, message, ...(tokenIndex === undefined ? {} : { tokenIndex }), ...(token === undefined ? {} : { token }) }]
  };
}

export function parseModernVernacularV11(input: string): ModernVernacularV11ParseResult {
  const tokens = input.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return v11Rejected("MV1_EMPTY_INPUT", "Enter a Modern Vernacular v1.1 expression.");

  // Keep the v1.0 grammar intact and expose a consistent v1.1 entry point.
  const core = parseModernVernacularV1(input);
  if (core.ok && core.ast?.kind === "clause") {
    return v11Rejected("MV1_UNSUPPORTED_CONSTRUCTION", "This expression belongs to the v1.0 core; use the v1.0 parser for its original AST.");
  }
  if (core.ok && core.ast?.kind === "response") {
    return v11Rejected("MV1_UNSUPPORTED_CONSTRUCTION", "Standalone responses remain defined by v1.0; use the v1.0 parser for their response AST.");
  }

  const allowed = new Set(["teshi", "fezo", "shuk", "zosh", "nava", "pun", ...Object.keys(V11_FRAMES), "rawu", "gisho", "losa"]);
  const unknownIndex = tokens.findIndex(token => !allowed.has(token));
  if (unknownIndex >= 0) return v11Rejected("MV1_UNKNOWN_FORM", `The form "${tokens[unknownIndex]}" is outside the locked v1.1 inventory.`, unknownIndex, tokens[unknownIndex]);

  let construction: ModernVernacularV11Ast["construction"] = "affirmative";
  let polarity: ModernVernacularV11Ast["polarity"] = "positive";
  let question: ModernVernacularV11Ast["question"] = "none";
  let subject: string;
  let predicate: string;
  let object: string;

  if (tokens.length === 3) {
    [subject, predicate, object] = tokens;
  } else if (tokens.length === 4 && tokens[1] === "nava") {
    subject = tokens[0]; predicate = tokens[2]; object = tokens[3];
    construction = "negative"; polarity = "negative";
  } else if (tokens.length === 4 && tokens[3] === "pun") {
    subject = tokens[0]; predicate = tokens[1]; object = tokens[2];
    construction = "polar-question"; question = "polar";
  } else if (tokens.length === 5 && tokens[1] === "nava" && tokens[4] === "pun") {
    return v11Rejected("MV1_BLOCKED_NEGATIVE_POLAR", "Negative polar questions remain blocked in Modern Vernacular v1.1.");
  } else {
    return v11Rejected("MV1_UNSUPPORTED_CONSTRUCTION", "This sequence is not licensed by the closed Modern Vernacular v1.1 transitive frames.");
  }

  if (!(subject === "teshi" || subject === "fezo" || subject === "shuk")) {
    return v11Rejected("MV1_INVALID_ARGUMENT_SLOT", "The first slot accepts teshi, fezo or shuk.", 0, subject);
  }
  const spec = V11_FRAMES[predicate as ModernVernacularV11Verb];
  if (!spec) return v11Rejected("MV1_UNSUPPORTED_CONSTRUCTION", "The predicate is not one of the six locked v1.1 verbs.", 1, predicate);

  if (subject === "shuk" && construction === "polar-question") {
    return v11Rejected("MV1_BLOCKED_INFORMATION_POLAR", "Combining an information question with pun is blocked.");
  }

  if (subject === "shuk" && construction !== "negative") {
    construction = "information-question";
    question = "information";
  }

  if (object === "zosh") {
    if (construction === "negative") return v11Rejected("MV1_INVALID_ARGUMENT_SLOT", "Question-word replacement is not licensed in the v1.1 simple-negation pattern.", 3, object);
    if (construction === "polar-question") return v11Rejected("MV1_BLOCKED_INFORMATION_POLAR", "Information questions combined with pun remain blocked.");
    construction = "information-question"; question = "information";
  } else if (object !== spec.object) {
    return v11Rejected("MV1_INVALID_ARGUMENT_SLOT", `${predicate} requires the locked second-slot item "${spec.object}" (or zosh for an information question).`, 2, object);
  }

  if (subject === "shuk" && construction === "negative") {
    return v11Rejected("MV1_INVALID_ARGUMENT_SLOT", "The v1.1 simple-negation frame requires an overt participant in slot A.", 0, subject);
  }
  return {
    ok: true,
    grammar: "modern-vernacular-v1.1-locked",
    ast: {
      kind: "clause", grammarVersion: "1.1", construction,
      subject: subject as ModernVernacularV11Ast["subject"],
      predicate: predicate as ModernVernacularV11Verb,
      object: object as ModernVernacularV11Ast["object"],
      polarity, question, frame: spec.frame
    },
    diagnostics: []
  };
}


/**
 * Parser for the locked Modern Vernacular v1.2 transfer frames.
 * Source: docs/canon/arcane-modern-vernacular-v1.2-transfer-and-recipients.md
 * This is a deliberately narrow parser; ka/du/li have no global case-marker status.
 */
export type ModernVernacularV12Ast = {
  kind: "transfer-clause";
  grammarVersion: "1.2";
  construction: "give" | "receive" | "take";
  subject: "teshi" | "fezo" | "shuk";
  predicate: "bul" | "lil";
  item: "fape" | "gisho" | "zosh";
  roleMarker: "ka" | "du";
  roleParticipant: "teshi" | "fezo";
  polarity: "positive" | "negative";
  question: "none" | "polar" | "information";
};
export type ModernVernacularV12ParseResult = {
  ok: boolean;
  grammar: "modern-vernacular-v1.2-locked";
  ast?: ModernVernacularV12Ast;
  diagnostics: ModernVernacularDiagnostic[];
};

function v12Rejected(code: ModernVernacularDiagnosticCode, message: string, tokenIndex?: number, token?: string): ModernVernacularV12ParseResult {
  return {
    ok: false,
    grammar: "modern-vernacular-v1.2-locked",
    diagnostics: [{ code, message, ...(tokenIndex === undefined ? {} : { tokenIndex }), ...(token === undefined ? {} : { token }) }]
  };
}

export function parseModernVernacularV12(input: string): ModernVernacularV12ParseResult {
  const tokens = input.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!tokens.length) return v12Rejected("MV1_EMPTY_INPUT", "Enter a Modern Vernacular v1.2 transfer clause.");

  const allowed = new Set(["teshi", "fezo", "shuk", "bul", "lil", "li", "fape", "gisho", "zosh", "ka", "du", "nava", "pun"]);
  const unknown = tokens.findIndex(token => !allowed.has(token));
  if (unknown >= 0) return v12Rejected("MV1_UNKNOWN_FORM", `The form "${tokens[unknown]}" is outside the locked v1.2 transfer inventory.`, unknown, tokens[unknown]);

  let subject: string, predicate: string, item: string, marker: string, participant: string;
  let polarity: ModernVernacularV12Ast["polarity"] = "positive";
  let question: ModernVernacularV12Ast["question"] = "none";
  let construction: ModernVernacularV12Ast["construction"];

  // Canonical surface shape: A [nava] VERB li ITEM ROLE-PARTICLE PARTICIPANT [pun].
  let body = [...tokens];
  if (body.at(-1) === "pun") {
    question = "polar";
    body = body.slice(0, -1);
  }
  if (body[1] === "nava") {
    if (question === "polar") return v12Rejected("MV12_BLOCKED_NEGATIVE_POLAR", "Negative polar questions remain blocked in v1.2.");
    polarity = "negative";
    body = [body[0], ...body.slice(2)];
  }
  if (body.length !== 6 || body[2] !== "li") {
    return v12Rejected("MV12_INVALID_TRANSFER_FRAME", "A v1.2 transfer clause requires exactly six tokens: participant + [nava] + bul/lil + li + item + ka/du + participant.");
  }
  [subject, predicate, , item, marker, participant] = body;

  if (!(subject === "teshi" || subject === "fezo" || subject === "shuk")) {
    return v12Rejected("MV12_INVALID_TRANSFER_FRAME", "The first slot accepts teshi, fezo or shuk.", 0, subject);
  }
  if (!(participant === "teshi" || participant === "fezo")) {
    return v12Rejected("MV12_INVALID_TRANSFER_FRAME", "The marked recipient/source must be teshi or fezo.", 5, participant);
  }
  if (item !== "fape" && item !== "gisho" && item !== "zosh") {
    return v12Rejected("MV12_INVALID_TRANSFER_FRAME", "The transferred-item slot accepts fape, gisho or the question replacement zosh.", 3, item);
  }
  if (predicate !== "bul" && predicate !== "lil") {
    return v12Rejected("MV12_INVALID_TRANSFER_FRAME", "The v1.2 transfer predicates are bul and lil.", 1, predicate);
  }
  if (marker !== "ka" && marker !== "du") {
    return v12Rejected("MV12_INVALID_TRANSFER_FRAME", "The give frame requires ka; receive/take frames require du.", 4, marker);
  }

  if (predicate === "bul" && marker === "ka") construction = "give";
  else if (predicate === "bul" && marker === "du") construction = "receive";
  else if (predicate === "lil" && marker === "du") construction = "take";
  else return v12Rejected("MV12_INVALID_TRANSFER_FRAME", "lil requires du to mark the source; ka is not licensed in the take frame.", 4, marker);

  if (subject === "shuk" || item === "zosh") {
    if (polarity === "negative") return v12Rejected("MV12_INVALID_TRANSFER_FRAME", "Information-slot replacement is not licensed with v1.2 simple negation.");
    if (question === "polar") return v12Rejected("MV12_BLOCKED_ROLE_QUESTION", "Information questions combined with pun are blocked.");
    question = "information";
  }
  if (subject === "shuk" && question !== "information") {
    return v12Rejected("MV12_BLOCKED_ROLE_QUESTION", "shuk is licensed only as an information question replacing the first participant.");
  }

  return {
    ok: true,
    grammar: "modern-vernacular-v1.2-locked",
    ast: {
      kind: "transfer-clause", grammarVersion: "1.2", construction,
      subject: subject as ModernVernacularV12Ast["subject"],
      predicate: predicate as ModernVernacularV12Ast["predicate"],
      item: item as ModernVernacularV12Ast["item"],
      roleMarker: marker as ModernVernacularV12Ast["roleMarker"],
      roleParticipant: participant as ModernVernacularV12Ast["roleParticipant"],
      polarity, question
    },
    diagnostics: []
  };
}


/**
 * Parser for locked Modern Vernacular v1.3 motion and route clauses.
 * Source: docs/canon/arcane-modern-vernacular-v1.3-motion-and-routes.md
 * Place vocabulary is intentionally limited to gezi until the learner lexicon
 * supplies further verified place expressions.
 */
export type ModernVernacularV13Ast = {
  kind: "motion-clause";
  grammarVersion: "1.3";
  construction: "affirmative" | "negative" | "polar-question" | "information-question";
  mover: "teshi" | "fezo" | "shuk";
  predicate: "ful" | "zem";
  spatialRoles: Array<{ role: "goal" | "source" | "route"; marker: "tava" | "dava" | "yara"; place: "gezi" }>;
  polarity: "positive" | "negative";
  question: "none" | "polar" | "information";
};
export type ModernVernacularV13ParseResult = {
  ok: boolean;
  grammar: "modern-vernacular-v1.3-locked";
  ast?: ModernVernacularV13Ast;
  diagnostics: ModernVernacularDiagnostic[];
};

function v13Rejected(code: ModernVernacularDiagnosticCode, message: string, tokenIndex?: number, token?: string): ModernVernacularV13ParseResult {
  return {
    ok: false,
    grammar: "modern-vernacular-v1.3-locked",
    diagnostics: [{ code, message, ...(tokenIndex === undefined ? {} : { tokenIndex }), ...(token === undefined ? {} : { token }) }]
  };
}

export function parseModernVernacularV13(input: string): ModernVernacularV13ParseResult {
  const tokens = input.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!tokens.length) return v13Rejected("MV1_EMPTY_INPUT", "Enter a Modern Vernacular v1.3 motion clause.");

  const allowed = new Set(["teshi", "fezo", "shuk", "ful", "zem", "tava", "dava", "yara", "gezi", "nava", "pun"]);
  const unknownIndex = tokens.findIndex(token => !allowed.has(token));
  if (unknownIndex >= 0) return v13Rejected("MV1_UNKNOWN_FORM", `The form "${tokens[unknownIndex]}" is outside the locked v1.3 motion inventory.`, unknownIndex, tokens[unknownIndex]);

  let body = [...tokens];
  let polarity: ModernVernacularV13Ast["polarity"] = "positive";
  let question: ModernVernacularV13Ast["question"] = "none";
  if (body.at(-1) === "pun") {
    question = "polar";
    body = body.slice(0, -1);
  }
  if (body[1] === "nava") {
    if (question === "polar") return v13Rejected("MV13_BLOCKED_NEGATIVE_POLAR", "Negative polar questions remain blocked in v1.3.");
    polarity = "negative";
    body = [body[0], ...body.slice(2)];
  }

  if (body.length < 2 || body.length > 8 || (body.length - 2) % 2 !== 0) {
    return v13Rejected("MV13_INVALID_MOTION_FRAME", "Motion clauses require a mover, ful/zem, and zero to three particle-place pairs.");
  }
  const mover = body[0], predicate = body[1];
  if (!(mover === "teshi" || mover === "fezo" || mover === "shuk")) {
    return v13Rejected("MV13_INVALID_MOTION_FRAME", "The mover slot accepts teshi, fezo or shuk.", 0, mover);
  }
  if (predicate !== "ful" && predicate !== "zem") {
    return v13Rejected("MV13_INVALID_MOTION_FRAME", "The only v1.3 motion predicates are ful and zem.", 1, predicate);
  }

  const roleOrder = { tava: 0, dava: 1, yara: 2 } as const;
  const seen = new Set<string>();
  const spatialRoles: ModernVernacularV13Ast["spatialRoles"] = [];
  let previousOrder = -1;
  for (let i = 2; i < body.length; i += 2) {
    const marker = body[i], place = body[i + 1];
    if (!(marker in roleOrder)) {
      return v13Rejected("MV13_UNMARKED_LOCATION", "Every spatial phrase must begin with tava (goal), dava (source) or yara (route); unmarked locations are not inferred.", i, marker);
    }
    if (seen.has(marker)) {
      return v13Rejected("MV13_DUPLICATE_SPATIAL_ROLE", "Only one goal, source and route phrase is licensed; repeated roles are blocked.", i, marker);
    }
    const order = roleOrder[marker as keyof typeof roleOrder];
    if (order < previousOrder) {
      return v13Rejected("MV13_INVALID_MOTION_FRAME", "Spatial phrases must appear in the locked order: tava, dava, yara.", i, marker);
    }
    previousOrder = order;
    seen.add(marker);
    if (place !== "gezi") {
      return v13Rejected("MV13_INVALID_MOTION_FRAME", "The only place expression currently licensed in this bounded learner lexicon is gezi.", i + 1, place);
    }
    spatialRoles.push({
      role: marker === "tava" ? "goal" : marker === "dava" ? "source" : "route",
      marker: marker as "tava" | "dava" | "yara",
      place: "gezi"
    });
  }

  if (mover === "shuk") {
    if (polarity === "negative") return v13Rejected("MV13_BLOCKED_SPATIAL_QUESTION", "The mover information question is licensed only in the positive form.");
    if (question === "polar") return v13Rejected("MV13_BLOCKED_SPATIAL_QUESTION", "Information questions combined with pun are blocked.");
    question = "information";
  }
  if (question === "polar" && mover === "shuk") {
    return v13Rejected("MV13_BLOCKED_SPATIAL_QUESTION", "shuk is an information question word, not a polar-question participant.");
  }
  if (predicate === "zem") {
    // Lexical parser cannot know the live discourse centre. It records the
    // deictic requirement rather than pretending to decide contextual felicity.
    // A goal is structurally accepted; contextual compatibility remains a semantic check.
  }

  return {
    ok: true,
    grammar: "modern-vernacular-v1.3-locked",
    ast: {
      kind: "motion-clause", grammarVersion: "1.3",
      construction: question === "information" ? "information-question" : question === "polar" ? "polar-question" : polarity === "negative" ? "negative" : "affirmative",
      mover: mover as ModernVernacularV13Ast["mover"],
      predicate: predicate as ModernVernacularV13Ast["predicate"],
      spatialRoles, polarity, question
    },
    diagnostics: []
  };
}


/**
 * Parser for locked Modern Vernacular v1.4 modality and intention.
 * Modal meanings are deliberately separate from permission, obligation,
 * negation scope, tense, aspect, completion and execution.
 */
export type ModernVernacularV14Modal = "fam" | "kong" | "tek";
export type ModernVernacularV14Action =
  | { version: "1.0"; ast: Extract<ModernVernacularAst, { kind: "clause" }> }
  | { version: "1.1"; ast: ModernVernacularV11Ast }
  | { version: "1.2"; ast: ModernVernacularV12Ast }
  | { version: "1.3"; ast: ModernVernacularV13Ast };
export type ModernVernacularV14Ast = {
  kind: "modal-clause";
  grammarVersion: "1.4";
  modal: ModernVernacularV14Modal;
  subject: "teshi" | "fezo" | "shuk";
  complementKind: "action" | "entity";
  action?: ModernVernacularV14Action;
  entity?: "fape" | "losa" | "fezo";
  polarity: "positive";
  question: "none" | "polar" | "information";
};
export type ModernVernacularV14ParseResult = {
  ok: boolean;
  grammar: "modern-vernacular-v1.4-locked";
  ast?: ModernVernacularV14Ast;
  diagnostics: ModernVernacularDiagnostic[];
};

function v14Rejected(code: ModernVernacularDiagnosticCode, message: string, tokenIndex?: number, token?: string): ModernVernacularV14ParseResult {
  return {
    ok: false,
    grammar: "modern-vernacular-v1.4-locked",
    diagnostics: [{ code, message, ...(tokenIndex === undefined ? {} : { tokenIndex }), ...(token === undefined ? {} : { token }) }]
  };
}

const V14_ENTITY_COMPLEMENTS = new Set(["fape", "losa", "fezo"]);
const V14_ACTION_VERBS = new Set(["wish", "nak", "zir", "shus", "mos", "mol", "tut", "bul", "lil", "ful", "zem"]);

export function parseModernVernacularV14(input: string): ModernVernacularV14ParseResult {
  const tokens = input.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!tokens.length) return v14Rejected("MV1_EMPTY_INPUT", "Enter a Modern Vernacular v1.4 modal construction.");

  const allowed = new Set([
    "teshi", "fezo", "shuk", "fam", "kong", "tek", "nava", "pun",
    ...V14_ACTION_VERBS, "rawu", "gisho", "losa", "fape", "zosh",
    "li", "ka", "du", "tava", "dava", "yara", "gezi"
  ]);
  const unknownIndex = tokens.findIndex(token => !allowed.has(token));
  if (unknownIndex >= 0) return v14Rejected("MV1_UNKNOWN_FORM", `The form "${tokens[unknownIndex]}" is outside the locked v1.4 inventory.`, unknownIndex, tokens[unknownIndex]);

  const subject = tokens[0];
  if (subject !== "teshi" && subject !== "fezo" && subject !== "shuk") {
    return v14Rejected("MV1_INVALID_ARGUMENT_SLOT", "The modal subject slot accepts teshi, fezo or shuk.", 0, subject);
  }
  const modal = tokens[1];
  if (modal !== "fam" && modal !== "kong" && modal !== "tek") {
    return v14Rejected("MV1_UNSUPPORTED_CONSTRUCTION", "A v1.4 modal must immediately follow the subject: fam, kong or tek.", 1, modal);
  }
  const complement = tokens.slice(2);
  if (complement.includes("nava")) {
    return v14Rejected("MV1_UNSUPPORTED_CONSTRUCTION", "Negation with modal constructions is deliberately blocked in v1.4; nava has no licensed modal scope.");
  }
  if (!complement.length) {
    return v14Rejected("MV1_UNSUPPORTED_CONSTRUCTION", "A modal requires a licensed action frame, or a noun complement for kong and tek.");
  }

  if (complement.length === 2 && complement[1] === "pun" && (modal === "kong" || modal === "tek") && V14_ENTITY_COMPLEMENTS.has(complement[0])) {
    if (subject === "shuk") return v14Rejected("MV1_INVALID_ARGUMENT_SLOT", "shuk is not licensed as a bare entity-modal question in v1.4.");
    return {
      ok: true, grammar: "modern-vernacular-v1.4-locked",
      ast: { kind: "modal-clause", grammarVersion: "1.4", modal, subject, complementKind: "entity", entity: complement[0] as ModernVernacularV14Ast["entity"], polarity: "positive", question: "polar" },
      diagnostics: []
    };
  }

  if (complement.length === 1) {
    if (modal === "fam") {
      return v14Rejected("MV1_UNSUPPORTED_CONSTRUCTION", "fam requires an action frame; a bare noun complement is not licensed.", 2, complement[0]);
    }
    if (!V14_ENTITY_COMPLEMENTS.has(complement[0])) {
      return v14Rejected("MV1_UNSUPPORTED_CONSTRUCTION", "kong and tek accept only the bounded v1.4 entity complements fape, losa and fezo.", 2, complement[0]);
    }
    if (subject === "shuk") {
      return v14Rejected("MV1_INVALID_ARGUMENT_SLOT", "shuk questions replace the modal subject only in an otherwise licensed action frame; bare entity questions are not specified.");
    }
    return {
      ok: true, grammar: "modern-vernacular-v1.4-locked",
      ast: { kind: "modal-clause", grammarVersion: "1.4", modal, subject, complementKind: "entity", entity: complement[0] as ModernVernacularV14Ast["entity"], polarity: "positive", question: "none" },
      diagnostics: []
    };
  }

  const actionInput = [subject, ...complement].join(" ");
  const verb = complement[0];
  let action: ModernVernacularV14Action | undefined;
  let diagnostics: ModernVernacularDiagnostic[] = [];

  if (verb === "wish") {
    const parsed = parseModernVernacularV1(actionInput);
    if (parsed.ok && parsed.ast?.kind === "clause") action = { version: "1.0", ast: parsed.ast };
    else diagnostics = parsed.diagnostics;
  } else if (["nak", "zir", "shus", "mos", "mol", "tut"].includes(verb)) {
    const parsed = parseModernVernacularV11(actionInput);
    if (parsed.ok && parsed.ast) action = { version: "1.1", ast: parsed.ast };
    else diagnostics = parsed.diagnostics;
  } else if (verb === "bul" || verb === "lil") {
    const parsed = parseModernVernacularV12(actionInput);
    if (parsed.ok && parsed.ast) action = { version: "1.2", ast: parsed.ast };
    else diagnostics = parsed.diagnostics;
  } else if (verb === "ful" || verb === "zem") {
    const parsed = parseModernVernacularV13(actionInput);
    if (parsed.ok && parsed.ast) action = { version: "1.3", ast: parsed.ast };
    else diagnostics = parsed.diagnostics;
  } else {
    return v14Rejected("MV1_UNSUPPORTED_CONSTRUCTION", "The action verb is not part of the v1.4 licensed complement inventory.", 2, verb);
  }

  if (!action) {
    const detail = diagnostics[0];
    return v14Rejected(detail?.code ?? "MV1_UNSUPPORTED_CONSTRUCTION", detail?.message ?? "The embedded action frame is not licensed; modality cannot repair it.", detail?.tokenIndex === undefined ? undefined : detail.tokenIndex + 2, detail?.token);
  }

  const actionQuestion = action.version === "1.0" ? action.ast.question
    : action.version === "1.1" ? action.ast.question
    : action.version === "1.2" ? action.ast.question
    : action.ast.question;
  const actionPolarity = action.version === "1.0" ? action.ast.polarity
    : action.version === "1.1" ? action.ast.polarity
    : action.version === "1.2" ? action.ast.polarity
    : action.ast.polarity;
  if (actionPolarity === "negative") {
    return v14Rejected("MV1_UNSUPPORTED_CONSTRUCTION", "A modal cannot take a negatively marked action frame in v1.4.");
  }
  return {
    ok: true, grammar: "modern-vernacular-v1.4-locked",
    ast: { kind: "modal-clause", grammarVersion: "1.4", modal, subject, complementKind: "action", action, polarity: "positive", question: actionQuestion },
    diagnostics: []
  };
}


/**
 * Unified entry point for the locked Modern Vernacular grammar family.
 * Dispatch is based only on the overt modal/verb form; it never repairs an
 * expression or upgrades an unknown form into a licensed construction.
 */
export type ModernVernacularUnifiedParseResult =
  | ModernVernacularParseResult
  | ModernVernacularV11ParseResult
  | ModernVernacularV12ParseResult
  | ModernVernacularV13ParseResult
  | ModernVernacularV14ParseResult
  | ModernVernacularV15ParseResult
  | ModernVernacularV16ParseResult
  | ModernVernacularV17ParseResult
  | ModernVernacularV18ParseResult
  | ModernVernacularV20ParseResult
  | ModernVernacularV21ParseResult
  | ModernVernacularV22ParseResult
  | ModernVernacularV26ParseResult
  | ModernVernacularV27ParseResult;


/** Modern Vernacular v2.0: bounded completion and ongoing aspect. */
export type ModernVernacularV20Ast = {
  kind: "aspect-clause";
  grammarVersion: "2.0";
  aspect: "completed" | "ongoing";
  polarity: "positive" | "negative";
  action: "wish" | "nak" | "zir" | "mos" | "mol" | "tut" | "bul" | "lil" | "ful" | "zem";
  clause: string;
  base: ModernVernacularParseResult["ast"] | ModernVernacularV11ParseResult["ast"] | ModernVernacularV12ParseResult["ast"] | ModernVernacularV13ParseResult["ast"] | ModernVernacularV14ParseResult["ast"] | ModernVernacularV15ParseResult["ast"] | ModernVernacularV16ParseResult["ast"] | ModernVernacularV17ParseResult["ast"] | ModernVernacularV18ParseResult["ast"];
};
export type ModernVernacularV20ParseResult = {
  ok: boolean;
  grammar: "modern-vernacular-v2.0-locked";
  ast?: ModernVernacularV20Ast;
  diagnostics: ModernVernacularDiagnostic[];
};

const MV20_COMPLETED = new Set(["wish","nak","zir","mos","mol","tut","bul","lil","ful","zem"]);
const MV20_ONGOING = new Set(["zir","mos","mol","tut","bul","lil","ful","zem"]);

function v20Rejected(message: string, tokenIndex?: number, token?: string): ModernVernacularV20ParseResult {
  return { ok: false, grammar: "modern-vernacular-v2.0-locked", diagnostics: [{
    code: "MV1_UNSUPPORTED_CONSTRUCTION", message,
    ...(tokenIndex === undefined ? {} : { tokenIndex }),
    ...(token === undefined ? {} : { token })
  }] };
}

/** Validates aspect scope first, then delegates the underlying argument frame to the existing clause parser. */
export function parseModernVernacularV20(input: string): ModernVernacularV20ParseResult {
  const tokens = input.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!tokens.length) return v20Rejected("Enter a complete v2.0 aspect-marked action clause.");
  let aspectIndex = tokens.indexOf("don");
  if (aspectIndex < 0) aspectIndex = tokens.indexOf("kok");
  if (aspectIndex < 0) return v20Rejected("A v2.0 clause requires exactly one aspect marker: don or kok.");
  const aspectToken = tokens[aspectIndex];
  if (tokens.indexOf(aspectToken, aspectIndex + 1) >= 0 || tokens.includes(aspectToken === "don" ? "kok" : "don")) {
    return v20Rejected("Aspect stacking or multiple aspect markers are not licensed.", aspectIndex, aspectToken);
  }
  if (aspectIndex !== 1 && !(aspectIndex === 2 && tokens[1] === "nava")) {
    return v20Rejected("Aspect must immediately follow the subject and any clause-local nava.", aspectIndex, aspectToken);
  }
  const verbIndex = aspectIndex + 1;
  const action = tokens[verbIndex];
  const licensed = aspectToken === "don" ? MV20_COMPLETED : MV20_ONGOING;
  if (!action || !licensed.has(action)) {
    return v20Rejected(aspectToken === "kok"
      ? "kok is licensed only with zir, mos, mol, tut, bul, lil, ful or zem."
      : "don is licensed only with the v2.0 eventive verb inventory.", verbIndex, action);
  }
  if (tokens.slice(verbIndex + 1).some(token => ["fam","kong","tek","yemi","zami","dema","sori","mira","toku"].includes(token))) {
    return v20Rejected("Modal and directive constructions cannot combine with v2.0 aspect.");
  }
  const baseTokens = tokens.filter((_, index) => index !== aspectIndex);
  const base = parseModernVernacular(baseTokens.join(" "));
  if (!base.ok) return v20Rejected("The underlying clause is not independently licensed by the existing Modern Vernacular parser.", base.diagnostics[0]?.tokenIndex, base.diagnostics[0]?.token);
  if (tokens[tokens.length - 1] === "pun" && tokens.includes("nava")) {
    return v20Rejected("Negative polar questions with v2.0 aspect remain blocked.");
  }
  return {
    ok: true,
    grammar: "modern-vernacular-v2.0-locked",
    ast: {
      kind: "aspect-clause",
      grammarVersion: "2.0",
      aspect: aspectToken === "don" ? "completed" : "ongoing",
      polarity: tokens.includes("nava") ? "negative" : "positive",
      action: action as ModernVernacularV20Ast["action"],
      clause: tokens.join(" "),
      base: base.ast
    },
    diagnostics: []
  };
}

/** Modern Vernacular v2.1: explicit current-time anchoring and binary completed-event ordering. */
export type ModernVernacularV21Ast =
  | { kind: "temporal-anchor"; grammarVersion: "2.1"; anchor: "now"; clause: ModernVernacularV20Ast }
  | { kind: "event-order"; grammarVersion: "2.1"; relation: "before" | "after"; first: ModernVernacularV20Ast; second: ModernVernacularV20Ast };
export type ModernVernacularV21ParseResult = {
  ok: boolean;
  grammar: "modern-vernacular-v2.1-locked";
  ast?: ModernVernacularV21Ast;
  diagnostics: ModernVernacularDiagnostic[];
};
function v21Rejected(message: string, tokenIndex?: number, token?: string): ModernVernacularV21ParseResult {
  return { ok: false, grammar: "modern-vernacular-v2.1-locked", diagnostics: [{
    code: "MV1_UNSUPPORTED_CONSTRUCTION", message,
    ...(tokenIndex === undefined ? {} : { tokenIndex }),
    ...(token === undefined ? {} : { token })
  }] };
}
function parseV21CompletedClause(input: string): ModernVernacularV20Ast | undefined {
  const parsed = parseModernVernacularV20(input);
  if (!parsed.ok || !parsed.ast || parsed.ast.aspect !== "completed" || parsed.ast.polarity !== "positive") return undefined;
  return parsed.ast;
}
export function parseModernVernacularV21(input: string): ModernVernacularV21ParseResult {
  const tokens = input.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!tokens.length) return v21Rejected("Enter a complete v2.1 temporal construction.");
  const anchors = tokens.reduce<number[]>((out, token, index) => (token === "nemi" ? [...out, index] : out), []);
  const relations = tokens.reduce<number[]>((out, token, index) => (token === "pavo" || token === "sula" ? [...out, index] : out), []);
  if (anchors.length) {
    if (anchors.length !== 1 || anchors[0] !== 0 || relations.length) return v21Rejected("nemi must occur exactly once at the start of a single clause and cannot combine with an event-order relation.");
    const clause = parseModernVernacularV20(tokens.slice(1).join(" "));
    if (!clause.ok || !clause.ast) return v21Rejected("nemi requires a complete, independently licensed v2.0 aspect clause.");
    return { ok: true, grammar: "modern-vernacular-v2.1-locked", ast: { kind: "temporal-anchor", grammarVersion: "2.1", anchor: "now", clause: clause.ast }, diagnostics: [] };
  }
  if (relations.length !== 1) return v21Rejected("A v2.1 event-order construction requires exactly one pavo or sula between two clauses.");
  const relationIndex = relations[0];
  const firstText = tokens.slice(0, relationIndex).join(" ");
  const secondText = tokens.slice(relationIndex + 1).join(" ");
  if (!firstText || !secondText) return v21Rejected("Both sides of the temporal relation must be complete clauses.", relationIndex, tokens[relationIndex]);
  const first = parseV21CompletedClause(firstText);
  if (!first) return v21Rejected("The first event must be a complete, positive v2.0 don clause with a licensed eventive verb.", 0, tokens[0]);
  const second = parseV21CompletedClause(secondText);
  if (!second) return v21Rejected("The second event must be a complete, positive v2.0 don clause with a licensed eventive verb.", relationIndex + 1, tokens[relationIndex + 1]);
  return {
    ok: true,
    grammar: "modern-vernacular-v2.1-locked",
    ast: { kind: "event-order", grammarVersion: "2.1", relation: tokens[relationIndex] === "pavo" ? "before" : "after", first, second },
    diagnostics: []
  };
}

/** Modern Vernacular v2.2: qualitative duration on affirmative completed events. */
export type ModernVernacularV22Ast = {
  kind: "qualitative-duration";
  grammarVersion: "2.2";
  duration: "brief" | "long";
  clause: ModernVernacularV20Ast;
  polarQuestion: boolean;
};
export type ModernVernacularV22ParseResult = {
  ok: boolean;
  grammar: "modern-vernacular-v2.2-locked";
  ast?: ModernVernacularV22Ast;
  diagnostics: ModernVernacularDiagnostic[];
};
function v22Rejected(message: string, tokenIndex?: number, token?: string): ModernVernacularV22ParseResult {
  return { ok: false, grammar: "modern-vernacular-v2.2-locked", diagnostics: [{
    code: "MV1_UNSUPPORTED_CONSTRUCTION", message,
    ...(tokenIndex === undefined ? {} : { tokenIndex }),
    ...(token === undefined ? {} : { token })
  }] };
}
export function parseModernVernacularV22(input: string): ModernVernacularV22ParseResult {
  const tokens = input.trim().toLowerCase().split(/\\s+/).filter(Boolean);
  if (!tokens.length) return v22Rejected("Enter a complete v2.2 qualitative-duration clause.");
  const markers = tokens.reduce<number[]>((out, token, index) => token === "melo" || token === "runi" ? [...out, index] : out, []);
  if (markers.length !== 1) return v22Rejected("A v2.2 duration clause requires exactly one clause-final marker: melo or runi.");
  const markerIndex = markers[0];
  const marker = tokens[markerIndex];
  const polarQuestion = tokens[tokens.length - 1] === "pun";
  const expectedMarkerIndex = tokens.length - (polarQuestion ? 2 : 1);
  if (markerIndex !== expectedMarkerIndex) return v22Rejected("melo or runi must follow every licensed complement and immediately precede an optional pun.", markerIndex, marker);
  if (tokens.includes("nava")) return v22Rejected("Negative completion is not licensed with qualitative duration in v2.2.");
  const clauseTokens = tokens.slice(0, markerIndex);
  const clause = parseModernVernacularV20(clauseTokens.join(" "));
  if (!clause.ok || !clause.ast || clause.ast.aspect !== "completed" || clause.ast.polarity !== "positive") {
    return v22Rejected("Qualitative duration requires a complete affirmative don clause with a v2.0-licensed eventive verb.");
  }
  if (polarQuestion && tokens.includes("nava")) return v22Rejected("Negative polar questions remain blocked.");
  return {
    ok: true,
    grammar: "modern-vernacular-v2.2-locked",
    ast: {
      kind: "qualitative-duration",
      grammarVersion: "2.2",
      duration: marker === "melo" ? "brief" : "long",
      clause: clause.ast,
      polarQuestion
    },
    diagnostics: []
  };
}

/** Modern Vernacular v2.6: standalone typed measurement quantity. */
export type ModernVernacularV26Unit = "ma" | "se" | "ke" | "ra" | "ku";
export type ModernVernacularV26Dimension = "LENGTH" | "TIME" | "MASS" | "PLANE_ANGLE" | "THERMODYNAMIC_TEMPERATURE";
export type ModernVernacularV26Ast = {
  kind: "measurement-quantity";
  grammarVersion: "2.6";
  approximate: boolean;
  value: number;
  scaledValue: number;
  unit: ModernVernacularV26Unit;
  dimension: ModernVernacularV26Dimension;
  raw: string;
};
export type ModernVernacularV26ParseResult = {
  ok: boolean;
  grammar: "modern-vernacular-v2.6-locked";
  ast?: ModernVernacularV26Ast;
  diagnostics: ModernVernacularDiagnostic[];
};

const MV26_DIGITS: Record<string, number> = {
  za: 0, ki: 1, to: 2, mu: 3, re: 4,
  sa: 5, fi: 6, du: 7, go: 8, pe: 9
};
const MV26_UNITS: Record<ModernVernacularV26Unit, ModernVernacularV26Dimension> = {
  ma: "LENGTH",
  se: "TIME",
  ke: "MASS",
  ra: "PLANE_ANGLE",
  ku: "THERMODYNAMIC_TEMPERATURE"
};

function v26Rejected(message: string, tokenIndex?: number, token?: string): ModernVernacularV26ParseResult {
  return {
    ok: false,
    grammar: "modern-vernacular-v2.6-locked",
    diagnostics: [{
      code: "MV1_UNSUPPORTED_CONSTRUCTION",
      message,
      ...(tokenIndex === undefined ? {} : { tokenIndex }),
      ...(token === undefined ? {} : { token })
    }]
  };
}

/** Parses the complete quantity phrase; it deliberately does not parse a sentence or arithmetic. */
export function parseModernVernacularV26(input: string): ModernVernacularV26ParseResult {
  const tokens = input.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!tokens.length) return v26Rejected("Enter one complete v2.6 measurement quantity.");
  let offset = 0;
  const approximate = tokens[offset] === "nela";
  if (approximate) offset++;

  const integerStart = offset;
  while (offset < tokens.length && Object.prototype.hasOwnProperty.call(MV26_DIGITS, tokens[offset])) offset++;
  const integerDigits = tokens.slice(integerStart, offset);
  if (integerDigits.length < 1 || integerDigits.length > 4) {
    return v26Rejected("A quantity requires one to four integer digit tokens.", offset, tokens[offset]);
  }
  if (integerDigits.length > 1 && integerDigits[0] === "za") {
    return v26Rejected("A compound integer cannot begin with zero.", integerStart, tokens[integerStart]);
  }

  let fractionalDigits: string[] = [];
  if (tokens[offset] === "shi") {
    offset++;
    const fractionStart = offset;
    while (offset < tokens.length && Object.prototype.hasOwnProperty.call(MV26_DIGITS, tokens[offset])) offset++;
    fractionalDigits = tokens.slice(fractionStart, offset);
    if (fractionalDigits.length < 1 || fractionalDigits.length > 3) {
      return v26Rejected("The decimal separator shi requires one to three fractional digit tokens.", fractionStart, tokens[fractionStart]);
    }
  }

  const unit = tokens[offset] as ModernVernacularV26Unit | undefined;
  if (!unit || !Object.prototype.hasOwnProperty.call(MV26_UNITS, unit)) {
    return v26Rejected("A quantity must end with exactly one canonical unit: ma, se, ke, ra or ku.", offset, tokens[offset]);
  }
  offset++;
  if (offset !== tokens.length) {
    return v26Rejected("A v2.6 quantity contains exactly one numeric value and one unit; trailing or chained unit tokens are not allowed.", offset, tokens[offset]);
  }

  const integerValue = Number(integerDigits.map(token => MV26_DIGITS[token]).join(""));
  const fractionText = fractionalDigits.map(token => MV26_DIGITS[token]).join("");
  const scaledValue = integerValue * 1000 + Number(fractionText.padEnd(3, "0") || "0");
  if (!Number.isSafeInteger(scaledValue) || scaledValue <= 0) {
    return v26Rejected("A v2.6 measurement quantity must be greater than zero.", integerStart, tokens[integerStart]);
  }
  return {
    ok: true,
    grammar: "modern-vernacular-v2.6-locked",
    ast: {
      kind: "measurement-quantity",
      grammarVersion: "2.6",
      approximate,
      value: scaledValue / 1000,
      scaledValue,
      unit,
      dimension: MV26_UNITS[unit],
      raw: tokens.join(" ")
    },
    diagnostics: []
  };
}

/** Modern Vernacular v2.7: exact comparison of two same-unit typed quantities. */
export type ModernVernacularV27Unit = "ma" | "se" | "ke" | "ra" | "ku";
export type ModernVernacularV27Ast = {
  kind: "quantity-comparison";
  grammarVersion: "2.7";
  relation: "equal" | "less-than" | "greater-than";
  operator: "nari" | "dori" | "gari";
  left: { raw: string; value: number; unit: ModernVernacularV27Unit };
  right: { raw: string; value: number; unit: ModernVernacularV27Unit };
  truth: boolean;
};
export type ModernVernacularV27ParseResult = {
  ok: boolean;
  grammar: "modern-vernacular-v2.7-locked";
  ast?: ModernVernacularV27Ast;
  diagnostics: ModernVernacularDiagnostic[];
};

const MV27_DIGITS: Record<string, string> = {
  za: "0", ki: "1", to: "2", mu: "3", re: "4",
  sa: "5", fi: "6", du: "7", go: "8", pe: "9"
};
const MV27_UNITS = new Set<ModernVernacularV27Unit>(["ma", "se", "ke", "ra", "ku"]);

function v27Rejected(message: string, tokenIndex?: number, token?: string): ModernVernacularV27ParseResult {
  return {
    ok: false,
    grammar: "modern-vernacular-v2.7-locked",
    diagnostics: [{
      code: "MV1_UNSUPPORTED_CONSTRUCTION",
      message,
      ...(tokenIndex === undefined ? {} : { tokenIndex }),
      ...(token === undefined ? {} : { token })
    }]
  };
}

function parseV27Quantity(tokens: string[], offset: number): {
  quantity?: ModernVernacularV27Ast["left"];
  scaledValue?: number;
  next: number;
  error?: string;
} {
  const start = offset;
  if (tokens[offset] === "nela") return { next: offset, error: "Approximate quantities are not licensed in exact v2.7 comparisons." };
  const integerStart = offset;
  while (offset < tokens.length && Object.prototype.hasOwnProperty.call(MV27_DIGITS, tokens[offset])) offset++;
  const integerDigits = tokens.slice(integerStart, offset);
  if (integerDigits.length < 1 || integerDigits.length > 4) {
    return { next: offset, error: "A comparison operand requires one to four integer digit tokens." };
  }
  if (integerDigits.length > 1 && integerDigits[0] === "za") {
    return { next: offset, error: "A compound integer cannot begin with zero." };
  }

  let fractionalDigits: string[] = [];
  if (tokens[offset] === "shi") {
    offset++;
    const fractionStart = offset;
    while (offset < tokens.length && Object.prototype.hasOwnProperty.call(MV27_DIGITS, tokens[offset])) offset++;
    fractionalDigits = tokens.slice(fractionStart, offset);
    if (fractionalDigits.length < 1 || fractionalDigits.length > 3) {
      return { next: offset, error: "The decimal separator shi requires one to three fractional digit tokens." };
    }
  }

  const unit = tokens[offset];
  if (!MV27_UNITS.has(unit as ModernVernacularV27Unit)) {
    return { next: offset, error: "A quantity comparison operand must end with one of the typed units: ma, se, ke, ra or ku." };
  }
  offset++;
  const integerValue = Number(integerDigits.map(digit => MV27_DIGITS[digit]).join(""));
  const fractionText = fractionalDigits.map(digit => MV27_DIGITS[digit]).join("").padEnd(3, "0");
  const scaledValue = integerValue * 1000 + Number(fractionText || "0");
  const value = scaledValue / 1000;
  if (!Number.isFinite(value) || scaledValue <= 0) {
    return { next: offset, error: "Comparison quantities must be finite and greater than zero." };
  }
  return {
    next: offset,
    quantity: {
      raw: tokens.slice(start, offset).join(" "),
      value,
      unit: unit as ModernVernacularV27Unit
    },
    scaledValue
  };
}

export function parseModernVernacularV27(input: string): ModernVernacularV27ParseResult {
  const tokens = input.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!tokens.length) return v27Rejected("Enter a v2.7 quantity comparison.");
  const operator = tokens[0];
  if (operator !== "nari" && operator !== "dori" && operator !== "gari") {
    return v27Rejected("A v2.7 comparison must begin with nari, dori or gari.", 0, operator);
  }
  const left = parseV27Quantity(tokens, 1);
  if (!left.quantity) return v27Rejected(left.error ?? "The first quantity is invalid.", left.next, tokens[left.next]);
  const right = parseV27Quantity(tokens, left.next);
  if (!right.quantity) return v27Rejected(right.error ?? "The second quantity is invalid.", right.next, tokens[right.next]);
  if (right.next !== tokens.length) {
    return v27Rejected("A v2.7 comparison contains exactly one relation and two complete quantities; trailing tokens are not allowed.", right.next, tokens[right.next]);
  }
  if (left.quantity.unit !== right.quantity.unit) {
    return v27Rejected("Both comparison operands must use the exact same unit token. Unit conversion is not defined in v2.7.", left.next, tokens[left.next]);
  }
  const relation = operator === "nari" ? "equal" : operator === "dori" ? "less-than" : "greater-than";
  const leftScaled = left.scaledValue ?? Math.round(left.quantity.value * 1000);
  const rightScaled = right.scaledValue ?? Math.round(right.quantity.value * 1000);
  const truth = relation === "equal"
    ? leftScaled === rightScaled
    : relation === "less-than"
      ? leftScaled < rightScaled
      : leftScaled > rightScaled;
  return {
    ok: true,
    grammar: "modern-vernacular-v2.7-locked",
    ast: {
      kind: "quantity-comparison",
      grammarVersion: "2.7",
      relation,
      operator,
      left: left.quantity,
      right: right.quantity,
      truth
    },
    diagnostics: []
  };
}

export function parseModernVernacular(input: string): ModernVernacularUnifiedParseResult {
  const tokens = input.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.includes("melo") || tokens.includes("runi")) return parseModernVernacularV22(input);
  if (tokens.includes("nemi") || tokens.includes("pavo") || tokens.includes("sula")) return parseModernVernacularV21(input);
  if (tokens.includes("don") || tokens.includes("kok")) return parseModernVernacularV20(input);
  if (["nari", "dori", "gari"].includes(tokens[0])) return parseModernVernacularV27(input);
  if (tokens[0] === "nela" || ["za","ki","to","mu","re","sa","fi","du","go","pe"].includes(tokens[0])) return parseModernVernacularV26(input);
  if (tokens.some(token => token === "lena" || token === "savi" || token === "doru")) return parseModernVernacularV18(input);
  if (["dema","sori","mira","toku"].includes(tokens[0])) return parseModernVernacularV17(input);
  const modalAtOne = ["fam","kong","tek","yemi","zami"].includes(tokens[1]);
  const modalAtTwo = tokens[1] === "nava" && ["fam","kong","tek","yemi","zami"].includes(tokens[2]);
  const actionNegated = ["fam","kong","tek","yemi"].includes(tokens[1]) && tokens[2] === "nava";
  if (tokens.includes("zami") || modalAtTwo || actionNegated) return parseModernVernacularV16(input);
  if (tokens[1] === "yemi") return parseModernVernacularV15(input);
  if (modalAtOne && ["fam","kong","tek"].includes(tokens[1])) return parseModernVernacularV14(input);

  const predicateIndex = tokens[1] === "nava" ? 2 : 1;
  const predicate = tokens[predicateIndex];
  if (predicate === "nak" || predicate === "zir" || predicate === "shus" || predicate === "mos" || predicate === "mol" || predicate === "tut") {
    return parseModernVernacularV11(input);
  }
  if (predicate === "bul" || predicate === "lil") return parseModernVernacularV12(input);
  if (predicate === "ful" || predicate === "zem") return parseModernVernacularV13(input);
  return parseModernVernacularV1(input);
}


/** Modern Vernacular v1.5–v1.6: permission and explicit modal scope. */
export type ModernVernacularV15Ast = {
  kind: "permission-clause"; grammarVersion: "1.5"; subject: "teshi" | "fezo" | "shuk";
  action: ModernVernacularV14Action; polarity: "positive"; question: "none" | "polar" | "information";
};
export type ModernVernacularV16Ast = {
  kind: "modal-scope-clause" | "prohibition-clause"; grammarVersion: "1.6";
  operator: "fam" | "kong" | "tek" | "yemi" | "zami";
  subject: "teshi" | "fezo" | "shuk";
  scope: "modal" | "action" | "prohibition";
  action: ModernVernacularV14Action;
  polarity: "positive" | "negative";
  question: "none" | "polar" | "information";
};
export type ModernVernacularV15ParseResult = { ok: boolean; grammar: "modern-vernacular-v1.5-locked"; ast?: ModernVernacularV15Ast; diagnostics: ModernVernacularDiagnostic[] };
export type ModernVernacularV16ParseResult = { ok: boolean; grammar: "modern-vernacular-v1.6-locked"; ast?: ModernVernacularV16Ast; diagnostics: ModernVernacularDiagnostic[] };

function parseLicensedAction(subject: string, actionTokens: string[]): { action?: ModernVernacularV14Action; diagnostics: ModernVernacularDiagnostic[] } {
  const input = [subject, ...actionTokens].join(" ");
  const verb = actionTokens.find(token => V14_ACTION_VERBS.has(token));
  if (!verb) return { diagnostics: [{ code: "MV1_UNSUPPORTED_CONSTRUCTION", message: "A licensed action verb is required." }] };
  if (verb === "wish") {
    const p = parseModernVernacularV1(input);
    return p.ok && p.ast?.kind === "clause" ? { action: { version: "1.0", ast: p.ast }, diagnostics: [] } : { diagnostics: p.diagnostics };
  }
  if (["nak","zir","shus","mos","mol","tut"].includes(verb)) {
    const p = parseModernVernacularV11(input);
    return p.ok && p.ast ? { action: { version: "1.1", ast: p.ast }, diagnostics: [] } : { diagnostics: p.diagnostics };
  }
  if (verb === "bul" || verb === "lil") {
    const p = parseModernVernacularV12(input);
    return p.ok && p.ast ? { action: { version: "1.2", ast: p.ast }, diagnostics: [] } : { diagnostics: p.diagnostics };
  }
  const p = parseModernVernacularV13(input);
  return p.ok && p.ast ? { action: { version: "1.3", ast: p.ast }, diagnostics: [] } : { diagnostics: p.diagnostics };
}

function v15Rejected(message: string): ModernVernacularV15ParseResult {
  return { ok: false, grammar: "modern-vernacular-v1.5-locked", diagnostics: [{ code: "MV1_UNSUPPORTED_CONSTRUCTION", message }] };
}
export function parseModernVernacularV15(input: string): ModernVernacularV15ParseResult {
  const t = input.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (t.length < 3 || t[1] !== "yemi") return v15Rejected("v1.5 requires subject + yemi + a licensed action frame.");
  if (t.includes("nava") || t.includes("fam") || t.includes("kong") || t.includes("tek") || t.includes("zami")) return v15Rejected("v1.5 blocks permission negation and modal stacking; those distinctions are handled only by later canon.");
  const subject = t[0];
  if (!["teshi","fezo","shuk"].includes(subject)) return v15Rejected("The permission subject slot accepts teshi, fezo or shuk.");
  const question = t[t.length-1] === "pun" ? "polar" : "none";
  if (subject === "shuk" && question === "polar") return v15Rejected("An in-situ subject information question cannot be combined with pun.");
  const body = question === "polar" ? t.slice(2,-1) : t.slice(2);
  const parsed = parseLicensedAction(subject, body);
  if (!parsed.action) return { ok:false, grammar:"modern-vernacular-v1.5-locked", diagnostics:parsed.diagnostics };
  const actionQuestion = parsed.action.ast.question; 
  if (question === "polar" && actionQuestion === "information") return v15Rejected("An information question cannot be combined with pun.");
  return { ok:true, grammar:"modern-vernacular-v1.5-locked", ast:{kind:"permission-clause",grammarVersion:"1.5",subject:subject as ModernVernacularV15Ast["subject"],action:parsed.action,polarity:"positive",question:question === "polar" ? "polar" : actionQuestion},diagnostics:[] };
}

function v16Rejected(message: string): ModernVernacularV16ParseResult {
  return { ok:false, grammar:"modern-vernacular-v1.6-locked", diagnostics:[{code:"MV1_UNSUPPORTED_CONSTRUCTION",message}] };
}
export function parseModernVernacularV16(input: string): ModernVernacularV16ParseResult {
  const t=input.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if(t.length<3) return v16Rejected("A v1.6 modal or prohibition requires a subject and licensed action frame.");
  const subject=t[0];
  if(!["teshi","fezo","shuk"].includes(subject)) return v16Rejected("The subject slot accepts teshi, fezo or shuk.");
  const polar=t[t.length-1]==="pun";
  const core=polar?t.slice(0,-1):t;
  const operatorIndex=core[1]==="nava"?2:1;
  const operator=core[operatorIndex];
  if(operator==="zami"){
    if(core.includes("nava") || core.includes("yemi")) return v16Rejected("zami cannot be negated or combined with yemi in v1.6.");
    if(subject==="shuk" && polar) return v16Rejected("An in-situ subject information question cannot be combined with pun.");
    const parsed=parseLicensedAction(subject,core.slice(2));
    if(!parsed.action) return {ok:false,grammar:"modern-vernacular-v1.6-locked",diagnostics:parsed.diagnostics};
    const q=parsed.action.ast.question;
    if(polar && q==="information") return v16Rejected("An information question cannot be combined with pun.");
    return {ok:true,grammar:"modern-vernacular-v1.6-locked",ast:{kind:"prohibition-clause",grammarVersion:"1.6",operator:"zami",subject:subject as ModernVernacularV16Ast["subject"],scope:"prohibition",action:parsed.action,polarity:"positive",question:polar?"polar":q},diagnostics:[]};
  }
  if(!["fam","kong","tek","yemi"].includes(operator)) return v16Rejected("v1.6 requires fam, kong, tek, yemi or zami.");
  if(core.includes("fam",operatorIndex+1) || core.includes("kong",operatorIndex+1) || core.includes("tek",operatorIndex+1) || core.includes("yemi",operatorIndex+1)) return v16Rejected("Modal stacking is blocked in v1.6.");
  const modalNegated=core[1]==="nava";
  const actionNegated=core[operatorIndex+1]==="nava";
  if(modalNegated && actionNegated) return v16Rejected("Only one nava scope position is licensed per v1.6 clause.");
  const actionStart=operatorIndex+1+(actionNegated?1:0);
  const actionTokens=core.slice(actionStart);
  if(subject==="shuk" && polar) return v16Rejected("An in-situ subject information question cannot be combined with pun.");
  const parsed=parseLicensedAction(subject,actionNegated?["nava",...actionTokens]:actionTokens);
  if(!parsed.action) return {ok:false,grammar:"modern-vernacular-v1.6-locked",diagnostics:parsed.diagnostics};
  const q=parsed.action.ast.question;
  if(polar && q==="information") return v16Rejected("An information question cannot be combined with pun.");
  return {ok:true,grammar:"modern-vernacular-v1.6-locked",ast:{kind:"modal-scope-clause",grammarVersion:"1.6",operator:operator as ModernVernacularV16Ast["operator"],subject:subject as ModernVernacularV16Ast["subject"],scope:modalNegated?"modal":actionNegated?"action":"modal",action:parsed.action,polarity:modalNegated?"negative": "positive",question:polar?"polar":q},diagnostics:[]};
}


/** Modern Vernacular v1.7 directive speech acts and v1.8 clause relations. */
export type ModernVernacularV17Action =
  | { version: "1.0"; ast: Omit<Extract<ModernVernacularAst, { kind: "clause" }>, "participantA"> & { participantA: { kind: "participant"; form: "addressee" } } }
  | { version: "1.1"; ast: Omit<ModernVernacularV11Ast, "subject"> & { subject: "addressee" } }
  | { version: "1.2"; ast: Omit<ModernVernacularV12Ast, "subject"> & { subject: "addressee" } }
  | { version: "1.3"; ast: Omit<ModernVernacularV13Ast, "mover"> & { mover: "addressee" } };
export type ModernVernacularV17Ast = {
  kind: "directive-clause"; grammarVersion: "1.7";
  directive: "dema" | "sori" | "mira" | "toku";
  actor: "addressee"; action: ModernVernacularV17Action;
};
export type ModernVernacularV18Ast = {
  kind: "linked-clauses"; grammarVersion: "1.8";
  relation: "coordination" | "reason" | "consequence";
  linker: "lena" | "savi" | "doru";
  left: ModernVernacularUnifiedParseResult;
  right: ModernVernacularUnifiedParseResult;
};
export type ModernVernacularV17ParseResult = { ok:boolean; grammar:"modern-vernacular-v1.7-locked"; ast?:ModernVernacularV17Ast; diagnostics:ModernVernacularDiagnostic[] };
export type ModernVernacularV18ParseResult = { ok:boolean; grammar:"modern-vernacular-v1.8-locked"; ast?:ModernVernacularV18Ast; diagnostics:ModernVernacularDiagnostic[] };

function toDirectiveAction(action: ModernVernacularV14Action): ModernVernacularV17Action {
  if (action.version === "1.0") {
    return { version: "1.0", ast: { ...action.ast, participantA: { kind: "participant", form: "addressee" } } };
  }
  if (action.version === "1.1") {
    return { version: "1.1", ast: { ...action.ast, subject: "addressee" } };
  }
  if (action.version === "1.2") {
    return { version: "1.2", ast: { ...action.ast, subject: "addressee" } };
  }
  return { version: "1.3", ast: { ...action.ast, mover: "addressee" } };
}

function v17Rejected(message:string):ModernVernacularV17ParseResult {
  return {ok:false,grammar:"modern-vernacular-v1.7-locked",diagnostics:[{code:"MV1_UNSUPPORTED_CONSTRUCTION",message}]};
}
export function parseModernVernacularV17(input:string):ModernVernacularV17ParseResult {
  const t=input.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const directive=t[0];
  if(!["dema","sori","mira","toku"].includes(directive)) return v17Rejected("v1.7 utterances begin with dema, sori, mira or toku.");
  if(t.includes("pun") || t.includes("nava") || t.some(x=>["fam","kong","tek","yemi","zami","dema","sori","mira","toku"].includes(x) && x!==directive)) return v17Rejected("Directive questions, negation, modal combinations and directive stacking are blocked in v1.7.");
  const parsed=parseLicensedAction("teshi",t.slice(1));
  if(!parsed.action) return {ok:false,grammar:"modern-vernacular-v1.7-locked",diagnostics:parsed.diagnostics};
  return {ok:true,grammar:"modern-vernacular-v1.7-locked",ast:{kind:"directive-clause",grammarVersion:"1.7",directive:directive as ModernVernacularV17Ast["directive"],actor:"addressee",action:toDirectiveAction(parsed.action)},diagnostics:[]};
}
function v18Rejected(message:string):ModernVernacularV18ParseResult {
  return {ok:false,grammar:"modern-vernacular-v1.8-locked",diagnostics:[{code:"MV1_UNSUPPORTED_CONSTRUCTION",message}]};
}
export function parseModernVernacularV18(input:string):ModernVernacularV18ParseResult {
  const t=input.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const linkers=t.filter(x=>x==="lena"||x==="savi"||x==="doru");
  if(linkers.length!==1) return v18Rejected("v1.8 requires exactly one linker between two complete clauses; nested or missing linkers are not licensed.");
  if(t.includes("shuk")||t.includes("zosh")) return v18Rejected("Information-question scope across linked clauses is unresolved in v1.8.");
  const linker=linkers[0];
  const at=t.indexOf(linker);
  if(at===0||at===t.length-1) return v18Rejected("A clause linker must have a complete clause on both sides.");
  const leftTokens=t.slice(0,at);
  const rightTokens=t.slice(at+1);
  if(rightTokens.includes("pun")) return v18Rejected("A final pun would ambiguously scope over the linked construction; only a clause-local question before the linker is licensed.");
  const leftInput=leftTokens.join(" ");
  const rightInput=rightTokens.join(" ");
  const left=parseModernVernacular(leftInput);
  const right=parseModernVernacular(rightInput);
  if(!left.ok||!right.ok) return v18Rejected("Both sides of a v1.8 linker must independently parse as complete licensed clauses.");
  if(left.grammar==="modern-vernacular-v1.7-locked"||right.grammar==="modern-vernacular-v1.7-locked") return v18Rejected("Directive utterances cannot be coordinated or causally linked in v1.8.");
  return {ok:true,grammar:"modern-vernacular-v1.8-locked",ast:{kind:"linked-clauses",grammarVersion:"1.8",relation:linker==="lena"?"coordination":linker==="savi"?"reason":"consequence",linker:linker as ModernVernacularV18Ast["linker"],left,right},diagnostics:[]};
}
