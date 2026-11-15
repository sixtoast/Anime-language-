# Phase 8BB — Performed reference homophone evidence

**Date:** 2026-11-14  
**Canon effect:** none. **Grammar changes:** none. **Executable parsing:** none.  
**Tests authored:** CON-REF-SRC-001–003 plus three boundary tests. **Tests executed:** not executed in this environment.

## 1. New source-recovery result

The repository's indexed Phase 5.20 Source Recovery and Homograph Evidence Matrix includes a machine-readable results file:

- Path: `sources/originals/Arcane_Phase_5_20_Results.json`
- SHA-256 (from the archive index): `7ab87138591049f8025f11c6ee12e9c566fd78e452814dcf0cd6e452b7983197`
- Length: 1,596 extracted characters.
- The full JSON is available as a standalone repository file and was inspected for this phase.

It records:
- `re` Performed: `TARGET-surface`; reference starts the construction and persists until replaced.
- `ra` Performed: `TARGET-path`; recorded as a slot-resolved homophone.
- Shared Arcana collisions: `re` is also numeral digit 4; `ra` is also the radian unit.
- Mixed-register prohibition remains unresolved.
- Whole-spoken unique parsing remains blocked; Phase 4 §§8–9 say the whole-spell grammar parse/full parser was not completed.
- Parameter-vowel and h-domain mappings remain provisional.
- No canon change is recorded.

This is a Phase 5.20 recovery/consolidation claim that points back to Phase 4 §§3.3, 8 and 10 and the Phase 4 lexicon generator. It is not direct inspection of the original Phase 4 DOCX or PDF, whose binary bodies remain unextracted here. Accordingly the two readings are classified as **partially recovered**, not as fully verified executable rules.

## 2. Website implementation

The Construction Studio now has a separate Performed reference evidence inspector for `re` and `ra`, alongside the existing `mel` worked-example inspector and the formal reference-context binder.

For each form it shows:
- the reported Performed reading;
- the competing Shared Arcana interpretation;
- the Phase 5.20 consolidation provenance;
- the limitation that slot context is required and a unique parse has not been established.

The inspector deliberately does not:
- decompose either form into segments;
- update the formal reference context;
- choose a reading from register labels alone;
- parse a complete Construction clause;
- claim that the source gap has been closed.

Three primary test IDs are registered, with additional tests for empty input, unknown forms, case normalisation and the no-binding boundary. They are authored but unverified until a test runner executes them.

## 3. Evidence boundary

| Form | Performed reading | Competing Shared reading | Status |
|---|---|---|---|
| `re` | TARGET-surface | Numeral digit 4 | Partially recovered |
| `ra` | TARGET-path | Radian unit | Partially recovered |

The fact that the Phase 5.20 matrix calls these slot-resolved does not supply a grammar rule for how a parser identifies the slot, nor does it prove a unique parse across a full spoken clause. The formal reference binder continues to accept only its existing documented token/scope combinations; this phase does not widen that contract.

## 4. Construction findings that remain open

- The original Phase 4 DOCX and PDF bodies still need independent extraction and comparison.
- The complete v2.0 reference inventory and landmark paradigm remain unrecovered.
- Phase 5.15 CVC and Phase 5.16 optional-coda accounts remain in conflict.
- The relation-coda inventory and meanings remain unrecovered.
- Parameter-vowel and H-domain mappings remain provisional.
- D-006 and D-007 remain unresolved.
- Whole-spoken unique parsing, physical feasibility and spell execution are not established.

## 5. Deployment and validation

Feature branch only. The tests are authored, not executed. Vercel preview build is the deployment verification path; no GitHub Actions were dispatched. Main and production remain untouched.
