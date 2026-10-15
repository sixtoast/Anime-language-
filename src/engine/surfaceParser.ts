/**
 * Narrow TypeScript port of the archived Phase 6G surface-parser design.
 *
 * This is a separate, provisional parser for whitespace-tokenised surface-like
 * expressions. It does not replace parseAuditExpression, load the canonical
 * lexicon, type-check expressions, evaluate spells, or establish canon.
 */
import { inspectLexiconForm, resolveLexiconForm, type LexiconRegistry } from "./lexiconRegistry";

export type SurfaceNode =
  | { kind: "atom"; form: string; lexicalClass: string }
  | { kind: "quantity"; value: string; unit: string; rawNumber: string }
  | { kind: "identifier"; digits: string }
  | { kind: "call"; operator: string; args: SurfaceNode[] }
  | { kind: "block"; expressions: SurfaceNode[] };

export type SurfaceDiagnosticCode =
  | "EMPTY_INPUT"
  | "UNEXPECTED_END"
  | "UNTERMINATED_NUMERAL"
  | "MALFORMED_DECIMAL"
  | "INVALID_NUMERAL"
  | "IDENTIFIER_NOT_CLOSED"
  | "EXPECTED_IDENTIFIER"
  | "MISSING_BLOCK_OPEN"
  | "MISSING_BLOCK_CLOSE"
  | "BLOCK_DELIMITER_OUTSIDE_CONTROL"
  | "UNKNOWN_LEXICAL_FORM"
  | "UNRESOLVED_OPERATOR"
  | "AMBIGUOUS_HOMOPHONE"
  | "INVALID_COMPARISON_CRITERION"
  | "TRAILING_EXPRESSIONS";

export interface SurfaceDiagnostic {
  code: SurfaceDiagnosticCode;
  message: string;
  tokenIndex: number;
  token?: string;
  /** Original source spelling at tokenIndex, retained even when aliases are normalised. */
  sourceToken?: string;
}

export interface SurfaceParseResult {
  ok: boolean;
  notation: "phase-6g-provisional";
  ast?: SurfaceNode;
  diagnostics: SurfaceDiagnostic[];
}

export interface SurfaceParserOptions {
  /** Additional lexicon forms permitted as atomic leaves. */
  knownAtoms?: readonly string[];
  /** Enable the archived prototype's legacy spelling normalisation. */
  allowLegacyAliases?: boolean;
  /** Optional source-loaded registry. It is consulted only for lexical atoms and alias resolution. */
  lexiconRegistry?: LexiconRegistry;
}

const DIGITS: Readonly<Record<string, string>> = {
  za: "0", ki: "1", to: "2", mu: "3", re: "4",
  sa: "5", fi: "6", du: "7", go: "8", pe: "9"
};
const UNITS = new Set(["ma", "se", "ke", "ra", "ku", "sho", "vo"]);
const AUDIT_CRITERIA = new Set(["lt", "le", "eq", "ne", "ge", "gt"]);
const ARITY: Readonly<Record<string, number>> = {
  frapa: 2, fraja: 2, frama: 2, frala: 2, frasha: 1,
  dran: 1, drem: 2, drum: 2, dras: 3,
  gran: 2, grat: 2, grash: 1,
  kwam: 2, kwat: 1, kwash: 1,
  bek: 2, zet: 2, kole: 2
};
const CONTROL = new Set(["bek", "zet", "kole"]);
const LEGACY_ALIASES: Readonly<Record<string, string>> = {
  frata: "fraja", fraka: "frama", drim: "drum",
  dral: "dras", grak: "grash", kwak: "kwash"
};
const OPERATOR_CLASSES = new Set(["frapa", "frata", "fraka", "frala", "frasha", "dran", "drem", "drim", "dral", "fraja", "frama", "drum", "dras", "gran", "grat", "grak", "grash", "kwam", "kwat", "kwak", "kwash", "bek", "zet", "kole", "nes", "gama", "dave", "sima", "weki", "ruki"]);

class ParseFailure extends Error {
  constructor(
    readonly code: SurfaceDiagnosticCode,
    message: string,
    readonly tokenIndex: number,
    readonly token?: string
  ) {
    super(message);
    this.name = "ParseFailure";
  }
}

class Parser {
  private readonly tokens: string[];
  private readonly sourceTokens: string[];
  private cursor = 0;
  private readonly knownAtoms: Set<string>;
  private readonly lexiconRegistry?: LexiconRegistry;

  constructor(input: string, options: SurfaceParserOptions) {
    this.sourceTokens = input.trim() ? input.trim().split(/\s+/) : [];
    this.tokens = this.sourceTokens.map((token) => {
      const lowered = token.toLowerCase();
      if (options.lexiconRegistry) return resolveLexiconForm(options.lexiconRegistry, lowered, { allowLegacyAliases: options.allowLegacyAliases }).resolvedForm;
      return options.allowLegacyAliases === true ? (LEGACY_ALIASES[lowered] ?? lowered) : lowered;
    });
    this.knownAtoms = new Set((options.knownAtoms ?? []).map((atom) => atom.toLowerCase()));
    this.lexiconRegistry = options.lexiconRegistry;
  }

  sourceTokenAt(index: number): string | undefined { return this.sourceTokens[index]; }

  private peek(): string | undefined { return this.tokens[this.cursor]; }

  private take(): string {
    const token = this.peek();
    if (token === undefined) {
      throw new ParseFailure("UNEXPECTED_END", "Unexpected end of input while parsing an expression.", this.cursor);
    }
    this.cursor += 1;
    return token;
  }

  parseAll(): SurfaceNode {
    if (this.tokens.length === 0) {
      throw new ParseFailure("EMPTY_INPUT", "Enter a surface expression to parse.", 0);
    }
    const node = this.expression();
    if (this.peek() !== undefined) {
      throw new ParseFailure("TRAILING_EXPRESSIONS", "More than one top-level expression was found; exactly one is required.", this.cursor, this.peek());
    }
    return node;
  }

  private parseNumeral(): SurfaceNode {
    const start = this.cursor;
    const whole: string[] = [];
    while (this.peek() !== undefined && Object.hasOwn(DIGITS, this.peek()!)) {
      whole.push(DIGITS[this.take()]);
    }
    if (whole.length === 0) {
      throw new ParseFailure("INVALID_NUMERAL", "Expected at least one numeral digit.", start, this.peek());
    }

    let fraction: string | undefined;
    if (this.peek() === "shi") {
      this.take();
      const digits: string[] = [];
      while (this.peek() !== undefined && Object.hasOwn(DIGITS, this.peek()!)) {
        digits.push(DIGITS[this.take()]);
      }
      if (digits.length === 0) {
        throw new ParseFailure("MALFORMED_DECIMAL", "SHI must be followed by at least one fractional digit.", this.cursor, this.peek());
      }
      fraction = digits.join("");
    }

    const unit = this.peek();
    const numeralTokens = this.tokens.slice(start, this.cursor);
    const ambiguousDigit = numeralTokens.find((token) => token === "re");
    if (ambiguousDigit !== undefined || unit === "ra") {
      const token = ambiguousDigit ?? unit!;
      throw new ParseFailure(
        "AMBIGUOUS_HOMOPHONE",
        `${token.toUpperCase()} has a documented digit/unit/reference collision; this parser has no slot-sensitive disambiguation policy and therefore rejects the numeral.`,
        ambiguousDigit === undefined ? this.cursor : numeralTokens.indexOf(ambiguousDigit) + start,
        token
      );
    }
    if (unit === undefined || !UNITS.has(unit)) {
      const first = this.tokens[start];
      const code: SurfaceDiagnosticCode = first === "ra" ? "AMBIGUOUS_HOMOPHONE" : "UNTERMINATED_NUMERAL";
      const message = code === "AMBIGUOUS_HOMOPHONE"
        ? `${first.toUpperCase()} is ambiguous in this numeral context; context-sensitive disambiguation is not implemented.`
        : `Numeral "${this.tokens.slice(start, this.cursor).join(" ")}" is not closed by a registered unit (SHO closes dimensionless values).`;
      throw new ParseFailure(code, message, start, first);
    }
    this.take();
    const rawNumber = whole.join("") + (fraction === undefined ? "" : `.${fraction}`);
    if (!/^\d+(\.\d+)?$/.test(rawNumber)) {
      throw new ParseFailure("INVALID_NUMERAL", "Numeral could not be represented as a decimal value.", start, this.tokens[start]);
    }
    return { kind: "quantity", value: rawNumber, unit: unit.toUpperCase(), rawNumber };
  }

  private parseIdentifier(): SurfaceNode {
    const start = this.cursor;
    const digits: string[] = [];
    while (this.peek() !== undefined && Object.hasOwn(DIGITS, this.peek()!)) {
      digits.push(DIGITS[this.take()]);
    }
    if (digits.length === 0) {
      throw new ParseFailure("EXPECTED_IDENTIFIER", "A binding identifier must begin with one or more digit tokens.", start, this.peek());
    }
    if (this.peek() !== "sho") {
      throw new ParseFailure("IDENTIFIER_NOT_CLOSED", "A binding identifier must end with SHO.", start, this.tokens[start]);
    }
    this.take();
    return { kind: "identifier", digits: digits.join("") };
  }

  private expression(): SurfaceNode {
    const token = this.peek();
    if (token === undefined) {
      throw new ParseFailure("UNEXPECTED_END", "Expected an expression, found end of input.", this.cursor);
    }
    if (Object.hasOwn(DIGITS, token)) return this.parseNumeral();
    if (token === "meto" || token === "dogu") {
      throw new ParseFailure("BLOCK_DELIMITER_OUTSIDE_CONTROL", `${token.toUpperCase()} is only valid inside a control form.`, this.cursor, token);
    }

    if (Object.hasOwn(ARITY, token)) {
      const operator = this.take();
      if (operator === "kwam") {
        const identifier = this.parseIdentifier();
        return { kind: "call", operator: operator.toUpperCase(), args: [identifier, this.expression()] };
      }
      if (operator === "kwat") {
        const identifier = this.parseIdentifier();
        return { kind: "call", operator: operator.toUpperCase(), args: [identifier] };
      }
      if (CONTROL.has(operator)) {
        const condition = this.expression();
        if (this.peek() !== "meto") {
          throw new ParseFailure("MISSING_BLOCK_OPEN", `${operator.toUpperCase()} requires METO before its block.`, this.cursor, this.peek());
        }
        this.take();
        const expressions: SurfaceNode[] = [];
        while (this.peek() !== "dogu") {
          if (this.peek() === undefined) {
            throw new ParseFailure("MISSING_BLOCK_CLOSE", `${operator.toUpperCase()} block is missing DOGU.`, this.cursor);
          }
          expressions.push(this.expression());
        }
        this.take();
        return { kind: "call", operator: operator.toUpperCase(), args: [condition, { kind: "block", expressions }] };
      }
      if (operator === "dras") {
        const first = this.expression();
        const second = this.expression();
        const criterion = this.peek();
        if (criterion === undefined || !AUDIT_CRITERIA.has(criterion)) {
          throw new ParseFailure("INVALID_COMPARISON_CRITERION", "DRAS requires an audit-only comparison criterion (LT/LE/EQ/NE/GE/GT); canonical surface forms remain unresolved.", this.cursor, criterion);
        }
        this.take();
        return { kind: "call", operator: operator.toUpperCase(), args: [first, second, { kind: "atom", form: criterion.toUpperCase(), lexicalClass: "AUDIT_CRITERION" }] };
      }
      const args: SurfaceNode[] = [];
      for (let index = 0; index < ARITY[operator]; index += 1) args.push(this.expression());
      return { kind: "call", operator: operator.toUpperCase(), args };
    }

    if (token === "re" || token === "ra") {
      throw new ParseFailure("AMBIGUOUS_HOMOPHONE", `${token.toUpperCase()} is a documented homophone; disambiguation is not implemented.`, this.cursor, token);
    }
    const form = this.take();
    if (OPERATOR_CLASSES.has(form)) {
      throw new ParseFailure("UNRESOLVED_OPERATOR", `Operator ${form.toUpperCase()} has no usable signature in this parser context.`, this.cursor - 1, form);
    }
    if (this.lexiconRegistry) {
      const inspected = inspectLexiconForm(this.lexiconRegistry, form);
      if (inspected.isCollision) {
        throw new ParseFailure("AMBIGUOUS_HOMOPHONE", `${form.toUpperCase()} has multiple source lexical analyses; this parser has no contextual disambiguation policy and therefore rejects it.`, this.cursor - 1, form);
      }
      if (inspected.entry) {
        return { kind: "atom", form: inspected.form.toUpperCase(), lexicalClass: inspected.entry.classes.join("|") || "LEXICON_ATOM" };
      }
    }
    if (this.knownAtoms.has(form)) {
      return { kind: "atom", form: form.toUpperCase(), lexicalClass: "KNOWN_ATOM" };
    }
    throw new ParseFailure("UNKNOWN_LEXICAL_FORM", `Lexical form "${form}" is not in the explicitly supplied atom inventory.`, this.cursor - 1, form);
  }
}

export function parseSurfaceExpression(input: string, options: SurfaceParserOptions = {}): SurfaceParseResult {
  const parser = new Parser(input, options);
  try {
    const ast = parser.parseAll();
    return { ok: true, notation: "phase-6g-provisional", ast, diagnostics: [] };
  } catch (error) {
    if (error instanceof ParseFailure) {
      return {
        ok: false,
        notation: "phase-6g-provisional",
        diagnostics: [{ code: error.code, message: error.message, tokenIndex: error.tokenIndex, ...(error.token === undefined ? {} : { token: error.token }), ...(parser.sourceTokenAt(error.tokenIndex) === undefined ? {} : { sourceToken: parser.sourceTokenAt(error.tokenIndex) }) }]
      };
    }
    return {
      ok: false,
      notation: "phase-6g-provisional",
      diagnostics: [{ code: "UNEXPECTED_END", message: error instanceof Error ? error.message : "Unexpected parser failure.", tokenIndex: 0 }]
    };
  }
}
