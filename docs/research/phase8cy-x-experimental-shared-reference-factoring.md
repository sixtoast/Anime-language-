# Phase 8CY-X — Experimental shared-reference factoring package

**Status:** implemented as an experimental structured-IR packaging proposal.  
**Canon effect:** NONE · **Execution:** disabled · **Tests:** 12 authored, not executed locally.

## Purpose

Phase 8CY-W identifies a narrow class of repeated reference records that may merit grammatical factoring. Phase 8CY-X supplies a reversible intermediate representation (IR) package for those records. It is deliberately not a spoken Arcana construction and does not add declaration syntax to the language.

## Package structure

The package contains the source envelope, shared binding records containing the complete original reference, operation records retaining identity and non-reference argument fields, and ordered reference slots. Each slot is either a shared-binding pointer or an inline copy. The sequence preserves reference order. Target labels and BRAN participant fields remain unchanged.

## Eligibility and boundaries

Only records already eligible under Phase 8CY-W are factored: identical label, class, scope, resolution, lifetime, binding state and referent identity; resolved and committed; SPELL lifetime; explicit target consumption or BRAN participant consumption; repeated across distinct operations.

No current-step, ambiguous, proposed, mismatched or unsupported reference is hoisted. No operation, condition, coupling field, spatial role, quantity, release field or arbitrary constraint is deduplicated.

## Expansion and structural checking

The expander resolves each shared slot to its complete stored reference record and reconstructs the original operation argument reference arrays in their original order. The package retains the original top-level envelope and non-reference operation/argument fields. A caller may supply the original record to the expander for an exact structural round-trip comparison. This verifies data reconstruction only, not semantic equivalence.

The expanded record should still be passed through the ordinary Incantation reviewers. This proposal does not replace those validators.

## Explicit non-claims

No spoken declaration token, abbreviation, visibility rule, forward-reference behaviour, shadowing, rebinding or invalidation rule is established. No semantic equivalence or character-saving estimate is claimed. No execution or physical effect is enabled.

## Tests

Twelve tests cover eligible factoring, exact reconstruction, blocked lifetimes and identities, ordered inline/shared slots, invalid binding references, duplicate binding ids, invalid package profiles, non-execution boundaries, source immutability and BRAN field preservation.
