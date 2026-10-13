import type { LoadedLexiconText } from "./lexiconCsvLoader";

export interface LexiconAuditFinding {
  severity: "error" | "warning" | "info";
  code:
    | "CSV_STRUCTURE"
    | "REGISTRY_FILTER"
    | "FORM_COLLISION"
    | "ALIAS_TARGET_MISSING"
    | "ALIAS_CONFLICT"
    | "EMPTY_REGISTRY";
  message: string;
  form?: string;
}

export interface LexiconAuditReport {
  sourceLabel: string;
  sourceVersion: string;
  structurallyValidRows: number;
  acceptedLexicalRows: number;
  acceptedForms: number;
  aliasRows: number;
  registeredAliases: number;
  collisionForms: string[];
  findings: LexiconAuditFinding[];
  readyForParserExperiment: boolean;
  canonEffect: "none";
}

/**
 * Produces a deterministic review report. "Ready" only means structural
 * conditions for an opt-in parser experiment are met; it is not canon approval.
 */
export function auditLoadedLexicon(loaded: LoadedLexiconText): LexiconAuditReport {
  const findings: LexiconAuditFinding[] = [];
  for (const message of loaded.sourceDiagnostics) {
    findings.push({
      severity: "error",
      code: "CSV_STRUCTURE",
      message
    });
  }
  for (const diagnostic of loaded.registry.diagnostics) {
    findings.push({
      severity: diagnostic.code === "CONFLICTING_ALIAS_TARGETS" ? "error" : "warning",
      code: diagnostic.code === "CONFLICTING_ALIAS_TARGETS" ? "ALIAS_EVIDENCE_MERGED" : "REGISTRY_FILTER",
      message: diagnostic.message,
      ...(diagnostic.form ? { form: diagnostic.form } : {})
    });
  }

  for (const alias of loaded.registry.aliases.values()) {
    if (!loaded.registry.entries.has(alias.preferredForm)) {
      findings.push({
        severity: "error",
        code: "ALIAS_TARGET_MISSING",
        form: alias.alias,
        message: `Alias ${alias.alias.toUpperCase()} points to ${alias.preferredForm.toUpperCase()}, which has no accepted lexicon entry.`
      });
    }
  }

  for (const [form, entry] of loaded.registry.collisions) {
    findings.push({
      severity: "warning",
      code: "FORM_COLLISION",
      form,
      message: `${form.toUpperCase()} has ${entry.glosses.length} gloss(es) and ${entry.classes.length} lexical class(es); contextual policy remains unresolved.`
    });
  }

  if (loaded.rowCount === 0 || loaded.registry.entries.size === 0) {
    findings.push({
      severity: "error",
      code: "EMPTY_REGISTRY",
      message: "No accepted source vocabulary is available."
    });
  }

  const hasErrors = findings.some((finding) => finding.severity === "error");
  return {
    sourceLabel: loaded.registry.sourceLabel,
    sourceVersion: loaded.registry.sourceVersion,
    structurallyValidRows: loaded.rowCount,
    acceptedLexicalRows: [...loaded.registry.entries.values()].reduce((sum, entry) => sum + entry.rowCount, 0),
    acceptedForms: loaded.registry.entries.size,
    aliasRows: loaded.aliasRowCount,
    registeredAliases: loaded.registry.aliases.size,
    collisionForms: [...loaded.registry.collisions.keys()].sort(),
    findings,
    readyForParserExperiment: !hasErrors && loaded.rowCount > 0 && loaded.registry.entries.size > 0,
    canonEffect: "none"
  };
}
