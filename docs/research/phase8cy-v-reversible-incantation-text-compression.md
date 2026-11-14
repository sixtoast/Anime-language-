# Phase 8CY-V — Reversible Incantation text compression

**Status:** implemented as a transport/display utility; no Arcane grammar change.  
**Canon effect:** NONE · **Execution:** disabled · **Tests:** 13 authored, not executed locally.

## Decision

Incantations should support shortening, but shortening must not silently delete semantic content or invent productive grammar. This phase introduces an explicitly external, reversible token-alias layer. It is not a new Arcane register or a claim that the language already permits contractions.

## Operation

A caller supplies a versioned/shared alias dictionary, for example `kan → ~K`. The compressor replaces exact whitespace-delimited tokens and preserves all original whitespace and punctuation. The expander reverses those substitutions exactly. Alias short forms may not already occur in the source, aliases must be unique, and alias chains/cycles are rejected.

The compressed surface is a transport representation, not valid spoken Arcane. The mandatory pipeline is:

`canonical Arcane text → compress for storage/display → expand → canonical Arcane parser`

The dictionary is shared separately; its one-time storage cost is reported separately from per-incantation character savings. If the alias is not used or the result is not shorter, the report says NO-SAVING.

## What this does not do

- It does not delete repeated operations, arguments, references, conditions, resource declarations or spatial roles.
- It does not claim that a token can be shortened in speech.
- It does not define abbreviations as Arcane vocabulary.
- It does not alter meaning by approximation.
- It does not parse or execute the compressed surface.

## Future grammar-level compression

A later language-design phase may investigate approved clitics, scope binding, shared reference declarations, parameter inheritance, conventional ellipsis or dedicated abbreviations. Each requires source evidence or an explicit versioned language decision, plus expansion/round-trip and semantic-equivalence tests. None is authorised by this phase.

## Tests

Fifteen cases cover round-trip identity, whitespace/punctuation preservation, collisions, duplicate aliases, alias chains, no-saving cases, unknown reserved tokens and non-execution boundaries.
