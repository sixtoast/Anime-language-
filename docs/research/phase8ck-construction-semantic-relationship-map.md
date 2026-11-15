# Phase 8CK — Construction semantic relationship map

**Date:** 2026-11-14  
**Canon effect:** NONE · **Grammar changes:** none · **Tests authored:** SEM-CK-001–016  
**Tests executed:** not executed locally

## 1. Purpose

This phase consolidates existing source-backed relationships between the six Construction macros, Foot frame groups, H-series coupling vocabulary, fixture tokens and the worked-example reference form. It adds no lexical meanings or grammar rules.

## 2. Relationship map

| Relationship | Evidence class | What is recorded | Boundary |
|---|---|---|---|
| TRAK → p/t/k | Described pattern | Voiceless-stop frame group associated with discrete change | No individual consonant meanings, Foot count or expansion |
| KREN → b/d/g | Proposed; owner confirmation | Proposed voiced-stop reinforced counterpart | Not confirmed as historical productive morphology |
| FREM → KEN / `ken` | Partial fixture association | Held structure / held energy state in hand-flame example | Whole token; not segmented or a proven FREM expansion |
| SHREN → KAS / `kas` | Partial fixture association | Release in hand-flame example | Whole token; target, mode and safety unknown |
| TRAK → KAN / `kan` | Whole-token alias | Alias recorded as TRAK ENRA | Does not reveal TRAK arity or ENRA syntax |
| BRAN → H-series | Described family association | h-domain syllables are coupling vocabulary | No participant identities, order, direction or complete signature |
| VARE → REQUIRE | Role described | Soft-requirement modifier paired with hard REQUIRE | Attachment, scope and conflict resolution unknown |
| MEL → me + anchor-l | Worked-example only | Single hand-flame reference association | No productive anchor-coda paradigm |

The H-series records six forms and glosses: `hə` mana, `he` matter, `ha` energy, `hu` living, `hi` information and `ho` field. Their physical mapping is provisional and their full argument signatures remain unresolved.

## 3. Distinctions that must remain separate

**Frame groups are not a productive Foot paradigm.** TRAK's p/t/k association is described. KREN's b/d/g counterpart is proposed and requires owner confirmation. Neither source record assigns meanings to each consonant or proves all combinations with parameter vowels and relation codas.

**Fixture aliases are not macro expansions.** The source records whole tokens `kan`, `ken` and `kas` with their aliases. Their internal segmentation is not established. The hand-flame example therefore cannot define FREM or SHREN as a general state-machine grammar.

**Coupling-domain glosses are not participant slots.** BRAN is associated with the H-series. The glosses mana, matter, energy, living, information and field do not specify which participant occupies which argument, or the direction or physical mechanism of coupling.

**VARE is a policy/modifier role, not a complete operator.** The recorded relation to hard REQUIRE is a soft-requirement modifier. The attachment site, preference ordering, conflicts and failure behaviour remain open.

**MEL is not general reference morphology.** The single MEL worked-example record associates `mel` with `me` plus anchor coda `l` and the hand referent. No productive anchor-coda paradigm is recovered.

## 4. Cross-stage and composition findings

The seven-stage order remains reference → spatial role/vector → Construction Feet → couplings → quantity → control → release. The source supports precedence only. It does not assign any macro to a stage, define stage interfaces or prove data dependencies.

For all six macros, signatures, Foot cardinality, sequence scope, preconditions, resource semantics, side effects and termination remain unrecovered. Pairwise macro composition and compatibility remain NOT-ESTABLISHED.

The hand-flame fixture surface order maintenance → coupling → duration → release is an example grouping, not proof of a causal lifecycle or universal sequence.

## 5. Implementation

Added `src/engine/constructionSemanticRelationshipMap.ts`, a read-only evidence map derived from the existing source ledgers. It distinguishes described, proposed, partial-fixture, gloss-only and role-described relationships and exposes a fail-closed lookup. It does not parse or execute Construction.

Sixteen tests are authored and registered as SEM-CK-001–016.

## 6. Conclusions

The map is a semantic crosswalk, not yet a grammar. No new productive morphology, macro signature, coupling operation, reference formation rule or compiler behaviour is authorised by this phase.

**Decision ID:** P8CK-CONSTRUCTION-SEMANTIC-RELATIONSHIP-MAP-01 · **Canon effect:** NONE
