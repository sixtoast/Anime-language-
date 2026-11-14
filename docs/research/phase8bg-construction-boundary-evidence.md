# Phase 8BG — Construction phrase-boundary evidence and language recovery

**Date:** 2026-11-14  
**Canon effect:** none. **Grammar changes:** none.  
**Tests authored:** four Vitest cases. **Tests executed:** not executed.

## Incantations Arcana: a bounded syntax recovery

The exact Phase 5.22 hand-flame fixture is:

`mel · po da za shi to za ma · kan ken · he ha · sa shi za se · kas`

Its recovered parse tree contains six phrases and seventeen whitespace-delimited tokens. Five middle-dot markers separate the six phrases. Phase 8BG adds a small evidence contract that records this observation and allows the exact fixture to be checked without pretending to parse arbitrary Construction.

This is a useful but deliberately narrow language result:

- The middle dot is a required phrase separator in this particular recovered fixture profile.
- Whitespace separates tokens within phrases in the recorded surface.
- The parse tree assigns fixture-level roles to anchor, position, Foot sequence, coupling sequence, duration and release.
- This does **not** establish that the middle dot is the universal spoken Construction clause delimiter, that it terminates a clause, or that arbitrary clauses must contain six phrases.
- It does not establish omission, repetition, nesting, sequencing, scope reset or replacement syntax.

The six phrase roles are therefore a fixture schema, not a productive grammar.

## Evidence-led language decisions

The two Construction matrices continue to expose a substantive Foot-shape conflict: Phase 5.15 states CVC, while Phase 5.16 C-02 describes the relation coda as optional. The safe working statement remains: a frame and parameter vowel are represented, relation is associated with coda position, but whether every Foot must contain a coda is unresolved. The canonical CV forms pa/ba/ta/da/ka/ga are frame forms; they are not proven complete Feet.

The parameter family labels (a/u/o/e/i/ə), H-series physical mappings, full relation-coda inventory, and general KAN/KEN/KAS morphology remain provisional or unrecovered. No new phoneme meanings or productive combinations are introduced.

## Website and tooling

Added `constructionBoundaryEvidence.ts` and a four-case test file. The model records the five exact separators, phrase positions, source basis and inference limits. It is intentionally not wired into the general parser. The Phase 8BF transcription comparator remains an offline exact-line comparison utility; the full three transcription bodies are not currently exposed as ordinary text files in the repository, so no paragraph-difference results are claimed.

## Repository quality correction

During the Phase 8BF review, the test registry tail was found to be missing a comma between the existing WEB-SRC-001 entry and the new SRC-COMP entries. This would make the registry invalid TypeScript. Phase 8BG corrects that syntax before adding its new test records. This is a source inspection finding; no build or tests are claimed executed.

## Validation and next evidence gate

Four tests are authored for exact separator count, exact-fixture matching, non-generalisation and the distinction between phrase boundaries and whitespace tokenisation. They have not been executed. The next major language milestone is recovery of the complete Phase 4 text bodies and resolution of the CVC/optional-coda discrepancy, not expansion of this fixture into an invented universal grammar.
