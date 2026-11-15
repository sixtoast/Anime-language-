# Phase 8BH — Construction reference and phrase-boundary interaction

**Date:** 2026-11-14  
**Canon effect:** none. **Grammar changes:** none.  
**Tests authored:** five Vitest cases. **Tests executed:** not executed.

## Language finding

Two recovered facts now meet at a useful boundary:

1. Phase 5.16 C-04 records reference persistence as UNTIL-REPLACED; absent replacement preserves the current binding, while a valid replacement replaces it.
2. The Phase 5.22 hand-flame fixture uses five middle dots to separate six phrases.

No recovered source says that a middle dot itself replaces a reference, terminates its persistence, or resets reference scope. Nor does the recovered evidence establish a general clause-boundary token.

The new `constructionReferenceBoundary.ts` is an evidence-aware interaction model, not a grammar rule:
- `NO-REPLACEMENT` applies the recovered persistence contract.
- `VALID-REPLACEMENT` applies the recovered replacement contract.
- `PHRASE-BOUNDARY` and `CLAUSE-BOUNDARY` preserve the current binding only as an inspection state, while returning `UNRESOLVED` for the boundary's grammatical effect.
- It explicitly forbids inferring a scope reset or a new reference from punctuation alone.

This allows the website's research tools to reason about the two evidence sets without silently inventing a connection between them. The model is not connected to the spoken parser or execution engine.

## Morphology remains source-conflict aware

Phase 5.15 specifies CVC (frame + parameter vowel + relation coda); Phase 5.16 C-02 summarises the coda as optional. Existing `constructionFootComposition.ts` compares both readings for a supplied shape and keeps both conclusions UNRESOLVED. This is the correct current treatment. Six CV forms are canonical frame forms only; no productive frame × parameter × coda paradigm has been recovered.

The parameter-vowel labels and H-series coupling glosses remain provisional. The TR​AK frame grouping is described at macro level, while KREN remains marked as requiring owner confirmation. No individual consonant meanings are assigned.

## Website / test coverage

Added a dedicated boundary interaction model and five tests covering persistence, explicit replacement, middle-dot non-replacement, unknown clause-boundary effect, and invalid stored bindings. Added two grouped test-registry entries. During this update, the missing comma between SRC-COMP-002 and CON-BOUND-001 in the registry was also corrected.

No source text was reconstructed from truncated archive previews. No new grammar or lexicon entries were promoted.
