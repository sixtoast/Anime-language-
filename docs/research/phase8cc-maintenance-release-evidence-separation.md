# Phase 8CC — Maintenance and release evidence separation

**Date:** 2026-11-14  
**Canon effect:** NONE · **Grammar changes:** none · **Tests authored:** CTRLREL-001–008  
**Tests executed:** not executed locally. The first Vercel type-check found an unsafe union-property access in two tests; Phase 8CC follow-up commit narrows each result by its discriminant before reading the branch-specific evidence.

## 1. Research question

Does the Phase 5.22 hand-flame fixture establish a general lifecycle in which maintenance leads to coupling, duration, then release?

It establishes a surface sequence in one bounded example, not a general causal or temporal contract.

## 2. Source-bounded observations

The exact surface is:

`mel · po da za shi to za ma · kan ken · he ha · sa shi za se · kas`

The archived parser and Phase 5.15 evidence matrix preserve:
- `ken` in the `kan ken` segment as a held-state / held-energy association, with partial FREM association;
- `kas` in the final segment as a release association, with partial SHREN association;
- a separate duration phrase `sa shi za se` between the coupling and release segments.

These observations do not establish that KEN is a universal control operator, that KAS is a complete release instruction, or that the duration phrase specifies how long KEN must hold. They do not establish a causal state machine.

## 3. Engine change

Added `src/engine/constructionMaintenanceReleaseEvidence.ts` with:
- separate KEN/FREM and KAS/SHREN fixture records;
- the observed surface segment order;
- explicit unresolved duration, maintenance, target, release-mode and safety fields;
- exact-fixture lookup and fail-closed token lookup;
- execution permanently disabled.

This is a bounded evidence model, not a parser, lifecycle engine or spell simulator.

## 4. Tests

Eight tests are authored and registered as CTRLREL-001–008. They cover the two separate associations, unresolved semantics, fixture ordering, duration separation, safety boundaries and unknown inputs. They have not been executed locally.

## 5. What remains necessary for a real contract

1. Recover the full Phase 4 control/release definitions and cited examples.
2. Determine whether KEN/KAS are lexical tokens, Foot forms, macro expansions or fixture aliases in each version.
3. Recover control-state identity, persistence, replacement and termination.
4. Recover duration binding and unit semantics.
5. Recover release target, mode, preconditions, authority and failure handling.
6. Establish any causal relationship to coupling only from explicit source rules.

**Decision ID:** P8CC-MAINTENANCE-RELEASE-EVIDENCE-01 · **Canon effect:** NONE
