# Phase 8AU — Archived Phase 5.22 fixture contract extraction

**Date:** 2026-11-14  
**Canon effect:** none. **General grammar effect:** none. **Runtime parser:** not implemented.  
**Tests authored:** CON-P522-001–009; not executed in this environment.

## Why this phase exists

Phase 8AT recovered the existence and broad interpretation of the archived Phase 5.22 bounded parser. This phase extracts the token tables and the visible quantity/test contract from the archive index into a version-bounded evidence module. It does not reconstruct the missing parser source from a partial excerpt.

## Source identity and recovery boundary

The archive index records:
- Parser member: `Arcane_Phase_6S_Typed_Expression_Integration/arcane_phase_5_22_parser.py`
- SHA-256: `8041e7e40cd6e152aa9d38982e2a8986515a1aa7bc315dbfc1e7065e72ee2905`
- Extracted length: 8,612 characters; index preview limit: 1,800 characters.
- Report SHA-256: `e4e29b0e39e29d8d778613a798ba817dd5645da1caaea74d782b53160f598fe6`
- Results SHA-256: `71c2559dc4463e2c731008795838db5f845e0258c5206ecee5597be9b5a18007`

The indexed preview contains only the beginning of the parser. The full source, full report and full results JSON are not separately available as UTF-8 files in the current repository checkout. The source ZIP is an archive artefact, not a file that this phase has extracted. Therefore this is excerpt-based recovery, not full source review.

## Historical token tables

| Family | Forms and values | Boundary |
|---|---|---|
| Digits | za=0, ki=1, to=2, mu=3, re=4, sa=5, fi=6, du=7, go=8, pe=9 | Phase 5.22 fixture profile only |
| Units | ma=metre, se=second, ke=kilogram, ra=radian, ku=kelvin, sho=dimensionless | Not global unit canon |
| Axes | pa=−X, ba=+X, ta=−Y, da=+Y, ka=−Z, ga=+Z | Do not conflate with Foot frame meanings |
| Role | po=position | One recovered role in this bounded parser |
| H-couplings | he=matter/mechanical-or-chemical; ha=energy/thermal; ho=electromagnetic; hu=biological; hi=informational; hə=mana-only | Every domain label is explicitly provisional |
| K-series | kan=TRAK ENRA; ken=FREM / structure held; kas=SHREN / release | Documented example-level aliases only |

A critical naming collision is preserved: `pa/ba/ta/da/ka/ga` are used in the historical fixture as axis labels, while the same forms are also documented canonical CV frame forms in the Construction Foot inventory. The two inventories are distinct contextual roles. This phase does not assign a shared semantic identity to them.

## Quantity profile and worked values

The archived report states:
- A numeral must terminate in a unit token.
- `shi` is the decimal separator and requires digits on both sides.
- Unknown digit tokens and multiple decimal separators are rejected.
- The position quantity must use metres.
- The duration quantity must use seconds.

Using only the indexed digit table:
- `za · shi · to · za · ma` = 0.2 metre.
- `sa · shi · za · se` = 5.0 seconds.

These are fixture-profile readings, not proof of general numeric syntax, measurement ontology, precision policy, unit conversion, physical validity or spell feasibility.

## Historical test report

The archive summary reports 17 passed, 0 failed. The visible JSON excerpt exposes 12 cases:
1. valid canonical fixture → PARSED_SUBSET
2. missing phrase → E-PHRASE-COUNT
3. empty phrase → E-EMPTY-PHRASE
4. unknown anchor → E-ANCHOR
5. unknown role → E-SPATIAL
6. unknown axis → E-SPATIAL
7. quantity missing unit → E-QTY-UNIT
8. bad digit → E-QTY-DIGIT
9. decimal without whole digits → E-QTY-DECIMAL
10. decimal without fractional digits → E-QTY-DECIMAL
11. multiple decimals → E-QTY-DECIMAL
12. wrong position unit → E-POSITION-UNIT

The remaining five result records are not visible in the indexed excerpt. The historical summary is not a current test run and has not been independently reproduced.

## Implementation

Added:
- `src/engine/constructionHistoricalFixtureContract.ts`
- `src/engine/constructionHistoricalFixtureContract.test.ts`
- Test registry cases CON-P522-001–009
- Research & Review entry 11
- This research record

The module is immutable evidence metadata. It does not parse expressions, validate current language forms, alter the lexicon, resolve CVC optionality, implement the historical Python parser, simulate mana or execute spells.

## Outstanding recovery work

1. Extract the full original Phase 5.22 parser/report/results from the correct archive member and verify each hash.
2. Reproduce all 17 historical tests against the recovered source, without treating that as current canonical conformance.
3. Compare the fixture token tables against versioned lexicon entries and Construction inventory.
4. Reconcile the shared spellings `pa/ba/ta/da/ka/ga` across axis and Foot-frame contexts.
5. Recover the complete v2.0 Foot morphology and coda inventory from authoritative source material.
6. Keep physical feasibility, mana magnitude and coupling strength outside the parser until independently specified.

## Verification status

Nine regression tests are authored, not executed. No local build, Vitest run, browser test or physical simulation is claimed. No canon, global lexicon, general parser or runtime semantics changed.
