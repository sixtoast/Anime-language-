# Phase 8BQ — Construction spatial composition evidence

**Date:** 2026-11-14  
**Canon effect:** NONE. **Grammar changes:** none.  
**Tests authored:** eight Vitest cases. **Tests executed locally:** not executed.

## Purpose

Phase 8BP classified the v3.0-L spatial inventory into four lexical categories. This phase asks whether the recovered material establishes how any two categories combine.

The reviewed inventory establishes category membership only. It does not supply composition signatures, ordering, operand roles, attachment rules or permitted combinations. The six unordered category pairs are therefore recorded as **NOT-ESTABLISHED**. This means evidence is absent; it does not mean a combination is invalid.

## Category-pair ledger

| Pair | Evidence status | Unresolved |
|---|---|---|
| FRAME ↔ SIGNED-AXIS | NOT-ESTABLISHED | Selection, binding, signature and ordering |
| FRAME ↔ RELATION | NOT-ESTABLISHED | Relation operands, reference and scope |
| FRAME ↔ GEOMETRY | NOT-ESTABLISHED | Geometry operands, frame and constraints |
| SIGNED-AXIS ↔ RELATION | NOT-ESTABLISHED | Directional role, argument order and attachment |
| SIGNED-AXIS ↔ GEOMETRY | NOT-ESTABLISHED | Vector/dimension interaction and quantity typing |
| RELATION ↔ GEOMETRY | NOT-ESTABLISHED | Relation arguments, geometry types and ordering |

These are research comparisons, not a proposed grammar template. Symmetric lookup is a property of the documentary pair identifier only; it does not imply symmetric linguistic or mathematical arguments.

## Historical fixture observation

The exact Phase 5.22 phrase **po da za shi to za ma** retains its fixture-local reading: po = position role; da = +Y; za shi to za ma = 0.2 metre.

This is co-occurrence within one worked example. It does not establish a v3.0-L category mapping, general token identity, phrase order, quantity attachment, coordinate frame, origin or productive syntax. In particular, po is not promoted into the v3.0-L inventory, and fixture da is not equated with v3.0-L DA.

## Website

The Construction Studio now presents a six-pair composition evidence matrix. It distinguishes recorded lexical categories, category combinations without recovered signatures, the separate historical fixture observation, and the difference between NOT-ESTABLISHED and INVALID. It is an evidence workbench, not a grammar validator.

## Implementation and verification

Added:
- src/engine/constructionSpatialCompositionEvidence.ts
- src/engine/constructionSpatialCompositionEvidence.test.ts

Updated:
- src/App.tsx
- src/engine/testRegistry.ts

Eight tests are authored as CON-SPATIAL-COMP-001–008. They cover pair enumeration, evidence status, fixture separation, ordering/attachment limits, fail-closed lookups, documentary lookup symmetry and the non-executable boundary.

Tests have not been run locally. The Vercel preview build is the available TypeScript/Vite verification and will be reported separately. No GitHub Actions workflow was dispatched. Main and production remain untouched.
