# Phase 8AL — Construction frame-to-macro association evidence

**Date:** 2026-11-13  
**Canon effect:** none. **Tests authored:** CON-FRAME-004–008 (authored-unverified).

## Recovered source distinction

The Phase 5.15 Construction Contract Matrix gives a macro-level pattern for two frame sets:

- **TRAK:** “Alter”; voiceless-stop frame consonants p, t, k; discrete change. Its full contract remains open because expansion, arity and physical/resource semantics are missing.
- **KREN:** voiced-stop frame consonants b, d, g, described as a reinforced counterpart, but explicitly marked **PROPOSED** with owner confirmation required.

This evidence is more specific than the frame inventory's statement that individual consonant semantic contrasts require the original v2.0 definitions. The two triplets may be recorded as macro-associated sets, but the source does not define the individual meaning of p versus t versus k, or b versus d versus g.

## Implementation

Added `src/engine/constructionFrameContrastEvidence.ts` with a read-only lookup and explicit status distinction. The Construction Studio now displays both associations alongside the Foot consonant inventory.

TRAK is labelled `DESCRIBED-PATTERN`; KREN is labelled `PROPOSED-OWNER-CONFIRMATION`. Both are explicitly non-executable. No Foot parser, parameter-vowel mapping, relation-coda inventory or macro contract is changed.

## Tests and limits

Added CON-FRAME-004–008 for exact frame sets, evidence-status distinction, unresolved individual semantics, non-executability and malformed/unknown lookup rejection. Tests are authored-unverified; no local unit/browser test run is claimed.

## Next source requirement

Recover the original v2.0 morphology definitions for the six individual consonants and obtain owner confirmation before promoting KREN. The existing Phase 5.15/5.16 matrices do not settle these questions.
