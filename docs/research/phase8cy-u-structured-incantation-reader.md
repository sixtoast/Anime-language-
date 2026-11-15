# Phase 8CY-U — Structured Incantation reader

**Purpose:** make an existing structured Incantation contract understandable to a human reviewer without pretending to parse spoken Arcane.

The project already has argument, relationship, condition, evidence, temporal, lifecycle and integrated contract reviewers. This phase adds a declaration-only readout layer.

## Behaviour

The `readStructuredIncantation` report presents:
1. operations and declared arguments;
2. references, resolution and binding state;
3. desired/current/release typed values;
4. spatial-role and coupling declarations;
5. semantic graph nodes and typed edges;
6. conditions, predicate identifiers, required results and failure policies;
7. evidence records, provenance and validity windows;
8. temporal contracts, postconditions, lifecycle events and recovery branches.

Values are reported as declared. The reader does not infer omitted facts or decide that a structurally present field is semantically correct.

## Operation gloss boundary

- TRAK: alter / discrete change (group-level source description).
- KREN: establish / reinforced counterpart (proposed; owner confirmation remains required).
- FREM: maintain.
- SHREN: release.
- BRAN: couple.

These are bounded role glosses, not complete operation signatures or physical mechanism definitions.

## What it cannot yet do

This reads structured contract JSON, not spoken Arcane. It is not a pronunciation guide, translator, spell generator, safety evaluator or executor. It cannot yet read arbitrary Arcane text. The Phase 5.22 hand-flame sequence remains a bounded historical fixture, not a general grammar.

Eleven tests are authored, not claimed as executed. Canon effect NONE.
