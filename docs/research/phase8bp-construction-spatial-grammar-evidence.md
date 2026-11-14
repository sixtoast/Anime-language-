# Phase 8BP — Spatial grammar evidence catalogue

**Date:** 2026-11-14  
**Canon effect:** none. **Grammar changes:** none.  
**Tests authored:** eight Vitest cases. **Tests executed:** not executed locally.

## Purpose

This phase turns the Arcane v3.0-L spatial inventory into a structured lexical evidence catalogue. It is a first step towards a spatial grammar, but it deliberately does not pretend that a category list is a compositional grammar.

## Recovered v3.0-L categories

| Category | Recorded forms | What the inventory establishes |
|---|---|---|
| Frame | `FE` | The recorded label is “Frame” |
| Signed-axis | `PA BA TA DA KA GA` | These six forms are listed as signed-axis forms |
| Relation | `JO JUR JA JE JI` | These five forms are listed as relation forms |
| Geometry | `PI LEN PLA SUR VOM PAR` | These six forms are listed as geometry forms |

All 18 entries retain version `V3.0-L`. The inventory labels do not recover individual axis directions, relation meanings, geometry meanings, operand order, arity, argument types or valid combinations. Every entry therefore has `signatureStatus: NOT-RECOVERED`.

## Historical fixture is separate

The Phase 5.22 hand-flame phrase `po da za shi to za ma` has a fixture-local reading of position, +Y and 0.2 metre. It remains attached to that exact historical profile. The catalogue does not equate lowercase fixture `da` with uppercase v3.0-L `DA`, and does not use `po` to create a general position operator.

## Spatial grammar questions now tracked explicitly

Eight interfaces remain unresolved:

1. Frame selection or introduction.
2. Origin and reference binding.
3. Composition of signed-axis forms into directions or vectors.
4. Relation-form argument signatures and ordering.
5. Geometry-form operands, dimensions and constraints.
6. Quantity attachment and unit compatibility.
7. Frame transforms and coordinate conversion.
8. Bounds, validity and failure conditions.

These are research questions, not implied grammatical slots. Their order in this list does not establish an execution order or dependency.

## Consequences for language development

The present evidence supports a **typed vocabulary inventory** (frame / signed-axis / relation / geometry) but not yet a spatial phrase template. We should not publish forms such as `FE + PA + JO + PI` as a valid expression until source evidence recovers the signatures and combination rules.

The historical `0.2 metre` reading is useful as a fixture anchor for future quantity research, but cannot define the v3.0-L quantity grammar or a general spatial unit system.

## Implementation

Added `src/engine/constructionSpatialGrammarEvidence.ts`, an evidence-only catalogue with exact version tags, category queries, per-form lookup and eight unresolved interface records. The Construction Studio now exposes those categories and their unresolved interfaces. Eight tests are authored to protect the inventory and its boundaries.

**Verification:** no local Vitest run was performed. The preview build is the available TypeScript/Vite check; its outcome is reported separately. No grammar parser, execution path or canon record is changed.
