# Phase 8CZ — Canonical binding operator reconciliation

**Status:** evidence reconciliation and parser-compatibility audit.  
**Canon effect:** NONE · **Execution:** disabled · **Tests:** 10 authored, registered and not executed locally.

## Canonical evidence

Arcane Language v3.0-L §10 records three binding operators:

- **KWAM** — create a binding.
- **KWAT** — reference an established binding.
- **KWAK** — live evaluation.

Its conceptual example is `KWAM 1 E`, followed by `KWAT 1`; `KWAK 1` can evaluate live where appropriate. The same section explicitly leaves exact identifier representation and evaluation semantics for formalisation. The specification distinguishes a static observation O(t₀) from a live observation O(t).

This establishes a canonical operator vocabulary and broad semantic distinction. It does not establish a complete binding grammar, operator arities, identifier tokenisation, declaration scope, reassignment, lifetime, evaluation timing or failure behaviour.

## Existing parser reconciliation

The Phase 6G provisional surface parser currently:
- parses KWAM as an identifier node followed by one expression;
- parses KWAT as one identifier node;
- parses identifiers as one or more digit tokens followed by SHO;
- uses KWASH as a legacy surface form associated with KWAK; direct KWAK is not accepted as a usable operator in the current parser path.

These are parser conventions, not canonical rules. In particular, the SHO-closed identifier format is not confirmed by v3.0-L's conceptual example. The current parser's KWAM/KWAT shapes must not be represented as approved canonical arities.

The operator-contract registry independently records KWAM, KWAT and KWAK as unresolved arity and evaluation contracts. This is consistent with the canonical source's open questions.

## Compression implication

The canonical operators provide an existing route for repeated-expression compression: create one binding with KWAM and refer to it with KWAT. This is a stronger source-grounded direction than inventing a new declaration operator. It remains a conceptual pattern until identifier representation, scope and lifetime are approved.

KWAK must remain distinct. A reference to a stored binding is not the same operation as live reevaluation. Replacing KWAT with KWAK can change temporal behaviour, freshness and the value observed.

## Guardrails

No new spoken form is added. No binding scope is inferred from the proposed SPELL/CURRENT-STEP reference model. No parser change is made. No expression is evaluated, and no spell is executed. A unique parse and exact expansion remain mandatory before any performed compression can be accepted.

## Tests

Ten tests cover provisional KWAM/KWAT parsing, unresolved identifier compatibility, unresolved canonical arity, KWASH legacy handling, direct KWAK rejection, parse failure, non-execution and absence of false semantic-equivalence claims.
