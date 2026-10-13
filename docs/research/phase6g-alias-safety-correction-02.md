# Phase 6G Alias Safety Correction — Audit 02

**Status:** corrective change committed; automated test/build execution still not verified.  
**Canon effect:** none.  
**Commits:** parser correction `e6ac33212f8dd62e303d3a13ab8f1e547104cfd5`; regression tests `5142aa8ad22c5f4d231a9f2d2f9fa61de82e1b8c`.

## Finding

The initial TypeScript port enabled the archived alias map by default. That meant forms such as `FRATA`, `FRAKA`, `DRIM` and `DRAL` could be rewritten into the Phase 6G prototype vocabulary before parsing. These forms also appear in the provisional Phase 2 operator registry, so silent default rewriting could change operator identity across parser dialects.

That is an unsafe default even if the archived prototype historically enabled migration aliases.

## Correction

- Legacy alias rewriting is now **opt-in** through `allowLegacyAliases: true`.
- By default, the parser does not rewrite the affected spellings.
- Operator forms known to the provisional operator inventories but unsupported by the Phase 6G signature table are reported as `UNRESOLVED_OPERATOR`, rather than being treated as ordinary unknown words.
- Regression tests cover the default rejection and explicit legacy-mode behaviour.

## Scope boundary

This is an implementation safety correction, not a canonical decision that any spelling is obsolete or invalid. The repository contains distinct provisional dialects and historical naming layers; those need a versioned alias registry and explicit parser-dialect selection rather than implicit global normalisation.

## Verification

The regression tests have been authored and committed. Their execution and the production build have not been verified in a current GitHub Actions run. Do not describe this correction as test-passing until a current run provides evidence.
