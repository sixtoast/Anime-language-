# Phase 8AE — Hand-flame Construction example evidence ledger

**Date:** 2026-11-13  
**Branch:** feat/v1-9-fixture-coverage-audit-2026-11-11  
**Canon effect:** none. **New vocabulary:** none.  
**Tests authored:** CON-WORKED-001–007 (authored-unverified). **Tests executed:** none.

## Source

The Phase 5.15 Construction Contract Matrix preserves the Phase 4 §8 hand-flame sequence:

`mel · po da za shi to za ma · kan ken · he ha · sa shi za se · kas`

The source status is TOKENISED-EXAMPLE / SEMANTICALLY-INCOMPLETE. Phase 5.16 C-08 reiterates that tokenisation was checked but full parsing and feasibility were not.

## Evidence ledger

| Source chunk | Evidence status | Recovered statement | Open boundary |
|---|---|---|---|
| `mel` | EXAMPLE-BACKED | `mel = me + anchor coda l`; used for an MI surface-scope reference anchored to the hand | Anatomical landmarks and general fused-reference morphology missing |
| `po da za shi to za ma` | UNRESOLVED | Preserved exactly as the second dot-delimited chunk | No reliable token-by-token gloss or complete parse in the recovery matrix |
| `kan ken` | PARTIAL-EXAMPLE | `ken` is associated with a held energy state | KAN rule, pair rule, argument structure and general FREM expansion not recovered |
| `he ha` | PROVISIONAL | H-series glosses: `he` = matter; `ha` = energy | Physical mapping provisional; order, direction, vector, validity and effect unresolved |
| `sa shi za se` | UNRESOLVED | Preserved exactly as the fifth dot-delimited chunk | No reliable token-by-token gloss or complete parse in the recovery matrix |
| `kas` | PARTIAL-EXAMPLE | Associated with release in this example | General release construction, target, mode and safety conditions missing |

## Critical interpretation boundaries

- Dot-delimited grouping is preserved; no chunk-to-Construction-stage mapping is asserted.
- `mel` is a performed fused form in the example. It is not equated with formal `me` or a complete anatomical landmark system.
- The partial KEN and KAS associations do not prove one-to-one FREM/SHREN expansions.
- The H-series glosses do not establish a valid BRAN operation or executable coupling.
- Phase 4 states that energy magnitude, extent and matter-coupling parameters are unspecified.
- No complete spoken grammar parse, physical feasibility, resource sufficiency, safety or physical execution is demonstrated.

## Implementation

Added `src/engine/constructionWorkedExampleEvidence.ts` as a typed evidence ledger, integrated a chunk-by-chunk view into the Construction Studio, and registered seven tests. The UI labels each chunk's evidence status and displays unresolved conditions instead of presenting a speculative translation.

## Validation

CON-WORKED-001–007 are authored-unverified. No local unit/browser execution is claimed. This increment does not change grammar, parser acceptance or runtime behaviour.

## Next

Recover original Phase 4 §8–9 and the missing v2.0 morphology artefacts. Where the archive only provides summaries, request the original source bundle or obtain explicit approval for a new versioned reconstruction. Continue by resolving reference landmark morphology and coupling participant/direction rules before attempting a complete Construction example.
