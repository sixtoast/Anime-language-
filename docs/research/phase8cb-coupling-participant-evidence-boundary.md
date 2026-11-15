# Phase 8CB — Coupling participant evidence boundary

**Date:** 2026-11-14  
**Status:** Candidate evidence model added; participant grammar unrecovered  
**Canon effect:** NONE · **Grammar changes:** none · **Tests authored:** COUP-PART-001–008  
**Tests executed:** not executed locally

## 1. Research question

Can the H-series domain labels be associated with the Construction reference context to establish coupling participants?

The recovered evidence supports only two separate facts:
- H-series forms have recorded v2.0 domain glosses (Phase 4 §§3.2–3.3; Phase 5.16 C-07).
- Construction reference binding has recovered token/scope/persistence behaviour (Phase 5.16 C-04/C-05, citing Phase 4 §3.3).

It does not establish a rule connecting these facts into a coupling participant grammar.

## 2. Domain, reference and participant are distinct

| Concept | Evidence available | What remains open |
|---|---|---|
| Domain | Six H-series forms and glosses | Exact physical/semantic interpretation |
| Reference | MI/NI/RI default-volume; me self-surface; until-replaced persistence | Landmark, geometry, identity and transforms |
| Participant | No complete participant contract recovered | Whether a domain form selects, labels or types a referenced entity |
| Coupling relation | BRAN associated with H-series family | Arity, participant order, relation, direction and constraints |

A valid reference binding does not prove that the referenced entity exists, is sensed, reachable, feasible, or selected as a coupling participant.

## 3. Engine change

Added `src/engine/constructionCouplingParticipantEvidence.ts`.

The review helper accepts an H-series form and an untrusted reference binding. It uses the existing Construction reference validator to classify the binding as bound, unbound or invalid. If both domain and reference evidence are present, it returns `DOMAIN-AND-REFERENCE-RECORDED`, explicitly not `PARTICIPANT-ESTABLISHED`.

All outcomes keep participant role, coupling relation and directionality as `NOT-ESTABLISHED`; execution is always false. Unknown domains and malformed reference objects fail closed.

This is an evidence review utility, not a parser, compiler, runtime participant resolver or physical model.

## 4. Tests

Eight tests are authored and registered as COUP-PART-001–008. They cover known/unknown domains, valid/unbound/invalid reference bindings, the semantic boundary, and disabled execution. They have not been executed locally.

## 5. Next source recovery targets

The original Phase 4 §§3.2–3.3 and all cited diagrams/tables are still required to establish:
1. whether H-series forms label domains, operands, relation types or something else;
2. participant cardinality and whether participants are references;
3. how BRAN composes participants;
4. participant order and directionality;
5. whether reference scopes constrain coupling;
6. relation to quantities, Construction Feet, control and release.

No such rules are promoted by this phase.

**Decision ID:** P8CB-COUPLING-PARTICIPANT-BOUNDARY-01 · **Canon effect:** NONE
