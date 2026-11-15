# Phase 8AI — Construction Foot slot-character boundary

**Date:** 2026-11-13  
**Canon effect:** none. **Tests authored:** CON-FOOT-013–017 (authored-unverified).  
**Tests executed:** no local unit or browser tests. The corrected Phase 8AI source passed Vercel's TypeScript and Vite production build.

## Finding

The Phase 8AH recogniser correctly narrowed canonical CV recognition to the six recovered forms, but its CVC check still accepted any non-parameter-vowel character in the final slot. That included punctuation and whitespace. It also described such a character as a consonant coda too readily. The sources establish a relation-coda position but do not provide a complete consonant/coda inventory.

## Correction

- Runtime input is guarded: non-string values return a structural invalid result instead of throwing.
- Length is counted by Unicode code points, preserving the intended treatment of the parameter vowel ə.
- Every occupied slot must be a Unicode letter; punctuation and whitespace are rejected.
- A final letter remains unresolved. The recogniser explicitly does not infer that an unfamiliar letter is a consonant in the source phonology or an allowed relation coda.
- The six recovered canonical CV forms remain the only forms assigned FRAME-FORM-RECOGNISED.
- The CVC-versus-optional-coda source discrepancy remains unresolved. No morphology, coda meanings, semantic interpretation or execution behaviour has been added.

## Tests

Added CON-FOOT-013–017 for punctuation/whitespace, non-string runtime inputs, Unicode code-point length, unfamiliar final letters and empty input. Existing CON-FOOT-001–012 are retained and aligned to the stricter distinction. All are authored-unverified; no local test runner, browser acceptance suite or GitHub Actions workflow was run.

## Deployment and safety

Phase 8AH commit d2646e789ea59c25f781e51d9fac9400e963cfc6 is confirmed READY on Vercel preview at https://anime-language-65rb0ycio-sixtoast1.vercel.app/. The first Phase 8AI commit (070ff7b11a55ec0c59474d8dbceff4c8d2074260) failed TypeScript because the Unicode property matcher was over-escaped; it was immediately corrected in 5d25de1f8f3d41cd1e06934cb0ac677ce5f12528. The corrected deployment dpl_6aondKX1WFa5rKo4yutgcQhzrKxe is READY at https://anime-language-i7t2ez9mq-sixtoast1.vercel.app/. Its build ran `tsc --noEmit && vite build`, transformed 2,125 modules and completed; Vite emitted a non-fatal large-chunk warning. No unit or browser acceptance suite was run. Main and production remain untouched.
