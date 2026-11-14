# Phase 8BR — Canonical signed-axis semantics

**Date:** 2026-11-14  
**Source:** docs/canon/arcane-language-v3.0-L.md, §4  
**Canon effect:** NONE — source meanings are represented in the workbench; no canon text is changed.  
**Tests authored:** nine Vitest cases. **Tests executed locally:** not executed.

## 1. Source-grounded assignments

The canonical v3.0-L specification explicitly assigns the six forms:

| Form | Coordinate | Sign | Direction |
|---|---|---:|---|
| PA | X | − | left |
| BA | X | + | right |
| TA | Y | − | below |
| DA | Y | + | above |
| KA | Z | − | behind |
| GA | Z | + | forward |

It fixes the positive coordinate convention as +X = right, +Y = above and +Z = forward. These assignments are canonical lexical meanings, not unresolved hypotheses.

## 2. Phonological symmetry

The source notes that the voiced/voiceless distinction gives a subtle internal symmetry. The six forms pair as P/B, T/D and K/G; in each pair, the forms occupy opposite signs on one coordinate dimension. The registry records the consonant voicing contrast as a source observation. It does not infer a general phonological semantic rule, nor does it infer that voicing alone predicts meaning outside these six lexical entries.

## 3. What this does not establish

The directional meanings do not define:
- a coordinate origin or a particular frame identity;
- a frame-selection or frame-construction expression;
- coordinate magnitudes or a vector value representation;
- a surface constructor or component ordering;
- how multiple axis forms combine;
- local-frame orientation or frame transforms;
- quantity attachment, units or dimensional typing.

FE remains the frame role. The presence of axis labels does not imply that FE alone identifies a concrete coordinate frame.

## 4. Historical fixture separation

The Phase 5.22 lowercase da in po da za shi to za ma remains a fixture-local +Y reading. The canonical uppercase v3.0-L DA is separately source-assigned +Y. This phase does not use shared spelling or matching gloss to prove historical token identity across versions.

## 5. Implementation

Added:
- src/engine/constructionAxisSemantics.ts
- src/engine/constructionAxisSemantics.test.ts

Updated:
- src/App.tsx — Construction Studio now displays all six canonical direction assignments and the source-recorded voicing symmetry.
- src/engine/testRegistry.ts — nine cases registered as CON-AXIS-001–009.

The registry provides exact lookups and opposite-axis lookup. These are lexical evidence functions only; they do not construct vectors, parse expressions or validate a spatial operation.

## 6. Verification

Nine tests are authored. They cover all six assignments, the positive coordinate convention, opposite-axis pairing, voicing evidence, unresolved frame/origin and vector construction, fail-closed lookup and non-executable boundaries.

Tests have not been run locally. Vercel preview build verification will be reported separately. No GitHub Actions workflow is dispatched. Main and production remain untouched.
