# Phase 8AK — Disambiguating Construction Foot frames from vector coordinate frames

**Date:** 2026-11-13  
**Canon effect:** none. **Tests authored:** CON-FOOT-FRAME-001–003 (authored-unverified).  
**Tests executed:** not run locally. Vercel preview build is the available TypeScript/build check.

## Finding

The source set uses the word *frame* in at least two distinct technical senses:

1. **Construction Foot frame consonants.** Phase 4 L-03 and the Phase 5.15 Construction Contract Matrix identify six consonant classes p, b, t, d, k and g, represented by pa, ba, ta, da, ka and ga. The Phase 5.15 matrix explicitly says their semantic contrasts require the original v2.0 definitions.
2. **Vector coordinate frames.** The Phase 5.8 provisional type checker uses world, caster and local as coordinate-context labels for typed vectors.
3. **Vector frame transforms.** The Phase 5.9 semantic-frame audit script defines basis vectors and handedness for world/caster/local vector operations.

The second and third senses do not provide a semantic interpretation of the six Foot consonants. In particular, caster handedness, basis orientation, or cross-product behaviour must not be mapped onto p/b/t/d/k/g.

## Implementation

Added `src/engine/constructionFrameTerminology.ts`, a small source-indexed terminology registry with three explicit entries. The Construction Studio now displays the concepts separately and warns against cross-subsystem inference. Added three registered tests in `constructionFrameTerminology.test.ts`.

## Consequences for future development

- Keep Foot frame consonant contrasts unresolved until original v2.0 definitions or an owner-approved replacement specification is recovered.
- Keep world/caster/local coordinate typing within the dimensional/vector subsystem.
- Do not infer Foot morphology from vector handedness or basis transforms.
- Do not change existing vector semantics or Foot inventories based on this terminology distinction.

## Sources inspected

- `sources/originals/Arcane_Phase_5_15_Construction_Contract_Matrix.csv`, Frame inventory row.
- `sources/originals/arcane_phase58_types.py`.
- `sources/originals/arcane_phase59_semantic_frames.py`.

The source scripts were inspected as text. They are audit implementations, not proof of the full Arcane canon or executable magic.
