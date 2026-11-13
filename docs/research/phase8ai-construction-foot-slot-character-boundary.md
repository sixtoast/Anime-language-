# Phase 8AI — Construction Foot slot-character boundary

**Date:** 2026-11-13  
**Canon effect:** none. **Tests authored:** CON-FOOT-013–017 (authored-unverified).  
**Tests executed:** none locally. The prior Phase 8AH preview deployment is confirmed READY; this commit has not yet been deployed.

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

Phase 8AH commit d2646e789ea59c25f781e51d9fac9400e963cfc6 is confirmed READY on Vercel preview at https://anime-language-65rb0ycio-sixtoast1.vercel.app/. Its build ran `tsc --noEmit && vite build`, transformed 2,125 modules and completed. Vite emitted a non-fatal large-chunk warning. This Phase 8AI commit requires its own preview deployment check. Main and production remain untouched.
