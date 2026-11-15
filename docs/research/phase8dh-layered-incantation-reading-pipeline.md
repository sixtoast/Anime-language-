# Phase 8DH — Layered incantation-reading pipeline

**Status:** Architecture/evidence contract. **Canon effect:** NONE. **Execution:** disabled. **Tests:** 18 authored and registered; not executed locally.

## 1. Purpose

The project needs a reader that can eventually turn a spoken or written incantation into a reliable interpretation. A single boolean called `valid` would be dangerously imprecise: recognised words do not prove a valid syntax tree; a syntax tree does not prove semantic types; typed expressions do not prove a physically feasible construction; and a feasible construction would not, by itself, establish authority or permission to execute it.

Phase 8DH defines three independent review layers and a strict language-reading sequence.

## 2. Layer A — Formal Arcane language reading

| Stage | What it establishes | What it does not establish |
|---|---|---|
| Lexical recognition | Forms are recognised under a named lexicon/profile | Correct grouping or meaning |
| Structural parsing | A tree is recoverable under a named grammar profile | Correct modifier scope or semantic types |
| Scope resolution | Modifiers, blocks and references have a determinate attachment/scope | Physical validity |
| Semantic typing | Expressions have supported type annotations | Evaluation, feasibility or execution |

The ordering matters. Phase 8DF records fixed-arity principles and unresolved spoken nesting syntax. Phase 8DG records the historical nearest-same-level modifier rule while showing that current modifier attachment is not yet implemented or confirmed. The reader must not invent a scope to make a parse succeed.

The current Phase 6G parser and Phase 6H semantic analyser are provisional components. The semantic analyser explicitly preserves unknown atom types, unresolved signatures and binding identifiers; Phase 8DH does not replace or overstate them.

## 3. Layer B — Incantation contract review

The incantation contract layer is not a second syntax parser. The v1.0–v2.1 specifications describe separate concerns including:
- intent and target resolution;
- preconditions and constraints;
- resource accounting and conservation;
- authority and authorisation;
- policy-profile composition and conflict resolution;
- invocation lifecycle and outcome reporting.

A language expression may be readable while one or more of these contract domains remain unknown, fail review or have not been checked. In particular, policy and authority must not be inferred from a grammatical imperative or from the identity of the speaker.

## 4. Layer C — Mana Construction review

Construction is tracked separately through seven evidence stages:
1. reference;
2. spatial role;
3. Construction Feet;
4. couplings;
5. quantity;
6. control;
7. release.

The existing Construction research establishes only a limited stage order and a number of source-bounded examples. The six adjacent PRECEDES edges do not establish data dependencies, mandatory presence, cardinality, omission rules, feasibility or executable inputs/outputs. Each stage therefore has its own evidence state.

## 5. Conservative state model

Each stage accepts one of four evidence states:
- `PASS`: the specific stage has been checked and supported;
- `FAIL`: the specific stage has a supported failure;
- `UNRESOLVED`: evidence exists but does not settle the question;
- `NOT-RUN`: the stage has not been assessed.

The language layer becomes READABLE only when lexical recognition, structural parsing, scope resolution and semantic typing all pass. A failed language stage rejects the reading; an unresolved or unrun prerequisite leaves it incomplete.

Incantation-contract and Construction states are computed independently. They do not silently change a successful language read into a failed parse. Nor does a successful language read claim that those downstream layers are complete.

## 6. Hard safety boundary

This module is a review-state model, not a casting engine. It never:
- evaluates an Arcane expression;
- generates or shortens an executable incantation;
- resolves an unknown identifier or modifier by guessing;
- claims physical feasibility or conservation;
- grants authority or policy permission;
- constructs mana or initiates execution.

`executionPermitted` and `physicalFeasibilityEstablished` are permanently false in this profile. A future implementation would require separate, explicit, owner-approved specifications and safety gates.

## 7. Website companion direction

The eventual companion reader can present three parallel panels:
- **Language:** recognised → parsed → scoped → typed;
- **Incantation contract:** target → preconditions → resources → authority → policy → lifecycle;
- **Mana Construction:** reference → spatial role → Feet → couplings → quantity → control → release.

Each item should show PASS, FAIL, UNRESOLVED or NOT RUN with its source and explanation. It should never display a green “spell valid” result merely because the parser accepted the surface form.

## 8. Decisions not made

No new Arcane vocabulary, morphology, spoken delimiters, operator signatures, Construction macro semantics, physical laws, authority hierarchy or casting behaviour is approved by this phase. It is an architecture for representing evidence faithfully, not a new language canon.

**Result:** the reader now has a precise, independently testable contract for what “readable” means and what it emphatically does not mean.
