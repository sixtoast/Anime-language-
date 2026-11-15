# Phase 8AB — Construction reference binding integrity

**Status:** Implementation hardening around recovered reference rules  
**Canon effect:** none  
**New language forms:** none  
**New grammar rules:** none  
**Tests added:** CON-REF-008–014  
**Execution status:** authored-unverified; tests have not been executed in this session

## 1. Source-backed reference behaviour retained

The recovery matrix (Phase 5.16 C-04/C-05, citing Phase 4 §3.3) records:
- reference context persists until replaced;
- MI, NI and RI use default-volume scope;
- `me` is described as SELF-surface.

This is not a complete reference grammar. It does not supply anatomical landmarks, boundary semantics, identifier syntax, transformations, or a productive rule for the performed fused-reference inventory. No such rules are introduced here.

## 2. Runtime defect

The prior `bindConstructionReference` accepted TypeScript string parameters but called `.trim()` without checking runtime types. Untyped callers could trigger an exception by supplying a number or other non-string identifier.

More importantly, `advanceConstructionReferenceContext` accepted a typed binding object and trusted it without validating the token/scope pairing, non-empty identity, or persistence value. A malformed replacement could therefore become the active reference context despite contradicting the recovered contract.

## 3. Implementation correction

The binding boundary now accepts unknown runtime values and validates them before returning a binding.

- Only MI, NI, RI and `me` receive the already recovered scopes.
- MI/NI/RI must use DEFAULT-VOLUME.
- `me` must use SELF-SURFACE.
- Reference IDs must be non-empty strings; surrounding whitespace is trimmed.
- Persistence must be exactly `UNTIL-REPLACED`.
- A malformed replacement returns UNRESOLVED with `REPLACEMENT_BINDING_INVALID`; it does not silently preserve or install a binding.
- A malformed existing binding returns UNRESOLVED with `REFERENCE_BINDING_INVALID`.
- A null update preserves a valid existing binding; null with null is UNBOUND.
- No undocumented token is assigned a scope.

The output remains a reference-context review only. It does not prove the referent exists, can be sensed, is reachable, or is physically coupled.

## 4. Regression coverage

Added and registered:
- CON-REF-008 — non-string reference ID rejected without throwing.
- CON-REF-009 — token/scope mismatch rejected.
- CON-REF-010 — malformed replacement rejected.
- CON-REF-011 — corrupted persisted binding rejected.
- CON-REF-012 — unknown persistence policy rejected.
- CON-REF-013 — reference ID whitespace normalised.
- CON-REF-014 — empty initial context reported as UNBOUND.

All are `authored-unverified`. No test execution is claimed.

## 5. Explicit non-decisions

This increment does not:
- treat mi/ni/ri performed forms as interchangeable with MI/NI/RI;
- infer the scope-vowel paradigm from analogy;
- resolve RE/RA lexical collisions;
- define MEL or anatomical landmarks;
- create identifier or coordinate syntax;
- infer sensing, target acquisition, coupling, feasibility, or execution;
- change canon or lexicon data.

## 6. Verification

- Parent: `b4d005821f64eed713c44714476af43450064652`
- Build: pending exact-commit Vercel result.
- Unit/browser tests: not executed.
- Main/production: unchanged.
