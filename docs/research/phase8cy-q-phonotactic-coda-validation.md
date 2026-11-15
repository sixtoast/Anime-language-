# Phase 8CY-Q — Phonotactic coda validation and semantic coda classification

**Canon effect:** NONE. **Grammar/compiler effect:** evidence reviewer only. **Execution:** NONE.

## Source rule

Phase 4 §4 Table 4 gives the legal syllable codas as `m n ng p t k s sh l r`. This is a phonotactic inventory, not the semantic Construction relation-coda inventory. Phase 4 §§3.1–3.2 identify only five relation codas: `m n ng s sh`.

The prior reviewer correctly separated known semantic meanings from unassigned codas, but its shape predicate accepted any single consonant after a frame and parameter vowel. That admitted consonants which Phase 4 does not permit in coda position.

## Implementation

The CVC shape recogniser now accepts only the ten Table 4 codas, including the two romanised digraphs `ng` and `sh`. It rejects `f v z h w j` in coda position, as well as vowel-final candidates.

The result exposes an explicit `codaEvidenceClass`:
- `RELATION-CODA`: one of the five semantically described relation codas.
- `PHONOTACTIC-ONLY`: a legal syllable coda with no recovered relation-coda meaning (for example `l` in `pal`).
- `SOURCE-CONFLICT`: exact source conflicts such as `kal` and `mel`.
- `NONE`: no coda is present or applicable.

This classification prevents phonotactic legality from being mistaken for a Construction relation meaning.

## Preserved conflicts

- `kal`: P4-T10 lists it as Foot-shaped; `l` is legal phonetically but absent from the five semantic relation codas. The source does not resolve whether P4-T10 tests only shape or a broader Foot class.
- `mel`: P4-T10 lists it as Foot-shaped; §8 Table 14 analyses it as `me` plus anchor coda `l`, a fused reference. The initial `m` is not one of the six Construction frames.
- Phase 5.16 C-02's optional-coda statement still conflicts with Phase 4's CVC description. No mandatory/optional rule is selected.

## Regression coverage

Adds tests for all ten legal phonotactic codas, six illegal coda consonants, and the distinct semantic/source-conflict classifications. Test cases are registered. They are authored, not yet executed for this commit.

## Boundaries

No productive 6×6×5 lexicon is generated. Parameter families remain provisional. The reviewer does not assign individual frame meanings, macro signatures, physical effects or execution semantics. No GitHub Actions workflow is dispatched, no PR is merged and production is untouched.
