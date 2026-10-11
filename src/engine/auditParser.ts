/**
 * Parser for the PROVISIONAL Phase 2 audit notation only.
 * This is not a parser for spoken or ordinary written Arcane.
 * It checks grouping and the small set of operator arities explicitly
 * proposed in Phase 2; it does not perform semantic or dimensional typing.
 */

export type AuditNode =
  | { kind: "symbol"; value: string }
  | { kind: "call"; operator: string; args: AuditNode[] };

export interface Diagnostic {
  code: "EMPTY_INPUT" | "EXPECTED_OPERATOR" | "EXPECTED_OPEN" | "EXPECTED_ARGUMENT" |
    "EXPECTED_SEPARATOR_OR_CLOSE" | "TRAILING_INPUT" | "UNKNOWN_ARITY" | "ARITY_MISMATCH";
  message: string;
  offset: number;
}

export interface AuditParseResult {
  ok: boolean;
  ast?: AuditNode;
  diagnostics: Diagnostic[];
  notation: "phase-2-provisional";
}

const ARITY: Record<string, number> = {
  FRAPA: 2, FRATA: 2, FRAKA: 2, FRALA: 2, FRASHA: 1,
  DRAN: 1, DREM: 2, DRIM: 2, DRAL: 3
};

type Token = { kind: "word" | "open" | "close" | "comma" | "eof"; value: string; offset: number };

function lex(input: string): { tokens: Token[]; diagnostics: Diagnostic[] } {
  const tokens: Token[] = [];
  const diagnostics: Diagnostic[] = [];
  let i = 0;
  while (i < input.length) {
    const ch = input[i];
    if (/\s/.test(ch)) { i++; continue; }
    if (ch === "⟨") { tokens.push({ kind: "open", value: ch, offset: i++ }); continue; }
    if (ch === "⟩") { tokens.push({ kind: "close", value: ch, offset: i++ }); continue; }
    if (ch === ",") { tokens.push({ kind: "comma", value: ch, offset: i++ }); continue; }
    if (/[A-Za-z0-9_]/.test(ch)) {
      const start = i;
      while (i < input.length && /[A-Za-z0-9_-]/.test(input[i])) i++;
      tokens.push({ kind: "word", value: input.slice(start, i).toUpperCase(), offset: start });
      continue;
    }
    diagnostics.push({
      code: "EXPECTED_ARGUMENT",
      message: `Unexpected character "${ch}" in Phase 2 audit notation.`,
      offset: i
    });
    i++;
  }
  tokens.push({ kind: "eof", value: "", offset: input.length });
  return { tokens, diagnostics };
}

export function parseAuditExpression(input: string): AuditParseResult {
  const { tokens, diagnostics } = lex(input);
  let cursor = 0;
  const peek = () => tokens[cursor];
  const take = () => tokens[cursor++];

  if (!input.trim()) {
    return { ok: false, diagnostics: [{ code: "EMPTY_INPUT", message: "Enter an expression to parse.", offset: 0 }], notation: "phase-2-provisional" };
  }
  if (diagnostics.length) return { ok: false, diagnostics, notation: "phase-2-provisional" };

  function parseNode(): AuditNode | undefined {
    const head = peek();
    if (head.kind !== "word") {
      diagnostics.push({ code: "EXPECTED_OPERATOR", message: "Expected an operator or symbol.", offset: head.offset });
      return undefined;
    }
    take();
    if (peek().kind !== "open") {
      return { kind: "symbol", value: head.value };
    }
    take();
    const args: AuditNode[] = [];
    if (peek().kind === "close") {
      diagnostics.push({ code: "EXPECTED_ARGUMENT", message: "An operator call must contain its required arguments.", offset: peek().offset });
      return undefined;
    }
    while (true) {
      const arg = parseNode();
      if (!arg) return undefined;
      args.push(arg);
      if (peek().kind === "comma") { take(); continue; }
      if (peek().kind === "close") { take(); break; }
      diagnostics.push({ code: "EXPECTED_SEPARATOR_OR_CLOSE", message: "Expected a comma between arguments or a closing ⟩.", offset: peek().offset });
      return undefined;
    }
    const expected = ARITY[head.value];
    if (expected === undefined) {
      diagnostics.push({ code: "UNKNOWN_ARITY", message: `No Phase 2 arity is registered for ${head.value}; the parser will not guess.`, offset: head.offset });
      return undefined;
    }
    if (args.length !== expected) {
      diagnostics.push({ code: "ARITY_MISMATCH", message: `${head.value} expects ${expected} argument(s) in the provisional audit register, received ${args.length}.`, offset: head.offset });
      return undefined;
    }
    return { kind: "call", operator: head.value, args };
  }

  const ast = parseNode();
  if (peek().kind !== "eof") {
    diagnostics.push({ code: "TRAILING_INPUT", message: "Unexpected trailing input after the expression.", offset: peek().offset });
  }
  if (!ast || diagnostics.length) return { ok: false, diagnostics, notation: "phase-2-provisional" };
  return { ok: true, ast, diagnostics: [], notation: "phase-2-provisional" };
}
