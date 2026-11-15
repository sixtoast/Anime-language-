# Phase 8AC — Construction Foot inventory recovery and language boundary

**Date:** 2026-11-13  
**Branch:** feat/v1-9-fixture-coverage-audit-2026-11-11  
**Canon effect:** none. **New vocabulary:** none.  
**Tests authored:** CON-FOOT-EVID-001–006 (authored-unverified). **Tests executed:** none.

## Purpose
Advance Construction Feet from a shape recogniser into an evidence-indexed language inventory, without fabricating missing semantic contrasts. This phase consolidates the supplied Phase 4/5 recovery records and exposes their status in the Construction Studio.

## Source-backed structure
The Phase 5.15 Construction Contract Matrix identifies the Foot pattern as CVC: frame consonant + parameter vowel + relation coda (Phase 4 §§3.1, 10; P4-T05/P4-T10). It separately records six canonical CV frame forms: pa, ba, ta, da, ka, ga (Phase 4 L-03). Those CV forms identify the frame inventory; they are not complete CVC Feet.

| Frame | Canonical CV | Status | Semantic contrast |
|---|---|---|---|
| p | pa | SOURCE-BACKED | unresolved |
| b | ba | SOURCE-BACKED | unresolved |
| t | ta | SOURCE-BACKED | unresolved |
| d | da | SOURCE-BACKED | unresolved |
| k | ka | SOURCE-BACKED | unresolved |
| g | ga | SOURCE-BACKED | unresolved |

The matrix explicitly says frame semantic contrasts require the original v2.0 definitions. It does not authorise assigning meanings to individual consonants or deriving paired contrasts from phonetic properties.

## Parameter-vowel families
Phase 4 §3.2 and Phase 5.15 list this mapping; Phase 5.16 C-06 marks it PROVISIONAL:

| Vowel | Property family | Status | Executable semantics |
|---|---|---|---|
| a | Energy | PROVISIONAL | not defined |
| u | Motion | PROVISIONAL | not defined |
| o | Extent | PROVISIONAL | not defined |
| e | Structure/form | PROVISIONAL | not defined |
| i | Information | PROVISIONAL | not defined |
| ə | Baseline | PROVISIONAL | not defined |

These labels describe recovered parameter families only. They do not authorise calculating, constructing, scaling, controlling or predicting a physical property. The worked hand-flame example leaves energy magnitude, extent and matter-coupling parameters unspecified.

## Relation coda — decisive missing layer
The CVC structural contract assigns the relation to the final consonant position. The complete coda inventory and exact coda-to-relation mapping are not recoverable from supplied Phase 2/4 records. Phase 5.16 C-09 lists exact Foot rules among unresolved v2.0 morphology.

Consequently:
- CV forms can be recognised as documented frame forms.
- A CVC-shaped input can be decomposed into frame, parameter-vowel and coda positions.
- Coda membership and meaning remain unresolved until the inventory is recovered.
- An arbitrary consonant in coda position must not be treated as a valid relation.
- No productive frame × vowel × coda paradigm can yet be generated.
- No complete Foot meaning, coupling, feasibility or execution follows from shape alone.

The existing shape recogniser intentionally returns UNRESOLVED for a CVC input when coda membership cannot be established.

## Implementation
Added src/engine/constructionFootEvidence.ts with the six frame forms, six provisional vowel families, unresolved semantic/coda gaps, and explicit CV/CVC distinction. Construction Studio now displays this evidence alongside the single-form recogniser. This is an evidence display, not a grammar parser or semantic validator.

## Tests
Six tests are authored:
- CON-FOOT-EVID-001: frame consonant inventory.
- CON-FOOT-EVID-002: frame meanings remain unresolved.
- CON-FOOT-EVID-003: provisional vowel-family mapping.
- CON-FOOT-EVID-004: no executable vowel semantics.
- CON-FOOT-EVID-005: CV frame forms versus CVC Feet.
- CON-FOOT-EVID-006: unresolved coda/productive composition.
All remain authored-unverified. No local unit or browser run is claimed.

## Next milestone
Recover original v2.0 Foot/frame/coda definitions rather than speculatively expanding the paradigm. If unavailable, a replacement semantic system requires explicit owner approval and a versioned, non-canon proposal. Website evidence status is now visible in the meantime.

## Safety
Work is confined to the feature branch. Main and production are untouched. No GitHub Actions workflow is invoked; Vercel preview is the deployment verification path.
