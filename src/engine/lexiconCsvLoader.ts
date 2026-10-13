import {
  buildLexiconRegistry,
  type LexiconAlias,
  type LexiconRegistry,
  type LexiconRow
} from "./lexiconRegistry";

export interface ParsedCsv {
  headers: string[];
  rows: Record<string, string>[];
  diagnostics: string[];
}

/**
 * Small RFC-4180-style CSV reader for the project's simple UTF-8 source files.
 * Handles quoted commas, doubled quotes, CRLF/LF and embedded newlines.
 * Rows with the wrong number of cells are diagnosed and excluded.
 */
export function parseCsvText(text: string): ParsedCsv {
  const records: string[][] = [];
  let record: string[] = [];
  let field = "";
  let quoted = false;
  const input = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    if (quoted) {
      if (char === '"' && input[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"' && field.length === 0) {
      quoted = true;
    } else if (char === ",") {
      record.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && input[i + 1] === "\n") i += 1;
      record.push(field);
      field = "";
      if (record.some((cell) => cell.trim() !== "")) records.push(record);
      record = [];
    } else {
      field += char;
    }
  }

  if (quoted) {
    return { headers: [], rows: [], diagnostics: ["CSV ended inside a quoted field; no rows were returned."] };
  }
  if (field.length > 0 || record.length > 0) {
    record.push(field);
    if (record.some((cell) => cell.trim() !== "")) records.push(record);
  }
  if (records.length === 0) {
    return { headers: [], rows: [], diagnostics: ["CSV contains no header or data rows."] };
  }

  const headers = records[0].map((header) => header.trim().toLowerCase());
  const diagnostics: string[] = [];
  if (headers.some((header) => !header)) {
    diagnostics.push("CSV contains an empty column name.");
    return { headers, rows: [], diagnostics };
  }
  if (new Set(headers).size !== headers.length) {
    diagnostics.push("CSV contains duplicate column names.");
    return { headers, rows: [], diagnostics };
  }

  const validRecords: string[][] = [];
  records.slice(1).forEach((cells, rowIndex) => {
    if (cells.length !== headers.length) {
      diagnostics.push(`Record ${rowIndex + 2} has ${cells.length} cells; expected ${headers.length}; record excluded.`);
    } else {
      validRecords.push(cells);
    }
  });
  const rows = validRecords.map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""])));
  return { headers, rows, diagnostics };
}

export interface LoadLexiconTextOptions {
  sourceLabel: string;
  sourceVersion: string;
  aliasCsvText?: string;
}

export interface LoadedLexiconText {
  registry: LexiconRegistry;
  rowCount: number;
  aliasRowCount: number;
  sourceDiagnostics: string[];
  aliases: LexiconAlias[];
}

const REQUIRED_LEXICON_HEADERS = ["form", "gloss", "cls", "register", "status", "source", "note"];
const REQUIRED_ALIAS_HEADERS = ["legacy_form", "preferred_form", "gloss", "source_decision", "compatibility_status", "lexicon_status"];

export function loadLexiconCsvText(text: string, options: LoadLexiconTextOptions): LoadedLexiconText {
  const parsed = parseCsvText(text);
  const sourceDiagnostics = [...parsed.diagnostics];
  const missing = REQUIRED_LEXICON_HEADERS.filter((header) => !parsed.headers.includes(header));
  if (missing.length) sourceDiagnostics.push(`Lexicon CSV is missing required columns: ${missing.join(", ")}.`);

  const rows: LexiconRow[] = missing.length ? [] : parsed.rows.map((row) => ({
    form: row.form,
    gloss: row.gloss,
    cls: row.cls,
    register: row.register,
    status: row.status,
    source: row.source,
    note: row.note
  }));

  let aliasRows: { legacyForm: string; preferredForm: string; evidence: string }[] = [];
  let aliasRowCount = 0;
  if (options.aliasCsvText !== undefined) {
    const aliasesParsed = parseCsvText(options.aliasCsvText);
    sourceDiagnostics.push(...aliasesParsed.diagnostics.map((message) => `Alias CSV: ${message}`));
    const missingAlias = REQUIRED_ALIAS_HEADERS.filter((header) => !aliasesParsed.headers.includes(header));
    if (missingAlias.length) {
      sourceDiagnostics.push(`Alias CSV is missing required columns: ${missingAlias.join(", ")}.`);
    } else {
      aliasRowCount = aliasesParsed.rows.length;
      aliasRows = aliasesParsed.rows.map((row) => ({
        legacyForm: row.legacy_form,
        preferredForm: row.preferred_form,
        evidence: [row.source_decision, row.compatibility_status, row.lexicon_status].filter(Boolean).join("; ")
      }));
    }
  }

  const registry = buildLexiconRegistry(rows, {
    sourceLabel: options.sourceLabel,
    sourceVersion: options.sourceVersion,
    explicitAliases: aliasRows
  });

  return {
    registry,
    rowCount: rows.length,
    aliasRowCount,
    sourceDiagnostics,
    aliases: [...registry.aliases.values()]
  };
}
