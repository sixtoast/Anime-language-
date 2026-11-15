# Phase 8BL — Version-bounded Construction spatial evidence

**Date:** 2026-11-14  
**Canon effect:** none. **Grammar changes:** none.  
**Tests authored:** six Vitest cases. **Tests executed:** not executed.

## Two separate evidence profiles

### Historical Phase 5.22 hand-flame fixture

The exact fixture tree reads `po` as the position role, `da` as the +Y axis, and `za shi to za ma` as 0.2 metre under fixture-local quantity tables. This is an exact worked-example reading. It does not recover a general spatial grammar, coordinate frame, origin, unit system or attachment contract.

### Arcane v3.0-L lexical inventory

The separately versioned inventory lists FE (Frame), signed-axis forms PA/BA/TA/DA/KA/GA, relation forms JO/JUR/JA/JE/JI and geometry forms PI/LEN/PLA/SUR/VOM/PAR. Their full signatures and historical equivalence are not established by the currently recovered Construction evidence.

## Collision discipline

The spelling DA occurs in both profiles, but that alone does not prove identity or semantic continuity. The Phase 5.22 fixture's lowercase `da` is recorded as +Y; the v3.0-L inventory's uppercase `DA` is a signed-axis form in a different versioned vocabulary. The fixture role `po` is not treated as a v3.0-L operator.

## Open spatial contract

Still unrecovered: coordinate-frame selection, origin/reference binding, axis and vector composition, quantity attachment and unit conversion, role signatures, transforms, bounds, validity and failure conditions.

## Website and tests

The Construction inspector now displays both profiles side by side and flags the spelling collision without merging the vocabularies. Six tests cover the fixture-local reading, v3.0-L inventory, cross-profile distinctions, missing interfaces and non-executable boundary. Tests are authored only; no runner or CI workflow was executed.
