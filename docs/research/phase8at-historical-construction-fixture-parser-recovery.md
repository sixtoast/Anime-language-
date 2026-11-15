# Phase 8AT — Historical Construction fixture parser recovery and integration

**Date:** 2026-11-14  
**Canon effect:** none. **Grammar effect:** none. **Tests authored:** CON-HF-015–016 plus revised CON-HF-005–014.  
**Current tests executed:** no. **Historical test result:** Phase 5.22 archive reports 17 PASS / 0 FAIL; not rerun in this phase.

## Discovery

The archive index `sources/archive-reports/mega-pack-text-index.md` contains an entry for:

- Parser: `Arcane_Phase_6S_Typed_Expression_Integration/arcane_phase_5_22_parser.py`
- SHA-256: `8041e7e40cd6e152aa9d38982e2a8986515a1aa7bc315dbfc1e7065e72ee2905`
- Report: `Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_22_Report.md`
- Results: `Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_22_Results.json`
- Archived result summary: 17 passed, 0 failed, 17 total.

The parser source preview identifies a deliberately narrow parser for the exact Phase 4 hand-flame fixture, not a general Arcane parser. It requires middle-dot phrase boundaries and does not assess physical feasibility. The archived report describes a structured parse tree and explicitly limits its scope to one exact six-phrase profile.

## Recovered fixture interpretation

| Phrase | Phase 5.22 reported interpretation | Evidence boundary |
|---|---|---|
| `mel` | Anchor token | Full landmark semantics remain unresolved |
| `po da za shi to za ma` | Position role, +Y axis, metre-closed quantity | Fixture-only parse; not a general spatial or quantity grammar |
| `kan ken` | Documented example Foot sequence | Parser metadata labels KAN as example-level alias of TRAK ENRA; KEN as FREM / structure held. This is not a general expansion contract |
| `he ha` | Coupling sequence | HE = matter/mechanical-or-chemical domain; HA = energy/thermal domain, both explicitly provisional |
| `sa shi za se` | Duration quantity in seconds | Fixture-only parse; not a general time or quantity-stage contract |
| `kas` | Release token | Parser metadata labels KAS as example-level alias of SHREN / release; not a universal signature |

The parser's archived token tables include digit forms `za, ki, to, mu, re, sa, fi, du, go, pe`, unit forms `ma, se, ke, ra, ku, sho`, and axis forms `pa, ba, ta, da, ka, ga`. These entries are useful historical fixture metadata; they do not automatically establish all current lexicon or morphology policy. The report specifically says the profile enforces metre for the position quantity and seconds for duration.

## Corrections to Phase 8AS evidence map

The earlier Phase 8AS implementation described the two quantity/spatial phrases as wholly unresolved and said the sequence was not fully parsed. That was too broad because it omitted the archived Phase 5.22 fixture parser.

The model now distinguishes:
- `ARCHIVED-FIXTURE-PARSE`: the two phrases interpreted by the historical bounded parser;
- `PARTIAL-EXAMPLE`: KAN/KEN, HE/HA and KAS, whose meanings are only example/profile bounded;
- `EXAMPLE-BACKED`: MEL as an anchor token, with landmark semantics unresolved.

It does not claim that the current TypeScript engine implements the archived parser. The archived parser's 17/17 result is recorded as a historical reported result, not a test rerun or current verification.

## Implementation

Updated:
- `src/engine/constructionHandFlameEvidence.ts`
- `src/engine/constructionHandFlameEvidence.test.ts`
- `src/engine/testRegistry.ts` (CON-HF-015–016; corrected CON-HF-010 label)
- `src/App.tsx` (Research & Review entry 10 corrected to 17 tokens and expanded to include archive recovery)
- This document

The 17-token count is retained. The evidence counts are now one example-backed group, three partial-example groups, two archived-fixture-parse groups and zero wholly uninterpreted groups under this evidence model.

## Remaining limits and next work

1. Recover the complete Phase 5.22 parser source from the original archive rather than relying only on its indexed excerpt.
2. Inspect all 17 historical tests and reproduce them against a preserved fixture implementation if the full source can be retrieved.
3. Compare its token tables and phrase grammar with the current lexicon, Construction Studio and source concordance.
4. Recover the underlying Phase 4/v2.0 frame × parameter × coda definitions. Phase 5.22's `kan/ken/kas` aliases are not a productive Foot paradigm and do not resolve the CVC/optional-coda discrepancy.
5. Do not infer physical feasibility, energy magnitude, matter coupling strength or safe release from the parser result.

No canon, spoken grammar, semantic contract, parser runtime or physical execution changed. Main and production remain untouched; no GitHub Actions workflow was triggered.
