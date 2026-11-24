# Phase 8DK — Digraph-aware Construction Foot recognition

**Canon effect:** NONE. **Grammar changes:** none. **Compiler/execution:** disabled. **Tests:** 24 authored in the focused Foot-shape suite; Vercel preview verification pending for this commit.

## 1. Problem found

The Phase 4 primary-source Construction morphology specifies a CVC Foot outline and lists five relation codas: m, n, ng/ŋ, s and sh. The repository's structural recogniser previously measured a candidate by Unicode code-point count and allowed only two or three characters. That incorrectly treated the surface spellings **ng** and **sh** as two structural positions each.

This created a mismatch with the source-backed orthography and with the existing 180-item evidence-space matrix, which already preserves `ng` and `sh` as complete coda spellings. A candidate such as `pang` or `pash` could be represented in the evidence matrix but was rejected by the companion structural inspector.

## 2. Change

The recogniser now separates:
1. the initial frame consonant (one code point);
2. the parameter vowel (one code point);
3. the remaining coda grapheme, matched against the exact source-backed orthographic inventory.

The inventory is sourced from `constructionRelationCodaInventory`, avoiding a second manually maintained list. It recognises `m`, `n`, `ng`, `s` and `sh`. The IPA notation `ŋ` remains a phonetic representation, not an alternative surface spelling; the documented Romanisation is `ng`.

## 3. Recognition states

- `FRAME-FORM-RECOGNISED`: one of the six canonical CV frame forms `pa ba ta da ka ga`; not a complete Foot.
- `CVC-SHAPE-RECOGNISED`: the token has a frame, parameter-vowel and one of the five source-backed coda graphemes.
- `UNRESOLVED`: the visible slots may fit the outline, but a coda or frame-vowel combination is not recovered.
- `SHAPE-INVALID`: the candidate violates a known slot class or contains an unrecovered multi-letter coda sequence.

Crucially, `CVC-SHAPE-RECOGNISED` does **not** mean that the particular combination is lexically attested, productive, semantically interpreted, physically feasible or executable. The parameter-vowel family mapping remains provisional, and the 180-item cross-product remains an evidence/design space rather than an approved lexicon.

## 4. Preserved source boundaries

- Phase 4 §3.1 Table 2 and §10 P4-T10 remain the primary CVC-shape evidence.
- Phase 5.16 C-02's optional-coda wording remains a context discrepancy; this change does not resolve or broaden that rule.
- Phase 4 §3.2 Table 3 remains the source for the five relation-coda families: FREM m/n open-loop maintenance, FREM ng feedback maintenance, and SHREN s/sh release.
- No individual frame meanings, vowel semantics, coda interaction rules, productive combinations, macro signatures or physical effects are inferred.
- The BRAN H-series coupling forms remain a separate class; VARE remains a modifier, not a Foot.

## 5. Companion inspector impact

The existing Construction Foot inspector now recognises the source-backed digraph spellings as single coda graphemes and displays the coda as `ng` or `sh`, rather than treating each written letter as a separate structural segment. The source-aware morphology and paradigm reviewers remain separate and continue to report lexical and semantic uncertainty.

## 6. Verification scope

The focused test suite covers the six canonical CV forms, known and unknown codas, both digraph spellings, schwa before digraph codas, IPA-versus-orthography separation, malformed multi-letter codas, Unicode code-point handling, punctuation and non-string inputs. The full preview build/test result will be recorded only after Vercel reports it for this commit.

**Result:** the structural reader's surface-grapheme handling is aligned with the recovered orthography without promoting unverified Foot combinations into canon.
