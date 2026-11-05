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
  | "MV12_BLOCKED_NEGATIVE_POLAR";

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
    return v12Rejected("MV12_INVALID_TRANSFER_FRAME", "A v1.2 transfer clause requires: participant + [nava] + bul/lil + li + item + ka/du + participant.");
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
