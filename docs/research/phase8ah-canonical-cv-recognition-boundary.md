# Phase 8AH — Canonical CV recognition boundary correction

**Date:** 2026-11-13  
**Canon effect:** none. **Tests authored:** CON-FOOT-010–012 (authored-unverified).  
**Tests executed:** none.

## Finding

The prior structural recogniser accepted every combination of one of the six frame consonants and one of the six parameter vowels as `FRAME-FORM-RECOGNISED`. That was broader than the recovered evidence. Phase 4 L-03 and the Phase 5.15 matrix identify exactly six canonical CV forms: `pa, ba, ta, da, ka, ga`. They do not establish all 36 frame × parameter-vowel combinations as canonical CV forms.

The parameter-vowel family labels are separately provisional (Phase 5.16 C-06), and the complete productive Foot paradigm is not recovered (C-09).

## Correction

`reviewConstructionFootShape` now:
- returns `FRAME-FORM-RECOGNISED` only for the six explicitly recovered canonical CV forms;
- returns `UNRESOLVED` for other frame-plus-parameter-vowel combinations, rather than calling them invalid or canonical;
- continues to return `UNRESOLVED` for CVC-shaped forms with a consonant in the coda position because the complete coda inventory is missing;
- rejects known structural defects (unsupported length, unknown frame initial, non-family medial vowel, vowel in final coda position).

The playground explanation now describes this narrower boundary. The tests assert all 36 possible initial/vowel pairs and ensure only the six source-backed forms receive the recognised status.

## Evidence boundary

This is a correction to the recogniser's claim, not a language change. It does not settle the CVC versus optional-coda discrepancy between Phase 5.15 and Phase 5.16 C-02, and does not infer relation-coda meanings or productive combinations.

## Validation and deployment

CON-FOOT-010–012 are authored and registered as authored-unverified. No local test runner, browser acceptance suite or GitHub Actions workflow was executed. Vercel preview will be checked against the resulting commit; production and main remain untouched.
