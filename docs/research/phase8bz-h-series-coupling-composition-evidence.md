# Phase 8BZ — H-series coupling composition evidence

**Date:** 2026-11-14  
**Status:** Evidence concordance added; composition grammar remains unrecovered  
**Canon effect:** NONE · **Grammar changes:** none · **Tests authored:** HCOUP-001–008  
**Tests executed:** not executed locally

## 1. Purpose

The six H-series forms are recorded with domain glosses. A domain gloss is not a complete coupling instruction. This phase makes that distinction explicit in the engine and research interface.

## 2. H-series inventory

| Form | Recorded gloss | Version | Argument signature | Physical mapping |
|---|---|---|---|---|
| hə | mana | v2.0 | Unresolved | Provisional |
| he | matter | v2.0 | Unresolved | Provisional |
| ha | energy | v2.0 | Unresolved | Provisional |
| hu | living | v2.0 | Unresolved | Provisional |
| hi | information | v2.0 | Unresolved | Provisional |
| ho | field | v2.0 | Unresolved | Provisional |

The source records the gloss family. It does not yet provide a complete mapping from these labels to physical quantities, states or transformation laws.

## 3. The bounded he ha observation

The Phase 5.22 hand-flame example contains the exact phrase `he ha`. The implementation records:
- the exact two forms;
- their observed surface order;
- their co-occurrence in that one fixture.

It does **not** infer:
- that `he` is necessarily the first participant;
- that `ha` is necessarily the second participant;
- a source/target or matter/energy transfer direction;
- a general two-argument coupling signature;
- a physical law, energy magnitude or matter transformation;
- that other H-series pairs are licensed.

The observation is fixture-local, not a productive composition rule.

## 4. BRAN relationship

The macro inventory describes BRAN as associated with the H-domain coupling family. This is retained as a family-level association only. Its expansion, participant order, direction, resource semantics and constraints remain unrecovered.

## 5. Engine changes

Added `src/engine/constructionHSeriesComposition.ts`:
- typed H-series domain records;
- exact hand-flame `he ha` co-occurrence record;
- BRAN family association record;
- fail-closed lookup helpers;
- explicit non-executable and unresolved fields.

Added eight tests, registered as HCOUP-001–008. They are authored but not executed locally. No parser, compiler, physical simulator or spell execution behaviour is introduced.

## 6. Research boundary and next recovery targets

To advance from evidence concordance to grammar, recover the original Phase 4 §§3.2–3.3 coupling descriptions and any referenced tables/examples, then compare them with Phase 5.15, Phase 5.16 C-07 and Phase 5.22. Specifically required:
1. exact definition of a coupling participant;
2. whether H-series forms name domains, operands, relation types or another category;
3. argument count and participant order;
4. directionality and reference binding;
5. composition/stacking rules and constraints;
6. interaction with quantities, Construction Feet, control and release;
7. BRAN's actual macro expansion and any preconditions.

Until those are source-backed, the subsystem remains descriptive and non-executable.

**Decision ID:** P8BZ-HSERIES-COMPOSITION-01 · **Canon effect:** NONE
