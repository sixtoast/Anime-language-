# Phase 8AG — KAN/KEN/KAS worked-example evidence

**Date:** 2026-11-13  
**Branch:** feat/v1-9-fixture-coverage-audit-2026-11-11  
**Canon effect:** none. **New vocabulary:** none.  
**Tests authored:** CON-KSER-001–008 (authored-unverified). **Tests executed:** none.

## Source reconciliation

The Phase 4 §8 hand-flame sequence contains the dot-delimited chunk `kan ken` and ends with `kas`. Phase 5.15's Construction Contract Matrix distinguishes their evidence:
- KAN is present in the example, but its exact rule is not recovered.
- KEN is associated with a held energy state; its relationship to FREM is partial example evidence only.
- KAS is associated with release; its relationship to SHREN is partial example evidence only.

Phase 5.16 C-08/C-09 explicitly warns that the example is tokenised but semantically incomplete and that exact KAN/KEN/KAS rules are unavailable.

## What this does and does not establish

| Form | Evidence status | Still unresolved |
|---|---|---|
| KAN | Present in example; rule unresolved | Exact gloss, arguments, relation to KEN |
| KEN | Partial held-energy association | Duration, maintenance, limits, termination, general FREM relation |
| KAS | Partial release association | Target, mode, safety, general SHREN relation |

The fact that KAN and KEN occur in the same source chunk does not establish a two-token operator, a sequence rule, a pairwise dependency, or a complete Foot. The macro associations do not prove one-to-one expansions. No new Foot or coda inventory is introduced.

## Implementation

Added `src/engine/constructionKSeriesExampleEvidence.ts` with an exact three-form, read-only evidence registry and lookup. Construction Studio exposes an independent K-series evidence panel. The lookup does not parse or execute a construction.

## Validation

Eight tests CON-KSER-001–008 are authored and registered as authored-unverified. No local unit tests or browser acceptance tests were executed. No GitHub Actions workflow was run. Main and production remain untouched.

## Source limitation and next step

The repository contains Phase 4 binary source artefacts and an Arcana mega-pack archive, but the text-file reader cannot decode these binary formats. The Phase 5.15/5.16 summaries are not sufficient to recover a productive K-series grammar. The next recovery attempt must extract the original DOCX/PDF/archive content using a binary-capable route; absent that, a replacement specification would need explicit owner approval and must not be presented as recovered canon.
