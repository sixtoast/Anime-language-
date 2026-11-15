# Phase 8BN — Construction fixture phrase traceability

**Status:** implementation authored; tests not executed locally  
**Canon effect:** NONE · **Execution:** disabled

## Purpose

Phase 8BN connects phrase-level evidence to the exact historical Phase 5.22 hand-flame fixture. It does not create a general Construction parser, delimiter grammar, stage mapper or token identity resolver.

## Fixture segmentation

The exact fixture surface is retained as six phrase groups separated by five middle dots. This segmentation is valid only for this fixture record. It does not establish universal punctuation behaviour.

Each phrase record stores:
- exact phrase index and surface;
- interpretation evidence status;
- source references;
- recorded claims;
- unresolved questions.

## Phrase evidence summary

1. `mel`: partial anchor-token evidence; general reference morphology and binding remain unresolved.
2. `po da za shi to za ma`: fixture-local position, +Y and 0.2 metre readings are recorded; frame, origin and general syntax remain unresolved.
3. `kan ken`: KAN and KEN remain whole example tokens; KEN's held-energy association is example-level; KAN's rule and segmentation remain unresolved.
4. `he ha`: H-series heavy coupling forms are recorded; matter/energy readings remain provisional and coupling contracts remain unresolved.
5. `sa shi za se`: interpretation remains unresolved. It is not assigned to Control.
6. `kas`: release association is example-level; general release grammar and token segmentation remain unresolved.

The six phrase groups are not assigned one-to-one to the seven Construction stages. The absence of an explicit Control interpretation is retained rather than repaired by conjecture.

## Cross-version surface comparison

A comparison helper reports whether two supplied surface strings are literally identical. Even an exact match leaves token identity and semantic equivalence as NOT-ESTABLISHED. The helper does not normalise case, merge lexical entries, or infer historical descent.

## Website

The Construction Studio gains a phrase-level traceability panel. It displays source references, recorded claims and unresolved questions for each exact phrase.

## Verification

Six tests are authored: CON-FIXTURE-001 through CON-FIXTURE-006. They cover exact phrase reconstruction, source attachment, unresolved phrase retention, the six-to-seven mismatch, cross-version identity boundaries and non-execution.

The Phase 8BM test registry comma defect is corrected in this increment. The Phase 8BM Vercel failure identified `src/engine/testRegistry.ts(474,3): TS1005 ',' expected`. A new preview build is required to confirm the correction. Tests have not been executed locally.

## Explicit non-goals

This phase does not define Construction syntax, phrase-to-stage mappings, Control semantics for the fifth phrase, cross-version token identity, semantic equivalence, parser acceptance, spell validity, physical feasibility or execution.
