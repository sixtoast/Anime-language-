# Phase 8CY-P — Source-aware Foot morphology reviewer and website integration

**Canon effect:** NONE. **Compiler effect:** NONE. **Execution:** NONE.

## Purpose

The previous morphology reviewer recognised six CV forms and CVC-shaped candidates, but its final-consonant recogniser needed an explicit regression guard against vowel-final forms. This increment adds that coverage and connects the source-aware morphology result to the existing Construction research panel.

## Reviewer correction and coverage

A CVC candidate requires:
- a recognised frame consonant from the source inventory;
- a parameter vowel from the recorded provisional family;
- a final consonant, either a single consonant letter or the recognised digraphs `ng` and `sh`.

A vowel in the final position is rejected as an unrecognised shape. This is only a structural filter. It does not certify lexical validity, parameter-vowel productivity, coda optionality, a macro signature or physical effect.

## Website integration

The existing Construction Foot input now drives both the historic shape checker and the Phase 4 source-aware morphology reviewer. The additional result exposes frame-group association, provisional parameter family, relation coda, source-backed coda meaning, lexical validity and execution/canon boundaries.

The existing source comparison remains available and is now accurately contextualised against the recovered Phase 4 body transcription. Historical whole-token examples `kan`, `ken` and `kas` remain distinct from the productive coda inventory; no automatic segmentation is performed.

## Source classification conflict

The exact form `mel` returns `SOURCE-CLASSIFICATION-CONFLICT`: §8 Table 14 describes it as fused reference `me` + anchor coda `l`, while §10 P4-T10 lists it as Foot-shaped. The six-frame inventory does not include `m`. The reviewer neither accepts nor rejects `mel` as a lexical Foot and does not generalise the conflict to other m-initial strings.

## Tests and verification

Two regression cases are added for vowel-final rejection and consonantal/digraph coda recognition. Tests are authored and registered, not yet executed for this commit. The Vercel preview is the next verification gate. No GitHub Actions workflow is dispatched, no PR is merged and production is untouched.
