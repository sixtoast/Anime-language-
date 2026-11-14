# Phase 8CY-S — Construction Foot source reconciliation

**Canon effect:** NONE · **Grammar changes:** none · **Execution:** none.

## Finding

Phase 8CY-R introduced five relation-coda mappings and enumerated a 6 × 6 × 5 (180-record) candidate space. That conflicts with the earlier Phase 8CI evidence-closure audit, which explicitly records zero recovered relation-coda entries and states that the primary Phase 4 inspection needed to decide the coda inventory and CVC/optional-coda conflict remained outstanding.

The repository also contains Phase 8CY-N/O summaries that describe the five mappings as recovered. Those later summaries do not, by themselves, establish that the exact source paragraphs, tables, footnotes and P4-T05/P4-T10 definitions were inspected and reconciled. The Phase 8CY-M transcription concordance specifically says that exact §3.1–§3.3 Foot definitions remain the next source-recovery task. The evidence chain is therefore internally inconsistent.

## Decision for the reviewer

- Preserve the 180-record Phase 8CY-R list as a historical hypothesis for auditability.
- Disable its candidate lookup; it must not classify forms such as `pang` as recognised paradigm members.
- Do not present m/n/ng/s/sh as a verified relation-coda inventory in the active reviewer.
- Retain the six frames and six provisional parameter vowels as 36 review pairs.
- Retain the six canonical CV frame forms `pa, ba, ta, da, ka, ga`; the other 30 frame–vowel pairs remain unresolved, not invalid.
- Keep parser readiness NOT-READY, execution disabled and canon effect NONE.

## Exact reconciliation gate

Inspect and cite the same recovered transcription for:
1. Phase 4 §3.1 and §3.2, including Tables 2–3;
2. §3.3 and the relevant parameter-vowel definitions;
3. §4 Table 4 (phonotactic coda inventory);
4. §10 and the exact P4-T05/P4-T10 test definitions;
5. any footnotes, table cells or wrapped paragraphs that affect coda semantics or optionality.

The Phase 4 original DOCX byte digest verifies source identity, not the completeness or correctness of an extracted text derivative. Until the above evidence is cross-referenced in a single concordance, the five-coda claims remain disputed.

## Implementation

Added `constructionFootParadigmReconciliation.ts` and regression tests. The Construction Foot panel now labels Phase 8CY-R as a legacy hypothesis, explains the contradiction and blocks candidate lookup. The legacy candidate records remain available to the audit code but are not treated as recognised forms.

Tests are authored, not claimed as executed. No GitHub Actions workflow was dispatched, no PR was merged and production remains untouched.
