# Phase 8CY-Y — Proposed shared-reference scope rules

**Status:** experimental scope model for design review only.  
**Canon effect:** NONE · **Spoken syntax:** not defined · **Execution:** disabled.  
**Tests:** 12 authored, registered and not executed locally.

## Question

A shared declaration can shorten repeated references only if every use has a predictable visibility boundary. Existing reference records distinguish SPELL and CURRENT-STEP lifetime. This phase turns that distinction into a testable proposal, without asserting that the proposal is already canon.

## Proposed rules

1. A SPELL-lifetime declaration belongs to a spell prelude, before the operation sequence, and is visible to all operations in that same Incantation.
2. A CURRENT-STEP declaration belongs to exactly one operation and is visible only within that operation.
3. A CURRENT-STEP reference cannot be promoted into a SPELL declaration, even if its referent identifier happens to match another record.
4. Binding identifiers are unique within the spell; redeclaration and shadowing are disallowed in this proposal.
5. Because SPELL declarations are in the prelude, their declaration order precedes all operation uses. This avoids a forward-reference question in the proposed model.
6. Every declaration must preserve the original reference's class, semantic scope, resolution, committed state, lifetime and stable referent identity.

The source reference scope markers (pi, len, pla, sur, vom, par, ben, net) are not the same thing as lexical visibility. This proposal does not reinterpret them.

## Alternatives not adopted

A nested/local group scope is not modelled yet because the source material and current contract model do not establish a reliable group boundary or group-lifetime marker. Contextual omission/implicit inheritance is also excluded: it risks selecting a target based on unstated context.

## Engine

The reviewIncantationReferenceScopeProposal engine checks a proposal IR containing explicit declarations, operations and uses. It checks declaration placement, lifetime preservation, unique ids, known uses and operation-local visibility. It does not parse or generate spoken Arcana, transform an integrated contract, infer semantic referents, or prove effect equivalence.

## Decision required before grammar

The spell-prelude and operation-local visibility rules are proposed design decisions, not source-backed canon. A language owner must approve them before any surface token or abbreviation is specified. In particular, the proposal does not yet choose a spoken declaration marker or punctuation.

## Test coverage

Twelve cases cover spell-wide use, local use, cross-operation blocking, declaration placement, missing owners, duplicate ids, unknown uses, lifetime promotion, reference commitment/resolution, operation identity, canon boundaries and malformed input.
