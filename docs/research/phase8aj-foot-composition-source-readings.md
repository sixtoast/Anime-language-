# Phase 8AJ — Source-reading-aware Construction Foot composition

**Date:** 2026-11-13  
**Canon effect:** none. **Tests authored:** CON-FOOT-018–023 (authored-unverified).  
**Tests executed:** not run locally; Vercel preview build is the available TypeScript/build check.

## Source conflict preserved

The recovered source matrices contain two distinct descriptions:

- `sources/originals/Arcane_Phase_5_15_Construction_Contract_Matrix.csv`, row 4: CVC, frame consonant + parameter vowel + relation coda. Row 7 says the relation occupies coda position but the complete inventory and mappings are incomplete.
- `sources/originals/Arcane_Phase_5_16_Construction_Recovery_Matrix.csv`, C-02: frame + parameter vowel + optional relation coda. C-09 says exact Foot rules remain unavailable.

These statements are not interchangeable. Neither implementation nor UI selects one as canon.

## Implementation

Added `reviewConstructionFootComposition` in `src/engine/constructionFootComposition.ts`. It reuses the structural recogniser and reports two independent assessments:

1. Phase 5.15 CVC-required reading: a CV-only form is marked as missing the required coda.
2. Phase 5.16 C-02 optional-coda reading: a CV-only form is marked as structurally aligned with the optional-coda description, without claiming productive Foot completeness.

For a three-slot input, both readings report occupied positions but leave coda membership and meaning unresolved. Both readings always retain an UNRESOLVED conclusion. Unrecorded frame-vowel combinations remain visible. Invalid input is not assessed under either reading.

The Playground now shows the two readings side by side and labels them as competing source readings, not selectable grammar modes.

## Tests and limits

Added CON-FOOT-018–023 for dual-reading preservation, required-coda absence, optional-coda alignment, unresolved three-slot forms, unrecovered frame-vowel combinations and malformed input. Tests are authored-unverified; no local unit tests, browser acceptance tests or GitHub Actions workflows were run.

No coda inventory, semantic value, productive paradigm, Foot argument structure, physical behaviour or execution rule has been invented. Main and production remain untouched.
