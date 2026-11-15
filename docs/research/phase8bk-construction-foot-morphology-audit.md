# Phase 8BK — Construction Foot productive morphology audit

**Date:** 2026-11-14  
**Canon effect:** none. **Grammar changes:** none.  
**Tests authored:** six Vitest cases. **Tests executed:** not executed.

## Scope

This phase audits what is and is not known about combining the six Construction frame consonants with the six recorded parameter-vowel families. It does not propose that every Cartesian-product combination is grammatical.

## 6 × 6 evidence matrix

Added `src/engine/constructionFootMorphologyAudit.ts`. The matrix has 36 frame–vowel pairs. Exactly six are labelled CANONICAL-CV-FRAME because the recovered inventory explicitly lists pa, ba, ta, da, ka and ga. The remaining 30 are UNRESOLVED-COMBINATION, not declared invalid. All 36 have unresolved semantic interpretation and are not established as complete Feet.

Parameter-vowel families (Energy, Motion, Extent, Structure/form, Information, Baseline) remain provisional. This matrix must not be read as evidence that the parameter vowels combine productively with every frame.

## Whole-token evidence kept separate

The standalone Phase 5.22 parser source records kan, ken and kas as whole example-level tokens with aliases/roles. Their internal segmentation is explicitly NOT-ESTABLISHED. The final letters n and s occur in these examples but do not constitute a complete coda inventory.

TRAK's p/t/k pattern and KREN's proposed b/d/g counterpart remain macro-level associations. Individual consonant meanings, macro expansion and executable Foot semantics are not inferred.

## CVC discrepancy

The Phase 5.15 CVC description and Phase 5.16 C-02 optional-coda summary remain parallel readings. This phase does not resolve whether every Foot requires a relation coda.

## Website

The Construction Foot inventory now displays the 36-pair audit, the six canonical CV count, the 30 unresolved pairs and the three whole-token examples. It expressly warns that the matrix is not a productive paradigm and that observed final letters are not a coda inventory.

## Tests

Six tests cover matrix dimensions, the six documented forms, unresolved combinations, whole-token segmentation limits, final-letter evidence limits and the unresolved source conflict. They are authored only; no test runner or CI workflow was executed.
