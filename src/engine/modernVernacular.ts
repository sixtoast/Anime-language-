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
const RESPONSES: Record<string, "yes" | "no" | "maybe"> = {
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
    const form = tokens[0] as keyof typeof RESPONSES;
    return {
      ok: true,
      grammar: "modern-vernacular-v1.0-locked",
      ast: { kind: "response", form, meaning: RESPONSES[form] },
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
  | ModernVernacularV14ParseResult;

export function parseModernVernacular(input: string): ModernVernacularUnifiedParseResult | ModernVernacularV15ParseResult | ModernVernacularV16ParseResult {
  const tokens = input.trim().toLowerCase().split(/\s+/).filter(Boolean);
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
  const body = question === "polar" ? t.slice(2,-1) : t.slice(2);
  const parsed = parseLicensedAction(subject, body);
  if (!parsed.action) return { ok:false, grammar:"modern-vernacular-v1.5-locked", diagnostics:parsed.diagnostics };
  const actionQuestion = parsed.action.version === "1.0" ? parsed.action.ast.question : parsed.action.ast.question;
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
    const parsed=parseLicensedAction(subject,core.slice(2));
    if(!parsed.action) return {ok:false,grammar:"modern-vernacular-v1.6-locked",diagnostics:parsed.diagnostics};
    const q=parsed.action.version==="1.0"?parsed.action.ast.question:parsed.action.ast.question;
    return {ok:true,grammar:"modern-vernacular-v1.6-locked",ast:{kind:"prohibition-clause",grammarVersion:"1.6",operator:"zami",subject:subject as ModernVernacularV16Ast["subject"],scope:"prohibition",action:parsed.action,polarity:"positive",question:polar?"polar":q},diagnostics:[]};
  }
  if(!["fam","kong","tek","yemi"].includes(operator)) return v16Rejected("v1.6 requires fam, kong, tek, yemi or zami.");
  if(core.includes("fam",operatorIndex+1) || core.includes("kong",operatorIndex+1) || core.includes("tek",operatorIndex+1) || core.includes("yemi",operatorIndex+1)) return v16Rejected("Modal stacking is blocked in v1.6.");
  const modalNegated=core[1]==="nava";
  const actionNegated=core[operatorIndex+1]==="nava";
  if(modalNegated && actionNegated) return v16Rejected("Only one nava scope position is licensed per v1.6 clause.");
  const actionStart=operatorIndex+1+(actionNegated?1:0);
  const actionTokens=core.slice(actionStart);
  const parsed=parseLicensedAction(subject,actionNegated?["nava",...actionTokens]:actionTokens);
  if(!parsed.action) return {ok:false,grammar:"modern-vernacular-v1.6-locked",diagnostics:parsed.diagnostics};
  const q=parsed.action.version==="1.0"?parsed.action.ast.question:parsed.action.ast.question;
  return {ok:true,grammar:"modern-vernacular-v1.6-locked",ast:{kind:"modal-scope-clause",grammarVersion:"1.6",operator:operator as ModernVernacularV16Ast["operator"],subject:subject as ModernVernacularV16Ast["subject"],scope:modalNegated?"modal":actionNegated?"action":"modal",action:parsed.action,polarity:modalNegated?"negative": "positive",question:polar?"polar":q},diagnostics:[]};
}
