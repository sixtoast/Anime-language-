/**
 * Source-aware lexicon adapter for the provisional Phase 6G parser.
 *
 * This module consumes rows supplied by a caller; it does not fetch files,
 * promote proposals to canon, or decide how ambiguous homophones are resolved.
 */
export interface LexiconRow {
  form: string;
  gloss?: string;
  cls?: string;
  register?: string;
  status?: string;
  source?: string;
  note?: string;
}

export interface LexiconEntry {
  form: string;
  glosses: string[];
  classes: string[];
  registers: string[];
  statuses: string[];
  sources: string[];
  notes: string[];
  rowCount: number;
}

export interface LexiconAlias {
  alias: string;
  preferredForm: string;
  evidence: string;
  sourceForm: string;
}

export interface LexiconRegistry {
  entries: ReadonlyMap<string, LexiconEntry>;
  /** Source rows intentionally retained outside the single-token parser inventory. */
  nonAtomicEntries: ReadonlyMap<string, LexiconEntry>;
  aliases: ReadonlyMap<string, LexiconAlias>;
  collisions: ReadonlyMap<string, LexiconEntry>;
  diagnostics: LexiconDiagnostic[];
  sourceLabel: string;
  sourceVersion: string;
}

export interface LexiconDiagnostic {
  code: "EMPTY_FORM" | "NON_ATOMIC_FORM" | "CONFLICTING_ALIAS_TARGETS" | "SELF_ALIAS" | "MISSING_ALIAS_TARGET";
  message: string;
  form?: string;
}

export interface BuildLexiconOptions {
  sourceLabel: string;
  sourceVersion: string;
  /** Optional explicit legacy alias records, e.g. the Phase 5.5 alias registry. */
  explicitAliases?: readonly { legacyForm: string; preferredForm: string; evidence: string }[];
}

const unique = (values: string[]): string[] => [...new Set(values.filter(Boolean))];

export function buildLexiconRegistry(
  rows: readonly LexiconRow[],
  options: BuildLexiconOptions
): LexiconRegistry {
  const grouped = new Map<string, LexiconRow[]>();
  const nonAtomicGrouped = new Map<string, LexiconRow[]>();
  const diagnostics: LexiconDiagnostic[] = [];

  for (const row of rows) {
    const form = (row.form ?? "").trim().toLowerCase();
    if (!form) {
      diagnostics.push({
        code: "EMPTY_FORM",
        message: "Ignored a source row with an empty lexical form."
      });
      continue;
    }
    const target = form.includes(" ") || form.endsWith("-") || form.startsWith("(")
      ? nonAtomicGrouped
      : grouped;
    const existing = target.get(form) ?? [];
    existing.push({ ...row, form });
    target.set(form, existing);
    if (target === nonAtomicGrouped) {
      diagnostics.push({
        code: "NON_ATOMIC_FORM",
        message: "Preserved a multiword, clitic, or editorial form outside the single-token parser inventory.",
        form
      });
    }
  }

  const toEntry = (form: string, records: LexiconRow[]): LexiconEntry => ({
    form,
    glosses: unique(records.map((r) => (r.gloss ?? "").trim())),
    classes: unique(records.map((r) => (r.cls ?? "").trim().toUpperCase())),
    registers: unique(records.map((r) => (r.register ?? "").trim())),
    statuses: unique(records.map((r) => (r.status ?? "").trim())),
    sources: unique(records.map((r) => (r.source ?? "").trim())),
    notes: unique(records.map((r) => (r.note ?? "").trim())),
    rowCount: records.length
  });
  const entries = new Map<string, LexiconEntry>();
  for (const [form, records] of grouped) entries.set(form, toEntry(form, records));
  const nonAtomicEntries = new Map<string, LexiconEntry>();
  for (const [form, records] of nonAtomicGrouped) nonAtomicEntries.set(form, toEntry(form, records));

  const aliasCandidates = new Map<string, { preferredForm: string; evidence: string; sourceForm: string }[]>();
  const addAlias = (aliasRaw: string, preferredRaw: string, evidence: string, sourceForm: string) => {
    const alias = aliasRaw.trim().toLowerCase();
    const preferredForm = preferredRaw.trim().toLowerCase();
    if (!alias || !preferredForm) return;
    if (alias === preferredForm) {
      diagnostics.push({ code: "SELF_ALIAS", message: `Ignored self-alias ${alias}.`, form: alias });
      return;
    }
    const list = aliasCandidates.get(alias) ?? [];
    list.push({ preferredForm, evidence, sourceForm });
    aliasCandidates.set(alias, list);
  };

  for (const [form, records] of grouped) {
    for (const row of records) {
      // Deliberately narrow: only the explicit documentary pattern "was <form>".
      const match = (row.note ?? "").toLowerCase().match(/\bwas\s+([a-zəʃŋ]+)/);
      if (match) addAlias(match[1], form, `Lexicon note: "${row.note}"`, form);
    }
  }
  for (const alias of options.explicitAliases ?? []) {
    addAlias(alias.legacyForm, alias.preferredForm, alias.evidence, "explicit-alias-registry");
  }

  const aliases = new Map<string, LexiconAlias>();
  for (const [alias, candidates] of aliasCandidates) {
    const targets = unique(candidates.map((candidate) => candidate.preferredForm));
    if (targets.length !== 1) {
      diagnostics.push({
        code: "CONFLICTING_ALIAS_TARGETS",
        message: `Alias ${alias.toUpperCase()} has conflicting targets: ${targets.map((x) => x.toUpperCase()).join(", ")}. It was not registered.`,
        form: alias
      });
      continue;
    }
    const chosen = candidates[0];
    if (!entries.has(chosen.preferredForm)) {
      diagnostics.push({
        code: "MISSING_ALIAS_TARGET",
        message: `Alias ${alias.toUpperCase()} targets ${chosen.preferredForm.toUpperCase()}, which is absent from the loaded lexicon. It was not registered.`,
        form: alias
      });
      continue;
    }
    aliases.set(alias, {
      alias,
      preferredForm: chosen.preferredForm,
      evidence: unique(candidates.map((candidate) => candidate.evidence)).join(" | "),
      sourceForm: chosen.sourceForm
    });
  }

  const collisions = new Map<string, LexiconEntry>();
  for (const [form, entry] of entries) {
    if (entry.classes.length > 1 || entry.glosses.length > 1) collisions.set(form, entry);
  }

  return {
    entries,
    nonAtomicEntries,
    aliases,
    collisions,
    diagnostics,
    sourceLabel: options.sourceLabel,
    sourceVersion: options.sourceVersion
  };
}

/** Resolve a spelling only when the caller explicitly opts into historical aliases. */
export function resolveLexiconForm(
  registry: LexiconRegistry,
  rawForm: string,
  options: { allowLegacyAliases?: boolean } = {}
): { inputForm: string; resolvedForm: string; alias?: LexiconAlias; entry?: LexiconEntry } {
  const inputForm = rawForm.trim().toLowerCase();
  const alias = options.allowLegacyAliases === true ? registry.aliases.get(inputForm) : undefined;
  const resolvedForm = alias?.preferredForm ?? inputForm;
  return { inputForm, resolvedForm, ...(alias ? { alias } : {}), ...(registry.entries.has(resolvedForm) ? { entry: registry.entries.get(resolvedForm)! } : {}) };
}

/** Return all source records for a spelling; never guess among homophones. */
export function inspectLexiconForm(registry: LexiconRegistry, rawForm: string): {
  form: string;
  entry?: LexiconEntry;
  isCollision: boolean;
  needsContextualDisambiguation: boolean;
} {
  const form = rawForm.trim().toLowerCase();
  const entry = registry.entries.get(form);
  return {
    form,
    ...(entry ? { entry } : {}),
    isCollision: registry.collisions.has(form),
    needsContextualDisambiguation: registry.collisions.has(form)
  };
}
