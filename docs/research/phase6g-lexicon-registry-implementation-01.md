# Phase 6G Lexicon Registry — Implementation Note 01

**Status:** registry and unit tests authored; current CI execution unverified.  
**Canon effect:** none.  
**Scope:** `src/engine/lexiconRegistry.ts` and `src/engine/lexiconRegistry.test.ts`.

## Why this exists

The archived Phase 6G Python parser loads the v5 lexicon, groups duplicate forms, retains lexical classes and notes, and derives documented historical aliases. The initial TypeScript port instead accepted a bare `knownAtoms` list and had a hard-coded alias map. That loses provenance and cannot explain lexical collisions.

This registry establishes a small, explicit data boundary for the next parser integration step.

## Current behaviour

- Groups rows by normalized form without discarding multiple source records.
- Preserves glosses, lexical classes, registers, status labels, source labels, notes, and row count.
- Extracts only the narrow documented note pattern `was <form>`.
- Accepts explicit alias records, so a separately curated alias registry can be merged.
- Refuses to register an alias if the same legacy form points to conflicting preferred forms.
- Retains collisions where a form has multiple classes or glosses; it does not choose a meaning.
- Requires explicit opt-in to resolve a legacy spelling to a preferred spelling.
- Carries a source label and version with the registry to prevent provenance from being silently lost.

## Important limitations

1. This is a typed row adapter, not a CSV parser and not yet connected to `surfaceParser.ts`.
2. Alias extraction is deliberately conservative and may not recover every historical rename format.
3. Collision detection is a review signal, not a complete linguistic homophony algorithm.
4. The current test fixtures are synthetic examples modeled on source records. They do not replace loading and checking every row of the real lexicon.
5. The parser still has its own provisional token tables and does not yet use this registry to determine operator class, alias resolution, or lexical slot policy.

## Next integration gate

Before the parser consumes this registry, add a loader for a pinned lexicon snapshot and verify its row counts, headers, source hash, alias coverage, duplicate-form groups, and known `RE/RA` collision records. Then integrate registry lookup behind an explicit parser option and test the same fixture cases both with and without legacy aliases. Do not add a global default alias rewrite.

## Verification status

Tests were authored for source metadata, grouping, aliases, conflicting alias targets, and homophone collisions. They have not yet been confirmed by a current completed CI run. No claim of passing tests or full source parity is made.
