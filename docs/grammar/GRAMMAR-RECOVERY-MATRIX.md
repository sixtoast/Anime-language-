# Arcane Grammar Recovery Matrix

**Status:** Working recovery index; not a replacement specification.  
**Canon impact:** None. This document does not approve, rename, or add any Arcane forms.  
**Purpose:** Turn the recovered grammar evidence into a practical work queue, separating established rules from historical implementation details and unresolved owner decisions.

## How to read this matrix

- **Canonical baseline** means the rule is stated in the repository's imported v3.0-L specification. It does not mean every rule has a complete implementation or corpus.
- **Historical evidence** means an archived file, prototype, or test report documents a prior approach. It is not automatically canonical.
- **Current implementation** describes the present TypeScript workbench only.
- **Next gate** is the evidence required before a proposed implementation can be treated as conformant.
- An unresolved item remains unresolved even if a prototype made a choice.

## Recovery matrix

| Area | Canonical baseline currently recorded | Historical/current divergence or limit | Next acceptance gate | Status |
|---|---|---|---|---|
| Surface syntax | Strongly head-initial; `HEAD + ARGUMENTS + MODIFIERS`; executable forms must have one recoverable parse | Current TypeScript parser is explicitly for Phase 2 audit notation `OP⟨arg1, arg2, …⟩`. Phase 6G describes a distinct surface-parser prototype | Recover the exact Phase 4 grammar text and compare its rules with the full Phase 6G source and fixtures; do not infer equivalence from shared operator names | Evidence recovery required |
| Operator spellings and aliases | v3.0-L lists forms such as FRATA, FRAKA, DRIM, DRAL, GRAK and KWAK in its operator tables | Phase 5.5 alias records cite Phase 4 §5.1 and D-032 for FRATA→FRAJA, FRAKA→FRAMA, DRIM→DRUM, REN→BEN, GRAK→GRASH, KWAK→KWASH, DRAL→DRAS. Phase 6G has its own normalisation layer | Establish version/context for every mapping from the original decision source; label each as canonical, legacy alias, prototype-only, or unresolved | Owner/source reconciliation required |
| Lexical classes and token boundaries | Canonical vocabulary is structured by semantic domain; canonical source says MA is metre, not SELF | v5 draft contains 255 structurally valid records, 247 distinct single-token forms after filtering and six non-atomic entries preserved separately. The v5 audit reports collisions for `re` and `ra` | Keep atomic and non-atomic forms separate until a grammar-aware rule establishes how each is consumed; decide homograph disambiguation from source evidence | Partially audited |
| Fixed arity and grouping | Core operators have fixed argument counts; precedence must not be relied on to resolve grouping | Current audit parser supports a limited set of registered arities in audit notation. Operator contract records leave some types and evaluation rules unresolved | Create a source-backed signature record per operator: spelling/version, arity, argument categories, result category, grouping rule, evidence and tests; do not fill unknown fields by analogy | Partially implemented |
| Semantic types and evaluation | Canonical specification describes typed expressions and incompatible types requiring a defined operation or conversion | Current operator contracts and dimensional primitives are not a complete parsed-expression evaluator | Define the missing source-backed type/evaluation contracts first; then add rejection tests for unsupported combinations | Unresolved integration |
| Physical quantities and units | Canonical table lists MA, SE, KE, RA and KU; property and value are distinct | TypeScript model represents an angle exponent but currently maps RA to dimensionless; archived Phase 6R uses an abstract L/M/T model and explicitly leaves canonical units unresolved | Record the chosen relationship between physical dimension and semantic angle typing before changing RA or derived-unit behaviour | Owner decision required |
| Bindings | v3.0-L names KWAM (create), KWAT (reference), KWAK (live evaluation), while exact identifier/evaluation details remain under formalisation | Phase 5.24 dual-binding behaviour is explicitly provisional; Phase 6G normalises KWAK to KWASH | Recover the Phase 5.24 decision record and compare it with canonical wording and alias decision evidence; keep captured-value and live-evaluation behaviour provisional until resolved | Provisional |
| Control blocks | Canonical operator table lists BEK (IF) and ZET (WHILE) as control operators | Phase 6G excerpt mentions METO/DOGU blocks; these are not established by the v3.0-L table currently imported | Recover exact block delimiters, condition typing, termination and nesting rules from authoritative source; do not treat prototype delimiters as canon | Evidence gap |
| Numerals and quantities | Canonical digits ZA, KI, TO, MU, RE, SA, FI, DU, GO, PE; decimal marker SHI; negative FRASHA | Phase 6G report describes numeral closure with SHO, a divergence from the imported canonical decimal marker | Verify whether SHO belongs to a distinct version, closure operator, or prototype notation using exact Phase 4 and Phase 6G source context | Evidence gap |
| Pragmatics, registers and prosody | Four registers and phonology/prosody are described in v3.0-L; formal executable Arcana must avoid unresolved ambiguity | Repository lacks a demonstrated large natural corpus and listener validation; reported lexicon/idiom percentages are unverified estimates | Build sourced examples across registers only from known vocabulary/rules; mark constructed examples as illustrative, and design a separate listener study before claiming intelligibility | Corpus incomplete |
| Macros and physical feasibility | Macro Transparency Law: shorthand must expand to a valid construction and cannot conceal impossible operations | Existing parser and dimensional prototypes do not demonstrate full physical-feasibility enforcement | Keep syntax acceptance, semantic validity and physical feasibility as separate gates; require expansion evidence and explicit physical constraints for any macro | Not implemented end-to-end |

## Priority order

### P0 — recover before changing language behaviour

1. Obtain the exact Phase 4 grammar and decision sources cited by the alias registry.
2. Compare the complete Phase 6G report, parser, lexicon CSV and fixture/test output against those sources.
3. Produce a spelling lineage table with one row per operator or alias, preserving version and source context.
4. Resolve the `re` and `ra` homographs without deleting either lexical record or inventing context rules.

### P1 — make confirmed grammar testable

5. Once a rule is source-backed, encode it as a grammar record with provenance and canonical status.
6. Add positive and negative fixtures for the rule, including malformed grouping and ambiguous input where relevant.
7. Keep audit-notation tests separate from surface-grammar conformance tests.
8. Report parser acceptance, semantic typing and physical-feasibility checks as separate outcomes.

### P2 — improve actual language usability

9. Build a compact worked-example corpus with gloss, compositional explanation, register, provenance and validation status.
10. Cover ordinary conversation as well as technical and performed registers; do not let the executable subset stand in for the entire language.
11. Measure lexical coverage and listener intelligibility instead of repeating unverified percentage estimates.

## Evidence references

- Canonical baseline: `docs/canon/arcane-language-v3.0-L.md`.
- Surface-parser and dimension comparison: `docs/research/surface-parser-and-dimensions-findings.md`.
- Phase 6 prototype comparison: `docs/research/phase-6-prototype-reconciliation.md`.
- v5 lexicon and alias audit: `docs/research/phase6g-v5-source-lexicon-audit-01.md`.
- Archived-source inventory and archive hashes: `sources/SOURCE-INVENTORY.md` and `sources/archive-reports/mega-pack-text-index.md`.

## Completion criteria

This recovery phase is complete only when each P0 spelling/grammar question has either (a) a source-backed resolution recorded in the decision workflow, or (b) a precisely scoped unresolved decision with the missing evidence named. A prototype test passing is not itself a language decision. No canonical rule changes as a side effect of this matrix.
