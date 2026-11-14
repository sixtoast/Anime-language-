# Phase 8BO — Construction reference grammar consolidation

**Date:** 2026-11-14  
**Canon effect:** none. **Grammar changes:** none.  
**Tests authored in this phase:** no new tests; existing reference and boundary suites remain the executable specification candidates.  
**Tests executed:** not executed locally. Vercel's TypeScript build had failed before this phase on two unrelated typing defects; this phase includes their minimal corrections.

## 1. What is actually recovered

The current evidence supports a small reference-binding contract, not a complete spoken reference grammar.

| Formal token | Recovered scope description | Persistence |
|---|---|---|
| `MI` | `DEFAULT-VOLUME` | `UNTIL-REPLACED` |
| `NI` | `DEFAULT-VOLUME` | `UNTIL-REPLACED` |
| `RI` | `DEFAULT-VOLUME` | `UNTIL-REPLACED` |
| `me` | `SELF-SURFACE` | `UNTIL-REPLACED` |

Evidence basis: Phase 5.16 C-04/C-05, citing Phase 4 §3.3. The scope labels are preserved as recorded; this consolidation does not invent a hierarchy among MI/NI/RI or infer the geometry or extent of a surface or volume.

## 2. Binding-state rules

The existing formal binder implements only these recovered behaviours:

1. A recognised formal token may be associated with a non-empty reference identifier.
2. The token determines the documented scope label; a conflicting caller-supplied scope is rejected.
3. A binding persists until a replacement is supplied.
4. A valid replacement replaces the previous binding as a whole.
5. No replacement preserves a valid current binding.
6. An unknown token, empty identifier, malformed replacement or corrupted persisted binding yields an unresolved state rather than guessed scope.

The identifier is an implementation-side opaque reference handle. Its syntax, referent identity rules and relationship to an actual sensed or physically reachable object are not recovered. The binder's validation is a conservative workbench contract, not proof that the language itself contains this exact runtime data structure.

## 3. Formal and Performed inventories remain separate

The Performed fused-reference inventory includes `mi`, `ni`, `ri`, `ne`, `rə`, `ro`, and `ru`; their individual readings and binding behaviour are not recovered in the current source trail.

Two Performed readings are partially recovered:
- `re`: TARGET-surface, with a competing Shared Arcana numeral reading (digit 4, v3.0-L).
- `ra`: TARGET-path, with a competing Shared Arcana unit reading (radian, v3.0-L).

These are slot-sensitive, partially recovered records. They do not justify converting lowercase forms into formal `RI`, `me`, or another binder token. Nor does a register label alone provide a whole-clause unique parse.

The hand-flame fixture's `mel` is recorded as `me + anchor coda l`, associated with the hand and MI surface-scope in that example. It is one worked example, not a productive anchor-coda paradigm. It is not accepted by the formal binder.

## 4. Boundary and spatial interfaces

The recovered `UNTIL-REPLACED` persistence rule is not the same as a claim that every written phrase or clause boundary resets or preserves scope. The hand-flame middle dot separates phrase groups in that fixture; its effect on reference scope is unresolved. A clause boundary likewise has no recovered reset rule here.

The next spatial stage is ordered after reference in the recovered seven-stage Construction sequence, but its interface to the reference stage remains unrecovered. In particular, this consolidation does not establish how a reference is consumed by a spatial role, how an origin or coordinate frame is selected, or whether reference identity entails existence, reachability or feasibility.

## 5. Explicit non-rules

This phase does not define:
- a spoken tokeniser, reference phrase syntax or slot grammar;
- a productive paradigm for performed fused references or anchor codas;
- anatomical landmarks, surface boundaries, volume geometry or coordinate frames;
- scope inheritance across arbitrary clause boundaries;
- reference transformation, aliasing, identity equality or object existence;
- mandatory stage presence, stage cardinality, physical feasibility or execution.

## 6. Implementation and verification

The existing reference inspector and binder remain separate: the inventory lookup is evidence-only and never creates a binding; the formal binder validates only `MI`, `NI`, `RI`, and `me`. Existing tests cover binding, replacement, persistence, malformed input, performed-reference boundaries and phrase/clause-boundary non-inference.

Two TypeScript build defects discovered in the Phase 8BN Vercel deployment are corrected without changing semantics:
- empty Construction composition initialisation now uses a typed reduction, preserving all seven stage keys;
- the six unresolved interface dimensions retain their literal tuple length so the review's `unresolvedCount: 6` type is sound.

**Verification boundary:** these are source edits. No local test runner was available, no tests were executed, and a successful Vercel build must still be observed before the preview can be called healthy.
