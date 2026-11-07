/**
 * Evidence-backed identity registry for the recovered Formal Arcane operator
 * inventory. This is a name-resolution layer, not a grammar, type checker,
 * evaluator, or execution permission system.
 *
 * Profiles:
 * - v3.0-L preserves the spellings listed in the v3.0-L language source.
 * - phase4-renamed uses the Phase 4 preferred spellings and can optionally
 *   accept the older spellings as compatibility aliases.
 *
 * The v5 draft CSV is a lexicon snapshot, not a complete grammar version, so
 * it is deliberately not represented as a parser/language profile here.
 *
 * This registry covers formal operators and the six Construction macros only.
 * REN/BEN is a geometry/region lexical rename, not an operator identity;
 * HƏ/HE/HA/HU/HI/HO are coupling vocabulary, not ordinary operators; and
 * Phase 4 proposal-only tokens remain outside this source-backed core registry.
 */
export type OperatorIdentityProfile = "v3.0-L" | "phase4-renamed";

export type OperatorIdentityKind = "formal-operator" | "construction-macro";
export type OperatorIdentityCategory =
  | "information-binding"
  | "arithmetic-vector"
  | "logic-control"
  | "construction";
export type OperatorSignatureStatus = "PROVISIONAL" | "OPEN" | "UNKNOWN";

export interface OperatorIdentityRecord {
  /** Stable identity across documentary spelling changes. */
  id: string;
  gloss: string;
  kind: OperatorIdentityKind;
  category: OperatorIdentityCategory;
  /** Exact form in the v3.0-L operator inventory; null if absent there. */
  v3_0LForm: string | null;
  /** Phase 4 preferred form; null if not established in that source layer. */
  phase4Form: string | null;
  /** Phase 2/5.12 audit arity only; never an executable signature. */
  auditArity: number | null;
  signatureStatus: OperatorSignatureStatus;
  sources: readonly string[];
  notes: readonly string[];
}

const LANGUAGE_SOURCE = "docs/canon/arcane-language-v3.0-L.md";
const MAGIC_SOURCE = "docs/canon/magic-system-v3.0.md";
const PHASE2_SOURCE = "docs/audits/phase-2-formal-syntax.md";
const PHASE45_RECONCILIATION = "sources/originals/Arcane_Phase_5_5_Source_Reconciliation.md";
const PHASE512_REGISTRY = "sources/originals/Arcane_Phase_5_12_Operator_Registry.csv";

const languageSources = [LANGUAGE_SOURCE, PHASE2_SOURCE] as const;
const renamedSources = [PHASE45_RECONCILIATION, PHASE512_REGISTRY] as const;
const macroSources = [MAGIC_SOURCE, PHASE45_RECONCILIATION, PHASE512_REGISTRY] as const;

export const operatorIdentityRecords: readonly OperatorIdentityRecord[] = [
  { id: "read-information", gloss: "read/retrieve available information", kind: "formal-operator", category: "information-binding", v3_0LForm: "NES", phase4Form: "NES", auditArity: 1, signatureStatus: "OPEN", sources: languageSources, notes: ["Does not measure or infer.", "An available information/source pathway is required."] },
  { id: "measure", gloss: "measure through a physical pathway", kind: "formal-operator", category: "information-binding", v3_0LForm: "SIMA", phase4Form: "SIMA", auditArity: null, signatureStatus: "OPEN", sources: languageSources, notes: ["Target/property and measurement pathway are conceptually required.", "Surface arity remains unresolved; do not infer it from the conceptual description."] },
  { id: "assign", gloss: "assign a representation/value", kind: "formal-operator", category: "information-binding", v3_0LForm: "GAMA", phase4Form: "GAMA", auditArity: 2, signatureStatus: "PROVISIONAL", sources: languageSources, notes: ["Assignment changes symbolic state; assignment is not physical causation."] },
  { id: "infer", gloss: "infer from information", kind: "formal-operator", category: "information-binding", v3_0LForm: "DAVE", phase4Form: "DAVE", auditArity: 2, signatureStatus: "OPEN", sources: languageSources, notes: ["Inference requires evidence and an inference model; an inferred result is not guaranteed truth."] },
  { id: "bind", gloss: "create a binding", kind: "formal-operator", category: "information-binding", v3_0LForm: "KWAM", phase4Form: "KWAM", auditArity: 2, signatureStatus: "PROVISIONAL", sources: languageSources, notes: ["Creates a symbolic binding, not a physical object."] },
  { id: "reference-binding", gloss: "reference an established binding", kind: "formal-operator", category: "information-binding", v3_0LForm: "KWAT", phase4Form: "KWAT", auditArity: 1, signatureStatus: "PROVISIONAL", sources: languageSources, notes: ["Binding scope, lifetime and resolution rules remain separate requirements."] },
  { id: "live-evaluation", gloss: "live evaluation", kind: "formal-operator", category: "information-binding", v3_0LForm: "KWAK", phase4Form: "KWASH", auditArity: 1, signatureStatus: "OPEN", sources: [...languageSources, ...renamedSources], notes: ["Phase 4 records KWASH as preferred and KWAK as a compatibility alias.", "Sampling timing and side-effect rules remain unresolved."] },
  { id: "add", gloss: "add", kind: "formal-operator", category: "arithmetic-vector", v3_0LForm: "FRAPA", phase4Form: "FRAPA", auditArity: 2, signatureStatus: "PROVISIONAL", sources: languageSources, notes: ["Phase 2 baseline is Quantity × Quantity → Quantity.", "Unit and semantic-kind compatibility remain incomplete."] },
  { id: "subtract", gloss: "subtract", kind: "formal-operator", category: "arithmetic-vector", v3_0LForm: "FRATA", phase4Form: "FRAJA", auditArity: 2, signatureStatus: "PROVISIONAL", sources: [...languageSources, ...renamedSources], notes: ["Phase 4 preferred form is FRAJA; FRATA remains a compatibility alias.", "Operand order matters; dimensional and semantic-kind rules remain incomplete."] },
  { id: "multiply", gloss: "multiply", kind: "formal-operator", category: "arithmetic-vector", v3_0LForm: "FRAKA", phase4Form: "FRAMA", auditArity: 2, signatureStatus: "PROVISIONAL", sources: [...languageSources, ...renamedSources], notes: ["Phase 4 preferred form is FRAMA; FRAKA remains a compatibility alias.", "Dimensional algebra remains incomplete."] },
  { id: "divide", gloss: "divide", kind: "formal-operator", category: "arithmetic-vector", v3_0LForm: "FRALA", phase4Form: "FRALA", auditArity: 2, signatureStatus: "PROVISIONAL", sources: languageSources, notes: ["Zero-denominator and dimensional rules must be enforced by a separate semantic contract."] },
  { id: "negate", gloss: "negate", kind: "formal-operator", category: "arithmetic-vector", v3_0LForm: "FRASHA", phase4Form: "FRASHA", auditArity: 1, signatureStatus: "PROVISIONAL", sources: languageSources, notes: ["Accepted numeric kinds and units remain to be specified."] },
  { id: "magnitude", gloss: "magnitude", kind: "formal-operator", category: "arithmetic-vector", v3_0LForm: "DRAN", phase4Form: "DRAN", auditArity: 1, signatureStatus: "PROVISIONAL", sources: languageSources, notes: ["Norm, metric and frame assumptions remain to be specified."] },
  { id: "dot-product", gloss: "dot product", kind: "formal-operator", category: "arithmetic-vector", v3_0LForm: "DREM", phase4Form: "DREM", auditArity: 2, signatureStatus: "PROVISIONAL", sources: languageSources, notes: ["Vector-space and coordinate-frame metric assumptions remain to be specified."] },
  { id: "cross-product", gloss: "cross product", kind: "formal-operator", category: "arithmetic-vector", v3_0LForm: "DRIM", phase4Form: "DRUM", auditArity: 2, signatureStatus: "PROVISIONAL", sources: [...languageSources, ...renamedSources], notes: ["Phase 4 preferred form is DRUM; DRIM remains a compatibility alias.", "Preserve the Phase 4 D-017 handedness decision and frame-specific component convention."] },
  { id: "compare", gloss: "compare", kind: "formal-operator", category: "arithmetic-vector", v3_0LForm: "DRAL", phase4Form: "DRAS", auditArity: 3, signatureStatus: "PROVISIONAL", sources: [...languageSources, ...renamedSources], notes: ["Phase 4 preferred form is DRAS; DRAL remains a compatibility alias.", "Criterion encoding and comparison semantics remain unresolved."] },
  { id: "and", gloss: "AND", kind: "formal-operator", category: "logic-control", v3_0LForm: "GRAN", phase4Form: "GRAN", auditArity: 2, signatureStatus: "PROVISIONAL", sources: languageSources, notes: ["Binary baseline; n-ary use and evaluation policy are not established."] },
  { id: "or", gloss: "OR", kind: "formal-operator", category: "logic-control", v3_0LForm: "GRAT", phase4Form: "GRAT", auditArity: 2, signatureStatus: "PROVISIONAL", sources: languageSources, notes: ["Binary baseline; n-ary use and evaluation policy are not established."] },
  { id: "not", gloss: "NOT", kind: "formal-operator", category: "logic-control", v3_0LForm: "GRAK", phase4Form: "GRASH", auditArity: 1, signatureStatus: "PROVISIONAL", sources: [...languageSources, ...renamedSources], notes: ["Phase 4 preferred form is GRASH; GRAK remains a compatibility alias."] },
  { id: "if", gloss: "IF", kind: "formal-operator", category: "logic-control", v3_0LForm: "BEK", phase4Form: "BEK", auditArity: 2, signatureStatus: "OPEN", sources: languageSources, notes: ["Condition and block are conceptually required; branch/result semantics remain open."] },
  { id: "while", gloss: "WHILE", kind: "formal-operator", category: "logic-control", v3_0LForm: "ZET", phase4Form: "ZET", auditArity: 2, signatureStatus: "OPEN", sources: languageSources, notes: ["Re-evaluation timing, termination and failure behaviour remain open."] },
  { id: "establish", gloss: "establish", kind: "construction-macro", category: "construction", v3_0LForm: null, phase4Form: "KREN", auditArity: null, signatureStatus: "OPEN", sources: macroSources, notes: ["Construction/Foot-defined macro, not an ordinary arithmetic operator.", "Exact Foot mapping and typed operands must be recovered before grammar or execution support is claimed."] },
  { id: "alter", gloss: "alter", kind: "construction-macro", category: "construction", v3_0LForm: null, phase4Form: "TRAK", auditArity: null, signatureStatus: "OPEN", sources: macroSources, notes: ["Construction/Foot-defined macro; exact signature and Foot mapping are not recovered."] },
  { id: "maintain", gloss: "maintain", kind: "construction-macro", category: "construction", v3_0LForm: null, phase4Form: "FREM", auditArity: null, signatureStatus: "OPEN", sources: macroSources, notes: ["Construction/Foot-defined macro; exact signature and Foot mapping are not recovered."] },
  { id: "release", gloss: "release", kind: "construction-macro", category: "construction", v3_0LForm: null, phase4Form: "SHREN", auditArity: null, signatureStatus: "OPEN", sources: macroSources, notes: ["Construction/Foot-defined macro; do not assume it releases every kind of binding, hold, coupling or effect."] },
  { id: "couple", gloss: "couple", kind: "construction-macro", category: "construction", v3_0LForm: null, phase4Form: "BRAN", auditArity: null, signatureStatus: "OPEN", sources: macroSources, notes: ["Construction/Foot-defined macro; do not infer participant order or coupling mechanism."] },
  { id: "prefer", gloss: "prefer", kind: "construction-macro", category: "construction", v3_0LForm: null, phase4Form: "VARE", auditArity: null, signatureStatus: "OPEN", sources: macroSources, notes: ["Construction/Foot-defined macro; preference does not establish feasibility or guarantee selection."] }
];

export type OperatorIdentityResolution =
  | {
      status: "RESOLVED";
      inputForm: string;
      resolvedForm: string;
      operatorId: string;
      profile: OperatorIdentityProfile;
      relationship: "PRIMARY" | "COMPATIBILITY-ALIAS";
      kind: OperatorIdentityKind;
      signatureStatus: OperatorSignatureStatus;
      auditArity: number | null;
      sources: readonly string[];
    }
  | {
      status: "ALIAS-DISABLED";
      inputForm: string;
      preferredForm: string;
      operatorId: string;
      profile: OperatorIdentityProfile;
      source: string;
    }
  | {
      status: "VERSION-NOT-LICENSED";
      inputForm: string;
      profile: OperatorIdentityProfile;
      licensedForm: string | null;
      operatorId: string;
    }
  | {
      status: "UNKNOWN";
      inputForm: string;
      profile: OperatorIdentityProfile;
    };

export interface ResolveOperatorIdentityOptions {
  /** Historical forms are accepted only when explicitly enabled. */
  allowCompatibilityAliases?: boolean;
}

/**
 * Resolve an operator spelling against a documentary spelling profile.
 * A RESOLVED identity does not imply that its signature or semantics are complete.
 */
export function resolveOperatorIdentity(
  rawForm: string,
  profile: OperatorIdentityProfile,
  options: ResolveOperatorIdentityOptions = {}
): OperatorIdentityResolution {
  const inputForm = rawForm.trim().toUpperCase();
  if (!inputForm) return { status: "UNKNOWN", inputForm, profile };

  for (const record of operatorIdentityRecords) {
    const primaryForm = profile === "v3.0-L" ? record.v3_0LForm : record.phase4Form;
    const alternateForm = profile === "v3.0-L" ? record.phase4Form : record.v3_0LForm;

    if (primaryForm === inputForm) {
      return {
        status: "RESOLVED",
        inputForm,
        resolvedForm: primaryForm,
        operatorId: record.id,
        profile,
        relationship: "PRIMARY",
        kind: record.kind,
        signatureStatus: record.signatureStatus,
        auditArity: record.auditArity,
        sources: record.sources
      };
    }

    if (alternateForm === inputForm && alternateForm !== primaryForm) {
      if (profile === "phase4-renamed" && record.v3_0LForm === inputForm) {
        if (options.allowCompatibilityAliases !== true) {
          return {
            status: "ALIAS-DISABLED",
            inputForm,
            preferredForm: record.phase4Form!,
            operatorId: record.id,
            profile,
            source: PHASE45_RECONCILIATION
          };
        }
        return {
          status: "RESOLVED",
          inputForm,
          resolvedForm: record.phase4Form!,
          operatorId: record.id,
          profile,
          relationship: "COMPATIBILITY-ALIAS",
          kind: record.kind,
          signatureStatus: record.signatureStatus,
          auditArity: record.auditArity,
          sources: record.sources
        };
      }

      const licensedForm = primaryForm;
      return {
        status: "VERSION-NOT-LICENSED",
        inputForm,
        profile,
        licensedForm,
        operatorId: record.id
      };
    }
  }

  return { status: "UNKNOWN", inputForm, profile };
}

export function getOperatorIdentity(operatorId: string): OperatorIdentityRecord | undefined {
  return operatorIdentityRecords.find((record) => record.id === operatorId);
}

/** List the primary spellings licensed by the selected documentary profile. */
export function listOperatorIdentities(profile: OperatorIdentityProfile): Array<{
  operatorId: string;
  form: string;
  gloss: string;
  kind: OperatorIdentityKind;
  category: OperatorIdentityCategory;
  signatureStatus: OperatorSignatureStatus;
  auditArity: number | null;
}> {
  return operatorIdentityRecords.flatMap((record) => {
    const form = profile === "v3.0-L" ? record.v3_0LForm : record.phase4Form;
    return form === null ? [] : [{
      operatorId: record.id,
      form,
      gloss: record.gloss,
      kind: record.kind,
      category: record.category,
      signatureStatus: record.signatureStatus,
      auditArity: record.auditArity
    }];
  });
}
