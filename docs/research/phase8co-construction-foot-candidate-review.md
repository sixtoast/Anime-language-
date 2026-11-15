# Phase 8CO — Unified Construction Foot candidate review

**Date:** 2026-11-14  
**Canon effect:** NONE · **Grammar changes:** none · **Execution:** none  
**Tests authored:** FOOT-8CO-001–014 · **Tests executed:** not executed locally

## 1. Purpose

Phase 8CO adds one consolidated, conservative reviewer over the existing Construction Foot evidence. It does not add new morphemes or a productive grammar. Its job is to explain the evidence status of a supplied candidate and to preserve distinctions previously spread across the Foot shape recogniser, morphology reviewer, source recovery and source-conflict audit.

## 2. Classification rules

The reviewer returns one of five statuses:

| Status | Meaning |
|---|---|
| CANONICAL-CV-FRAME | Exact one of `pa ba ta da ka ga`; a frame form, not a complete Foot |
| WHOLE-EXAMPLE-TOKEN | Exact `kan ken kas`; retain as indivisible example-level evidence |
| UNRESOLVED-CV-COMBINATION | Uses a recovered frame consonant and provisional parameter vowel, but is not one of the six recorded forms |
| STRUCTURAL-CVC-CANDIDATE | Fits the provisional three-position outline; coda membership and mandatory/optional status remain unresolved |
| UNSUPPORTED-OR-UNRESOLVED | No exact bounded evidence category matches; not proof of impossibility |

## 3. Evidence boundaries

### Frame and parameter

The six frame consonants p, b, t, k, d and g and their canonical CV forms are recorded. The six parameter vowels a, u, o, e, i and ə have provisional family associations. The reviewer exposes those associations but does not convert them into executable parameter values.

The TRAK p/t/k and proposed KREN b/d/g groupings remain macro-level associations. No individual consonant semantics are inferred.

### Whole-token preservation

The Phase 5.22 hand-flame source records `kan`, `ken` and `kas` as whole example tokens. This reviewer checks those exact strings before attempting any shape classification. It deliberately returns no frame, vowel or coda segmentation for them.

The final letters n and s remain observed occurrences, not a recovered coda inventory.

### CVC conflict

For a structural CVC candidate such as `pan`, the reviewer presents both extant readings:
- Phase 5.15: coda required;
- Phase 5.16 C-02: coda optional.

Both outcomes remain unresolved. No precedence is assigned and no candidate is declared a valid complete Foot.

## 4. Normalisation policy

No automatic trimming, case folding or spelling repair occurs. This is deliberate: the existing tools had different normalisation behaviour. The consolidated reviewer makes the supplied orthographic form explicit so that an uppercase or whitespace-modified string cannot silently be treated as an exact source form.

## 5. Website and API integration

Added `src/engine/constructionFootCandidateReview.ts`. It returns evidence category, frame and provisional vowel information where supported, macro-level frame association, coda membership state, both source readings for CVC candidates, evidence references and a permanent non-executable/canon-neutral boundary.

This is an engine/API increment. It is registered in Research & Review as item 41; no interactive spell editor or compiler is enabled.

## 6. Tests

Fourteen Vitest cases are authored for the six canonical forms, provisional parameter exposure, macro-level group associations, unresolved frame-vowel pairs, indivisible hand-flame tokens, parallel CVC readings, strict input preservation and fail-closed handling.

Tests have not been executed locally. The deployment build will verify TypeScript compilation and Vite bundling only.

## 7. Remaining primary-source work

The reviewer does not resolve the underlying CVC dispute. The next source task remains inspection of the complete Phase 4 DOCX §§3.1 and 10 and recovery of P4-T05/P4-T10. Until that happens, relation-coda inventory, phonological constraints, relation meanings, Foot composition, and productive licensing remain unrecovered.

**Decision ID:** P8CO-CONSTRUCTION-FOOT-CANDIDATE-REVIEW-01 · **Canon effect:** NONE
