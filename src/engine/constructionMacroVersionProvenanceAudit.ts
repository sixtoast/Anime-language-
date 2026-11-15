/**
 * Phase 8CJ — versioned Construction macro vocabulary provenance audit.
 * Compares the Phase 4 / v2.0 evidence ledger with v3.0-L and the draft lexicon.
 * Matching spelling and gloss are not treated as a complete version bridge.
 */
import { constructionMacroEvidence } from "./constructionMacroEvidence";

export const constructionMacroVersionProvenanceAudit = {
  sources: {
    historicalConstruction: "Phase 4 §3.2 and §8; Phase 5.15 Construction Contract Matrix",
    currentCanon: "docs/canon/magic-system-v3.0.md §13",
    draftLexicon: "sources/originals/Arcane_Lexicon_v5_draft.csv"
  },
  currentCanonSection: {
    section: "13. Spell design and grammar",
    heading: "Core operational vocabulary",
    forms: ["KREN", "TRAK", "FREM", "SHREN", "BRAN", "VARE"],
    claim: "The canonical v3.0 specification lists these six forms with their operational glosses.",
    boundary: "This confirms their presence in the supplied v3.0 canon document; it does not provide a Construction Foot expansion or prove unchanged v2.0 morphology."
  },
  draftLexiconCitationAudit: {
    rows: [
      { form: "kren", gloss: "establish", source: "Magic v3.0 §26", status: "CANON" },
      { form: "trak", gloss: "alter", source: "Magic v3.0 §26", status: "CANON" },
      { form: "frem", gloss: "maintain", source: "Magic v3.0 §26", status: "CANON" },
      { form: "shren", gloss: "release", source: "Magic v3.0 §26", status: "CANON" },
      { form: "bran", gloss: "couple", source: "Magic v3.0 §26", status: "CANON" },
      { form: "vare", gloss: "prefer", source: "Magic v3.0 §26", status: "CANON" }
    ],
    citationConsistency: "SECTION-REFERENCE-MISMATCH-REQUIRES-REVIEW",
    explanation: "The available canonical Markdown document lists the vocabulary in §13, while the v5 draft CSV cites Magic v3.0 §26. The CSV citation may refer to another source edition or section numbering; this audit does not assume either explanation."
  },
  comparisons: constructionMacroEvidence.map(historical => {
    const row = [
      { form: "kren", gloss: "establish" },
      { form: "trak", gloss: "alter" },
      { form: "frem", gloss: "maintain" },
      { form: "shren", gloss: "release" },
      { form: "bran", gloss: "couple" },
      { form: "vare", gloss: "prefer" }
    ].find(item => item.form === historical.form.toLowerCase());
    return {
      form: historical.form,
      phase4Gloss: historical.gloss,
      phase4EvidenceStatus: historical.evidenceStatus,
      v3CanonListed: Boolean(row),
      v3CanonGloss: row?.gloss ?? null,
      glossSurfaceAgreement: row?.gloss === historical.gloss,
      crossVersionIdentity: "NOT-ESTABLISHED" as const,
      morphologyContinuity: "NOT-ESTABLISHED" as const,
      signatureContinuity: "NOT-ESTABLISHED" as const,
      permissionToBackfillPhase4: false as const
    };
  }),
  conclusions: {
    exactFormCount: 6,
    matchingGlossCount: 6,
    v3CanonVocabularyPresence: "SOURCE-CONFIRMED",
    draftCsvSectionCitation: "REQUIRES-PRIMARY-SOURCE-CHECK",
    phase4ToV3MorphologyBridge: "NOT-RECOVERED",
    macroSignatures: "UNRESOLVED",
    executable: false,
    canonEffect: "NONE"
  },
  safeguards: [
    "The v3.0 canon listing does not retroactively change the Phase 4 evidence status of KREN from PROPOSED to confirmed v2.0 morphology.",
    "A matching form and gloss do not establish identical expansion, argument structure, Foot composition, stage scope or physical mechanism across versions.",
    "The CSV's Magic v3.0 §26 citation is preserved verbatim and not silently corrected to §13.",
    "No Construction macro is made executable by this cross-version vocabulary comparison."
  ]
} as const;

export function reviewConstructionMacroVersionProvenance(value: unknown) {
  if (typeof value !== "string") return null;
  const form = value.trim().toUpperCase();
  return constructionMacroVersionProvenanceAudit.comparisons.find(item => item.form === form) ?? null;
}
